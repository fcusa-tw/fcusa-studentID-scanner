import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
  Result,
} from "@zxing/library";

import type {
  ScannerStatus,
  StudentIdScanResult,
  UseStudentIdScannerOptions,
} from "../types";
import { normalizeStudentId } from "../utils/normalizeStudentId";
import { getBarcodeFormatName } from "../utils/formatNames";

const DEFAULT_SCAN_REGION = {
  x: 0.08,
  y: 0.38,
  width: 0.84,
  height: 0.24,
};

const DEFAULT_CAMERA_CONSTRAINTS: MediaTrackConstraints = {
  facingMode: { ideal: "environment" },
  width: { ideal: 1920 },
  height: { ideal: 1080 },
};

function createReader() {
  const hints = new Map();

  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODABAR,
    BarcodeFormat.ITF,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ]);

  hints.set(DecodeHintType.TRY_HARDER, true);

  return new BrowserMultiFormatReader(hints);
}

export function useStudentIdScanner(options: UseStudentIdScannerOptions = {}) {
  const {
    autoStart = true,
    pauseOnScan = true,
    scanIntervalMs = 200,
    scale = 3,
    scanRegion = DEFAULT_SCAN_REGION,
    cameraConstraints = DEFAULT_CAMERA_CONSTRAINTS,
    onScan,
    onError,
  } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const isDecodingRef = useRef(false);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);

  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [rawValue, setRawValue] = useState("-");
  const [studentId, setStudentId] = useState("尚未掃描到學號");
  const [format, setFormat] = useState("-");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const reportError = useCallback((error: unknown) => {
    const err = error instanceof Error ? error : new Error(String(error));

    setStatus("error");
    setErrorMessage(err.message);
    onErrorRef.current?.(err);
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStatus("stopped");
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      reportError(new Error("此瀏覽器不支援相機存取。"));
      return;
    }

    if (!window.isSecureContext) {
      reportError(new Error("相機功能需要 HTTPS 或 localhost 環境。"));
      return;
    }

    try {
      setStatus("starting");
      setErrorMessage("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraConstraints,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("scanning");
    } catch (error) {
      reportError(error);
    }
  }, [cameraConstraints, reportError]);

  const reset = useCallback(() => {
    setRawValue("-");
    setStudentId("尚未掃描到學號");
    setFormat("-");
    setErrorMessage("");

    if (streamRef.current) {
      setStatus("scanning");
    } else {
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    readerRef.current = createReader();

    if (autoStart) {
      void startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [autoStart, startCamera, stopCamera]);

  useEffect(() => {
    if (status !== "scanning") return;

    const timer = window.setInterval(async () => {
      if (isDecodingRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const reader = readerRef.current;

      if (!video || !canvas || !reader) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (!videoWidth || !videoHeight) return;

      const context = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!context) return;

      const cropX = videoWidth * scanRegion.x;
      const cropY = videoHeight * scanRegion.y;
      const cropWidth = videoWidth * scanRegion.width;
      const cropHeight = videoHeight * scanRegion.height;

      canvas.width = Math.round(cropWidth * scale);
      canvas.height = Math.round(cropHeight * scale);

      context.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      try {
        isDecodingRef.current = true;

        const result: Result = await reader.decodeFromCanvas(canvas);
        const raw = result.getText();
        const normalized = normalizeStudentId(raw);
        const formatCode = result.getBarcodeFormat() as number;
        const formatName = getBarcodeFormatName(formatCode);

        setRawValue(raw);
        setFormat(formatName);

        if (!normalized) {
          setStudentId("格式不符合");
          setErrorMessage("掃描成功，但內容不符合學號格式 [A-Z] + 7 位數字。");
          return;
        }

        const scanResult: StudentIdScanResult = {
          studentId: normalized,
          rawValue: raw,
          format: formatName,
        };

        setStudentId(normalized);
        setErrorMessage("");
        onScanRef.current?.(scanResult);

        if (pauseOnScan) {
          setStatus("success");
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          return;
        }

        reportError(error);
      } finally {
        isDecodingRef.current = false;
      }
    }, scanIntervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [pauseOnScan, reportError, scale, scanIntervalMs, scanRegion, status]);

  return {
    videoRef,
    canvasRef,
    status,
    rawValue,
    studentId,
    format,
    errorMessage,
    startCamera,
    stopCamera,
    reset,
  };
}

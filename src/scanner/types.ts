import type { CSSProperties } from "react";

export type ScannerStatus =
  | "idle"
  | "starting"
  | "scanning"
  | "success"
  | "error"
  | "stopped";

export interface StudentIdScanResult {
  /** Normalized student ID. Example: D1090481 */
  studentId: string;
  /** Original decoded barcode content. Example: D10904810 */
  rawValue: string;
  /** Barcode format detected by ZXing. Example: CODE_128 */
  format: string;
}

export interface ScanRegionRatio {
  /** Horizontal offset ratio from left side of source video. */
  x: number;
  /** Vertical offset ratio from top side of source video. */
  y: number;
  /** Region width ratio based on source video width. */
  width: number;
  /** Region height ratio based on source video height. */
  height: number;
}

export interface UseStudentIdScannerOptions {
  autoStart?: boolean;
  pauseOnScan?: boolean;
  scanIntervalMs?: number;
  scale?: number;
  scanRegion?: ScanRegionRatio;
  cameraConstraints?: MediaTrackConstraints;
  onScan?: (result: StudentIdScanResult) => void;
  onError?: (error: Error) => void;
}

export interface StudentIdScannerProps extends UseStudentIdScannerOptions {
  title?: string;
  helperText?: string;
  showDebugCanvas?: boolean;
  showRawValue?: boolean;
  className?: string;
  style?: CSSProperties;
}

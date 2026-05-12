import type { StudentIdScannerProps } from "../types";
import { useStudentIdScanner } from "../hooks/useStudentIdScanner";

const DEFAULT_HELPER_TEXT = "請讓學生證條碼水平放入紅框，並盡量填滿紅框寬度。";

export function StudentIdScanner(props: StudentIdScannerProps) {
  const {
    title = "學生證條碼掃描",
    helperText = DEFAULT_HELPER_TEXT,
    showDebugCanvas = false,
    showRawValue = true,
    className,
    style,
    ...scannerOptions
  } = props;

  const {
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
  } = useStudentIdScanner(scannerOptions);

  return (
    <section className={className} style={{ maxWidth: "720px", margin: "0 auto", ...style }}>
      <h2>{title}</h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            width: "100%",
            display: "block",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "8%",
            right: "8%",
            top: "38%",
            height: "24%",
            border: "2px solid red",
            borderRadius: "6px",
            pointerEvents: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button type="button" onClick={reset}>
          重新掃描
        </button>

        <button type="button" onClick={() => void startCamera()}>
          啟動相機
        </button>

        <button type="button" onClick={stopCamera}>
          停止相機
        </button>
      </div>

      <div style={{ marginTop: "16px" }}>
        <strong>狀態：</strong>
        <p>{status}</p>

        <strong>學號：</strong>
        <p style={{ wordBreak: "break-all" }}>{studentId}</p>

        {showRawValue && (
          <>
            <strong>原始掃描值：</strong>
            <p style={{ wordBreak: "break-all" }}>{rawValue}</p>
          </>
        )}

        <strong>格式：</strong>
        <p>{format}</p>

        {errorMessage && (
          <>
            <strong>錯誤：</strong>
            <p>{errorMessage}</p>
          </>
        )}
      </div>

      {showDebugCanvas && (
        <details style={{ marginTop: "16px" }}>
          <summary>Debug：裁切後送進 ZXing 的畫面</summary>

          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              marginTop: "12px",
              border: "1px solid #ddd",
            }}
          />
        </details>
      )}

      {!showDebugCanvas && <canvas ref={canvasRef} style={{ display: "none" }} />}

      <p style={{ color: "#666", fontSize: "14px" }}>{helperText}</p>
    </section>
  );
}

import { useState } from "react";
import { StudentIdScanner } from "../scanner";
import type { StudentIdScanResult } from "../scanner";

export function ScannerDemo() {
  const [lastScan, setLastScan] = useState<StudentIdScanResult | null>(null);

  return (
    <div className="demo-layout">
      <StudentIdScanner
        showDebugCanvas
        onScan={(result) => {
          setLastScan(result);
          console.log("掃描結果：", result);
        }}
        onError={(error) => {
          console.error("掃描錯誤：", error);
        }}
      />

      <section className="result-card">
        <h2>模組輸出</h2>

        {lastScan ? (
          <dl>
            <dt>學號</dt>
            <dd>{lastScan.studentId}</dd>

            <dt>原始值</dt>
            <dd>{lastScan.rawValue}</dd>

            <dt>格式</dt>
            <dd>{lastScan.format}</dd>
          </dl>
        ) : (
          <p>尚未收到掃描結果。</p>
        )}
      </section>
    </div>
  );
}

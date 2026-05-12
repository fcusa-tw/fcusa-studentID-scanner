import { ScannerDemo } from "./demo/ScannerDemo";
import "./App.css";

export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">fcusa-studentID-scanner</p>
        <h1>學生會學號掃描工具</h1>
        <p>
          這個頁面是模組 demo。正式專案可以直接引用 StudentIdScanner，並在 onScan 中接上會員會籍查詢、活動簽到或集點 API。
        </p>
      </header>

      <ScannerDemo />
    </main>
  );
}

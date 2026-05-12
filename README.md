# fcusa-studentID-scanner

學生會用學號掃描工具。這個專案同時提供：

1. 一個可部署的 Vite demo app，用於手機實測掃描效果。
2. 一個可被其他 React 專案引用的掃描模組。

> 注意：npm package name 不允許大寫字母，所以 `package.json` 內使用 `fcusa-studentid-scanner`；專案資料夾仍保留 `fcusa-studentID-scanner`。

## 核心模組

核心模組位於：

```txt
src/scanner/
├── components/
│   └── StudentIdScanner.tsx
├── hooks/
│   └── useStudentIdScanner.ts
├── utils/
│   ├── formatNames.ts
│   └── normalizeStudentId.ts
├── index.ts
└── types.ts
```

`src/scanner/index.ts` 是正式 export 入口。

```ts
export { StudentIdScanner } from "./components/StudentIdScanner";
export { useStudentIdScanner } from "./hooks/useStudentIdScanner";
export { normalizeStudentId, isValidStudentId } from "./utils/normalizeStudentId";
```

## 功能

- 使用手機或電腦相機掃描學生證一維條碼。
- 透過 ZXing 解析常見 1D 條碼格式。
- 將原始掃描值正規化成學號格式：`[A-Z]\d{7}`，例如 `D1090481`。
- 保留原始掃描值，例如實體卡片條碼末尾的換證次數。
- 透過 `onScan` 將結果交給外部系統，不在模組內直接查資料庫。

## 開發環境

建議使用 Node.js 24 或更新版本。

```bash
npm install
npm run dev
```

手機相機測試需要 HTTPS。正式測試建議部署到 Zeabur、Cloudflare Pages、Vercel、Netlify 或 VPS + HTTPS。

## Demo app build

用於部署測試頁面，例如 Zeabur 靜態網站：

```bash
npm run build
npm run preview
```

輸出目錄：

```txt
dist/
```

## Library build

用於產出可被其他專案安裝引用的 package 檔案：

```bash
npm run build:lib
```

輸出目錄：

```txt
dist-lib/
├── fcusa-studentid-scanner.es.js
├── fcusa-studentid-scanner.umd.js
└── types/
```

`package.json` 的 `exports` 已指向 `dist-lib`，因此未來可以透過 package 形式引用。

## 模組使用方式

在同一個 repo / app 內：

```tsx
import { StudentIdScanner } from "./scanner";

export function MemberLookupPage() {
  return (
    <StudentIdScanner
      onScan={async ({ studentId, rawValue, format }) => {
        console.log({ studentId, rawValue, format });

        // example:
        // await fetch(`/api/members/${studentId}`);
      }}
    />
  );
}
```

如果未來將此專案作為 package 安裝到其他系統：

```tsx
import { StudentIdScanner } from "fcusa-studentid-scanner";
```

## Hook 使用方式

若其他系統想自己設計 UI，可以只使用 hook：

```tsx
import { useStudentIdScanner } from "fcusa-studentid-scanner";

export function CustomScanner() {
  const {
    videoRef,
    canvasRef,
    status,
    studentId,
    startCamera,
    stopCamera,
    reset,
  } = useStudentIdScanner({
    onScan: ({ studentId }) => {
      console.log(studentId);
    },
  });

  return (
    <div>
      <video ref={videoRef} playsInline muted />
      <canvas ref={canvasRef} hidden />
      <p>{status}</p>
      <p>{studentId}</p>
      <button onClick={() => void startCamera()}>start</button>
      <button onClick={stopCamera}>stop</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}
```

## `onScan` 回傳資料

```ts
interface StudentIdScanResult {
  studentId: string; // normalized, e.g. D1090481
  rawValue: string;  // original barcode payload, e.g. D10904810
  format: string;    // barcode format, e.g. CODE_128
}
```

## 安裝到其他專案的方式

尚未發布到 npm 前，可以先用 tarball 測試：

```bash
npm run build:lib
npm pack
```

在另一個專案中：

```bash
npm install /path/to/fcusa-studentid-scanner-0.1.0.tgz
```

或未來推上 GitHub 後直接安裝：

```bash
npm install git+https://github.com/<org-or-user>/fcusa-studentID-scanner.git
```

因為 `package.json` 有 `prepare` script，從 GitHub 安裝時會自動執行 library build。

## 建議正式專案分工

scanner 模組只負責：

- 開啟相機
- 裁切掃描區域
- 解析條碼
- 正規化學號
- 將結果交給外部 `onScan`

它不負責：

- 會員會籍查詢
- 活動簽到
- 集點活動
- 後端 API
- 資料庫操作
- 權限驗證

這樣未來可以在不同學生會系統中重複使用。

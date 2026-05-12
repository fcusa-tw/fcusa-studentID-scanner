import type { ScannerStatus, UseStudentIdScannerOptions } from "../types";
export declare function useStudentIdScanner(options?: UseStudentIdScannerOptions): {
    videoRef: import("react").RefObject<HTMLVideoElement | null>;
    canvasRef: import("react").RefObject<HTMLCanvasElement | null>;
    status: ScannerStatus;
    rawValue: string;
    studentId: string;
    format: string;
    errorMessage: string;
    startCamera: () => Promise<void>;
    stopCamera: () => void;
    reset: () => void;
};
//# sourceMappingURL=useStudentIdScanner.d.ts.map
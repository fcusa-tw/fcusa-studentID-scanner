export { StudentIdScanner } from "./components/StudentIdScanner";
export { useStudentIdScanner } from "./hooks/useStudentIdScanner";

export {
  normalizeStudentId,
  isValidStudentId,
} from "./utils/normalizeStudentId";

export type {
  ScannerStatus,
  ScanRegionRatio,
  StudentIdScanResult,
  StudentIdScannerProps,
  UseStudentIdScannerOptions,
} from "./types";

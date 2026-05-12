/**
 * Normalize scanned barcode payload into the student ID used by FCUSA systems.
 *
 * Current rule:
 * - Student ID format is [A-Z]\d{7}, e.g. D1090481.
 * - Physical student card barcode may contain an extra trailing card reissue count.
 * - Therefore, extract the first [A-Z]\d{7} sequence from the payload.
 */
export declare function normalizeStudentId(raw: string): string | null;
export declare function isValidStudentId(value: string): boolean;
//# sourceMappingURL=normalizeStudentId.d.ts.map
const STUDENT_ID_PATTERN = /[A-Z]\d{7}/;
const EXACT_STUDENT_ID_PATTERN = /^[A-Z]\d{7}$/;

/**
 * Normalize scanned barcode payload into the student ID used by FCUSA systems.
 *
 * Current rule:
 * - Student ID format is [A-Z]\d{7}, e.g. D1090481.
 * - Physical student card barcode may contain an extra trailing card reissue count.
 * - Therefore, extract the first [A-Z]\d{7} sequence from the payload.
 */
export function normalizeStudentId(raw: string): string | null {
  return raw.trim().toUpperCase().match(STUDENT_ID_PATTERN)?.[0] ?? null;
}

export function isValidStudentId(value: string): boolean {
  return EXACT_STUDENT_ID_PATTERN.test(value.trim().toUpperCase());
}

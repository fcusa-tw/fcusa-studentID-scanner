export const barcodeFormatNames: Record<number, string> = {
  0: "AZTEC",
  1: "CODABAR",
  2: "CODE_39",
  3: "CODE_93",
  4: "CODE_128",
  5: "DATA_MATRIX",
  6: "EAN_8",
  7: "EAN_13",
  8: "ITF",
  9: "MAXICODE",
  10: "PDF_417",
  11: "QR_CODE",
  12: "RSS_14",
  13: "RSS_EXPANDED",
  14: "UPC_A",
  15: "UPC_E",
  16: "UPC_EAN_EXTENSION",
};

export function getBarcodeFormatName(formatCode: number): string {
  return barcodeFormatNames[formatCode] ?? `UNKNOWN (${formatCode})`;
}

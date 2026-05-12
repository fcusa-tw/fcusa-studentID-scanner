import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-lib",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/scanner/index.ts"),
      name: "FcusaStudentIdScanner",
      fileName: (format) => `fcusa-studentid-scanner.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
});

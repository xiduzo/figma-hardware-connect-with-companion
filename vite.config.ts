import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src/plugin/ui",
  plugins: [reactRefresh(), viteSingleFile()],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(__dirname, "../../src"),
      },
    ],
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: "../../../build/plugin",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});

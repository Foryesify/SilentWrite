import {fileURLToPath} from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import process from "node:process";
const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => ({
  plugins: [vue()],
  clearScreen: false,
  build: {
    minify: "terser",
  },
  server: {
    port: 1420,
    strictPort: true,
    host: host || "127.0.0.1",
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)), },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  }
}));

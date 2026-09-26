import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const tauri = Boolean(process.env.TAURI_ENV_PLATFORM || process.env.TAURI_DEV_HOST)
const host = process.env.TAURI_DEV_HOST

export default defineConfig(({mode}) => ({
  base: './',
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_ENV_'],
  plugins: [
    vue(),
    ...(!tauri ? [VitePWA({ registerType: 'autoUpdate', manifest: false })] : []),
  ],
  define: { __DEBUG__: JSON.stringify(mode === 'development'), },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)), },
  },
  server: {
    port: tauri ? 1420 : 5173,
    strictPort: tauri,
    host: host || false,
    hmr: host
      ? {
        protocol: 'ws',
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  build: {
    chunkSizeWarningLimit: 1024,
  },
}))

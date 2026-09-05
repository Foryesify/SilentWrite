import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const tauri = Boolean(process.env.TAURI_ENV_PLATFORM || process.env.TAURI_DEV_HOST)
const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  base: './',
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_ENV_'],
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'SilentWrite',
        short_name: 'SilentWrite',
        display: 'standalone',
        background_color: '#202020',
        theme_color: '#202020',
        description: 'Quiet, pure and costomizable Markdown editor.',
        start_url: './',
        scope: './',
        lang: 'zh-CN',
        launch_handler: {
          client_mode: ['focus-existing', 'auto'],
        },
        file_handlers: [
          {
            action: './',
            launch_type: 'single-client',
            accept: {
              'text/markdown': ['.md', '.markdown'],
              'text/plain': ['.md', '.markdown'],
            },
          },
        ],
        icons: [
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
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
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'GESAP — Portal del Paciente',
        short_name: 'GESAP Paciente',
        description: 'Sistema Hospitalario de Guatemala — Portal del Paciente',
        theme_color: '#0A2647',
        background_color: '#E6F7F8',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'es',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    port: 5176,
    host: true,
    allowedHosts: true,
    proxy: {
      "/gesap-portal/v1": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
    },
  },
})

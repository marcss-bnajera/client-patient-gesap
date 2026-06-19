import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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

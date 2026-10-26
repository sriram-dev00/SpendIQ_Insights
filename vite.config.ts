import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'strip-live-server-redirect',
      transformIndexHtml(html, ctx) {
        if (ctx.bundle) {
          return html.replace(/<!-- LIVE_SERVER_REDIRECT_START -->[\s\S]*?<!-- LIVE_SERVER_REDIRECT_END -->\s*/, '');
        }
        return html;
      },
    },
  ],
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

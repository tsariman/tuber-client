import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      // Example: proxy API requests to backend during development
      // '/api': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      //   secure: false,
      // }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
      open: false
    })
  ],
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

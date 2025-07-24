// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      pages:      path.resolve(__dirname, 'src/pages'),
      hooks:      path.resolve(__dirname, 'src/hooks'),
      assets:     path.resolve(__dirname, 'src/assets'),
    }
  }
})

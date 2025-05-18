import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@axios': path.resolve(__dirname, './src/axios'),
      '@components': path.resolve(__dirname, './src/components'),
      '@const': path.resolve(__dirname, './src/const'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@hook': path.resolve(__dirname, './src/hook'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@resources': path.resolve(__dirname, './src/resources'),
      '@routers': path.resolve(__dirname, './src/routers'),
      '@storage': path.resolve(__dirname, './src/storage'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@validate': path.resolve(__dirname, './src/validate'),
    }
  }
})
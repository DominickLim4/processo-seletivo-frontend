import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // simula um navegador no terminal
    globals: true,
    setupFiles: './src/setupTests.js',
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Explicitly bind to all network interfaces
    port: 3000,
    strictPort: true, // Fail if port is in use
    open: true
  }
})
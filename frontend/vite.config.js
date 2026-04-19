import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Route auth directly to auth-service (avoids gateway CSRF issues)
      '/api/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      // Route products directly to product-service
      '/api/products': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      // Route orders directly to order-service
      '/api/orders': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
    }
  }
})
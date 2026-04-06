import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: '/<repo>/', 
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, 'src'),  // Use path.resolve for absolute path
    },
  },
  build: {
    target: 'es2022'  // Supports destructuring natively
  },
  esbuild: {
    target: 'es2022'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022'
    }
  }
})
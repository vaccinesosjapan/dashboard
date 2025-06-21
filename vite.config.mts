import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/dashboard/' : '/',
  plugins: [
    vue(),
  ],
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    // 本番ビルドにおけるハイドレーションの不一致についての詳細を有効にする
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})

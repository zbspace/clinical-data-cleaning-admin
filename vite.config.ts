import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // #region Build Optimization
  build: {
    // 禁用 gzip 压缩大小报告，减少内存占用
    reportCompressedSize: false,
    // 确保禁用 sourcemap
    sourcemap: false,
    rollupOptions: {
      output: {
        // 分块优化，避免单个文件过大
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  // #endregion
  server: {
    port: 5180,
    proxy: {
      '/api': {
        target: 'http://47.103.54.49:19080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue() as any],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // #region Build Optimization
  build: {
    reportCompressedSize: false,
    sourcemap: false,
    rollupOptions: {
      output: {
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
      },
    },
  },
});

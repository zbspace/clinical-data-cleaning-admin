//#region Imports
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from '@unocss/vite';
import path from 'path';
//#endregion

//#region Config
export default defineConfig({
  // 部署子路径，生产构建后资源路径为 /lyqAdmin/assets/...
  base: '/admin/',
  plugins: [vue(), UnoCSS()],
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
        target: 'https://test.shucangyiyao.com/lyqAdmin',
        changeOrigin: true,
      },
    },
  },
});
//#endregion

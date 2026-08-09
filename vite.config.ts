//#region Imports
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from '@unocss/vite';
import presetWind from '@unocss/preset-wind';
import path from 'path';
//#endregion

//#region Config
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      presets: [presetWind()],
      shortcuts: {
        'flex-center': 'flex items-center justify-center',
        'flex-between': 'flex items-center justify-between',
      },
    }),
  ],
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
        target: 'https://test.shucangyiyao.com',
        changeOrigin: true,
      },
    },
  },
});
//#endregion

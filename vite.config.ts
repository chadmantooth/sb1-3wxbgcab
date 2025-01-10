import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'node-fetch': 'isomorphic-fetch'
    },
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main']
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: ['fast-xml-parser', 'rss-parser', 'apexcharts']
  },
  preview: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    target: 'esnext'
  }
});
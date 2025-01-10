import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

const config = defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    ssr: {
      noExternal: ['apexcharts']
    },
    optimizeDeps: {
      include: ['apexcharts']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  }
});

export default config;
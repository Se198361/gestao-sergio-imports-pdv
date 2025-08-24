import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
        cleanupOutdatedCaches: true,
      },
      includeAssets: ['logo.svg', 'apple-touch-icon.svg'],
      manifest: {
        name: 'Sérgio Imports - Sistema de Gestão',
        short_name: 'Sérgio Imports',
        description: 'Sistema de gestão completo para vendas, estoque e PDV da Sérgio Imports',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: 'logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

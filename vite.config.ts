import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'ensure-pwa-png-icons',
        configResolved() {
          const publicDir = path.resolve(__dirname, 'public');
          const srcIcon = path.resolve(__dirname, 'src/assets/images/pwa_icon_512_1795181470147.jpg');
          if (fs.existsSync(srcIcon)) {
            if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
            const target512 = path.resolve(publicDir, 'pwa-512x512.png');
            const target192 = path.resolve(publicDir, 'pwa-192x192.png');
            const targetApple = path.resolve(publicDir, 'apple-touch-icon.png');
            if (!fs.existsSync(target512)) fs.copyFileSync(srcIcon, target512);
            if (!fs.existsSync(target192)) fs.copyFileSync(srcIcon, target192);
            if (!fs.existsSync(targetApple)) fs.copyFileSync(srcIcon, targetApple);
          }
        }
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'apple-touch-icon.png'],
        manifest: {
          id: '/',
          name: 'Struk Pembayaran Tagihan Listrik',
          short_name: 'Struk PLN',
          description: 'Aplikasi PWA pemindai OCR struk PLN, cetak printer thermal Bluetooth, dan generator struk PPOB.',
          theme_color: '#0284c7',
          background_color: '#f0f9ff',
          display: 'standalone',
          start_url: '/',
          scope: '/',

          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any'
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      }),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

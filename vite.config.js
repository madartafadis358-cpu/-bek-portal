import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const manifest = {
  name: 'Portail Citoyen Bordj El Kiffan',
  short_name: 'BEK Citoyen',
  description: 'Signalez vos préoccupations, proposez des solutions et participez au développement de votre commune.',
  lang: 'fr',
  theme_color: '#1a5c2a',
  background_color: '#0d1117',
  display: 'standalone',
  orientation: 'portrait-primary',
  scope: '/',
  start_url: '/',
  categories: ['government', 'social', 'civic'],
  related_applications: [{ platform: 'play', url: 'https://play.google.com/store/apps/details?id=com.bek.portal', id: 'com.bek.portal' }],
  icons: [
    { src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 } },
          },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: true,
  },
})

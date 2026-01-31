import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://sarando.site',
      readable: true,
      // Dynamic routes akan di-handle via includedRoutes di main.ts
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // SSG options - lihat dokumentasi vite-ssg
  // @ts-expect-error ssgOptions is added by vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
})

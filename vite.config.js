import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  
  const plugins = [vue()]
  
  // Only add dev tools in dev mode
  if (isDev) {
    plugins.push(vueDevTools())
  }
  
  return {
    plugins,
    
    // Dependency pre-bundling for faster startup
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'firebase/app',
        'firebase/firestore',
        'qrcode',
        'jsqr',
      ],
      exclude: ['@vite/env'],
    },

    // Enhanced dev server for faster HMR
    server: {
      host: true,
      https: false,
      allowedHosts: [
        'highway-baseball-keno-infrared.trycloudflare.com',
        'localhost'
      ],
      // Faster HMR configuration
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
      },
      // Improve server startup speed
      middlewareMode: false,
      watch: {
        // Ignore node_modules and dist for faster reloads
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      },
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },

    // Build optimizations for production
    build: {
      // Minify and compress
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
      // Chunk size optimizations
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'firebase': ['firebase'],
            'qr': ['qrcode', 'jsqr'],
          },
        },
      },
      // Faster build with less detail
      reportCompressedSize: false,
      // Don't emit source maps in production
      sourcemap: false,
      // Increase chunk size limit
      chunkSizeWarningLimit: 1000,
    },

    // CSS optimizations
    css: {
      postcss: './postcss.config.js',
    },
  }
})

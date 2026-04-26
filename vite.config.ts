import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

function inlineCss(): Plugin {
  const cssMap = new Map<string, string>()
  return {
    name: 'inline-css',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && chunk.type === 'asset') {
          cssMap.set(fileName, chunk.source as string)
          delete bundle[fileName]
        }
      }
    },
    transformIndexHtml(html) {
      if (cssMap.size === 0) return html
      const styles = [...cssMap.values()].join('\n')
      return html.replace(
        /<link[^>]+rel="stylesheet"[^>]*>/g,
        '',
      ).replace('</head>', `<style>${styles}</style></head>`)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
})

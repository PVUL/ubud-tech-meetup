import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: [
        // search up for workspace root
        '..',
        // allow serving files from global bun modules
        '/Users/pyun/.bun/install/global/node_modules',
        // include the project root itself
        '.'
      ]
    }
  }
})

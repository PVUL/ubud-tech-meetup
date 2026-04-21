import { defineConfig } from 'vite'

export default defineConfig({
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

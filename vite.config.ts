import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import terser from '@rollup/plugin-terser'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts')
    },
    rollupOptions: {
      external: ['@faker-js/faker'],
      output: [
        {
          entryFileNames: 'factoria.js',
          format: 'es'
        },
        {
          entryFileNames: 'factoria.min.js',
          format: 'es',
          plugins: [terser()]
        }
      ]
    },
    minify: false,
    emptyOutDir: true,
    outDir: 'dist'
  }
})

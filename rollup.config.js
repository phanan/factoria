import { uglify } from 'rollup-plugin-uglify'
import typescript from '@rollup/plugin-typescript'
import babel from 'rollup-plugin-babel'

export default {
  input: 'index.ts',
  context: 'this',
  external: ['faker'],
  output: {
    file: 'dist/factoria.min.js',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    uglify(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

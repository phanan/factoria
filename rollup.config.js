import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

export default {
  input: 'index.js',
  output: {
    file: 'dist/factoria.min.js',
    format: 'cjs'
  },
  plugins: [
    uglify(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

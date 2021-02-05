import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'index.ts',
  context: 'this',
  external: ['faker'],
  output: [
    {
      file: 'dist/factoria.min.js',
      format: 'cjs',
      exports: 'auto',
      plugins: [terser()]
    }, {
      file: 'dist/factoria.js',
      format: 'cjs',
      exports: 'auto'
    }
  ],
  plugins: [
    typescript(),
    commonjs(),
    nodeResolve()
  ]
}

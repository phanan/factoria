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
      entryFileNames: 'factoria.min.js',
      dir: 'dist',
      format: 'cjs',
      exports: 'auto',
      plugins: [terser()]
    }, {
      entryFileNames: 'factoria.js',
      dir: 'dist',
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

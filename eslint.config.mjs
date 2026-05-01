import neostandard from 'neostandard'

export default [
  {
    ignores: ['node_modules/**', 'dist/**']
  },
  ...neostandard({ ts: true }),
  {
    rules: {
      'no-unused-vars': 'off'
    }
  }
]

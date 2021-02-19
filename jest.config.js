module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json'
    }
  }
}

export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: [
    '**/reference-tracker/**/*.test.ts',
    '**/config/**/*.test.ts',
    '**/trace-entry-factories/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'reference-tracker/**/*.ts',
    'config/**/*.ts',
    'trace-entry-factories/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.test.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true
    }]
  }
};
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  testMatch: ['<rootDir>/src/**/*.test.ts'],
}

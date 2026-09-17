module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
  collectCoverageFrom: ['src/components/**/*.{ts,tsx}', '!src/components/**/*.stories.tsx', '!src/components/**/index.ts'],
};

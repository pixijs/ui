/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },

    testMatch: ['<rootDir>/tests/**/*.test.ts'],

    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/index.ts',
        '!<rootDir>/src/stories/**',
    ],
    coverageDirectory: '<rootDir>/coverage',

    testTimeout: 5000,
};

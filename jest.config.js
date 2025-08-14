/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '\\.(png|jpg|gif|svg)$': '<rootDir>/tests/file-mock.js'
    },

    testMatch: ['<rootDir>/tests/components/*.test.ts'],

    collectCoverageFrom: ['<rootDir>/src/*.ts'],
    coverageDirectory: '<rootDir>/coverage',

    testTimeout: 5000,
};

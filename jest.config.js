/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                module: 'ESNext',
                esModuleInterop: true,
                skipLibCheck: true,
                allowSyntheticDefaultImports: true,
            },
            diagnostics: false,
        }],
        '\\.(png|jpg|gif|svg)$': '<rootDir>/tests/file-mock.js'
    },

    testMatch: ['<rootDir>/tests/components/*.test.ts'],

    collectCoverageFrom: ['<rootDir>/src/*.ts'],
    coverageDirectory: '<rootDir>/coverage',

    testTimeout: 10000,
    cache: true,
    cacheDirectory: '<rootDir>/.jest-cache',
};

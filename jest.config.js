/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/', '/docs/'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                module: 'ESNext',
                esModuleInterop: true,
            },
            diagnostics: false,
        }],
        '\\.(png|jpg|gif|svg)$': '<rootDir>/tests/file-mock.js'
    },
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: ['**/tests/**/?(*.)+(test|spec)\\.ts'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/**/*.stories.ts'
    ],
    coverageDirectory: '<rootDir>/coverage',
    testTimeout: 10000,
};
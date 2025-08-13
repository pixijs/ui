/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    // Performance optimizations
    maxWorkers: '50%', // Use half of available CPU cores
    cache: true,
    cacheDirectory: '<rootDir>/.jest-cache',

    // Path and file handling
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/', '/docs/', '/.jest-cache/'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

    // Transforms - optimized for performance
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                module: 'ESNext',
                esModuleInterop: true,
                skipLibCheck: true, // Skip lib checking for faster compilation
                allowSyntheticDefaultImports: true,
            },
            diagnostics: false,
            // isolatedModules moved to tsconfig.json to avoid deprecation warning
        }],
        '\\.(png|jpg|gif|svg)$': '<rootDir>/tests/file-mock.js'
    },

    // Module resolution
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1'
    },

    // Test discovery
    testMatch: ['**/tests/**/?(*.)+(test|spec)\\.ts'],

    // Coverage settings
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/**/*.stories.ts',
        '!<rootDir>/src/**/*.d.ts',
        '!<rootDir>/src/index.ts', // Exclude index files from coverage
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },

    // Timing and performance
    testTimeout: 10000,
    slowTestThreshold: 5, // Mark tests over 5 seconds as slow

    // Test environment optimizations
    testEnvironmentOptions: {
        url: 'http://localhost',
        pretendToBeVisual: true,
        resources: 'usable'
    },

    // Reporter configuration for better CI/local feedback
    reporters: [
        'default'
        // Note: Add 'jest-junit' to reporters if you have jest-junit package installed for CI
    ],

    // Error handling
    bail: 0, // Don't bail on first test failure
    verbose: false, // Reduce output verbosity for faster CI

    // Module loading optimizations
    modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/lib/'],

    // Global setup optimizations
    globalSetup: undefined,
    globalTeardown: undefined,
};

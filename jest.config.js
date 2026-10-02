/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        // Babel ignores the project .babelrc for files under node_modules, so the
        // presets have to be handed to babel-jest here for earcut (see below).
        '^.+\\.m?js$': [
            'babel-jest',
            { babelrc: false, configFile: false, presets: ['@babel/preset-env'] },
        ],
    },

    // node_modules is left untransformed except for earcut, which pixi.js requires
    // from its CommonJS build but which has shipped ESM only since earcut 3.
    transformIgnorePatterns: ['/node_modules/(?!earcut/)'],

    testMatch: ['<rootDir>/tests/**/*.test.ts'],

    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/index.ts',
        '!<rootDir>/src/stories/**',
    ],
    coverageDirectory: '<rootDir>/coverage',

    testTimeout: 5000,
};

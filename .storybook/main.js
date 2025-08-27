module.exports = {
    stories: ['../src/stories/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
    staticDirs: ['../src/stories/assets'],
    output: '../docs/',
    logLevel: 'debug',
    addons: [
        '@storybook/addon-webpack5-compiler-babel',
        '@storybook/addon-actions',
        '@storybook/addon-backgrounds',
        '@storybook/addon-controls',
        '@storybook/addon-viewport',
        '@storybook/addon-links',
        '@storybook/addon-highlight',
        '@storybook/addon-storysource',
    ],
    core: {
        channelOptions: { allowFunction: false, maxDepth: 10 },
        disableTelemetry: true,
    },
    features: {
        buildStoriesJson: true,
    },
    framework: '@pixi/storybook-webpack5',
    typescript: {
        check: false,
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
};

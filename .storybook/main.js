module.exports = {
    stories: ['../src/stories/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
    staticDirs: ['../src/stories/assets'],
    output: '../docs/',
    logLevel: 'debug',
    addons: [
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
        breakingChangesV7: true,
    },
    framework: '@pixi/storybook-webpack5',
};

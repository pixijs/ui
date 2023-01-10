export const parameters = {
    layout: 'fullscreen',
    pixi: {
        applicationOptions: {
            backgroundAlpha: 0,
            resolution: 1,
            antialias: true,
        },
    },
    backgrounds: {
        default: 'Dark',
        values: [
            {
                name: 'Dark',
                value: '#1b1c1d',
            },
            {
                name: 'Light',
                value: '#dddddd',
            },
        ],
    },
};

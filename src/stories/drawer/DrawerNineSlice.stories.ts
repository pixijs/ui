import { Text, Texture } from 'pixi.js';
import { PixiStory, StoryContext } from '@pixi/storybook-renderer';
import { Drawer } from '../../Drawer';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    width: 500,
    height: 350,
    padding: 30,
    backdropColor: '#000000',
    backdropAlpha: 0.5,
    contentColor: colors.textColor,
    closeOnBackdropClick: true,
    swipeToClose: true,
};

type Args = typeof args;

export const NineSliceBottom = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backdropColor,
                    backdropAlpha,
                    contentColor,
                    closeOnBackdropClick,
                    swipeToClose,
                } = args;

                await preload(['button_gray.png']);

                const drawer = new Drawer({
                    background: Texture.from('button_gray.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    content: new Text({
                        text: 'This drawer has a scalable border!\n\nSwipe down or tap backdrop to close.',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            align: 'center',
                            wordWrapWidth: width - (2 * padding),
                            wordWrap: true,
                            fill: getColor(contentColor),
                        },
                    }),
                    width,
                    height,
                    padding,
                    position: 'bottom',
                    closeOnBackdropClick,
                    swipeToClose,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                drawer.onClose.connect(() =>
                {
                    action('onClose')('Drawer closed');
                    setTimeout(() => drawer.open(), 1000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export const NineSliceTop = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backdropColor,
                    backdropAlpha,
                    contentColor,
                    closeOnBackdropClick,
                    swipeToClose,
                } = args;

                await preload(['button_gray.png']);

                const drawer = new Drawer({
                    background: Texture.from('button_gray.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    content: new Text({
                        text: 'Top drawer with NineSliceSprite background.\n\nSwipe up to close.',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            align: 'center',
                            wordWrapWidth: width - (2 * padding),
                            wordWrap: true,
                            fill: getColor(contentColor),
                        },
                    }),
                    width,
                    height,
                    padding,
                    position: 'top',
                    closeOnBackdropClick,
                    swipeToClose,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                drawer.onClose.connect(() =>
                {
                    action('onClose')('Drawer closed');
                    setTimeout(() => drawer.open(), 1000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export const NineSliceLeft = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backdropColor,
                    backdropAlpha,
                    contentColor,
                    closeOnBackdropClick,
                    swipeToClose,
                } = args;

                await preload(['button_gray.png']);

                const drawer = new Drawer({
                    background: Texture.from('button_gray.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    content: new Text({
                        text: 'Left drawer with NineSliceSprite background.\n\nSwipe left to close.',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            align: 'center',
                            wordWrapWidth: width - (2 * padding),
                            wordWrap: true,
                            fill: getColor(contentColor),
                        },
                    }),
                    width,
                    height,
                    padding,
                    position: 'left',
                    closeOnBackdropClick,
                    swipeToClose,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                drawer.onClose.connect(() =>
                {
                    action('onClose')('Drawer closed');
                    setTimeout(() => drawer.open(), 1000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export const NineSliceRight = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backdropColor,
                    backdropAlpha,
                    contentColor,
                    closeOnBackdropClick,
                    swipeToClose,
                } = args;

                await preload(['button_gray.png']);

                const drawer = new Drawer({
                    background: Texture.from('button_gray.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    content: new Text({
                        text: 'Top drawer with NineSliceSprite background.\n\nSwipe up to close.',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            align: 'center',
                            wordWrapWidth: width - (2 * padding),
                            wordWrap: true,
                            fill: getColor(contentColor),
                        },
                    }),
                    width,
                    height,
                    padding,
                    position: 'top',
                    closeOnBackdropClick,
                    swipeToClose,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                drawer.onClose.connect(() =>
                {
                    action('onClose')('Drawer closed');
                    setTimeout(() => drawer.open(), 1000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export default {
    title: 'Components/Drawer/Use NineSliceSprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

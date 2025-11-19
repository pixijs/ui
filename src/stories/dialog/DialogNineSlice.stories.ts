import { Graphics, Text, Texture } from 'pixi.js';
import { PixiStory, StoryContext } from '@pixi/storybook-renderer';
import { Dialog } from '../../Dialog';
import { FancyButton } from '../../FancyButton';
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
    titleColor: colors.textColor,
    contentColor: colors.textColor,
    buttonColor: colors.color,
    buttonHoverColor: colors.hoverColor,
    buttonPressedColor: colors.pressedColor,
    closeOnBackdropClick: false,
};

type Args = typeof args;

export const NineSliceBackground = {
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
                    titleColor,
                    contentColor,
                } = args;

                await preload(['button_gray.png', 'button.png', 'button_hover.png', 'button_pressed.png']);

                const button = new FancyButton({
                    text: new Text({
                        text: '👍 Amazing!',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 28,
                            fontWeight: 'bold',
                            fill: getColor(colors.textColor),
                        },
                    }),
                    defaultView: 'button.png',
                    hoverView: 'button_hover.png',
                    pressedView: 'button_pressed.png',
                    nineSliceSprite: [25, 20, 25, 20],
                    animations: {
                        hover: {
                            props: {
                                scale: { x: 1.01, y: 1.01 },
                                x: -2,
                                y: 0,
                            },
                            duration: 100,
                        },
                        pressed: {
                            props: {
                                scale: { x: 0.99, y: 0.99 },
                                x: 6,
                                y: 8,
                            },
                            duration: 100,
                        },
                    },
                });

                const dialog = new Dialog({
                    background: Texture.from('button_gray.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    title: new Text({
                        text: 'Fancy Dialog',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    content: new Text({
                        text: 'This dialog has a scalable border!',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: getColor(contentColor),
                        },
                    }),
                    buttons: [button],
                    width,
                    height,
                    padding,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                dialog.onSelect.connect((index, text) =>
                {
                    action('onSelect')(`Button ${index}: ${text}`);
                });

                view.addChild(dialog);
                dialog.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export const NineSliceConfirm = {
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
                    titleColor,
                    contentColor,
                    closeOnBackdropClick,
                } = args;

                await preload(['button_gray.png', 'button.png', 'button_hover.png', 'button_pressed.png']);

                const dialog = new Dialog({
                    background: Texture.from('button_gray.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    title: new Text({
                        text: 'Confirm Action',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    content: new Text({
                        text: 'Are you sure you want to proceed?',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: getColor(contentColor),
                        },
                    }),
                    buttons: [
                        {
                            text: new Text({
                                text: '✖ Cancel',
                                style: {
                                    ...defaultTextStyle,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    fill: getColor(colors.textColor),
                                },
                            }),
                            defaultView: new Graphics()
                                .roundRect(0, 0, 110, 50, 50)
                                .fill(getColor(colors.color)),
                            hoverView: new Graphics()
                                .roundRect(0, 0, 110, 50, 50)
                                .fill(getColor(colors.hoverColor)),
                            pressedView: new Graphics()
                                .roundRect(0, 0, 110, 50, 50)
                                .fill(getColor(colors.pressedColor)),
                            animations: {
                                hover: {
                                    props: {
                                        scale: {
                                            x: 1.03,
                                            y: 1.03,
                                        },
                                        x: -2,
                                        y: -2,
                                    },
                                    duration: 100,
                                },
                                pressed: {
                                    props: {
                                        scale: {
                                            x: 0.95,
                                            y: 0.95,
                                        },
                                        x: 2,
                                        y: 2,
                                    },
                                    duration: 100,
                                },
                            },
                        },
                        {
                            text: new Text({
                                text: '✓ Confirm',
                                style: {
                                    ...defaultTextStyle,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    fill: getColor(colors.textColor),
                                },
                            }),
                            defaultView: new Graphics()
                                .roundRect(0, 0, 110, 50, 50)
                                .fill(getColor(colors.color)),
                            hoverView: new Graphics()
                                .roundRect(0, 0, 110, 50, 50)
                                .fill(getColor(colors.hoverColor)),
                            pressedView: new Graphics()
                                .roundRect(0, 0, 110, 50, 50)
                                .fill(getColor(colors.pressedColor)),
                            animations: {
                                hover: {
                                    props: {
                                        scale: {
                                            x: 1.03,
                                            y: 1.03,
                                        },
                                        x: -2,
                                        y: -2,
                                    },
                                    duration: 100,
                                },
                                pressed: {
                                    props: {
                                        scale: {
                                            x: 0.95,
                                            y: 0.95,
                                        },
                                        x: 2,
                                        y: 2,
                                    },
                                    duration: 100,
                                },
                            },
                        },
                    ],
                    width,
                    height,
                    padding,
                    closeOnBackdropClick,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                dialog.onSelect.connect((index, text) =>
                {
                    action('onSelect')(`Button ${index}: ${text}`);
                });

                view.addChild(dialog);
                dialog.open();
            },
            resize: centerView,
        }),
    args: {
        ...getDefaultArgs(args),
        closeOnBackdropClick: true,
    },
};

export default {
    title: 'Components/Dialog/Use NineSliceSprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

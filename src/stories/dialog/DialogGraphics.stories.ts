import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryContext } from '@pixi/storybook-renderer';
import { Button } from '../../Button';
import { Dialog } from '../../Dialog';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { loremText } from '../utils/loremText';
import { action } from '@storybook/addon-actions';

const args = {
    width: 400,
    height: 300,
    radius: 20,
    padding: 20,
    backgroundColor: colors.pannelColor,
    backgroundBorderColor: colors.pannelBorderColor,
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

export const SimpleAlert = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    radius,
                    padding,
                    backgroundColor,
                    backgroundBorderColor,
                    backdropColor,
                    backdropAlpha,
                    titleColor,
                    contentColor,
                    buttonColor,
                    closeOnBackdropClick,
                } = args;

                const buttonBg = new Graphics();
                const button = new Button(buttonBg);

                const textInstance = new Text({
                    text: 'OK',
                    style: {
                        ...defaultTextStyle,
                        fill: defaultTextStyle.fill,
                        fontSize: 22,
                    },
                });

                buttonBg.clear().roundRect(0, 0, 150, 40, radius).fill(buttonColor);

                textInstance.x = buttonBg.width / 2;
                textInstance.y = buttonBg.height / 2;
                textInstance.anchor.set(0.5);

                buttonBg.addChild(textInstance);

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor)
                        .stroke({
                            color: backgroundBorderColor,
                            width: 1,
                        }),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    title: new Text({
                        text: 'Title',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            // lineHeight: 14,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    content: new Text({
                        text: loremText,
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            align: 'center',
                            fontWeight: 'normal',
                            wordWrapWidth: width - (2 * padding) - padding,
                            wordWrap: true,
                            lineHeight: 20,
                            fill: getColor(contentColor),
                        },
                    }),
                    buttons: [button],
                    buttonList: {
                        elementsMargin: 40,
                    },
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
                    dialog.close();
                });

                dialog.onClose.connect(() =>
                {
                    setTimeout(() => dialog.open(), 1000);
                });

                view.addChild(dialog);
                dialog.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export const ConfirmDialog = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    radius,
                    padding,
                    backgroundColor,
                    backgroundBorderColor,
                    backdropColor,
                    backdropAlpha,
                    titleColor,
                    contentColor,
                    buttonColor,
                    buttonHoverColor,
                    buttonPressedColor,
                    closeOnBackdropClick,
                } = args;

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor)
                        .stroke({
                            color: backgroundBorderColor,
                            width: 1,
                        }),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    title: new Text({
                        text: 'Confirm Action',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                            lineHeight: 44,
                        },
                    }),
                    content: new Text({
                        text: `Are you sure you want to proceed?`,
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            align: 'center',
                            wordWrapWidth: width - (2 * padding),
                            wordWrap: true,
                            lineHeight: 24,
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
                                .roundRect(0, 0, 110, 50, radius)
                                .fill(getColor(buttonColor)),
                            hoverView: new Graphics()
                                .roundRect(0, 0, 110, 50, radius)
                                .fill(getColor(buttonHoverColor)),
                            pressedView: new Graphics()
                                .roundRect(0, 0, 110, 50, radius)
                                .fill(getColor(buttonPressedColor)),
                            animations: {
                                hover: {
                                    props: {
                                        scale: {
                                            x: 1.03,
                                            y: 1.03,
                                        },
                                        y: -1,
                                        x: -2,
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
                                .roundRect(0, 0, 110, 50, radius)
                                .fill(getColor(buttonColor)),
                            hoverView: new Graphics()
                                .roundRect(0, 0, 110, 50, radius)
                                .fill(getColor(buttonHoverColor)),
                            pressedView: new Graphics()
                                .roundRect(0, 0, 110, 50, radius)
                                .fill(getColor(buttonPressedColor)),
                            animations: {
                                hover: {
                                    props: {
                                        scale: {
                                            x: 1.03,
                                            y: 1.03,
                                        },
                                        x: -2,
                                        y: -1,
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
                    buttonList: {
                        elementsMargin: 40,
                    },
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
                    dialog.close();
                    setTimeout(() => dialog.open(), 2000);
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

export const ThreeButtons = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    radius,
                    padding,
                    backgroundColor,
                    backgroundBorderColor,
                    backdropColor,
                    backdropAlpha,
                    titleColor,
                    contentColor,
                    buttonColor,
                    buttonHoverColor,
                    buttonPressedColor,
                    closeOnBackdropClick,
                } = args;

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor)
                        .stroke({
                            color: backgroundBorderColor,
                            width: 1,
                        }),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    title: new Text({
                        text: 'Choose Action',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                            lineHeight: 44,
                        },
                    }),
                    content: new Text({
                        text: 'What would you like to do?',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: getColor(contentColor),
                        },
                    }),
                    closeOnBackdropClick,
                    buttons: [
                        {
                            text: new Text({
                                text: 'Yes',
                                style: {
                                    ...defaultTextStyle,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    fill: getColor(colors.textColor),
                                },
                            }),
                            defaultView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonColor)),
                            hoverView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonHoverColor)),
                            pressedView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonPressedColor)),
                            animations: {
                                hover: {
                                    props: {
                                        scale: {
                                            x: 1.03,
                                            y: 1.03,
                                        },
                                        x: -2,
                                        y: -1,
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
                                text: 'No',
                                style: {
                                    ...defaultTextStyle,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    fill: getColor(colors.textColor),
                                },
                            }),
                            defaultView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonColor)),
                            hoverView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonHoverColor)),
                            pressedView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonPressedColor)),
                            animations: {
                                hover: {
                                    props: {
                                        scale: {
                                            x: 1.03,
                                            y: 1.03,
                                        },
                                        x: -1,
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
                                text: 'Cancel',
                                style: {
                                    ...defaultTextStyle,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    fill: getColor(colors.textColor),
                                },
                            }),
                            defaultView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonColor)),
                            hoverView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonHoverColor)),
                            pressedView: new Graphics()
                                .roundRect(0, 0, 90, 50, radius)
                                .fill(getColor(buttonPressedColor)),
                            animations: {
                                hover: {
                                    props: {
                                        scale: {
                                            x: 1.03,
                                            y: 1.03,
                                        },
                                        x: -1,
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
                    buttonList: {
                        elementsMargin: 40,
                    },
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

export default {
    title: 'Components/Dialog/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryContext } from '@pixi/storybook-renderer';
import { Dialog } from '../../Dialog';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { createBunnyBackdrop } from '../utils/backdrop';
import { getColor } from '../utils/color';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    width: 400,
    height: 300,
    padding: 20,
    backdropAlpha: 0.7,
    backgroundColor: colors.pannelColor,
    titleColor: colors.textColor,
    contentColor: colors.textColor,
    buttonColor: colors.color,
    buttonHoverColor: colors.hoverColor,
    buttonPressedColor: colors.pressedColor,
    closeOnBackdropClick: false,
};

type Args = typeof args;

export const WhiteBackground = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backgroundColor,
                    titleColor,
                    contentColor,
                    buttonColor,
                    buttonHoverColor,
                    buttonPressedColor,
                } = args;

                await preload(['bunny.png']);

                const bunnyBackdrop = createBunnyBackdrop(2);

                const bg = new Graphics().rect(0, 0, width, height).fill(backgroundColor);

                const dialog = new Dialog({
                    background: bg,
                    backdrop: bunnyBackdrop,
                    title: new Text({
                        text: 'Simple Dialog',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    content: new Text({
                        text: 'This dialog uses solid colors!',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: getColor(contentColor),
                        },
                    }),
                    buttons: [{ text: 'OK' }],
                    width,
                    height,
                    padding,
                    buttonColor: getColor(buttonColor),
                    buttonHoverColor: getColor(buttonHoverColor),
                    buttonPressedColor: getColor(buttonPressedColor),
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

export const BlueBackground = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backgroundColor,
                    titleColor,
                    contentColor,
                    buttonColor,
                    buttonHoverColor,
                    buttonPressedColor,
                    closeOnBackdropClick,
                } = args;

                await preload(['bunny.png']);

                const bunnyBackdrop = createBunnyBackdrop(-2);

                const bg = new Graphics().rect(0, 0, width, height).fill(backgroundColor);

                const dialog = new Dialog({
                    background: bg,
                    backdrop: bunnyBackdrop,
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
                        { text: 'Cancel' },
                        { text: 'Confirm' },
                    ],
                    width,
                    height,
                    padding,
                    buttonColor: getColor(buttonColor),
                    buttonHoverColor: getColor(buttonHoverColor),
                    buttonPressedColor: getColor(buttonPressedColor),
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
    title: 'Components/Dialog/Use Solid Colors',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

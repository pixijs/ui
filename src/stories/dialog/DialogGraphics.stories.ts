import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryContext } from '@pixi/storybook-renderer';
import { Dialog } from '../../Dialog';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
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
    animationDuration: 300,
    disableAnimations: false,
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
                    buttonHoverColor,
                    buttonPressedColor,
                    animationDuration,
                    disableAnimations,
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
                        text: 'Alert',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    content: new Text({
                        text: 'This is an alert message!',
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
                    radius,
                    buttonColor: getColor(buttonColor),
                    buttonHoverColor: getColor(buttonHoverColor),
                    buttonPressedColor: getColor(buttonPressedColor),
                    animationDuration,
                    disableAnimations,
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
                    animationDuration,
                    disableAnimations,
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
                    buttons: [{ text: 'Cancel' }, { text: 'Confirm' }],
                    width,
                    height,
                    padding,
                    radius,
                    buttonColor: getColor(buttonColor),
                    buttonHoverColor: getColor(buttonHoverColor),
                    buttonPressedColor: getColor(buttonPressedColor),
                    closeOnBackdropClick,
                    animationDuration,
                    disableAnimations,
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
                    animationDuration,
                    disableAnimations,
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
                    buttons: [{ text: 'Yes' }, { text: 'No' }, { text: 'Cancel' }],
                    width,
                    height,
                    padding,
                    radius,
                    buttonColor: getColor(buttonColor),
                    buttonHoverColor: getColor(buttonHoverColor),
                    buttonPressedColor: getColor(buttonPressedColor),
                    animationDuration,
                    disableAnimations,
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

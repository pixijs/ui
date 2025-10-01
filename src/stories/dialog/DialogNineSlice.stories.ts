import { Text, Texture } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { Dialog } from '../../Dialog';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const defaultArgs = {
    width: 500,
    height: 350,
    padding: 30,
    backdropAlpha: 0.7,
    titleColor: 0xFFFFFF,
    contentColor: 0xEEEEEE,
    closeOnBackdropClick: false,
};

type Args = typeof defaultArgs;

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
                    backdropAlpha,
                } = args;

                await preload(['button_blue.png']);

                const dialog = new Dialog({
                    background: Texture.from('button_blue.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: 0x000000,
                    backdropAlpha,
                    title: new Text({
                        text: 'Fancy Dialog',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: 0xFFFFFF,
                        },
                    }),
                    content: new Text({
                        text: 'This dialog has a scalable border!',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: 0xFFFFFF,
                        },
                    }),
                    buttons: [{ text: 'Amazing!' }],
                    width,
                    height,
                    padding,
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
    args: defaultArgs,
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
                    backdropAlpha,
                    closeOnBackdropClick,
                } = args;

                await preload(['button_green.png']);

                const dialog = new Dialog({
                    background: Texture.from('button_green.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: 0x000000,
                    backdropAlpha,
                    title: new Text({
                        text: 'Confirm Action',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: 0xFFFFFF,
                        },
                    }),
                    content: new Text({
                        text: 'Are you sure you want to proceed?',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: 0xFFFFFF,
                        },
                    }),
                    buttons: [
                        { text: 'Cancel' },
                        { text: 'Confirm' },
                    ],
                    width,
                    height,
                    padding,
                    closeOnBackdropClick,
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
        ...defaultArgs,
        closeOnBackdropClick: true,
    },
};

export const NineSliceDifferentSizes = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backdropAlpha,
                } = args;

                await preload(['button_white.png']);

                const dialog = new Dialog({
                    background: Texture.from('button_white.png'),
                    nineSliceSprite: [25, 20, 25, 20],
                    backdropColor: 0x000000,
                    backdropAlpha,
                    title: new Text({
                        text: 'Scalable',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 28,
                            fontWeight: 'bold',
                            fill: 0x000000,
                        },
                    }),
                    content: new Text({
                        text: 'Try changing the width and height to see how the border scales properly!',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 18,
                            fill: 0x333333,
                        },
                    }),
                    buttons: [
                        { text: 'Small' },
                        { text: 'Medium' },
                        { text: 'Large' },
                    ],
                    width,
                    height,
                    padding,
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
    args: defaultArgs,
};

export default {
    title: 'Components/Dialog/Use NineSliceSprite',
    argTypes: {
        width: { control: { type: 'range', min: 300, max: 800, step: 10 } },
        height: { control: { type: 'range', min: 200, max: 600, step: 10 } },
        padding: { control: { type: 'range', min: 10, max: 50, step: 5 } },
        backdropAlpha: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
        titleColor: { control: 'color' },
        contentColor: { control: 'color' },
        closeOnBackdropClick: { control: 'boolean' },
    },
    args: defaultArgs,
};

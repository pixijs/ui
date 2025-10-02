import { Graphics, Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { Dialog } from '../../Dialog';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { createBunnyBackdrop } from '../utils/backdrop';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const defaultArgs = {
    width: 400,
    height: 300,
    padding: 20,
    backdropAlpha: 0.7,
    titleColor: 0x000000,
    contentColor: 0x333333,
    closeOnBackdropClick: false,
};

type Args = typeof defaultArgs;

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
                    titleColor,
                    contentColor,
                } = args;

                await preload(['bunny.png']);

                const bunnyBackdrop = createBunnyBackdrop(2);

                const bg = new Graphics()
                    .rect(0, 0, width, height)
                    .fill(0xFFFFFF);

                const dialog = new Dialog({
                    background: bg,
                    backdrop: bunnyBackdrop,
                    title: new Text({
                        text: 'Simple Dialog',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: titleColor,
                        },
                    }),
                    content: new Text({
                        text: 'This dialog uses solid colors!',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: contentColor,
                        },
                    }),
                    buttons: [{ text: 'OK' }],
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
                    closeOnBackdropClick,
                } = args;

                await preload(['bunny.png']);

                const bunnyBackdrop = createBunnyBackdrop(-2);

                const bg = new Graphics()
                    .rect(0, 0, width, height)
                    .fill(0x4A90E2);

                const dialog = new Dialog({
                    background: bg,
                    backdrop: bunnyBackdrop,
                    title: new Text({
                        text: 'Confirm',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: 0xFFFFFF,
                        },
                    }),
                    content: new Text({
                        text: 'Do you want to save your changes?',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: 0xFFFFFF,
                        },
                    }),
                    buttons: [
                        { text: 'Cancel' },
                        { text: 'Save' },
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

export default {
    title: 'Components/Dialog/Use Solid Colors',
    argTypes: {
        width: { control: { type: 'range', min: 200, max: 800, step: 10 } },
        height: { control: { type: 'range', min: 150, max: 600, step: 10 } },
        padding: { control: { type: 'range', min: 10, max: 50, step: 5 } },
        backdropAlpha: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
        titleColor: { control: 'color' },
        contentColor: { control: 'color' },
        closeOnBackdropClick: { control: 'boolean' },
    },
    args: defaultArgs,
};

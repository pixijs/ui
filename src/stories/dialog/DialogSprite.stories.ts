import { Sprite, Text, Texture } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { Dialog } from '../../Dialog';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
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

export const SpriteBackground = {
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
                    titleColor,
                    contentColor,
                } = args;

                await preload(['input.png']);

                const backdrop = new Sprite(Texture.WHITE);

                backdrop.tint = 0x000000;
                backdrop.alpha = backdropAlpha;
                backdrop.width = 10000;
                backdrop.height = 10000;
                backdrop.x = -5000;
                backdrop.y = -5000;

                const dialog = new Dialog({
                    background: Texture.from('input.png'),
                    backdrop,
                    title: new Text({
                        text: 'Sprite Dialog',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: titleColor,
                        },
                    }),
                    content: new Text({
                        text: 'This dialog uses a sprite texture!',
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

export const SpriteButtons = {
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
                    titleColor,
                    contentColor,
                    closeOnBackdropClick,
                } = args;

                await preload(['select.png']);

                const backdrop = new Sprite(Texture.WHITE);

                backdrop.tint = 0x000000;
                backdrop.alpha = backdropAlpha;
                backdrop.width = 10000;
                backdrop.height = 10000;
                backdrop.x = -5000;
                backdrop.y = -5000;

                const dialog = new Dialog({
                    background: Texture.from('select.png'),
                    backdrop,
                    title: new Text({
                        text: 'Confirm',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: titleColor,
                        },
                    }),
                    content: new Text({
                        text: 'Do you want to save your changes?',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: contentColor,
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
    title: 'Components/Dialog/Use Sprite',
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

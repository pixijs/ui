import { Container, Graphics, Sprite, Text, Texture, Ticker } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { Dialog } from '../../Dialog';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

function createBunnyBackdrop(width: number = 10000, height: number = 10000): Container
{
    const container = new Container();
    const bunnyTexture = Texture.from('bunny.png');
    const bunnies: Sprite[] = [];

    const bunnyCount = 25;

    for (let i = 0; i < bunnyCount; i++)
    {
        const bunny = new Sprite(bunnyTexture);

        bunny.x = (i / bunnyCount) * width;
        bunny.y = (i / bunnyCount) * height;

        const scale = 0.5 + (Math.random() * 1.5);

        bunny.scale.set(scale);

        (bunny as any).vx = (Math.random() - 0.5) * 2;
        (bunny as any).vy = (Math.random() - 0.5) * 2;

        bunnies.push(bunny);
        container.addChild(bunny);
    }

    Ticker.shared.add(() =>
    {
        bunnies.forEach((bunny) =>
        {
            bunny.x += (bunny as any).vx;
            bunny.y += (bunny as any).vy;

            if (bunny.x < -bunny.width) bunny.x = width;
            if (bunny.x > width) bunny.x = -bunny.width;
            if (bunny.y < -bunny.height) bunny.y = height;
            if (bunny.y > height) bunny.y = -bunny.height;
        });
    });

    const overlay = new Sprite(Texture.WHITE);

    overlay.tint = 0x000000;
    overlay.alpha = 0.5;
    overlay.width = width;
    overlay.height = height;
    container.addChildAt(overlay, 0);

    return container;
}

const defaultArgs = {
    width: 400,
    height: 300,
    radius: 20,
    padding: 20,
    backgroundColor: 0xFFFFFF,
    backdropColor: 0x000000,
    backdropAlpha: 0.5,
    titleColor: 0x000000,
    contentColor: 0x333333,
    closeOnBackdropClick: false,
};

type Args = typeof defaultArgs;

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
                    backdropColor,
                    backdropAlpha,
                    titleColor,
                    contentColor,
                } = args;

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor),
                    backdrop: new Graphics()
                        .rect(0, 0, 10000, 10000)
                        .fill({ color: backdropColor, alpha: backdropAlpha }),
                    title: new Text({
                        text: 'Alert',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: titleColor,
                        },
                    }),
                    content: new Text({
                        text: 'This is an alert message!',
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
                    radius,
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
                    backdropColor,
                    backdropAlpha,
                    titleColor,
                    contentColor,
                    closeOnBackdropClick,
                } = args;

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor),
                    backdrop: new Graphics()
                        .rect(0, 0, 10000, 10000)
                        .fill({ color: backdropColor, alpha: backdropAlpha }),
                    title: new Text({
                        text: 'Confirm Action',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: titleColor,
                        },
                    }),
                    content: new Text({
                        text: 'Are you sure you want to proceed?',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: contentColor,
                        },
                    }),
                    buttons: [
                        { text: 'Cancel' },
                        { text: 'Confirm' },
                    ],
                    width,
                    height,
                    padding,
                    radius,
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

export const ThreeButtons = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    width,
                    height,
                    radius,
                    padding,
                    backgroundColor,
                    titleColor,
                    contentColor,
                } = args;

                await preload(['bunny.png']);

                const bunnyBackdrop = createBunnyBackdrop();

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor),
                    backdrop: bunnyBackdrop,
                    title: new Text({
                        text: 'Choose Action',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: titleColor,
                        },
                    }),
                    content: new Text({
                        text: 'What would you like to do?',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            fill: contentColor,
                        },
                    }),
                    buttons: [
                        { text: 'Yes' },
                        { text: 'No' },
                        { text: 'Cancel' },
                    ],
                    width,
                    height,
                    padding,
                    radius,
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
    title: 'Components/Dialog/Use Graphics',
    argTypes: {
        width: { control: { type: 'range', min: 200, max: 800, step: 10 } },
        height: { control: { type: 'range', min: 150, max: 600, step: 10 } },
        radius: { control: { type: 'range', min: 0, max: 50, step: 5 } },
        padding: { control: { type: 'range', min: 10, max: 50, step: 5 } },
        backgroundColor: { control: 'color' },
        backdropColor: { control: 'color' },
        backdropAlpha: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
        titleColor: { control: 'color' },
        contentColor: { control: 'color' },
        closeOnBackdropClick: { control: 'boolean' },
    },
    args: defaultArgs,
};

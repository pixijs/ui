import { Container, Graphics, Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { Dialog } from '../../Dialog';
import { FancyButton } from '../../FancyButton';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const defaultArgs = {
    width: 500,
    height: 400,
    padding: 20,
    backgroundColor: 0xFFFFFF,
    backdropAlpha: 0.7,
};

type Args = typeof defaultArgs;

export const LetterGridSelector = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const { width, height, padding, backgroundColor, backdropAlpha } = args;

                const letterGrid = new Container();
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                const cols = 5;
                const buttonSize = 60;
                const spacing = 10;

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, 20)
                        .fill(backgroundColor),
                    backdropColor: 0x000000,
                    backdropAlpha,
                    title: new Text({
                        text: 'Select a letter',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: 0x000000,
                        },
                    }),
                    content: letterGrid,
                    width,
                    height,
                    padding,
                    closeOnBackdropClick: true,
                    buttons: undefined,
                });

                letters.forEach((letter, index) =>
                {
                    const col = index % cols;
                    const row = Math.floor(index / cols);

                    const letterButton = new FancyButton({
                        defaultView: new Graphics()
                            .roundRect(0, 0, buttonSize, buttonSize, 8)
                            .fill(0xA5E24D),
                        hoverView: new Graphics()
                            .roundRect(0, 0, buttonSize, buttonSize, 8)
                            .fill(0x8BC34A),
                        pressedView: new Graphics()
                            .roundRect(0, 0, buttonSize, buttonSize, 8)
                            .fill(0x689F38),
                        text: new Text({
                            text: letter,
                            style: {
                                ...defaultTextStyle,
                                fontSize: 24,
                                fontWeight: 'bold',
                                fill: 0x000000,
                            },
                        }),
                    });

                    letterButton.x = col * (buttonSize + spacing);
                    letterButton.y = row * (buttonSize + spacing);

                    letterButton.onPress.connect(() =>
                    {
                        action('letterSelected')(letter);
                        dialog.close();
                    });

                    letterGrid.addChild(letterButton);
                });

                const gridWidth = (cols * buttonSize) + ((cols - 1) * spacing);

                letterGrid.x = (width - gridWidth) / 2;

                view.addChild(dialog);
                dialog.open();
            },
            resize: centerView,
        }),
    args: defaultArgs,
};

const swapDialogArgs = {
    width: 450,
    height: 550,
    padding: 20,
    backgroundColor: 0xFFFFFF,
    backdropAlpha: 0.7,
};

type SwapArgs = typeof swapDialogArgs;

export const CheckboxSwapDialog = {
    render: (args: SwapArgs, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const { width, height, padding, backgroundColor, backdropAlpha } = args;

                const selectedLetters = new Set<string>();

                const checkboxContainer = new Container();
                const letters = 'ABCDEFGHIJ'.split('');

                letters.forEach((letter, index) =>
                {
                    const checkbox = new CheckBox({
                        style: {
                            unchecked: new Graphics()
                                .roundRect(0, 0, 30, 30, 5)
                                .stroke({ color: 0x000000, width: 2 }),
                            checked: new Graphics()
                                .roundRect(0, 0, 30, 30, 5)
                                .fill(0xA5E24D)
                                .stroke({ color: 0x000000, width: 2 }),
                            text: {
                                fontSize: 20,
                                fill: 0x000000,
                            },
                        },
                        text: letter,
                    });

                    checkbox.y = index * 50;

                    checkbox.onCheck.connect((checked) =>
                    {
                        if (checked)
                        {
                            selectedLetters.add(letter);
                        }
                        else
                        {
                            selectedLetters.delete(letter);
                        }

                        updateSwapButton();
                    });

                    checkboxContainer.addChild(checkbox);
                });

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, 20)
                        .fill(backgroundColor),
                    backdropColor: 0x000000,
                    backdropAlpha,
                    title: new Text({
                        text: 'Swap letters',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: 0x000000,
                        },
                    }),
                    content: checkboxContainer,
                    buttons: [
                        { text: 'Cancel' },
                        { text: 'Swap' },
                    ],
                    width,
                    height,
                    padding,
                    scrollBox: {
                        width: width - (padding * 4),
                        height: 300,
                    },
                });

                const swapButton = (dialog as any).buttons[1];

                function updateSwapButton()
                {
                    if (selectedLetters.size === 0)
                    {
                        swapButton.enabled = false;
                    }
                    else
                    {
                        swapButton.enabled = true;
                    }
                }

                updateSwapButton();

                dialog.onSelect.connect((index) =>
                {
                    if (index === 1 && selectedLetters.size > 0)
                    {
                        action('swapLetters')(Array.from(selectedLetters).join(', '));
                    }
                });

                view.addChild(dialog);
                dialog.open();
            },
            resize: centerView,
        }),
    args: swapDialogArgs,
};

export default {
    title: 'Components/Dialog/Use Sprite',
    argTypes: {
        width: { control: { type: 'range', min: 400, max: 800, step: 10 } },
        height: { control: { type: 'range', min: 300, max: 600, step: 10 } },
        padding: { control: { type: 'range', min: 10, max: 50, step: 5 } },
        backgroundColor: { control: 'color' },
        backdropAlpha: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    },
    args: defaultArgs,
};

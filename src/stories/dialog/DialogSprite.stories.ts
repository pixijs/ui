import { Container, Graphics, Text } from 'pixi.js';
import { PixiStory, StoryContext } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { Dialog } from '../../Dialog';
import { FancyButton } from '../../FancyButton';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { action } from '@storybook/addon-actions';

const args = {
    width: 500,
    height: 400,
    padding: 20,
    backgroundColor: colors.pannelColor,
    backdropColor: '#000000',
    backdropAlpha: 0.7,
    titleColor: colors.textColor,
    contentColor: colors.textColor,
    buttonColor: colors.color,
    buttonHoverColor: colors.hoverColor,
    buttonPressedColor: colors.pressedColor,
};

type Args = typeof args;

export const LetterGridSelector = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backgroundColor,
                    backdropColor,
                    backdropAlpha,
                    titleColor,
                    buttonColor,
                    buttonHoverColor,
                    buttonPressedColor,
                } = args;

                const letterGrid = new Container();
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                const cols = 5;
                const buttonSize = 60;
                const spacing = 10;
                const letterButtons: Array<{ button: FancyButton; letter: string }> = [];

                letters.forEach((letter, index) =>
                {
                    const col = index % cols;
                    const row = Math.floor(index / cols);

                    const letterButton = new FancyButton({
                        defaultView: new Graphics()
                            .roundRect(0, 0, buttonSize, buttonSize, 8)
                            .fill(buttonColor),
                        hoverView: new Graphics()
                            .roundRect(0, 0, buttonSize, buttonSize, 8)
                            .fill(buttonHoverColor),
                        pressedView: new Graphics()
                            .roundRect(0, 0, buttonSize, buttonSize, 8)
                            .fill(buttonPressedColor),
                        text: new Text({
                            text: letter,
                            style: {
                                ...defaultTextStyle,
                                fontSize: 24,
                                fontWeight: 'bold',
                                fill: getColor(colors.textColor),
                            },
                        }),
                    });

                    letterButton.x = col * (buttonSize + spacing);
                    letterButton.y = row * (buttonSize + spacing);

                    letterButtons.push({ button: letterButton, letter });
                    letterGrid.addChild(letterButton);
                });

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, 20)
                        .fill(backgroundColor),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    title: new Text({
                        text: 'Select a letter',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    content: letterGrid,
                    width,
                    height,
                    padding,
                    closeOnBackdropClick: true,
                    buttons: undefined,
                    scrollBox: {
                        width: width - (padding * 4),
                        height: 280,
                    },
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                letterButtons.forEach(({ button, letter }) =>
                {
                    button.onPress.connect(() =>
                    {
                        action('letterSelected')(letter);
                        dialog.close();
                    });
                });

                view.addChild(dialog);
                dialog.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

const swapDialogArgs = {
    width: 450,
    height: 400,
    padding: 20,
    backgroundColor: colors.pannelColor,
    backdropColor: '#000000',
    backdropAlpha: 0.7,
    titleColor: colors.textColor,
    checkboxUncheckedColor: colors.pannelBorderColor,
    checkboxCheckedColor: colors.color,
    checkboxTextColor: colors.textColor,
    buttonColor: colors.color,
    buttonHoverColor: colors.hoverColor,
    buttonPressedColor: colors.pressedColor,
};

type SwapArgs = typeof swapDialogArgs;

export const CheckboxSwapDialog = {
    render: (args: SwapArgs, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    padding,
                    backgroundColor,
                    backdropColor,
                    backdropAlpha,
                    titleColor,
                    checkboxUncheckedColor,
                    checkboxCheckedColor,
                    checkboxTextColor,
                    buttonColor,
                    buttonHoverColor,
                    buttonPressedColor,
                } = args;

                const selectedLetters = new Set<string>();

                const checkboxContainer = new Container();
                const letters = 'ABCDEFGHIJ'.split('');

                letters.forEach((letter, index) =>
                {
                    const checkbox = new CheckBox({
                        style: {
                            unchecked: new Graphics()
                                .roundRect(0, 0, 30, 30, 5)
                                .fill(checkboxUncheckedColor)
                                .stroke({ color: checkboxTextColor, width: 2 }),
                            checked: new Graphics()
                                .roundRect(0, 0, 30, 30, 5)
                                .fill(checkboxCheckedColor)
                                .stroke({ color: checkboxTextColor, width: 2 }),
                            text: {
                                fontSize: 20,
                                fill: getColor(checkboxTextColor),
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

                const cancelButton = new FancyButton({
                    text: 'Cancel',
                    defaultView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonColor),
                    hoverView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonHoverColor),
                    pressedView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonPressedColor),
                });

                const swapButton = new FancyButton({
                    text: 'Swap',
                    defaultView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonColor),
                    hoverView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonHoverColor),
                    pressedView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonPressedColor),
                });

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, 20)
                        .fill(backgroundColor),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    title: new Text({
                        text: 'Swap letters',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    content: checkboxContainer,
                    buttons: [
                        cancelButton,
                        swapButton,
                    ],
                    buttonList: {
                        elementsMargin: 10,
                    },
                    width,
                    height,
                    padding,
                    scrollBox: {
                        width: width - (padding * 4),
                        height: 230,
                    },
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

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
    args: getDefaultArgs(swapDialogArgs),
};

export default {
    title: 'Components/Dialog/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

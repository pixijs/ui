import { Graphics, Text } from 'pixi.js';
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
    height: 420,
    padding: 35,
    backgroundColor: colors.pannelColor,
    titleColor: colors.textColor,
    contentColor: colors.textColor,
    buttonColor: colors.color,
    buttonHoverColor: colors.hoverColor,
    buttonPressedColor: colors.pressedColor,
    buttonDisabledColor: colors.disabledColor,
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
                    titleColor,
                    buttonColor,
                    buttonHoverColor,
                    buttonPressedColor,
                } = args;

                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                const buttonSize = 60;

                const title = new Text({
                    text: 'Select a letter',
                    style: {
                        ...defaultTextStyle,
                        fontSize: 24,
                        fontWeight: 'bold',
                        fill: getColor(titleColor),
                        lineHeight: 44,
                    },
                });

                const letterButtons: FancyButton[] = letters.map((letter) =>
                {
                    const button = new FancyButton({
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
                        })
                    });

                    return button;
                });

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, 20)
                        .fill(backgroundColor),
                    title,
                    content: letterButtons,
                    width,
                    height,
                    padding,
                });

                letterButtons.forEach((button, index) =>
                {
                    button.onPress.connect(() =>
                    {
                        action('letterSelected')(letters[index]);
                        dialog.close();
                    });
                });

                dialog.onClose.connect(() =>
                {
                    setTimeout(() => dialog.open(), 2000);
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
    verticalList: false,
    backgroundColor: colors.pannelColor,
    titleColor: colors.textColor,
    checkboxUncheckedColor: colors.pannelBorderColor,
    checkboxCheckedColor: colors.color,
    checkboxTextColor: colors.textColor,
    buttonColor: colors.color,
    buttonHoverColor: colors.hoverColor,
    buttonPressedColor: colors.pressedColor,
    buttonDisabledColor: colors.disabledColor,
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
                    verticalList,
                    backgroundColor,
                    titleColor,
                    checkboxUncheckedColor,
                    checkboxCheckedColor,
                    checkboxTextColor,
                    buttonColor,
                    buttonHoverColor,
                    buttonPressedColor,
                    buttonDisabledColor,
                } = args;

                const selectedLetters = new Set<string>();

                const letters = 'ABCDEFGHIJ'.split('');
                const checkboxes: CheckBox[] = letters.map((letter) =>
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

                    return checkbox;
                });

                const cancelButton = new FancyButton({
                    text: new Text({
                        text: 'Cancel',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 20,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
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

                cancelButton.onPress.connect(() => checkboxes.forEach((cb) => { cb.checked = false; }));

                const swapButton = new FancyButton({
                    text: new Text({
                        text: 'Swap',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 20,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    defaultView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonColor),
                    hoverView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonHoverColor),
                    pressedView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonPressedColor),
                    disabledView: new Graphics()
                        .roundRect(0, 0, 100, 40, 10)
                        .fill(buttonDisabledColor),
                });

                const dialog = new Dialog({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, 20)
                        .fill(backgroundColor),
                    title: new Text({
                        text: 'Swap letters',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fill: getColor(titleColor),
                        },
                    }),
                    content: checkboxes,
                    buttons: [
                        cancelButton,
                        swapButton,
                    ],
                    scrollBox: {
                        type: verticalList ? 'vertical' : 'bidirectional',
                        elementsMargin: verticalList ? 5 : 50,
                        vertPadding: 30,
                    },
                    buttonList: {
                        elementsMargin: 10,
                    },
                    width,
                    height,
                    padding,
                });

                function updateSwapButton()
                {
                    swapButton.enabled = selectedLetters.size !== 0;
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

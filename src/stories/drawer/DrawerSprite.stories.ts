import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryContext } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { Drawer } from '../../Drawer';
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

                // Add title to the beginning of content
                const content = [title, ...letterButtons];

                const drawer = new Drawer({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, 20)
                        .fill(backgroundColor),
                    content,
                    width,
                    height,
                    padding,
                    position: 'bottom',
                    closeOnBackdropClick: true,
                    swipeToClose: true,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                letterButtons.forEach((button, index) =>
                {
                    button.onPress.connect(() =>
                    {
                        action('letterSelected')(letters[index]);
                        drawer.close();
                    });
                });

                drawer.onClose.connect(() =>
                {
                    setTimeout(() => drawer.open(), 2000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

const swapDrawerArgs = {
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

type SwapArgs = typeof swapDrawerArgs;

export const CheckboxSwapDrawer = {
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

                const title = new Text({
                    text: 'Swap letters',
                    style: {
                        ...defaultTextStyle,
                        fontSize: 24,
                        fontWeight: 'bold',
                        fill: getColor(titleColor),
                    },
                });

                // Combine all content
                const content = [title, ...checkboxes, cancelButton, swapButton];

                const drawer = new Drawer({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, 20)
                        .fill(backgroundColor),
                    content,
                    scrollBox: {
                        elementsMargin: 10,
                        vertPadding: 10,
                    },
                    width,
                    height,
                    padding,
                    position: 'bottom',
                    closeOnBackdropClick: true,
                    swipeToClose: true,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                // Connect button events after drawer is created
                cancelButton.onPress.connect(() =>
                {
                    checkboxes.forEach((cb) => { cb.checked = false; });
                    drawer.close();
                });

                swapButton.onPress.connect(() =>
                {
                    if (selectedLetters.size > 0)
                    {
                        action('swapLetters')(Array.from(selectedLetters).join(', '));
                        drawer.close();
                    }
                });

                function updateSwapButton()
                {
                    swapButton.enabled = selectedLetters.size !== 0;
                }

                updateSwapButton();

                drawer.onClose.connect(() =>
                {
                    setTimeout(() => drawer.open(), 2000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(swapDrawerArgs),
};

export default {
    title: 'Components/Drawer/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { Container, Graphics, Text } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { Button } from '../../Button';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

const args = {
    text: '👉 Click me 👈',
    ...colors,
    width: 313,
    height: 75,
    radius: 14,
    disabled: false,
    action: action('Button'),
};

export const UseGraphics: StoryFn<typeof args> = ({
    text, width, height, color, hoverColor, pressedColor, disabled, radius, disabledColor, action
}, context) =>
    new PixiStory({
        context,
        init: (view) =>
        {
            // prepare elements
            const buttonView = new Container();
            const buttonBg = new Graphics();

            const textInstance = new Text({
                text, style: {
                    ...defaultTextStyle,
                    fill: defaultTextStyle.fill,
                },
            });

            textInstance.anchor.set(0.5);

            buttonView.addChild(buttonBg, textInstance);

            // Component usage !!!
            const button = new Button(buttonView);

            button.enabled = !disabled;

            button.onPress.connect(() => action('onPress'));
            button.onDown.connect(() =>
            {
                action('onDown');
                pressButton();
            });
            button.onUp.connect(() =>
            {
                action('onUp');
                defaultButton();
            });
            button.onHover.connect(() =>
            {
                action('onHover');
                hoverButton();
            });
            button.onOut.connect(() =>
            {
                action('onOut');
                defaultButton();
            });
            button.onUpOut.connect(() =>
            {
                action('onUpOut');
                defaultButton();
            });

            view.addChild(buttonView);

            const defaultButton = (fillColor = color) =>
            {
                buttonBg
                    .clear()
                    .roundRect(0, 0, width, height, radius)
                    .fill(disabled ? disabledColor : fillColor)
                    .roundRect(12, 12, width - 4, height - 4, radius)
                    .stroke({
                        color: disabled ? disabledColor : fillColor,
                        width: 3,
                    });

                buttonBg.x = -buttonBg.width / 2;
                buttonBg.y = -buttonBg.height / 2;
                textInstance.x = -4;
                textInstance.y = -5;
            };

            defaultButton();

            const hoverButton = () =>
            {
                defaultButton(hoverColor);
            };

            const pressButton = () =>
            {
                buttonBg
                    .clear()
                    .roundRect(0, 0, width, height, radius)
                    .fill(pressedColor)
                    .roundRect(9, 8, width - 4, height - 4, radius)
                    .stroke({
                        color: pressedColor,
                        width: 3,
                    });

                buttonBg.x += 2;
                buttonBg.y += 2;
                textInstance.x += 2;
                textInstance.y += 2;
            };
        },
        resize: centerView,
    });

export default {
    title: 'Components/Button/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

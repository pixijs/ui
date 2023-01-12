import { Sprite as PixiSprite } from '@pixi/sprite';
import { Text } from '@pixi/text';
import { Button } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { preloadAssets } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';
import { Container } from '@pixi/display';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    padding: 11,
    textOffsetX: 0,
    textOffsetY: -7,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)'),
    anchorX: 0.5,
    anchorY: 0.5,
};

export const Sprite = ({
    text,
    textColor,
    disabled,
    onPress,
    padding,
    textOffsetX,
    textOffsetY,
    anchorX,
    anchorY,
}: any) =>
{
    const view = new Container();

    const assets = [
        `button.png`,
        `button_hover.png`,
        `button_pressed.png`,
        `button_disabled.png`,
    ];

    preloadAssets(assets).then(() =>
    {
        const defaultView = PixiSprite.from(`button.png`);
        const hoverView = PixiSprite.from(`button_hover.png`);
        const pressedView = PixiSprite.from(`button_pressed.png`);
        const disabledView = PixiSprite.from(`button_disabled.png`);

        hoverView.scale.set(1.03);
        hoverView.anchor.set(0.5);

        // Component usage !!!
        const button = new Button({
            view: defaultView,
            hoverView,
            pressedView,
            disabledView,
            textView: new Text(text, {
                ...defaultTextStyle,
                fill: textColor || defaultTextStyle.fill,
            }),
            padding,
            offsets: { text: { x: textOffsetX, y: textOffsetY } },
            anchor: {
                x: anchorX,
                y: anchorY,
            },
        });

        if (disabled)
        {
            button.enabled = false;
        }

        button.onPress.connect(onPress);

        view.addChild(button);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Button/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { Sprite as PixiSprite, Text, Texture } from 'pixi.js';
import { Button } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { Layout } from './../../Layout';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { preloadAssets } from '../../utils/helpers/loader';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    padding: 11,
    textOffsetX: 0,
    textOffsetY: -7,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)'),
};

export const Sprite = ({
    text,
    textColor,
    disabled,
    onPress,
    padding,
    textOffsetX,
    textOffsetY,
}: any) => {
    const view = new Layout({
        type: 'vertical',
        elementsMargin: 20,
    });

    const assets = [
        `button.png`,
        `button_hover.png`,
        `button_pressed.png`,
        `button_disabled.png`,
    ];

    preloadAssets(assets).then(() => {
        // Component usage !!!
        const button = new Button({
            view: new PixiSprite(Texture.from(`button.png`)),
            hoverView: new PixiSprite(Texture.from(`button_hover.png`)),
            pressedView: new PixiSprite(Texture.from(`button_pressed.png`)),
            disabledView: new PixiSprite(Texture.from(`button_disabled.png`)),
            textView: new Text(text, {
                ...defaultTextStyle,
                fill: textColor || defaultTextStyle.fill,
            }),
            padding,
            textOffset: { x: textOffsetX, y: textOffsetY },
        });

        if (disabled) {
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

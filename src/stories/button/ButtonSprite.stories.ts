import { Text } from '@pixi/text';
import { Button } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { preloadAssets } from '../utils/loader';
import { centerElement, centerView } from '../../utils/helpers/resize';
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

export const UseSprite = ({
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
        // Component usage !!!
        const button = new Button({
            defaultView: `button.png`,
            hoverView: `button_hover.png`,
            pressedView: `button_pressed.png`,
            disabledView: `button_disabled.png`,
            text: new Text(text, {
                ...defaultTextStyle,
                fill: textColor || defaultTextStyle.fill,
            }),
            padding,
            offset: {
                pressed: { y: 5 },
            },
            textOffset: { x: textOffsetX, y: textOffsetY },
            anchorX,
            anchorY,
        });

        if (disabled)
        {
            button.enabled = false;
        }

        button.onPress.connect(onPress);

        centerView(view);

        view.addChild(button);
    });

    return { view, resize: () => centerView(view) };
};

export default {
    title: 'Components/Button/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

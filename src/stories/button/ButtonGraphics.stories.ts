import { Graphics } from '@pixi/graphics';
import { Text } from '@pixi/text';
import { Button } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../utils/loader';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { MaskedFrame } from '../../MaskedFrame';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    color: '#A5E24D',
    hoverColor: '#FEC230',
    pressedColor: '#FE6048',
    disabledColor: '#6E6E6E',
    width: 350,
    height: 200,
    padding: 11,
    radius: 50,
    iconSize: 100,
    iconOffsetX: 0,
    iconOffsetY: -30,
    textOffsetX: 0,
    textOffsetY: 50,
    defaultOffset: 0,
    hoverOffset: -1,
    pressedOffset: 5,
    disabledOffset: 0,
    disabled: false,
    action: action('button Event:')
};

export const UseGraphics = ({
    width,
    height,
    radius,
    text,
    color,
    hoverColor,
    pressedColor,
    disabledColor,
    disabled,
    padding,
    textColor,
    iconSize,
    iconOffsetX,
    iconOffsetY,
    textOffsetX,
    textOffsetY,
    defaultOffset,
    hoverOffset,
    pressedOffset,
    disabledOffset,
    action
}: any) =>
{
    color = Number(color.replace('#', '0x'));
    hoverColor = Number(hoverColor.replace('#', '0x'));
    pressedColor = Number(pressedColor.replace('#', '0x'));
    disabledColor = Number(disabledColor.replace('#', '0x'));

    const view = new Container();

    const assets = [`avatar-01.png`];

    preloadAssets(assets).then(() =>
    {
        const fill = Number(textColor.replace('#', '0x'));
        const target = Sprite.from(`avatar-01.png`);

        // Component usage !!!
        const icon = new MaskedFrame({
            target,
            mask: new Graphics().beginFill(0x000000).drawCircle(target.width / 2, target.height / 2, target.width / 2),
            borderWidth: 10,
            borderColor: fill
        });

        icon.scale.set(iconSize / target.width);

        // Component usage !!!
        const button = new Button({
            defaultView: new Graphics().beginFill(color).drawRoundedRect(0, 0, width, height, radius),
            hoverView: new Graphics().beginFill(hoverColor).drawRoundedRect(0, 0, width, height, radius),
            pressedView: new Graphics().beginFill(pressedColor).drawRoundedRect(0, 0, width, height, radius),
            disabledView: new Graphics().beginFill(disabledColor).drawRoundedRect(0, 0, width, height, radius),
            icon,
            text: new Text(text, {
                ...defaultTextStyle,
                fill
            }),
            padding,
            offset: {
                default: { y: defaultOffset },
                hover: { y: hoverOffset },
                pressed: { y: pressedOffset },
                disabled: { y: disabledOffset }
            },
            textOffset: {
                x: textOffsetX,
                y: textOffsetY
            },
            iconOffset: {
                x: iconOffsetX,
                y: iconOffsetY
            }
        });

        if (disabled)
        {
            button.enabled = false;
        }

        button.anchor.set(0);

        button.onPress.connect(() => action('onPress'));
        button.onDown.connect(() => action('onDown'));
        button.onUp.connect(() => action('onUp'));
        button.onHover.connect(() => action('onHover'));
        button.onOut.connect(() => action('onOut'));
        button.onUpOut.connect(() => action('onUpOut'));

        view.addChild(button);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/Button/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

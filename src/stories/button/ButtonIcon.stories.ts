import { Graphics } from '@pixi/graphics';
import { Button } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../utils/loader';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { MaskedFrame } from '../../MaskedFrame';

const args = {
    color: '#A5E24D',
    hoverColor: '#FEC230',
    pressedColor: '#FE6048',
    disabledColor: '#6E6E6E',
    width: 250,
    height: 250,
    padding: 10,
    radius: 200,
    iconSize: 250,
    iconOffsetX: 0,
    iconOffsetY: 0,
    defaultOffset: 0,
    hoverOffset: -1,
    pressedOffset: 5,
    disabledOffset: 0,
    disabled: false,
    action: action('button Event:')
};

export const UseIcon = ({
    width,
    height,
    radius,
    color,
    hoverColor,
    pressedColor,
    disabledColor,
    disabled,
    padding,
    iconSize,
    iconOffsetX,
    iconOffsetY,
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
        const target = Sprite.from(`avatar-01.png`);

        target.scale.set(iconSize / target.width);

        const icon = new MaskedFrame({
            target,
            mask: new Graphics().beginFill(0x000000).drawCircle(target.width / 2, target.height / 2, target.width / 2),
            borderWidth: 5,
            borderColor: 0xffffff
        });

        // Component usage !!!
        const button = new Button({
            defaultView: new Graphics().beginFill(color).drawRoundedRect(0, 0, width, height, radius),
            hoverView: new Graphics().beginFill(hoverColor).drawRoundedRect(0, 0, width, height, radius),
            pressedView: new Graphics().beginFill(pressedColor).drawRoundedRect(0, 0, width, height, radius),
            disabledView: new Graphics().beginFill(disabledColor).drawRoundedRect(0, 0, width, height, radius),
            icon,
            padding,
            offset: {
                default: { y: defaultOffset },
                hover: { y: hoverOffset },
                pressed: { y: pressedOffset },
                disabled: { y: disabledOffset }
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
    title: 'Components/Button/Use Icon',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

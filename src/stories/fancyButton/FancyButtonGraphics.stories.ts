import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { FancyButton } from '../../FancyButton';
import { MaskedFrame } from '../../MaskedFrame';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    color: '#A5E24D',
    hoverColor: '#FEC230',
    pressedColor: '#FE6048',
    disabledColor: '#6E6E6E',
    width: 350,
    height: 350,
    padding: 11,
    radius: 50,
    iconOffsetX: 0,
    iconOffsetY: -30,
    textOffsetX: 0,
    textOffsetY: 140,
    defaultOffsetY: 0,
    hoverOffsetY: -1,
    pressedOffsetY: 5,
    disabledOffsetY: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    animationDuration: 100,
    disabled: false,
    action: action('Button')
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
    anchorX,
    anchorY,
    textColor,
    iconOffsetX,
    iconOffsetY,
    textOffsetX,
    textOffsetY,
    defaultOffsetY,
    hoverOffsetY,
    pressedOffsetY,
    disabledOffsetY,
    animationDuration,
    action
}: any) =>
{
    color = getColor(color);
    hoverColor = getColor(hoverColor);
    pressedColor = getColor(pressedColor);
    disabledColor = getColor(disabledColor);

    const view = new Container();

    const assets = [`avatar-01.png`];

    preload(assets).then(() =>
    {
        const fill = getColor(textColor);
        const target = Sprite.from(`avatar-01.png`);

        // Component usage !!!
        const icon = new MaskedFrame({
            target,
            mask: new Graphics().circle(target.width / 2, target.height / 2, target.width / 2).fill(0x000000),
            borderWidth: 10,
            borderColor: fill
        });

        // Component usage !!!
        const button = new FancyButton({
            defaultView: new Graphics().roundRect(0, 0, width, height, radius).fill(color),
            hoverView: new Graphics().roundRect(0, 0, width, height, radius).fill(hoverColor),
            pressedView: new Graphics().roundRect(0, 0, width, height, radius).fill(pressedColor),
            disabledView: new Graphics().roundRect(0, 0, width, height, radius).fill(disabledColor),
            icon,
            text: new Text({
                text, style: {
                    ...defaultTextStyle,
                    fill
                }
            }),
            padding,
            offset: {
                default: { y: defaultOffsetY },
                hover: { y: hoverOffsetY },
                pressed: { y: pressedOffsetY },
                disabled: { y: disabledOffsetY }
            },
            textOffset: {
                x: textOffsetX,
                y: textOffsetY
            },
            iconOffset: {
                x: iconOffsetX,
                y: iconOffsetY
            },
            animations: {
                default: {
                    props: {
                        scale: { x: 1, y: 1 },
                        y: defaultOffsetY
                    },
                    duration: animationDuration
                },
                hover: {
                    props: {
                        scale: { x: 1.03, y: 1.03 },
                        y: hoverOffsetY
                    },
                    duration: animationDuration
                },
                pressed: {
                    props: {
                        scale: { x: 0.9, y: 0.9 },
                        y: pressedOffsetY
                    },
                    duration: animationDuration
                }
            }
        });

        if (disabled)
        {
            button.enabled = false;
        }

        button.anchor.set(anchorX, anchorY);

        button.onPress.connect(() => action('onPress'));
        button.onDown.connect(() => action('onDown'));
        button.onUp.connect(() => action('onUp'));
        button.onHover.connect(() => action('onHover'));
        button.onOut.connect(() => action('onOut'));
        button.onUpOut.connect(() => action('onUpOut'));

        view.addChild(button);

        centerView(view);
    });

    return { view, resize: () => centerView(view) };
};

export default {
    title: 'Components/FancyButton/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

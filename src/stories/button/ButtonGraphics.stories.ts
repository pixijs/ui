import { Graphics } from '@pixi/graphics';
import { Text } from '@pixi/text';
import { Button } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    color: '#A5E24D',
    hoverColor: '#FEC230',
    pressedColor: '#FE6048',
    disabledColor: '#6E6E6E',
    width: 300,
    height: 137,
    padding: 11,
    radius: 50,
    textOffsetX: 0,
    textOffsetY: 0,
    defaultOffset: 0,
    hoverOffset: -1,
    pressedOffset: 5,
    disabledOffset: 0,
    disabled: false,
    action: action('button Event:'),
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
    textOffsetX,
    textOffsetY,
    defaultOffset,
    hoverOffset,
    pressedOffset,
    disabledOffset,
    action,
}: any) =>
{
    color = Number(color.replace('#', '0x'));
    hoverColor = Number(hoverColor.replace('#', '0x'));
    pressedColor = Number(pressedColor.replace('#', '0x'));
    disabledColor = Number(disabledColor.replace('#', '0x'));

    // Component usage !!!
    const view = new Button({
        defaultView: new Graphics()
            .beginFill(color)
            .drawRoundedRect(0, 0, width, height, radius),
        hoverView: new Graphics()
            .beginFill(hoverColor)
            .drawRoundedRect(0, 0, width, height, radius),
        pressedView: new Graphics()
            .beginFill(pressedColor)
            .drawRoundedRect(0, 0, width, height, radius),
        disabledView: new Graphics()
            .beginFill(disabledColor)
            .drawRoundedRect(0, 0, width, height, radius),
        text: new Text(text, {
            ...defaultTextStyle,
            fill: textColor || defaultTextStyle.fill,
        }),
        padding,
        offset: {
            default: { y: defaultOffset },
            hover: { y: hoverOffset },
            pressed: { y: pressedOffset },
            disabled: { y: disabledOffset },
        },
        textOffset: {
            x: textOffsetX,
            y: textOffsetY,
        },
    });

    if (disabled)
    {
        view.enabled = false;
    }

    view.anchor.set(0);

    view.onPress.connect(() => action('onPress'));
    view.onDown.connect(() => action('onDown'));
    view.onUp.connect(() => action('onUp'));
    view.onHover.connect(() => action('onHover'));
    view.onOut.connect(() => action('onOut'));
    view.onUpOut.connect(() => action('onUpOut'));

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/Button/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { Graphics as PixiGraphics } from '@pixi/graphics';
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
    onPress: action('button was pressed! (tap or click!)'),
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
    onPress,
}: any) =>
{
    color = Number(color.replace('#', '0x'));
    hoverColor = Number(hoverColor.replace('#', '0x'));
    pressedColor = Number(pressedColor.replace('#', '0x'));
    disabledColor = Number(disabledColor.replace('#', '0x'));

    // Component usage !!!
    const view = new Button({
        defaultView: new PixiGraphics()
            .beginFill(color)
            .drawRoundedRect(0, 0, width, height, radius),
        hoverView: new PixiGraphics()
            .beginFill(hoverColor)
            .drawRoundedRect(0, 0, width, height, radius),
        pressedView: new PixiGraphics()
            .beginFill(pressedColor)
            .drawRoundedRect(0, 0, width, height, radius),
        disabledView: new PixiGraphics()
            .beginFill(disabledColor)
            .drawRoundedRect(0, 0, width, height, radius),
        textView: new Text(text, {
            ...defaultTextStyle,
            fill: textColor || defaultTextStyle.fill,
        }),
        padding,
        offsets: {
            defaultView: { y: defaultOffset },
            hoverView: { y: hoverOffset },
            pressedView: { y: pressedOffset },
            disabledView: { y: disabledOffset },
            text: {
                x: textOffsetX,
                y: textOffsetY,
            },
        },
    });

    if (disabled)
    {
        view.enabled = false;
    }

    view.onPress.connect(onPress);

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Button',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

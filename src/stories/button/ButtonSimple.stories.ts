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
    anchor: 0.5,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)'),
};

export const Simple = ({
    width,
    height,
    radius,
    text,
    color,
    disabled,
    padding,
    textColor,
    textOffsetX,
    textOffsetY,
    defaultOffset,
    hoverOffset,
    pressedOffset,
    disabledOffset,
    anchor,
    onPress,
}: any) =>
{
    color = Number(color.replace('#', '0x'));

    // Component usage !!!
    const view = new Button({
        defaultView: new Graphics()
            .beginFill(color)
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
        anchor,
    });

    if (disabled)
    {
        view.enabled = false;
    }

    view.onPress.connect(onPress);

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/Button/Simple',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

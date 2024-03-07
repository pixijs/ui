import { Graphics, Text } from 'pixi.js';
import { ButtonContainer } from '../../Button';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { action } from '@storybook/addon-actions';

const args = {
    color: '#A5E24D',
    size: 150,
    radius: 150,
    disabled: false,
    action: action('Button')
};

export const ButtonContainerSprite = ({ size, color, disabled, radius, action }: any) =>
{
    color = getColor(color);

    // Component usage !!!
    const button = new ButtonContainer();

    button.enabled = !disabled;

    button.onPress.connect(() => action('onPress'));
    button.onDown.connect(() => action('onDown'));
    button.onUp.connect(() => action('onUp'));
    button.onHover.connect(() => action('onHover'));
    button.onOut.connect(() => action('onOut'));
    button.onUpOut.connect(() => action('onUpOut'));

    const buttonView = new Graphics().roundRect(0, 0, size, size, radius).fill(color);
    const text = new Text({ text: '🤙', style: { fontSize: 70 } });

    text.anchor.set(0.5);
    text.x = buttonView.width / 2;
    text.y = buttonView.height / 2;

    buttonView.addChild(text);

    button.addChild(buttonView);

    return { view: button, resize: () => centerElement(button) };
};

export default {
    title: 'Components/Button/Button Container Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

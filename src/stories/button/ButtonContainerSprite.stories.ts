import { ButtonContainer } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { centerElement } from '../../utils/helpers/resize';
import { Graphics } from '@pixi/graphics';
import { Text } from '@pixi/text';
import { getColor } from '../utils/color';

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

    const buttonView = new Graphics().beginFill(color).drawRoundedRect(0, 0, size, size, radius);
    const text = new Text('🤙', { fontSize: 70 });

    text.anchor.set(0.5);
    text.x = buttonView.width / 2;
    text.y = buttonView.height / 2;

    buttonView.addChild(text);

    // Component usage !!!
    const button = new ButtonContainer(buttonView);

    button.enabled = !disabled;

    button.onPress.connect(() => action('onPress'));
    button.onDown.connect(() => action('onDown'));
    button.onUp.connect(() => action('onUp'));
    button.onHover.connect(() => action('onHover'));
    button.onOut.connect(() => action('onOut'));
    button.onUpOut.connect(() => action('onUpOut'));

    return { view: button, resize: () => centerElement(button) };
};

export default {
    title: 'Components/Button/Button Container Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

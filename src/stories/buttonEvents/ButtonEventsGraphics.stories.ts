import { Graphics } from '@pixi/graphics';
import { Text } from '@pixi/text';
import { ButtonEvents } from '../../ButtonEvents';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { centerElement } from '../../utils/helpers/resize';
import { drawStar } from '../../utils/helpers/star';

const args = {
    color: '#A5E24D',
    size: 100,
    disabled: false,
    action: action('button Event:')
};

export const UseGraphics = ({ size, color, disabled, action }: any) =>
{
    color = Number(color.replace('#', '0x'));

    const buttonView = new Graphics().beginFill(color);

    drawStar(buttonView, size, size, 5, size / 2, size, 18);

    const text = new Text('🤙', { fontSize: 70 });

    text.anchor.set(0.5);
    text.x = buttonView.width / 2;
    text.y = buttonView.height / 2;
    buttonView.addChild(text);

    // Component usage !!!
    const buttonEvents = new ButtonEvents(buttonView);

    buttonEvents.enabled = !disabled;

    buttonEvents.onPress.connect(() => action('onPress'));
    buttonEvents.onDown.connect(() => action('onDown'));
    buttonEvents.onUp.connect(() => action('onUp'));
    buttonEvents.onHover.connect(() => action('onHover'));
    buttonEvents.onOut.connect(() => action('onOut'));
    buttonEvents.onUpOut.connect(() => action('onUpOut'));

    return { view: buttonView, resize: () => centerElement(buttonView) };
};

export default {
    title: 'Components/ButtonEvents/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

import { Text } from '@pixi/text';
import { FancyButton } from '../../FancyButton';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerView } from '../../utils/helpers/resize';
import { Container } from '@pixi/display';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    animationDuration: 100,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)')
};

export const TextLink = ({
    text,
    textColor,
    disabled,
    onPress,
    animationDuration
}: any) =>
{
    const view = new Container();

    // Component usage !!!
    const button = new FancyButton({
        text: new Text(text, {
            ...defaultTextStyle,
            fill: textColor || defaultTextStyle.fill
        }),
        animations: {
            hover: {
                props: {
                    scale: { x: 1.03, y: 1.03 },
                    y: 0
                },
                duration: animationDuration
            },
            pressed: {
                props: {
                    scale: { x: 0.9, y: 0.9 },
                    y: 10
                },
                duration: animationDuration
            }
        }
    });

    if (disabled)
    {
        button.enabled = false;
    }

    button.onPress.connect(onPress);

    centerView(view);

    view.addChild(button);

    return { view, resize: () => centerView(view) };
};

export default {
    title: 'Components/FancyButton/Text Link',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

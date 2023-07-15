import { FancyButton } from '../../FancyButton';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { centerView } from '../../utils/helpers/resize';
import { Container } from '@pixi/display';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { Text } from '@pixi/text';
import { randomItem } from '../utils/random';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    padding: 11,
    textOffsetX: 0,
    textOffsetY: -7,
    anchorX: 0.5,
    anchorY: 0.5,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)')
};

export const DynamicUpdate = ({
    text,
    textColor,
    disabled,
    onPress,
    padding,
    textOffsetX,
    textOffsetY,
    anchorX,
    anchorY,
}: any) =>
{
    const view = new Container();

    const assets = [`button.png`, `button_hover.png`, `button_pressed.png`, `button_disabled.png`];

    preload(assets).then(() =>
    {
        // Component usage !!!
        const button = new FancyButton();

        button.defaultView = `button.png`;
        button.hoverView = `button_hover.png`;

        button.textView = new Text(text, {
            ...defaultTextStyle,
            fill: textColor || defaultTextStyle.fill
        });

        button.padding = padding;
        button.textOffset = { x: textOffsetX, y: textOffsetY };

        button.anchor.set(anchorX, anchorY);

        button.enabled = !disabled;

        button.onPress.connect(onPress);

        let currentTexture = 'button_hover.png';

        button.onUp.connect(() =>
        {
            currentTexture = randomItem([
                `button_hover.png`,
                `button_pressed.png`,
                `button_disabled.png`
            ].filter((texture) => texture !== currentTexture)) as string;

            button.hoverView = currentTexture;
        });

        centerView(view);

        view.addChild(button);
    });

    return { view, resize: () => centerView(view) };
};

export default {
    title: 'Components/FancyButton/Dynamic Update',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};
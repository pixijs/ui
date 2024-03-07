import { Container, Sprite, Text } from 'pixi.js';
import { FancyButton } from '../../FancyButton';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { randomItem } from '../utils/random';
import { action } from '@storybook/addon-actions';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    padding: 11,
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
    anchorX,
    anchorY,
}: any) =>
{
    const view = new Container();

    const assets = [`button.png`, `button_hover.png`, `button_pressed.png`, `button_disabled.png`];
    const avatars = [`avatar-01.png`, `avatar-02.png`, `avatar-03.png`, `avatar-04.png`, `avatar-05.png`];

    preload([...assets, ...avatars]).then(() =>
    {
        // Component usage !!!
        const button = new FancyButton();

        button.defaultView = `button.png`;
        button.hoverView = `button_hover.png`;

        let icon = avatars[0];

        button.iconView = Sprite.from(icon);
        button.iconView.scale.set(0.2);
        button.iconOffset = { x: -100, y: -7 };

        button.textView = new Text(text, {
            ...defaultTextStyle,
            fill: textColor || defaultTextStyle.fill
        });
        button.textOffset = { x: 30, y: -7 };

        button.padding = padding;

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

            const texts: string[] = ['🤙', '👌', '👍', '👏', '👋', '🤟', '🤘', '🤞'];
            const text = randomItem(texts.filter((text) => text !== button.text)) as string;

            button.textView = new Text(text, { fontSize: 70 });

            icon = randomItem(avatars.filter((avatar) => avatar !== icon)) as string;

            const sprite = Sprite.from(icon);

            sprite.scale.set(0.2);

            button.iconView = sprite;
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

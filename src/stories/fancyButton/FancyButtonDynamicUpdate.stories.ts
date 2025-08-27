import { Sprite, Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { randomItem } from '../utils/random';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    iconOffsetX: -100,
    iconOffsetY: -7,
    textOffsetX: 30,
    textOffsetY: -7,
    defaultTextScale: 0.99,
    defaultIconScale: 0.2,
    defaultTextAnchorX: 0.5,
    defaultTextAnchorY: 0.5,
    defaultIconAnchorX: 0.5,
    defaultIconAnchorY: 0.5,
    padding: 11,
    anchorX: 0.5,
    anchorY: 0.5,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)'),
};

type Args = typeof args;

export const DynamicUpdate = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    text,
                    textColor,
                    iconOffsetX,
                    iconOffsetY,
                    textOffsetX,
                    textOffsetY,
                    defaultTextScale,
                    defaultIconScale,
                    defaultTextAnchorX,
                    defaultTextAnchorY,
                    defaultIconAnchorX,
                    defaultIconAnchorY,
                    disabled,
                    onPress,
                    padding,
                    anchorX,
                    anchorY,
                } = args;
                const assets = [
                    `button.png`,
                    `button_hover.png`,
                    `button_pressed.png`,
                    `button_disabled.png`,
                    `button_green.png`,
                    `button_blue.png`,
                    `button_black.png`,
                    `button_white.png`,
                ];
                const avatars = [
                    `avatar-01.png`,
                    `avatar-02.png`,
                    `avatar-03.png`,
                    `avatar-04.png`,
                    `avatar-05.png`,
                ];

                await preload([...assets, ...avatars]);

                // Component usage !!!
                const button = new FancyButton();

                let currentHoverViewTexture = 'button.png';

                button.defaultView = currentHoverViewTexture;
                button.hoverView = `button_hover.png`;
                button.pressedView = `button_pressed.png`;
                button.disabledView = `button_disabled.png`;

                let icon = avatars[0];

                button.iconView = icon;

                button.defaultIconScale = defaultIconScale;
                button.defaultIconAnchor = {
                    x: defaultIconAnchorX,
                    y: defaultIconAnchorY,
                };
                button.iconOffset = { x: iconOffsetX, y: iconOffsetY };

                button.textView = new Text({
                    text,
                    style: {
                        ...defaultTextStyle,
                        fill: textColor || defaultTextStyle.fill,
                    },
                });
                button.defaultTextScale = defaultTextScale;
                button.defaultTextAnchor = {
                    x: defaultTextAnchorX,
                    y: defaultTextAnchorY,
                };
                button.textOffset = { x: textOffsetX, y: textOffsetY };

                button.padding = padding;

                button.anchor.set(anchorX, anchorY);

                button.enabled = !disabled;

                button.onPress.connect(onPress);

                button.onPress.connect(() =>
                {
                    currentHoverViewTexture = randomItem(
                        [`button.png`, `button_green.png`, `button_blue.png`, `button_black.png`, `button_white.png`].filter(
                            (texture) => texture !== currentHoverViewTexture,
                        ),
                    ) as string;

                    button.hoverView = currentHoverViewTexture;

                    const texts: string[] = ['🤙', '👌', '👍', '👏', '👋', '🤟', '🤘', '🤞'];
                    const text = randomItem(texts.filter((text) => text !== button.text)) as string;

                    button.textView = new Text({
                        text,
                        style: { fontSize: 70 },
                    });

                    icon = randomItem(avatars.filter((avatar) => avatar !== icon)) as string;

                    const sprite = Sprite.from(icon);

                    sprite.scale.set(0.2);

                    button.iconView = sprite;
                });

                view.addChild(button);
            },
            resize: centerView,
        }),
};

export default {
    title: 'Components/FancyButton/Dynamic Update',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

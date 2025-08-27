import { Graphics, Sprite, Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { MaskedFrame } from '../../MaskedFrame';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: '👉 Click me 👈',
    ...colors,
    width: 350,
    height: 350,
    padding: 11,
    radius: 50,
    iconOffsetX: 0,
    iconOffsetY: -30,
    textOffsetX: 0,
    textOffsetY: 140,
    defaultTextScale: 0.99,
    defaultIconScale: 0.99,
    defaultTextAnchorX: 0.5,
    defaultTextAnchorY: 0.5,
    defaultIconAnchorX: 0.5,
    defaultIconAnchorY: 0.5,
    defaultOffsetY: 0,
    hoverOffsetY: -1,
    pressedOffsetY: 5,
    disabledOffsetY: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    animationDuration: 100,
    disabled: false,
    action: action('Button'),
};

type Args = typeof args;

export const UseGraphics = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
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
                    anchorX,
                    anchorY,
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
                    defaultOffsetY,
                    hoverOffsetY,
                    pressedOffsetY,
                    disabledOffsetY,
                    animationDuration,
                    action,
                } = args;
                const assets = [`avatar-01.png`];

                await preload(assets);

                const fill = getColor(textColor);
                const target = Sprite.from(`avatar-01.png`);

                // Component usage !!!
                const icon = new MaskedFrame({
                    target,
                    mask: new Graphics()
                        .circle(target.width / 2, target.height / 2, target.width / 2)
                        .fill(0x000000),
                    borderWidth: 10,
                    borderColor: fill,
                });

                // Component usage !!!
                const button = new FancyButton({
                    defaultView: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(color)
                        .roundRect(12, 12, width - 4, height - 4, radius)
                        .stroke({
                            color,
                            width: 3,
                        }),
                    hoverView: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(hoverColor)
                        .roundRect(12, 12, width - 4, height - 4, radius)
                        .stroke({
                            color: hoverColor,
                            width: 3,
                        }),
                    pressedView: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(pressedColor)
                        .roundRect(9, 8, width - 4, height - 4, radius)
                        .stroke({
                            color: pressedColor,
                            width: 3,
                        }),
                    disabledView: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(disabledColor)
                        .roundRect(12, 12, width - 4, height - 4, radius)
                        .stroke({
                            color: disabledColor,
                            width: 3,
                        }),
                    icon,
                    text: new Text({
                        text,
                        style: {
                            ...defaultTextStyle,
                            fill,
                        },
                    }),
                    padding,
                    offset: {
                        default: { y: defaultOffsetY },
                        hover: { y: hoverOffsetY },
                        pressed: { y: pressedOffsetY },
                        disabled: { y: disabledOffsetY },
                    },
                    textOffset: {
                        x: textOffsetX,
                        y: textOffsetY,
                    },
                    iconOffset: {
                        x: iconOffsetX,
                        y: iconOffsetY,
                    },
                    defaultTextScale,
                    defaultIconScale,
                    defaultTextAnchor: {
                        x: defaultTextAnchorX,
                        y: defaultTextAnchorY,
                    },
                    defaultIconAnchor: {
                        x: defaultIconAnchorX,
                        y: defaultIconAnchorY,
                    },
                    animations: {
                        default: {
                            props: {
                                scale: { x: 1, y: 1 },
                                y: defaultOffsetY,
                            },
                            duration: animationDuration,
                        },
                        hover: {
                            props: {
                                scale: { x: 1.03, y: 1.03 },
                                y: hoverOffsetY,
                            },
                            duration: animationDuration,
                        },
                        pressed: {
                            props: {
                                scale: { x: 0.9, y: 0.9 },
                                y: pressedOffsetY,
                            },
                            duration: animationDuration,
                        },
                    },
                });

                if (disabled)
                {
                    button.enabled = false;
                }

                button.anchor.set(anchorX, anchorY);

                button.onPress.connect(() => action('onPress'));
                button.onDown.connect(() => action('onDown'));
                button.onUp.connect(() => action('onUp'));
                button.onHover.connect(() => action('onHover'));
                button.onOut.connect(() => action('onOut'));
                button.onUpOut.connect(() => action('onUpOut'));

                view.addChild(button);
            },
            resize: centerView,
        }),
};

export default {
    title: 'Components/FancyButton/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

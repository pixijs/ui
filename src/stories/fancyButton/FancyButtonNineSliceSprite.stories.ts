import { Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { MaskedFrame } from '../../MaskedFrame';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';
import type { ContentFittingMode } from '../../FancyButton';

const args = {
    text: 'Click me',
    textColor: '#FFFFFF',
    padding: 11,
    width: 300,
    height: 137,
    defaultTextScale: 0.99,
    defaultIconScale: 0.2,
    defaultTextAnchorX: 0.5,
    defaultTextAnchorY: 0.5,
    defaultIconAnchorX: 0.5,
    defaultIconAnchorY: 0.5,
    anchorX: 0.5,
    anchorY: 0.5,
    animationDuration: 100,
    disabled: false,
    contentFittingMode: ['default', 'fill', 'none'],
    onPress: action('button was pressed! (tap or click!)'),
};

type Args = typeof args & {
    contentFittingMode: ContentFittingMode;
};

export const UseNineSliceSprite = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    text,
                    textColor,
                    disabled,
                    onPress,
                    padding,
                    anchorX,
                    anchorY,
                    animationDuration,
                    width,
                    height,
                    defaultTextScale,
                    defaultIconScale,
                    defaultTextAnchorX,
                    defaultTextAnchorY,
                    defaultIconAnchorX,
                    defaultIconAnchorY,
                    contentFittingMode,
                } = args;
                const assets = [
                    `button.png`,
                    `button_hover.png`,
                    `button_pressed.png`,
                    `button_disabled.png`,
                    `avatar-01.png`,
                    `avatar_mask.png`,
                ];

                preload(assets).then(() =>
                {
                // Component usage !!!
                    const button = new FancyButton({
                        defaultView: `button.png`,
                        hoverView: `button_hover.png`,
                        pressedView: `button_pressed.png`,
                        disabledView: `button_disabled.png`,
                        nineSliceSprite: [25, 20, 25, 20],
                        text: new Text({
                            text,
                            style: {
                                ...defaultTextStyle,
                                fill: textColor || defaultTextStyle.fill,
                            },
                        }),
                        padding,
                        textOffset: { x: 30, y: -5 },
                        iconOffset: { x: -100, y: -7 },
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
                            hover: {
                                props: {
                                    scale: { x: 1.03, y: 1.03 },
                                    y: 0,
                                },
                                duration: animationDuration,
                            },
                            pressed: {
                                props: {
                                    scale: { x: 0.9, y: 0.9 },
                                    y: 10,
                                },
                                duration: animationDuration,
                            },
                        },
                        contentFittingMode,
                    });

                    button.iconView = new MaskedFrame({
                        target: `avatar-01.png`,
                        mask: `avatar_mask.png`,
                        borderWidth: 10,
                        borderColor: 0xffffff,
                    });

                    button.anchor.set(anchorX, anchorY);

                    if (disabled)
                    {
                        button.enabled = false;
                    }

                    const sizes: { w: number; h: number }[] = [
                        { w: width, h: height },
                        { w: 300, h: 300 },
                        { w: 600, h: 137 },
                        { w: 600, h: 300 },
                    ];

                    button.width = sizes[0].w;
                    button.height = sizes[0].h;

                    let currentSizeID = 0;

                    button.onPress.connect(() =>
                    {
                        currentSizeID++;

                        if (currentSizeID >= sizes.length)
                        {
                            currentSizeID = 0;
                        }

                        const size = sizes[currentSizeID];

                        button.width = size.w;
                        button.height = size.h;
                    });

                    button.onPress.connect(onPress);

                    centerView(view);

                    view.addChild(button);
                });
            },
            resize: centerView,
        }),
};

export default {
    title: 'Components/FancyButton/Use NineSliceSprite',
    argTypes: argTypes(args),
    args: { ...getDefaultArgs(args), contentFittingMode: 'default' },
};

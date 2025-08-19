import { Graphics, Sprite } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { MaskedFrame } from '../../MaskedFrame';
import { centerView } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    color: '#e91e63',
    hoverColor: '#FEC230',
    pressedColor: '#FE6048',
    disabledColor: '#6E6E6E',
    width: 250,
    height: 250,
    padding: 30,
    radius: 200,
    iconOffsetX: 0,
    iconOffsetY: 0,
    defaultIconScale: 0.99,
    defaultIconAnchorX: 0.5,
    defaultIconAnchorY: 0.5,
    defaultOffset: 0,
    hoverOffset: -1,
    pressedOffset: 5,
    disabledOffset: 0,
    animationDuration: 100,
    anchorX: 0.5,
    anchorY: 0.5,
    disabled: false,
    action: action('Button'),
};

export const UseIcon: StoryFn<typeof args> = (
    {
        width,
        height,
        radius,
        color,
        hoverColor,
        pressedColor,
        disabledColor,
        disabled,
        padding,
        iconOffsetX,
        iconOffsetY,
        defaultIconScale,
        defaultIconAnchorX,
        defaultIconAnchorY,
        defaultOffset,
        hoverOffset,
        pressedOffset,
        disabledOffset,
        action,
        anchorX,
        anchorY,
        animationDuration,
    },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const assets = [`avatar-01.png`];

            preload(assets).then(() =>
            {
                const target = Sprite.from(`avatar-01.png`);

                const icon = new MaskedFrame({
                    target,
                    mask: new Graphics()
                        .circle(target.width / 2, target.height / 2, target.width / 2)
                        .fill(0x000000),
                    borderWidth: 5,
                    borderColor: 0xffffff,
                });

                // Component usage !!!
                const button = new FancyButton({
                    defaultView: new Graphics().roundRect(0, 0, width, height, radius).fill(color),
                    hoverView: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(hoverColor),
                    pressedView: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(pressedColor),
                    disabledView: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(disabledColor),
                    icon,
                    padding,
                    offset: {
                        default: { y: defaultOffset },
                        disabled: { y: disabledOffset },
                    },
                    iconOffset: {
                        x: iconOffsetX,
                        y: iconOffsetY,
                    },
                    defaultIconScale,
                    defaultIconAnchor: {
                        x: defaultIconAnchorX,
                        y: defaultIconAnchorY,
                    },
                    animations: {
                        hover: {
                            props: {
                                scale: { x: 1.03, y: 1.03 },
                                y: hoverOffset,
                            },
                            duration: animationDuration,
                        },
                        pressed: {
                            props: {
                                scale: { x: 0.9, y: 0.9 },
                                y: pressedOffset,
                            },
                            duration: animationDuration,
                        },
                    },
                });

                button.anchor.set(anchorX, anchorY);

                if (disabled)
                {
                    button.enabled = false;
                }

                button.onPress.connect(() => action('onPress'));
                button.onDown.connect(() => action('onDown'));
                button.onUp.connect(() => action('onUp'));
                button.onHover.connect(() => action('onHover'));
                button.onOut.connect(() => action('onOut'));
                button.onUpOut.connect(() => action('onUpOut'));

                view.addChild(button);

                centerView(view);
            });
        },
        resize: centerView,
    });

export default {
    title: 'Components/FancyButton/Use Icon',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

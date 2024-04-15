import { HTMLText } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    padding: 11,
    textOffsetX: 0,
    textOffsetY: -7,
    defaultTextScale: 0.99,
    anchorX: 0.5,
    anchorY: 0.5,
    animationDuration: 100,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)'),
};

export const UsingSpriteAndHTMLText: StoryFn<typeof args> = (
    {
        text,
        textColor,
        disabled,
        onPress,
        padding,
        textOffsetX,
        textOffsetY,
        defaultTextScale,
        anchorX,
        anchorY,
        animationDuration
    },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const assets = [
                `button.png`,
                `button_hover.png`,
                `button_pressed.png`,
                `button_disabled.png`,
            ];

            preload(assets).then(() =>
            {
                const title = new HTMLText({
                    text,
                    style: {
                        ...defaultTextStyle,
                        fill: textColor || defaultTextStyle.fill,
                    },
                });

                // Component usage !!!
                const button = new FancyButton({
                    defaultView: `button.png`,
                    hoverView: `button_hover.png`,
                    pressedView: `button_pressed.png`,
                    disabledView: `button_disabled.png`,
                    text: title,
                    padding,
                    textOffset: { x: textOffsetX, y: textOffsetY },
                    defaultTextScale,
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
                });

                button.anchor.set(anchorX, anchorY);

                if (disabled)
                {
                    button.enabled = false;
                }

                button.onPress.connect(onPress);
                view.addChild(button);
            });
        },
        resize: centerView
    });

export default {
    title: 'Components/FancyButton/Using Sprite And HTMLText',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

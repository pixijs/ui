import { Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: '👉 Click me 👈',
    textColor: '#FFFFFF',
    animationDuration: 100,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)'),
};

type Args = typeof args;

export const TextLink = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const { text, textColor, disabled, onPress, animationDuration } = args;
                const button = new FancyButton({
                    text: new Text({
                        text,
                        style: {
                            ...defaultTextStyle,
                            fill: textColor || defaultTextStyle.fill,
                        },
                    }),
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

                if (disabled)
                {
                    button.enabled = false;
                }

                button.onPress.connect(onPress);

                centerView(view);

                view.addChild(button);
            },
            resize: centerView,
        }),
};

export default {
    title: 'Components/FancyButton/Text Link',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

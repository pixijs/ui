import { Graphics } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { Input } from '../../input';
import { centerElement } from '../../utils/helpers/resize';
import { colors } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: '',
    placeholder: 'Enter text',
    textColor: colors.textColor,
    backgroundColor: colors.color,
    borderColor: colors.pressedColor,
    fontSize: 24,
    border: 5,
    width: 320,
    height: 200,
    radius: 11,
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    maskPaddingTop: 8,
    maskPaddingRight: 8,
    maskPaddingBottom: 8,
    maskPaddingLeft: 8,
    maskRadius: 6,
    onChange: action('Change'),
};

type Args = typeof args;

export const Multiline = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    text,
                    border,
                    textColor,
                    fontSize,
                    backgroundColor,
                    borderColor,
                    width,
                    height,
                    radius,
                    placeholder,
                    paddingTop,
                    paddingRight,
                    paddingBottom,
                    paddingLeft,
                    maskPaddingTop,
                    maskPaddingRight,
                    maskPaddingBottom,
                    maskPaddingLeft,
                    maskRadius,
                    onChange,
                } = args;

                // Component usage
                const input = new Input({
                    bg: new Graphics()
                        .roundRect(0, 0, width, height, radius + border)
                        .fill(borderColor)
                        .roundRect(border, border, width - (border * 2), height - (border * 2), radius)
                        .fill(backgroundColor),
                    textStyle: {
                        fill: textColor,
                        fontSize,
                        fontWeight: 'bold',
                    },
                    placeholder,
                    value: text,
                    padding: [paddingTop, paddingRight, paddingBottom, paddingLeft],
                    multiline: true,
                    addMask: true,
                    maskPadding: [maskPaddingTop, maskPaddingRight, maskPaddingBottom, maskPaddingLeft],
                    maskRadius,
                    cleanOnFocus: false,
                });

                input.onChange.connect((val) => onChange(`Input (${val})`));
                input.onEnter.connect((val) => action('onEnter')(`Input (${val})`));

                view.addChild(input);
            },
            resize: (view) => centerElement(view.children[0]),
        }),
};

export default {
    title: 'Components/Input/Multi-line',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

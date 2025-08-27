import { Graphics } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { Input } from '../../Input';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { colors } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

type AlignType = 'left' | 'center' | 'right';

const args = {
    text: '',
    placeholder: 'Enter text',
    secure: false,
    align: 'center' as AlignType,
    textColor: colors.textColor,
    backgroundColor: colors.color,
    borderColor: colors.pressedColor,
    maxLength: 20,
    fontSize: 24,
    border: 5,
    width: 320,
    height: 70,
    radius: 11,
    amount: 1,
    paddingTop: 0,
    paddingRight: 7,
    paddingBottom: 0,
    paddingLeft: 7,
    cleanOnFocus: true,
    addMask: false,
    onChange: action('Change'),
};

type Args = typeof args;

export const UseGraphics = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    text,
                    amount,
                    border,
                    textColor,
                    fontSize,
                    backgroundColor,
                    borderColor,
                    width,
                    height,
                    radius,
                    maxLength,
                    align,
                    placeholder,
                    secure,
                    paddingTop,
                    paddingRight,
                    paddingBottom,
                    paddingLeft,
                    onChange,
                    cleanOnFocus,
                    addMask,
                } = args;
                const list = new List({ type: 'vertical', elementsMargin: 10 });

                for (let i = 0; i < amount; i++)
                {
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
                        maxLength,
                        align,
                        placeholder,
                        secure,
                        value: text,
                        padding: [paddingTop, paddingRight, paddingBottom, paddingLeft],
                        cleanOnFocus,
                        addMask,
                    });

                    input.onEnter.connect((val) =>
                    {
                        onChange(`Input ${i + 1} (${val})`);
                    });

                    list.addChild(input);
                    view.addChild(list);
                }
            },
            resize: (view) => centerElement(view.children[0]),
        }),
};

export default {
    title: 'Components/Input/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { Sprite } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { Input } from '../../Input';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { colors } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: '',
    placeholder: 'Enter text',
    secure: false,
    align: 'center' as const,
    textColor: colors.textColor,
    maxLength: 20,
    fontSize: 24,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    amount: 1,
    addMask: false,
    maxTextLength: 10,
    onChange: action('Input'),
};

type Args = typeof args;

export const UseSprite = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    text,
                    amount,
                    paddingTop,
                    paddingRight,
                    paddingBottom,
                    paddingLeft,
                    textColor,
                    fontSize,
                    maxLength,
                    align,
                    placeholder,
                    secure,
                    addMask,
                    onChange,
                } = args;
                const list = new List({ type: 'vertical', elementsMargin: 10 });

                const assets = [`input.png`];

                preload(assets).then(() =>
                {
                    for (let i = 0; i < amount; i++)
                    {
                    // Component usage
                        const input = new Input({
                            bg: Sprite.from('input.png'),
                            padding: [paddingTop, paddingRight, paddingBottom, paddingLeft],
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
                            addMask,
                        });

                        input.onChange.connect(() => onChange(`${i + 1} - ${input.value}`));

                        list.addChild(input);
                    }

                    centerElement(list);
                });
                view.addChild(list);
            },
            resize: (view) => centerElement(view.children[0]),
        }),
};

export default {
    title: 'Components/Input/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

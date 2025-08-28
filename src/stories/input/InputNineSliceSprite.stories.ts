import { PixiStory } from '@pixi/storybook-renderer';
import { Input } from '../../Input';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { colors } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';
import type { InputAlign } from '../../Input';

const args = {
    text: '',
    placeholder: 'Enter text',
    secure: false,
    align: ['left', 'center', 'right'],
    textColor: colors.textColor,
    maxLength: 20,
    fontSize: 24,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    amount: 1,
    width: 320,
    height: 80,
    addMask: false,
    onChange: action('Input'),
};

type Args = typeof args & {
    align: InputAlign;
};

export const UseNineSliceSprite = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
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
                    width,
                    height,
                    addMask,
                    onChange,
                } = args;
                const list = new List({ type: 'vertical', elementsMargin: 10 });

                const assets = [`input.png`];

                await preload(assets);

                for (let i = 0; i < amount; i++)
                {
                // Component usage
                    const input = new Input({
                        bg: 'input.png',
                        nineSliceSprite: [160, 27, 160, 27],
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

                    input.width = width;
                    input.height = height;

                    input.onChange.connect(() => onChange(`${i + 1} - ${input.value}`));

                    list.addChild(input);
                }

                centerElement(list);

                view.addChild(list);
            },
            resize: (view) => centerElement(view.children[0]),
        }),
};

export default {
    title: 'Components/Input/Use NineSliceSprite',
    argTypes: argTypes(args),
    args: { ...getDefaultArgs(args), align: 'center' },
};

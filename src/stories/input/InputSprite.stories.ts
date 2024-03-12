import { Sprite } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { Input } from '../../Input';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    text: '',
    placeholder: 'Enter text',
    align: ['center', 'left', 'right'],
    textColor: '#000000',
    maxLength: 100,
    fontSize: 24,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    amount: 1,
    onChange: action('Input')
};

export const UseSprite: StoryFn<typeof args & { align: 'center' | 'left' | 'right' }> = ({
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
    onChange
}, context) =>
    new PixiStory({
        context,
        init: (view) =>
        {
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
                            fontWeight: 'bold'
                        },
                        maxLength,
                        align,
                        placeholder,
                        value: text
                    });

                    input.onChange.connect(() => onChange(`${i + 1} - ${input.value}`));

                    list.addChild(input);
                }

                centerElement(list);
            });
            view.addChild(list);
        },
        resize: (view) => centerElement(view.children[0])
    });

export default {
    title: 'Components/Input/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

import { Graphics } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { Input } from '../../Input';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

const args = {
    text: '',
    placeholder: 'Enter text',
    secure: false,
    align: ['center', 'left', 'right'],
    textColor: '#000000',
    backgroundColor: '#F1D583',
    borderColor: '#DCB000',
    maxLength: 20,
    fontSize: 24,
    border: 5,
    width: 320,
    height: 70,
    radius: 11,
    amount: 1,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    cleanOnFocus: true,
    addMask: false,
    onChange: action('Change'),
};

export const UseGraphics: StoryFn<typeof args & { align: 'center' | 'left' | 'right' }> = ({
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
    addMask
}, context) =>
    new PixiStory<typeof args>({
        context,
        init: (view) => {
            const list = new List({ type: 'vertical', elementsMargin: 10 });

            for (let i = 0; i < amount; i++) {
                // Component usage
                const input = new Input({
                    bg: new Graphics()
                        .roundRect(0, 0, width, height, radius + border)
                        .fill(borderColor)
                        .roundRect(border, border, width - border * 2, height - border * 2, radius)
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

                input.onEnter.connect((val) => {
                    onChange(`Input ${i + 1} (${val})`);
                });

                list.addChild(input);
                view.addChild(list);
            }
        },
        resize: (view) => centerElement(view.children[0]),
    });

export default {
    title: 'Components/Input/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

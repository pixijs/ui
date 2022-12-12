import { Graphics as PixiGraphics } from 'pixi.js';
import { action } from '@storybook/addon-actions';
import { Layout } from '../../Layout';
import { Input } from '../../Input';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    count: 1,
    text: '',
    placeholder: 'Enter text',
    maxLength: 100,
    align: ['center', 'left', 'right'],
    textColor: '#000000',
    fontSize: 24,
    border: 5,
    backgroundColor: '#F1D583',
    borderColor: '#DCB000',
    width: 320,
    height: 70,
    radius: 11,

    onChange: action('Input: '),
};

export const Graphics = ({
    text,
    count,
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
    onChange,
}: any) => {
    const view = new Layout({ type: 'vertical', elementsMargin: 10 });

    backgroundColor = backgroundColor.replace('#', '0x');
    borderColor = Number(borderColor.replace('#', '0x'));
    textColor = Number(textColor.replace('#', '0x'));

    for (let i = 0; i < count; i++) {
        // Component usage
        const input = new Input({
            bg: new PixiGraphics()
                .beginFill(borderColor)
                .drawRoundedRect(0, 0, width, height, radius + border)
                .beginFill(backgroundColor)
                .drawRoundedRect(
                    border,
                    border,
                    width - border * 2,
                    height - border * 2,
                    radius,
                ),
            padding: border ? border + 3 : 0,
            textStyle: {
                ...defaultTextStyle,
                fill: textColor,
                fontSize,
            },
            maxLength,
            align,
            placeholder,
            value: text,
        });

        input.onChange.connect(() => onChange(input.value));

        view.addChild(input);
    }

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Input/Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

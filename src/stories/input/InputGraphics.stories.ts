import { Graphics } from '@pixi/graphics';
import { action } from '@storybook/addon-actions';
import { Layout } from '../../Layout';
import { Input } from '../../Input';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';
import { getColor } from '../utils/color';

const args = {
    text: '',
    placeholder: 'Enter text',
    align: ['center', 'left', 'right'],
    textColor: '#000000',
    backgroundColor: '#F1D583',
    borderColor: '#DCB000',
    maxLength: 100,
    fontSize: 24,
    border: 5,
    width: 320,
    height: 70,
    radius: 11,
    amount: 1,

    onChange: action('Input: ')
};

export const UseGraphics = ({
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
    onChange
}: any) =>
{
    const view = new Layout({ type: 'vertical', elementsMargin: 10 });

    backgroundColor = getColor(backgroundColor);
    borderColor = getColor(borderColor);
    textColor = getColor(textColor);

    for (let i = 0; i < amount; i++)
    {
    // Component usage
        const input = new Input({
            bg: new Graphics()
                .beginFill(borderColor)
                .drawRoundedRect(0, 0, width, height, radius + border)
                .beginFill(backgroundColor)
                .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius),
            padding: border ? border + 3 : 0,
            textStyle: {
                ...defaultTextStyle,
                fill: textColor,
                fontSize
            },
            maxLength,
            align,
            placeholder,
            value: text
        });

        input.onChange.connect(() => onChange(input.value));

        view.addChild(input);
    }

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/Input/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

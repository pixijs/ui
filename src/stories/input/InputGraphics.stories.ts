import { Graphics } from '@pixi/graphics';
import { action } from '@storybook/addon-actions';
import { List } from '../../List';
import { Input } from '../../Input';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
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
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    cleanOnFocus: true,
    onChange: action('Change')
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
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    onChange,
    cleanOnFocus
}: any) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });

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
            textStyle: {
                fill: textColor,
                fontSize,
                fontWeight: 'bold'
            },
            maxLength,
            align,
            placeholder,
            value: text,
            padding: [paddingTop, paddingRight, paddingBottom, paddingLeft],
            cleanOnFocus
        });

        input.onEnter.connect((val) =>
        {
            onChange(`Input ${i + 1} (${val})`);
        });

        view.addChild(input);
    }

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/Input/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

import { action } from '@storybook/addon-actions';
import { List } from '../../List';
import { Input } from '../../Input';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';

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
    width: 320,
    height: 80,
    onChange: action('Input')
};

export const UseNineSlicePlane = ({
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
    width,
    height,
    onChange
}: any) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });

    const assets = [`input.png`];

    preload(assets).then(() =>
    {
        for (let i = 0; i < amount; i++)
        {
            // Component usage
            const input = new Input({
                bg: 'input.png',
                nineSliceSprite: [
                    160, 27, 160, 27
                ],
                padding: [paddingTop, paddingRight, paddingBottom, paddingLeft],
                textStyle: {
                    fill: textColor,
                    fontSize,
                    fontWeight: 'bold'
                },
                maxLength,
                align,
                placeholder,
                value: text,
            });

            input.width = width;
            input.height = height;

            input.onChange.connect(() => onChange(`${i + 1} - ${input.value}`));

            view.addChild(input);
        }

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/Input/Use NineSlicePlane',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

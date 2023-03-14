import { action } from '@storybook/addon-actions';
import { List } from '../../List';
import { NativeInput } from '../../NativeInput';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';

const args = {
    text: '',
    amount: 1,
    paddingTop: 11,
    paddingRight: 11,
    paddingBottom: 11,
    paddingLeft: 11,
    placeholder: 'Enter text',
    onChange: action('onChange')
};

export const Native = ({
    text,
    amount,
    placeholder,
    onChange,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft
}: any) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });
    const canvas = document.getElementById('storybook-root').children[0] as HTMLCanvasElement;
    const assets = [`input.png`];

    preload(assets).then(() =>
    {
        for (let i = 0; i < amount; i++)
        {
            // Component usage
            const input = new NativeInput({
                id: `input-${i}`,
                canvas,
                value: text,
                placeholder,
                bg: 'input.png',
                styles: {
                    fontSize: '20px'
                },
                padding: {
                    top: paddingTop,
                    right: paddingRight,
                    bottom: paddingBottom,
                    left: paddingLeft
                }
            });

            input.onChange.connect((val) => onChange(`Input${i}: ${val}`));

            view.addChild(input);
        }

        centerElement(view);
    });

    return {
        view,
        resize: () =>
        {
            centerElement(view);
        }
    };
};

export default {
    title: 'Components/Input/Native',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

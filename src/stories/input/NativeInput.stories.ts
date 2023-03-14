import { action } from '@storybook/addon-actions';
import { List } from '../../List';
import { NativeInput } from '../../NativeInput';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { Container } from '@pixi/display';

const args = {
    text: '',
    amount: 1,
    paddingTop: 11,
    paddingRight: 11,
    paddingBottom: 11,
    paddingLeft: 11,
    placeholder: 'Enter text',
    onChange: action('Input: ')
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
                padding: {
                    top: paddingTop,
                    right: paddingRight,
                    bottom: paddingBottom,
                    left: paddingLeft
                }
            });

            input.onChange.connect(() => onChange(input.value));

            view.addChild(input);
        }

        resizeCanvas(view);
    });

    return {
        view,
        resize: () => resizeCanvas(view)
    };
};

function resizeCanvas(view: Container)
{
    const canvasWrapper = document.getElementById('storybook-root');
    const canvas = canvasWrapper.getElementsByTagName('canvas')[0];

    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    // canvas.style.width = '50%';
    // canvas.style.height = '50%';
    canvas.style.marginLeft = `-${canvas.width / 4}px`;
    canvas.style.marginTop = `-${canvas.height / 4}px`;

    // view.x = canvas.offsetWidth / 2;
    // view.y = canvas.offsetHeight / 2;
}

export default {
    title: 'Components/Input/Native',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

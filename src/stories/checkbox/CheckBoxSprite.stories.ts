import { Sprite as PixiSprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Layout } from '../../Layout';
import { CheckBox } from '../../CheckBox';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { preloadAssets } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    text: '',
    textColor: '#FFFFFF',
    count: 3,
    checked: false,
    onChange: action('Checkbox changed'),
};

export const Sprite = ({ checked, onChange, count, textColor, text }: any) =>
{
    const view = new Layout({
        type: 'vertical',
        elementsMargin: 5,
    });

    const assets = [`switch_off.png`, `switch_on.png`];

    preloadAssets(assets).then(() =>
    {
        for (let i = 0; i < count; i++)
        {
            // Component usage !!!
            const checkBox = new CheckBox({
                text: text ?? `${text} ${i + 1}`,
                checked,
                style: {
                    unchecked: new PixiSprite(Texture.from(`switch_off.png`)),
                    checked: new PixiSprite(Texture.from(`switch_on.png`)),
                    text: {
                        ...defaultTextStyle,
                        fontSize: 22,
                        fill: textColor,
                    },
                },
            });

            checkBox.onChange.connect(() => onChange(`${checkBox.checked}`));

            view.addChild(checkBox);
        }

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Checkbox/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

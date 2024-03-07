import { List } from '../../List';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryFn } from '@storybook/types';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value: 50,
    fontSize: 20,
    showValue: true,
    amount: 1,
    onChange: action('Slider')
};

export const Single: StoryFn = ({ min, max, value, fontSize, fontColor, onChange, showValue, amount }: any) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });

    const assets = ['slider_bg.png', 'slider.png', 'slider_progress.png'];

    preload(assets).then(() =>
    {
        for (let i = 0; i < amount; i++)
        {
            // Component usage !!!
            const singleSlider = new Slider({
                bg: 'slider_bg.png',
                fill: 'slider_progress.png',
                slider: 'slider.png',
                min,
                max,
                value,
                valueTextStyle: {
                    fill: fontColor,
                    fontSize
                },
                showValue,
                valueTextOffset: {
                    y: -40
                },
                fillPaddings: {
                    left: 4.5,
                    top: 2
                }
            });

            singleSlider.onChange.connect((value) => onChange(`onChange ${i + 1}: ${value}`));

            view.addChild(singleSlider);
        }
        centerElement(view);
    });

    return {
        view,
        resize: () => centerElement(view)
    };
};

export default {
    title: 'Components/Slider/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

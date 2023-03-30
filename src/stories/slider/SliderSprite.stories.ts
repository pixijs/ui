import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';
import { preload } from '../utils/loader';
import { Container } from '@pixi/display';
import type { StoryFn } from '@storybook/types';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value: 50,
    fontSize: 20,
    showValue: true,
    showFill: true,
    onChange: action('Slider')
};

export const Single: StoryFn = ({ min, max, value, fontSize, fontColor, onChange, showValue, showFill }: any) =>
{
    const view = new Container();

    const assets = ['slider_bg.png', 'slider.png', 'slider_progress.png'];

    preload(assets).then(() =>
    {
    // Component usage !!!
        const singleSlider = new Slider({
            bg: 'slider_bg.png',
            fill: showFill ? 'slider_progress.png' : null,
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
            fillOffset: {
                x: -1,
                y: -2
            }
        });

        singleSlider.onChange.connect((value) => onChange(`${value}`));

        view.addChild(singleSlider);

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

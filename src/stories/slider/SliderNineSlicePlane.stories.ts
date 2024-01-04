import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';
import { preload } from '../utils/loader';
import { Container } from 'pixi.js';
import type { StoryFn } from '@storybook/types';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value: 50,
    fontSize: 20,
    showValue: true,
    width: 500,
    height: 38,
    onChange: action('Slider')
};

export const Single: StoryFn = ({
    min,
    max,
    value,
    fontSize,
    fontColor,
    onChange,
    showValue,
    width,
    height
}: any) =>
{
    const view = new Container();

    const assets = ['slider_bg.png', 'slider.png', 'slider_progress.png'];

    preload(assets).then(() =>
    {
    // Component usage !!!
        const singleSlider = new Slider({
            bg: 'slider_bg.png',
            fill: 'slider_progress.png',
            slider: 'slider.png',
            nineSliceSprite: {
                bg: [22, 15, 22, 23],
                fill: [22, 15, 22, 15]
            },
            fillPaddings: {
                top: 2.5,
                left: 5,
                right: 5,
                bottom: 7,
            },
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
        });

        singleSlider.width = width;
        singleSlider.height = height;

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
    title: 'Components/Slider/SpriteNineSlicePlane',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

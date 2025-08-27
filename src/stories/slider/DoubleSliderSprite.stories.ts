import { PixiStory } from '@pixi/storybook-renderer';
import { DoubleSlider } from '../../DoubleSlider';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { Args, StoryContext } from '@pixi/storybook-renderer';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value1: 15,
    value2: 85,
    fontSize: 20,
    showValue: true,
    onChange: action('Slider'),
};

export const Double = {
    render: (args: Args, ctx: StoryContext) =>
    {
        const { min, max, value1, value2, fontSize, fontColor, showValue, onChange } = args;

        return new PixiStory<typeof args>({
            context: ctx,
            init: (view) =>
            {
                const assets = ['slider_bg.png', 'radio_checked.png', 'slider_progress.png'];

                preload(assets).then(() =>
                {
                    // Component usage !!!
                    const doubleSlider = new DoubleSlider({
                        bg: 'slider_bg.png',
                        fill: 'slider_progress.png',
                        slider1: 'radio_checked.png',
                        slider2: 'radio_checked.png',
                        min,
                        max,
                        value1,
                        value2,
                        valueTextStyle: {
                            fill: fontColor,
                            fontSize,
                        },
                        showValue,
                        valueTextOffset: {
                            y: -40,
                        },
                        fillPaddings: {
                            top: 4,
                            left: 0,
                        },
                    });

                    doubleSlider.value1 = value1;
                    doubleSlider.value2 = value2;

                    doubleSlider.onChange.connect((value1, value2) =>
                    {
                        onChange(`${value1} - ${value2}`);
                    });

                    view.addChild(doubleSlider);

                    centerElement(view);
                });
            },
            resize: centerElement,
        });
    },
};

export default {
    title: 'Components/Slider/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

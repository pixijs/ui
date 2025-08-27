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
    width: 500,
    height: 38,
    onChange: action('Slider'),
};

export const Double = {
    render: (args: Args, ctx: StoryContext) =>
    {
        const { min, max, value1, value2, fontSize, fontColor, onChange, showValue, width, height } = args;

        return new PixiStory<typeof args>({
            context: ctx,
            init: (view) =>
            {
                const assets = ['slider_bg.png', 'radio_checked.png', 'slider_progress.png'];

                preload(assets).then(() =>
                {
                    // Component usage !!!
                    const singleSlider = new DoubleSlider({
                        bg: 'slider_bg.png',
                        fill: 'slider_progress.png',
                        slider1: 'radio_checked.png',
                        slider2: 'radio_checked.png',
                        nineSliceSprite: {
                            bg: [44, 20, 44, 19],
                            fill: [34, 16, 34, 15],
                        },
                        fillPaddings: {
                            top: 4,
                            left: 0,
                            right: 0,
                            bottom: 4,
                        },
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
                    });

                    singleSlider.width = width;
                    singleSlider.height = height;

                    singleSlider.onChange.connect((value) => onChange(`${value}`));

                    view.addChild(singleSlider);

                    centerElement(view);
                });
            },
            resize: centerElement,
        });
    },
};

export default {
    title: 'Components/Slider/SpriteNineSliceSprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

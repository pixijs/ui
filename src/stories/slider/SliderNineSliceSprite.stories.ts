import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    fontSize: 20,
    showValue: true,
    width: 500,
    height: 38,
    onChange: action('Slider'),
};

export const Single: StoryFn<typeof args> = (
    { min, max, step, value, fontSize, fontColor, onChange, showValue, width, height },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
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
                        fill: [22, 15, 22, 15],
                    },
                    fillPaddings: {
                        top: 2.5,
                        left: 5,
                        right: 5,
                        bottom: 7,
                    },
                    min,
                    max,
                    step,
                    value,
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

export default {
    title: 'Components/Slider/SpriteNineSliceSprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

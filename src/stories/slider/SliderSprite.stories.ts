import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { List } from '../../List';
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
    amount: 1,
    onChange: action('Slider'),
};

export const Single: StoryFn<typeof args> = (
    { min, max, step, value, fontSize, fontColor, onChange, showValue, amount },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) => {
            const list = new List({ type: 'vertical', elementsMargin: 10 });

            const assets = ['slider_bg.png', 'slider.png', 'slider_progress.png'];

            preload(assets).then(() => {
                for (let i = 0; i < amount; i++) {
                    // Component usage !!!
                    const singleSlider = new Slider({
                        bg: 'slider_bg.png',
                        fill: 'slider_progress.png',
                        slider: 'slider.png',
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
                        fillPaddings: {
                            left: 4.5,
                            top: 2,
                        },
                    });

                    singleSlider.onChange.connect((value) =>
                        onChange(`onChange ${i + 1}: ${value}`),
                    );

                    list.addChild(singleSlider);
                }
                centerElement(list);
            });

            view.addChild(list);
        },
        resize: (view) => centerElement(view.children[0]),
    });

export default {
    title: 'Components/Slider/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

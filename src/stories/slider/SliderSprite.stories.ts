import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../../utils/helpers/loader';
import { Container } from 'pixi.js';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value: 50,
    fontSize: 20,
    showValue: false,
    onChange: action('Slider changed'),
};

export const Single = ({
    min,
    max,
    value,
    fontSize,
    fontColor,
    onChange,
    showValue,
}: any) => {
    const view = new Container();

    const assets = ['slider_bg.png', 'slider.png', 'slider_progress.png'];

    preloadAssets(assets).then(() => {
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
                fontSize,
            },
            showValue,
            valueTextOffset: {
                y: -40,
            },
            fillOffset: {
                x: -1,
                y: -2,
            },
        });

        singleSlider.onChange.connect((value) => {
            onChange(`Slider changed > ${value}`);
        });

        view.addChild(singleSlider);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Slider/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

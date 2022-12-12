import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../../utils/storybook/argTypes';
import { Slider } from "../../Slider";
import { centerElement } from '../../utils/storybook/resize';
import { preloadAssets } from '../../utils/storybook/loader';
import { Container } from 'pixi.js';

const args = {
    min: 0,
    max: 100,
    value: 50,
    fontSize: 20,
    fontColor: '#FFFFFF',
    showValue: false,
    onChange: action('Slider changed'),
}

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

    const assets = [
        'slider_bg.png',
        'slider.png',
    ];

    preloadAssets(assets).then(() => {
        // Component usage !!!
        const singleSlider = new Slider({
            bg: 'slider_bg.png',
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
            }
        });

        singleSlider.onChange.connect((value) => {
            onChange(`Slider changed > ${value}`)
        });

        view.addChild(singleSlider);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view)};
};

export default {
    title: 'UI components/Slider/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};
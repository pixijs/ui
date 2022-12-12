import { Container } from "pixi.js";
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../helpers/argTypes';
import { DoubleSlider } from "../../DoubleSlider";
import { centerElement } from "../helpers/resize";
import { preloadAssets } from '../helpers/loader';

const args = {
    min: 0,
    max: 100,
    value1: 15,
    value2: 85,
    fontSize: 20,
    fontColor: '#000000',
    showValue: false,
    onChange: action('Slider changed'),
}

export const Double = ({
    min,
    max,
    value1,
    value2,
    fontSize,
    fontColor,
    showValue,
    onChange,
}: any) => {
    const view = new Container();

    const assets = [
        'slider_bg.png',
        'slider.png',
    ];

    preloadAssets(assets).then(() => {
        // Component usage !!!
        const doubleSlider = new DoubleSlider({
            bg: 'slider_bg.png',
            slider1: 'slider.png',
            slider2: 'slider.png',
            min,
            max,
            value1,
            value2,
            valueTextStyle: {
                fill: fontColor,
                fontSize: fontSize,
            },
            showValue,
        });

        doubleSlider.onChange.connect((value1, value2) => {
            onChange(`Slider changed > ${value1} - ${value2}`)
        });

        view.addChild(doubleSlider);
        
        centerElement(view);
    });
    
    return { view, resize: () => centerElement(view)};
};

export default {
    title: 'UI components/Slider/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};
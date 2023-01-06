import { Container } from '@pixi/display';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { DoubleSlider } from '../../DoubleSlider';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../utils/loader';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value1: 15,
    value2: 85,
    fontSize: 20,
    showValue: false,
    onChange: action('Slider changed'),
};

export const Double = ({
    min,
    max,
    value1,
    value2,
    fontSize,
    fontColor,
    showValue,
    onChange,
}: any) =>
{
    // TODO: We should update the components to work with the new move events
    window.PIXI.renderer.events.rootBoundary.moveOnAll = true;

    const view = new Container();

    const assets = ['slider_bg.png', 'slider.png', 'slider_progress.png'];

    preloadAssets(assets).then(() =>
    {
        // Component usage !!!
        const doubleSlider = new DoubleSlider({
            bg: 'slider_bg.png',
            fill: 'slider_progress.png',
            slider1: 'slider.png',
            slider2: 'slider.png',
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
            fillOffset: {
                x: -1,
                y: -2,
            },
        });

        doubleSlider.onChange.connect((value1, value2) =>
        {
            onChange(`Slider changed > ${value1} - ${value2}`);
        });

        view.addChild(doubleSlider);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Slider/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { Container } from '@pixi/display';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { DoubleSlider } from '../../DoubleSlider';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../utils/loader';
import type { StoryFn } from '@storybook/types';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value1: 15,
    value2: 85,
    fontSize: 20,
    showValue: true,
    showFill: true,
    onChange: action('Slider')
};

export const Double: StoryFn = (
    { min, max, value1, value2, fontSize, fontColor, showValue, onChange, showFill }: any,
    context
) =>
{
    const { app } = context.parameters.pixi;

    app.renderer.events.rootBoundary.moveOnAll = true;

    const view = new Container();
    const assets = ['slider_bg.png', 'slider.png', 'slider_progress.png'];

    preloadAssets(assets).then(() =>
    {
    // Component usage !!!
        const doubleSlider = new DoubleSlider({
            bg: 'slider_bg.png',
            fill: showFill ? 'slider_progress.png' : '',
            slider1: 'slider.png',
            slider2: 'slider.png',
            min,
            max,
            value1,
            value2,
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

        doubleSlider.onChange.connect((value1, value2) =>
        {
            onChange(`${value1} - ${value2}`);
        });

        view.addChild(doubleSlider);

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

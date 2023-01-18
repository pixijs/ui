import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../utils/loader';
import { Container } from '@pixi/display';
import type { StoryFn } from '@storybook/types';

const args = {
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value: 50,
    fontSize: 20,
    showValue: false,
    onChange: action('Slider changed'),
};

export const Single: StoryFn = ({
    min,
    max,
    value,
    fontSize,
    fontColor,
    onChange,
    showValue,
}: any, context) =>
{
    const { app } = context.parameters.pixi;

    app.renderer.events.rootBoundary.moveOnAll = true;

    const view = new Container();

    const assets = ['slider_bg.png', 'slider.png', 'slider_progress.png'];

    preloadAssets(assets).then(() =>
    {
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

        singleSlider.onChange.connect((value) =>
        {
            onChange(`Slider changed > ${value}`);
        });

        view.addChild(singleSlider);

        centerElement(view);
    });

    return {
        view,
        resize: () => centerElement(view),
    };
};

export default {
    title: 'Components/Slider/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

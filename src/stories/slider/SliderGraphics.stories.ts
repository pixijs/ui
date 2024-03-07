import { Graphics } from 'pixi.js';
import { List } from '../../List';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { action } from '@storybook/addon-actions';

import type { StoryFn } from '@storybook/types';

const args = {
    meshColor: '#a5e34d',
    fillColor: '#00b1dd',
    borderColor: '#FFFFFF',
    backgroundColor: '#fe6048',
    fontColor: '#FFFFFF',
    min: 0,
    max: 100,
    value: 50,
    width: 450,
    height: 35,
    radius: 25,
    fontSize: 20,
    border: 3,
    handleBorder: 3,
    showValue: true,
    onChange: action('Slider')
};

export const Single: StoryFn = ({
    min,
    max,
    value,
    meshColor,
    borderColor,
    backgroundColor,
    fillColor,
    handleBorder,
    width,
    height,
    radius,
    fontSize,
    fontColor,
    border,
    onChange,
    showValue,
}: any, a) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });

    meshColor = getColor(meshColor);
    fillColor = getColor(fillColor);
    borderColor = getColor(borderColor);
    backgroundColor = getColor(backgroundColor);

    const bg = new Graphics()
        .roundRect(0, 0, width, height, radius)
        .fill(borderColor)
        .roundRect(border, border, width - (border * 2), height - (border * 2), radius)
        .fill(backgroundColor);

    const fill = new Graphics()
        .roundRect(0, 0, width, height, radius)
        .fill(borderColor)
        .roundRect(border, border, width - (border * 2), height - (border * 2), radius)
        .fill(fillColor);

    const slider = new Graphics()
        .circle(0, 0, 20 + handleBorder)
        .fill(borderColor)
        .circle(0, 0, 20)
        .fill(meshColor);

    // Component usage
    const singleSlider = new Slider({
        bg,
        fill,
        slider,
        min,
        max,
        value,
        valueTextStyle: {
            fill: fontColor,
            fontSize
        },
        showValue
    });

    singleSlider.value = value;

    singleSlider.onUpdate.connect((value) => onChange(`${value}`));

    view.addChild(singleSlider);

    return {
        view,
        resize: () => centerElement(view)
    };
};

export default {
    title: 'Components/Slider/Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

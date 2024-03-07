import { Graphics } from 'pixi.js';
import { DoubleSlider } from '../../DoubleSlider';
import { List } from '../../List';
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
    value1: 15,
    value2: 85,
    width: 450,
    height: 35,
    radius: 25,
    fontSize: 20,
    border: 5,
    handleBorder: 3,
    showValue: true,
    onChange: action('Slider')
};

export const Double: StoryFn = ({
    min,
    max,
    value1,
    value2,
    meshColor,
    borderColor,
    backgroundColor,
    fillColor,
    width,
    height,
    radius,
    fontSize,
    fontColor,
    border,
    handleBorder,
    showValue,
    onChange,
}: any) =>
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

    const slider1 = new Graphics()
        .circle(0, 0, 20 + handleBorder)
        .fill(borderColor)
        .circle(0, 0, 20)
        .fill(meshColor);

    const slider2 = new Graphics()
        .circle(0, 0, 20 + handleBorder)
        .fill(borderColor)
        .circle(0, 0, 20)
        .fill(meshColor);

    const doubleSlider = new DoubleSlider({
        bg,
        fill,
        slider1,
        slider2,
        min,
        max,
        value1,
        value2,
        valueTextStyle: {
            fill: fontColor,
            fontSize
        },
        showValue
    });

    doubleSlider.onChange.connect((value1, value2) =>
    {
        onChange(`${value1} - ${value2}`);
    });

    view.addChild(doubleSlider);

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

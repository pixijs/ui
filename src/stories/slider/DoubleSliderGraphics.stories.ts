import { Graphics } from '@pixi/graphics';
import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/types';
import { DoubleSlider } from '../../DoubleSlider';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';

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
    showFill: true,
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
    showFill
}: any) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });

    meshColor = getColor(meshColor);
    fillColor = getColor(fillColor);
    borderColor = getColor(borderColor);
    backgroundColor = getColor(backgroundColor);

    const bg = new Graphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius)
        .beginFill(backgroundColor)
        .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius);

    const fill = new Graphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius)
        .beginFill(fillColor)
        .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius);

    const slider1 = new Graphics()
        .beginFill(borderColor)
        .drawCircle(0, 0, 20 + handleBorder)
        .beginFill(meshColor)
        .drawCircle(0, 0, 20)
        .endFill();

    const slider2 = new Graphics()
        .beginFill(borderColor)
        .drawCircle(0, 0, 20 + handleBorder)
        .beginFill(meshColor)
        .drawCircle(0, 0, 20)
        .endFill();

    const doubleSlider = new DoubleSlider({
        bg,
        fill: showFill ? fill : null,
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

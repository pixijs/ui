import { Graphics } from '@pixi/graphics';
import { action } from '@storybook/addon-actions';
import { List } from '../../List';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { getColor } from '../utils/color';

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
    showFill: true,
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

    const slider = new Graphics()
        .beginFill(borderColor)
        .drawCircle(0, 0, 20 + handleBorder)
        .beginFill(meshColor)
        .drawCircle(0, 0, 20)
        .endFill();

    // Component usage
    const singleSlider = new Slider({
        bg,
        fill: showFill ? fill : null,
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

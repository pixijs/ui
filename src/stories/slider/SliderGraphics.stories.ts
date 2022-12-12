import { Graphics as PixiGraphics } from 'pixi.js';
import { action } from '@storybook/addon-actions';
import { Layout } from '../../Layout';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { Slider } from '../../Slider';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    min: 0,
    max: 100,
    value: 50,
    meshColor: '#35b600',
    fillColor: '#ff4545',
    borderColor: '#FFFFFF',
    backgroundColor: '#F1D583',
    fontColor: '#FFFFFF',
    width: 450,
    height: 35,
    radius: 25,
    fontSize: 20,
    border: 3,
    handleBorder: 3,
    showValue: true,
    onChange: action('Slider changed'),
};

export const Single = ({
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
}: any) => {
    const view = new Layout({ type: 'vertical', elementsMargin: 10 });

    meshColor = Number(meshColor.replace('#', '0x'));
    fillColor = Number(fillColor.replace('#', '0x'));
    borderColor = Number(borderColor.replace('#', '0x'));
    backgroundColor = Number(backgroundColor.replace('#', '0x'));

    const bg = new PixiGraphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius)
        .beginFill(backgroundColor)
        .drawRoundedRect(
            border,
            border,
            width - border * 2,
            height - border * 2,
            radius,
        );

    const fill = new PixiGraphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius)
        .beginFill(fillColor)
        .drawRoundedRect(
            border,
            border,
            width - border * 2,
            height - border * 2,
            radius,
        );

    const slider = new PixiGraphics()
        .beginFill(borderColor)
        .drawCircle(0, 0, 20 + handleBorder)
        .beginFill(meshColor)
        .drawCircle(0, 0, 20)
        .endFill();

    const singleSlider = new Slider({
        bg,
        fill,
        slider,
        min,
        max,
        value,
        valueTextStyle: {
            fill: fontColor,
            fontSize: fontSize,
        },
        showValue,
    });

    singleSlider.onChange.connect((value) => {
        onChange(`Slider changed > ${value}`);
    });

    view.addChild(singleSlider);

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Slider/Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { Graphics as PixiGraphics } from "pixi.js";
import { action } from '@storybook/addon-actions';
import { Layout } from "../../Layout";
import { argTypes, getDefaultArgs } from '../../utils/storybook/argTypes';
import { DoubleSlider } from "../../DoubleSlider";
import { centerElement } from "../../utils/storybook/resize";

const args = {
    min: 0,
    max: 100,
    value1: 15,
    value2: 85,
    meshColor: '#35b600',
    fillColor: '#ff4545',
    borderColor: '#FFFFFF',
    backgroundColor: '#F1D583',
    fontColor: '#FFFFFF',
    width: 450,
    height: 35,
    radius: 25,
    fontSize: 20,
    border: 5,
    handleBorder: 3,
    showValue: true,
    onChange: action('Slider changed'),
}

export const Double = ({
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
}: any) => {
    const view = new Layout({ type: 'vertical', elementsMargin: 10 });

    meshColor = Number(meshColor.replace('#', '0x'));
    fillColor = Number(fillColor.replace('#', '0x'));
    borderColor = Number(borderColor.replace('#', '0x'));
    backgroundColor = Number(backgroundColor.replace('#', '0x'));

    const bg = new PixiGraphics()
        .beginFill(borderColor).drawRoundedRect(0, 0, width, height, radius)
        .beginFill(backgroundColor).drawRoundedRect(border, border, width - border * 2, height - border * 2, radius);

    const fill = new PixiGraphics()
        .beginFill(borderColor).drawRoundedRect(0, 0, width, height, radius)
        .beginFill(fillColor).drawRoundedRect(border, border, width - border * 2, height - border * 2, radius);

    const slider1 = new PixiGraphics()
        .beginFill(borderColor).drawCircle(0, 0, 20 + handleBorder)
        .beginFill(meshColor).drawCircle(0, 0, 20)
        .endFill();

    const slider2 = new PixiGraphics()
        .beginFill(borderColor).drawCircle(0, 0, 20 + handleBorder)
        .beginFill(meshColor).drawCircle(0, 0, 20)
        .endFill();

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
            fontSize: fontSize,
        },
        showValue,
    });

    doubleSlider.onChange.connect((value1, value2) => {
        onChange(`Slider changed > ${value1} - ${value2}`)
    });

    view.addChild(doubleSlider);

    return { view, resize: () => centerElement(view)};
};

export default {
    title: 'UI components/Slider/Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};
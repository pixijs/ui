import { Graphics } from '@pixi/graphics';
import { Layout } from '../../Layout';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';

const args = {
    fillColor: '#ff4545',
    borderColor: '#FFFFFF',
    backgroundColor: '#F1D583',
    progress: 50,
    width: 450,
    height: 35,
    radius: 25,
    border: 3
};

export const UseGraphics: StoryFn = (
    { progress, borderColor, backgroundColor, fillColor, width, height, radius, border }: any,
    context
) =>
{
    const { app } = context.parameters.pixi;

    app.renderer.events.rootBoundary.moveOnAll = true;

    const view = new Layout({ type: 'vertical', elementsMargin: 10 });

    fillColor = Number(fillColor.replace('#', '0x'));
    borderColor = Number(borderColor.replace('#', '0x'));
    backgroundColor = Number(backgroundColor.replace('#', '0x'));

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

    const progressBar = new ProgressBar({
        bg,
        fill,
        progress
    });

    view.addChild(progressBar);

    return {
        view,
        resize: () => centerElement(view)
    };
};

export default {
    title: 'Components/ProgressBar/UseGraphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

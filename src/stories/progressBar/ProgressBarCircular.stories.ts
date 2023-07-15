import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { CircularProgressBar } from '../../CircularProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { Container } from '@pixi/display';
// import { Graphics, LINE_CAP, LINE_JOIN } from '@pixi/graphics';

const args = {
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
    fillColor: '#00b1dd',
    radius: 100,
    lineWidth: 20,
    value: 50,
    backgroundAlpha: 0.5,
    fillAlpha: 0.8,
    animate: true
};

export const circular: StoryFn = ({
    backgroundColor,
    fillColor,
    radius,
    lineWidth,
    value,
    backgroundAlpha,
    fillAlpha,
    animate
}: any) =>
{
    const view = new Container();
    // const mask = new Graphics();

    // mask
    //     .lineStyle({
    //         width: lineWidth,
    //         color: 0xFFFFFF,
    //         join: LINE_JOIN.ROUND,
    //         cap: LINE_CAP.ROUND,
    //     })
    //     .moveTo(-radius, -radius)
    //     .lineTo(radius, -radius)
    //     .lineTo(0, radius)
    //     .closePath();

    const progressBar = new CircularProgressBar({
        backgroundColor,
        lineWidth,
        fillColor,
        radius,
        value,
        backgroundAlpha,
        fillAlpha,
    });

    view.addChild(progressBar);

    let isFilling = true;

    return {
        view,
        resize: () =>
        {
            centerElement(view);
            view.y += view.height;
        },
        update: () =>
        {
            if (!animate)
            {
                return;
            }

            isFilling ? value++ : value--;

            if (value >= 100)
            {
                isFilling = false;
            }
            else if (value <= 0)
            {
                isFilling = true;
            }

            progressBar.progress = value;
        }
    };
};

export default {
    title: 'Components/ProgressBar/Circular',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

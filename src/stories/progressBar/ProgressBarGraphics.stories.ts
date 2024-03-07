import { Graphics } from 'pixi.js';
import { List } from '../../List';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';

import type { StoryFn } from '@storybook/types';

const args = {
    fillColor: '#00b1dd',
    borderColor: '#FFFFFF',
    backgroundColor: '#fe6048',
    value: 50,
    width: 450,
    height: 35,
    radius: 25,
    border: 3,
    animate: true,
    vertical: false
};

export const UseGraphics: StoryFn = ({
    value,
    borderColor,
    backgroundColor,
    fillColor,
    width,
    height,
    radius,
    border,
    animate,
    vertical
}: any) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });

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

    // Component usage
    const progressBar = new ProgressBar({
        bg,
        fill,
        progress: value
    });

    if (vertical)
    {
        progressBar.rotation = -Math.PI / 2;
    }

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

            if (value > 150)
            {
                isFilling = false;
            }
            else if (value < -50)
            {
                isFilling = true;
            }

            progressBar.progress = value;
        }
    };
};

export default {
    title: 'Components/ProgressBar/UseGraphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

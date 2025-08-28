import { LineCap } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { CircularProgressBar } from '../../CircularProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { colors } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    backgroundColor: colors.pannelBorderColor,
    fillColor: colors.color,
    radius: 50,
    lineWidth: 15,
    value: 50,
    backgroundAlpha: 0.5,
    fillAlpha: 0.8,
    animate: true,
    cap: ['round', 'butt', 'square'],
};

type Args = typeof args & {
    cap: LineCap;
};

export const circular = {
    render: (args: Args, ctx: StoryContext) =>
    {
        const {
            backgroundColor,
            fillColor,
            radius,
            lineWidth,
            value: initialValue,
            backgroundAlpha,
            fillAlpha,
            animate,
            cap,
        } = args;
        let isFilling = true;
        let progressBar1: CircularProgressBar;
        let value = initialValue;

        return new PixiStory({
            context: ctx,
            init: (view) =>
            {
                progressBar1 = new CircularProgressBar({
                    backgroundColor,
                    lineWidth,
                    fillColor,
                    radius,
                    value,
                    backgroundAlpha,
                    fillAlpha,
                    cap,
                });

                progressBar1.x += progressBar1.width / 2;
                progressBar1.y += -progressBar1.height / 2;

                view.addChild(progressBar1);
            },
            resize: (view) =>
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

                progressBar1.progress = value;
                progressBar1.rotation += 0.1;
            },
        });
    },
};

export default {
    title: 'Components/ProgressBar/Circular',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

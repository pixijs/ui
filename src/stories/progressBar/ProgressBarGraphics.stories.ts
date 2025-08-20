import { Graphics } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { List } from '../../List';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { colors } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';

const args = {
    fillColor: colors.color,
    borderColor: colors.textColor,
    backgroundColor: colors.pannelBorderColor,
    value: 50,
    width: 450,
    height: 35,
    radius: 25,
    border: 3,
    animate: true,
    vertical: false,
};

export const UseGraphics: StoryFn<typeof args> = (
    {
        value,
        borderColor,
        backgroundColor,
        fillColor,
        width,
        height,
        radius,
        border,
        animate,
        vertical,
    },
    context,
) =>
{
    let isFilling = true;
    let progressBar: ProgressBar;

    return new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const list = new List({ type: 'vertical', elementsMargin: 10 });

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
            progressBar = new ProgressBar({
                bg,
                fill,
                progress: value,
            });

            if (vertical)
            {
                progressBar.rotation = -Math.PI / 2;
            }

            list.addChild(progressBar);
            view.addChild(list);
        },
        resize: (view) =>
        {
            centerElement(view);
            view.y += view.height;
        },
        update: () =>
        {
            if (!animate || !progressBar)
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
        },
    });
};

export default {
    title: 'Components/ProgressBar/UseGraphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

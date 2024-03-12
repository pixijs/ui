import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { CircularProgressBar } from '../../CircularProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';

const args = {
    backgroundColor: '#3d3d3d',
    fillColor: '#00b1dd',
    radius: 50,
    lineWidth: 15,
    value: 50,
    backgroundAlpha: 0.5,
    fillAlpha: 0.8,
    animate: true,
    cap: ['round', 'butt', 'square']
};

export const circular: StoryFn<typeof args & {cap: 'round' | 'butt' | 'square'}> = ({
    backgroundColor,
    fillColor,
    radius,
    lineWidth,
    value,
    backgroundAlpha,
    fillAlpha,
    animate,
    cap
}, context) =>
{
    let isFilling = true;
    let progressBar1: CircularProgressBar;

    return new PixiStory<typeof args>({
        context,
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
                cap
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
        }
    });
};

export default {
    title: 'Components/ProgressBar/Circular',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

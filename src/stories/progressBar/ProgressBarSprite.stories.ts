import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { preload } from '../utils/loader';
import type { StoryFn } from '@storybook/types';
import { List } from '../../List';

const args = {
    value: 50,
    animate: true,
    vertical: false
};

export const Sprite: StoryFn = ({ value, animate, vertical }: any) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });

    const assets = ['slider_bg.png', 'slider_progress.png'];

    let progressBar: ProgressBar;

    preload(assets).then(() =>
    {
    // Component usage !!!
        progressBar = new ProgressBar({
            bg: 'slider_bg.png',
            fill: 'slider_progress.png',
            progress: value,
            fillOffset: {
                x: 0,
                y: -2
            }
        });

        view.addChild(progressBar);

        if (vertical)
        {
            progressBar.rotation = -Math.PI / 2;
            view.y += view.height / 2;
        }
        else
        {
            view.x += -view.width / 2;
        }
    });

    let isFilling = true;

    return {
        view,
        resize: () =>
        {
            centerElement(view);
            if (vertical)
            {
                view.y += view.height;
            }
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

            if (progressBar)
            {
                progressBar.progress = value;
            }
        }
    };
};

export default {
    title: 'Components/ProgressBar/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

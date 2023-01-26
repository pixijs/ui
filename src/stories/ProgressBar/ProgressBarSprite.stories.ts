import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../utils/loader';
import { Container } from '@pixi/display';
import type { StoryFn } from '@storybook/types';

const args = {
    value: 50,
    animate: true
};

export const Sprite: StoryFn = ({ value, animate }, context) =>
{
    const { app } = context.parameters.pixi;

    app.renderer.events.rootBoundary.moveOnAll = true;

    const view = new Container();

    const assets = ['slider_bg.png', 'slider_progress.png'];

    let progressBar: ProgressBar;

    preloadAssets(assets).then(() =>
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

        centerElement(view);
    });

    let isFilling = true;

    return {
        view,
        resize: () => centerElement(view),
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

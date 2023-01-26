import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../utils/loader';
import { Container } from '@pixi/display';
import type { StoryFn } from '@storybook/types';

const args = {};

export const Sprite: StoryFn = (_, context) =>
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
            fillOffset: {
                x: 0,
                y: -2
            }
        });

        view.addChild(progressBar);

        centerElement(view);
    });

    let isFilling = true;
    let progress = 0;

    return {
        view,
        resize: () => centerElement(view),
        update: () =>
        {
            isFilling ? progress++ : progress--;

            if (progress > 150)
            {
                isFilling = false;
            }
            else if (progress < -50)
            {
                isFilling = true;
            }

            if (progressBar)
            {
                progressBar.progress = progress;
            }
        }
    };
};

export default {
    title: 'Components/ProgressBar/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

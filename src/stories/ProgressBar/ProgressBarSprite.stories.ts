import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { preloadAssets } from '../utils/loader';
import { Container } from '@pixi/display';
import type { StoryFn } from '@storybook/types';

const args = {
    progress: 50
};

export const Sprite: StoryFn = ({ progress }, context) =>
{
    const { app } = context.parameters.pixi;

    app.renderer.events.rootBoundary.moveOnAll = true;

    const view = new Container();

    const assets = ['slider_bg.png', 'slider_progress.png'];

    preloadAssets(assets).then(() =>
    {
    // Component usage !!!
        const progressBar = new ProgressBar({
            bg: 'slider_bg.png',
            fill: 'slider_progress.png',
            progress,
            fillOffset: {
                x: 0,
                y: -2
            }
        });

        view.addChild(progressBar);

        centerElement(view);
    });

    return {
        view,
        resize: () => centerElement(view)
    };
};

export default {
    title: 'Components/ProgressBar/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

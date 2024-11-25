import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { List } from '../../List';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';

const args = {
    value: 50,
    width: 500,
    height: 60,
    animate: true,
    vertical: false,
};

export const NineSliceSprite: StoryFn<typeof args> = (
    { value, animate, vertical, width, height },
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

            const assets = ['slider_bg.png', 'slider_progress.png'];

            preload(assets).then(() =>
            {
                // Component usage !!!
                progressBar = new ProgressBar({
                    bg: 'slider_bg.png',
                    fill: 'slider_progress.png',
                    nineSliceSprite: {
                        bg: [22, 15, 22, 23],
                        fill: [22, 15, 22, 15],
                    },
                    progress: value,
                    fillPaddings: {
                        top: 3,
                        right: 5,
                        bottom: 4.5,
                        left: 4.5,
                    },
                });

                progressBar.width = width;
                progressBar.height = height;

                list.addChild(progressBar);

                if (vertical)
                {
                    progressBar.rotation = -Math.PI / 2;
                    list.y += list.height / 2;
                }
                else
                {
                    list.x += -list.width / 2;
                }
            });

            view.addChild(list);
        },

        resize: (view) =>
        {
            centerElement(view);
            if (vertical)
            {
                view.y += view.height;
            }
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

            if (progressBar)
            {
                progressBar.progress = value;
            }
        },
    });
};

export default {
    title: 'Components/ProgressBar/NineSliceSprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

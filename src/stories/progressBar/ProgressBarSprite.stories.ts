import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { List } from '../../List';
import { ProgressBar } from '../../ProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';

const args = {
    value: 50,
    animate: true,
    vertical: false,
};

export const Sprite: StoryFn<typeof args> = ({ value, animate, vertical }, context) => {
    let isFilling = true;
    let progressBar: ProgressBar;

    return new PixiStory<typeof args>({
        context,
        init: (view) => {
            const list = new List({ type: 'vertical', elementsMargin: 10 });
            const assets = ['slider_bg.png', 'slider_progress.png'];

            preload(assets).then(() => {
                // Component usage !!!
                progressBar = new ProgressBar({
                    bg: 'slider_bg.png',
                    fill: 'slider_progress.png',
                    progress: value,
                    fillPaddings: {
                        top: 3,
                        left: 4.5,
                    },
                });

                list.addChild(progressBar);

                if (vertical) {
                    progressBar.rotation = -Math.PI / 2;
                    list.y += list.height / 2;
                } else {
                    list.x += -list.width / 2;
                }
            });

            view.addChild(list);
        },

        resize: (view) => {
            centerElement(view);
            if (vertical) {
                view.y += view.height;
            }
        },
        update: () => {
            if (!animate || !progressBar) {
                return;
            }

            isFilling ? value++ : value--;

            if (value > 150) {
                isFilling = false;
            } else if (value < -50) {
                isFilling = true;
            }

            if (progressBar) {
                progressBar.progress = value;
            }
        },
    });
};

export default {
    title: 'Components/ProgressBar/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

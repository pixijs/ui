import { Graphics, Sprite } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { MaskedFrame } from '../../MaskedFrame';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';

const args = {
    borderColor: '#FFFFFF',
    borderWidth: 10,
    radius: 250
};

// TODO: implement preloading
export const UseGraphics: StoryFn<typeof args> = ({ borderColor, radius, borderWidth }, context) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const assets = [`avatar-01.png`];

            preload(assets).then(() =>
            {
                const target = Sprite.from(`avatar-01.png`);

                // Component usage !!!
                const frame = new MaskedFrame({
                    target,
                    mask: getMask(target.width, target.height, radius),
                    borderWidth,
                    borderColor
                });

                view.addChild(frame);

                centerElement(view);
            });
        },
        resize: centerElement
    });

function getMask(width: number, height: number, radius: number): Graphics
{
    const isCircle = width === height && radius >= width / 2;

    const mask = new Graphics();

    if (isCircle)
    {
        mask.circle(width / 2, height / 2, width / 2).fill(0x000000);
    }
    else
    {
        mask.roundRect(0, 0, width, height, radius).fill(0x000000);
    }

    return mask;
}

export default {
    title: 'Components/MaskedFrame/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

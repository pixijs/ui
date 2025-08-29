import { PixiStory } from '@pixi/storybook-renderer';
import { MaskedFrame } from '../../MaskedFrame';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    borderColor: '#FFFFFF',
    borderWidth: 10,
};

type Args = typeof args;

export const UseSprite = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const { borderColor, borderWidth } = args;
                const assets = [`avatar-01.png`, `avatar_mask.png`];

                preload(assets).then(() =>
                {
                // Component usage !!!
                    const frame = new MaskedFrame({
                        target: `avatar-01.png`,
                        mask: `avatar_mask.png`,
                        borderWidth,
                        borderColor,
                    });

                    view.addChild(frame);

                    centerElement(view);
                });
            },
            resize: centerElement,
        }),
};

export default {
    title: 'Components/MaskedFrame/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

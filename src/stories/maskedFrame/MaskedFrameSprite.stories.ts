import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { MaskedFrame } from '../../MaskedFrame';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';

const args = {
    borderColor: '#FFFFFF',
    borderWidth: 10,
};

export const UseSprite: StoryFn<typeof args> = ({ borderColor, borderWidth }, context) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
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
    });

export default {
    title: 'Components/MaskedFrame/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

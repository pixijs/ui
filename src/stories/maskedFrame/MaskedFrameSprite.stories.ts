import { Container } from '@pixi/display';
import { MaskedFrame } from '../../MaskedFrame';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preloadAssets } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    borderColor: '#FFFFFF',
    borderWidth: 10,
};

// TODO: implement preloading
export const Sprite = ({ borderColor, borderWidth }: any) =>
{
    const view = new Container();

    const assets = [`avatar.png`, `avatar_mask.png`];

    preloadAssets(assets).then(() =>
    {
        borderColor = Number(borderColor.replace('#', '0x'));

        // Component usage !!!
        const frame = new MaskedFrame({
            target: `avatar.png`,
            mask: `avatar_mask.png`,
            borderWidth,
            borderColor,
        });

        view.addChild(frame);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/MaskedFrame/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

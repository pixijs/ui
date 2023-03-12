import { Container } from '@pixi/display';
import { MaskedFrame } from '../../MaskedFrame';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';
import { getColor } from '../utils/color';

const args = {
    borderColor: '#FFFFFF',
    borderWidth: 10
};

// TODO: implement preloading
export const UseSprite = ({ borderColor, borderWidth }: any) =>
{
    const view = new Container();

    const assets = [`avatar-01.png`, `avatar_mask.png`];

    preload(assets).then(() =>
    {
        borderColor = getColor(borderColor);

        // Component usage !!!
        const frame = new MaskedFrame({
            target: `avatar-01.png`,
            mask: `avatar_mask.png`,
            borderWidth,
            borderColor
        });

        view.addChild(frame);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/MaskedFrame/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

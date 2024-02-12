import { Container, Graphics, Sprite } from 'pixi.js';
import { MaskedFrame } from '../../MaskedFrame';
import { centerElement } from '../../utils/helpers/resize';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { preload } from '../utils/loader';

const args = {
    borderColor: '#FFFFFF',
    borderWidth: 10,
    radius: 250
};

// TODO: implement preloading
export const UseGraphics = ({ borderColor, radius, borderWidth }: any) =>
{
    const view = new Container();

    const assets = [`avatar-01.png`];

    preload(assets).then(() =>
    {
        borderColor = getColor(borderColor);

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

    return { view, resize: () => centerElement(view) };
};

function getMask(width: number, height: number, radius: number): Graphics
{
    const isCircle = width === height && radius >= width / 2;

    const mask = new Graphics();

    if (isCircle)
    {
        mask.fill(0x000000).drawCircle(width / 2, height / 2, width / 2);
    }
    else
    {
        mask.fill(0x000000).roundRect(0, 0, width, height, radius);
    }

    return mask;
}

export default {
    title: 'Components/MaskedFrame/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

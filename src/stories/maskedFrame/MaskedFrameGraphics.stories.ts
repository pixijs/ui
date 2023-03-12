import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { MaskedFrame } from '../../MaskedFrame';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';
import { getColor } from '../utils/color';

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
        mask.beginFill(0x000000).drawCircle(width / 2, height / 2, width / 2);
    }
    else
    {
        mask.beginFill(0x000000).drawRoundedRect(0, 0, width, height, radius);
    }

    return mask;
}

export default {
    title: 'Components/MaskedFrame/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

import { Container, Sprite, Texture, Graphics as PixiGraphics } from 'pixi.js';
import { MaskedFrame } from '../../MaskedFrame';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { preloadAssets } from '../../utils/helpers/loader';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    borderColor: '#FFFFFF',
    borderWidth: 10,
    radius: 250,
};

// TODO: implement preloading
export const Graphics = ({ borderColor, radius, borderWidth }: any) => {
    const view = new Container();

    const assets = [`avatar.png`];

    preloadAssets(assets).then(() => {
        borderColor = Number(borderColor.replace('#', '0x'));

        const target = new Sprite(Texture.from(`avatar.png`));

        // Component usage !!!
        const frame = new MaskedFrame({
            target,
            mask: getMask(target.width, target.height, radius),
            borderWidth,
            borderColor,
        });
        view.addChild(frame);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

function getMask(width: number, height: number, radius: number): PixiGraphics {
    const isCircle = width === height && radius >= width / 2;

    const mask = new PixiGraphics();

    if (isCircle) {
        mask.beginFill(0x000000).drawCircle(width / 2, height / 2, width / 2);
    } else {
        mask.beginFill(0x000000).drawRoundedRect(0, 0, width, height, radius);
    }

    return mask;
}

export default {
    title: 'UI components/MaskedFrame/Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

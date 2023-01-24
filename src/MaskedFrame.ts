import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { getView } from './utils/helpers/view';

export type MaskedFrameOptions = {
    target: string | Container;
    mask: string | Graphics;
    borderWidth?: number;
    borderColor?: number;
};

/**
 * Applies mask to a container and draws a same shape border around it
 * @example
 * ```
 * new MaskedFrame({
 *     target: `avatar.png`,
 *     mask: `avatar_mask.png`,
 *     borderWidth: 5,
 *     borderColor: 0xFFFFFF,
 * });
 * ```
 */
export class MaskedFrame extends Graphics
{
    /** TODO */
    public target: Container;
    /** TODO */
    public targetMask: Container;

    public borderColor: number;
    public borderWidth: number;

    constructor({ target, mask, borderWidth, borderColor }: MaskedFrameOptions)
    {
        super();

        this.borderColor = borderColor;
        this.borderWidth = borderWidth;

        this.target = getView(target);
        this.targetMask = getView(mask);
        this.target.addChild(this.targetMask);
        this.target.mask = this.targetMask;

        if (borderWidth)
        {
            this.showBorder();

            this.target.x = borderWidth;
            this.target.y = borderWidth;

            const borderMask = typeof mask === 'string' ? new Sprite(Texture.from(mask)) : mask.clone();

            borderMask.width += borderWidth * 2;
            borderMask.height += borderWidth * 2;

            this.mask = borderMask;
            this.addChild(borderMask);
        }

        this.addChild(this.target);
    }

    /** TODO */
    public showBorder()
    {
        this.beginFill(this.borderColor);

        const width = this.borderWidth * 2;

        this.drawRect(0, 0, this.target.width + width, this.target.height + width);
    }

    /** TODO */
    public hideBorder()
    {
        this.clear();
    }
}

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
 * Draws a border or apply a mask of any shape to a container.
 * @example
 * new MaskedFrame({
 *     target: `avatar.png`,
 *     mask: `avatar_mask.png`,
 *     borderWidth: 5,
 *     borderColor: 0xFFFFFF,
 * });
 */
export class MaskedFrame extends Graphics
{
    /** Target container. */
    public target: Container;

    /** Mask to apply. */
    public targetMask: Container;

    /** Border color. */
    public borderColor: number;

    /** Border width. */
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

    /** Shows a border. */
    public showBorder()
    {
        this.beginFill(this.borderColor);

        const width = this.borderWidth * 2;

        this.drawRect(0, 0, this.target.width + width, this.target.height + width);
    }

    /** Hides a border. */
    public hideBorder()
    {
        this.clear();
    }
}

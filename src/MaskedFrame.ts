import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';

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
 *     mask: `avatar_mask.png`),
 *     borderWidth: 5,
 *     borderColor: 0xFFFFFF,
 * });
 * ```
 */
export class MaskedFrame extends Container
{
    // private readonly borderMask: Graphics;
    private border?: Graphics;
    /** TODO */
    public target: Container;
    /** TODO */
    public targetMask: Container;

    constructor({
        target,
        mask,
        borderWidth,
        borderColor,
    }: MaskedFrameOptions)
    {
        super();

        this.target = typeof target === 'string' ? new Sprite(Texture.from(target)) : target;
        this.targetMask = typeof mask === 'string' ? new Sprite(Texture.from(mask)) : mask;
        this.target.addChild(this.targetMask);
        this.target.mask = this.targetMask;

        if (borderWidth)
        {
            this.border = new Graphics()
                .beginFill(borderColor)
                .drawRect(
                    0,
                    0,
                    this.target.width + (borderWidth * 2),
                    this.target.height + (borderWidth * 2),
                );

            this.target.x = borderWidth;
            this.target.y = borderWidth;

            const borderMask = typeof mask === 'string' ? new Sprite(Texture.from(mask)) : mask.clone();

            borderMask.width += borderWidth * 2;
            borderMask.height += borderWidth * 2;

            this.border.mask = borderMask;
            this.border.addChild(borderMask);
            this.addChild(this.border);
        }

        this.addChild(this.target);
    }

    /** TODO */
    public showBorder()
    {
        if (!this.border) return;

        this.border.visible = true;
    }

    /** TODO */
    public hideBorder()
    {
        if (!this.border) return;

        this.border.visible = false;
    }
}

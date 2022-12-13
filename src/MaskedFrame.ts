import { Container, Graphics, Texture, Sprite } from 'pixi.js';

export type MaskedFrameOptions = {
    target: string | Container;
    mask: string | Graphics;
    borderWidth?: number;
    borderColor?: number;
};

/**
 * Draws mask or/and border around any container based element
 *
 * @example
 * ```
 * const sprite = new Sprite(texture.from('picture.png'));
 * new MaskedFrame({
 *     target: new PixiSprite(Texture.from(`avatar.png`)),
 *     mask: new PixiSprite(Texture.from(`avatar_mask.png`)),
 *     borderWidth: 5,
 *     borderColor: 0xFFFFFF,
 * });
 * ```
 */
export class MaskedFrame extends Container {
    // private readonly borderMask: Graphics;
    private border?: Graphics;
    public target: Container;
    public targetMask: Container;

    constructor({
        target,
        mask,
        borderWidth,
        borderColor,
    }: MaskedFrameOptions) {
        super();

        this.target =
            typeof target === 'string'
                ? new Sprite(Texture.from(target))
                : target;

        this.targetMask =
            typeof mask === 'string' ? new Sprite(Texture.from(mask)) : mask;

        this.target.addChild(this.targetMask);

        this.target.mask = this.targetMask;

        if (borderWidth) {
            this.border = new Graphics()
                .beginFill(borderColor)
                .drawRect(
                    0,
                    0,
                    this.target.width + borderWidth * 2,
                    this.target.height + borderWidth * 2,
                );

            this.target.x = borderWidth;
            this.target.y = borderWidth;

            const borderMask =
                typeof mask === 'string'
                    ? new Sprite(Texture.from(mask))
                    : mask.clone();

            borderMask.width += borderWidth * 2;
            borderMask.height += borderWidth * 2;

            this.border.mask = borderMask;

            this.border.addChild(borderMask);

            this.addChild(this.border);
        }

        this.addChild(this.target);
    }

    public showBorder() {
        if (!this.border) return;

        this.border.visible = true;
    }

    public hideBorder() {
        if (!this.border) return;

        this.border.visible = false;
    }
}

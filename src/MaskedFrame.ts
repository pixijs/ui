import { Container, Graphics, Sprite } from 'pixi.js';
import { getView } from './utils/helpers/view';

export type MaskedFrameOptions = {
    target?: string | Container;
    mask?: string | Graphics;
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
    target: Container;

    protected _targetMask: Container;
    protected maskData: string | Graphics;
    protected borderWidth: number;
    protected borderColor: number;

    constructor(options?: MaskedFrameOptions)
    {
        super();

        if (options?.target)
        {
            this.init(options);
        }
    }

    /**
     * Initializes a component.
     * @param root0
     * @param root0.target - Container to apply a mask or a border.
     * @param root0.mask - Mask.
     * @param root0.borderWidth - Border width.
     * @param root0.borderColor - Border color.
     */
    init({ target, mask, borderWidth, borderColor }: MaskedFrameOptions)
    {
        if (this.target)
        {
            this.removeChild(this.target);
        }

        this.target = getView(target);
        this.addChild(this.target);

        if (mask) this.setMask(mask);
        if (borderWidth) this.setBorder(borderWidth, borderColor);
    }

    /**
     * Applies a mask to a target container.
     * @param mask
     */
    setMask(mask: string | Graphics)
    {
        this.maskData = mask;

        this._targetMask = getView(mask);
        this.target.addChild(this._targetMask);
        this.target.mask = this._targetMask;
    }

    /**
     * Shows a border around the target Container, same shape as the mask.
     * @param borderWidth
     * @param borderColor
     */
    setBorder(borderWidth: number, borderColor: number)
    {
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;

        this.showBorder();

        const borderMask = typeof this.maskData === 'string' ? Sprite.from(this.maskData) : this.maskData.clone(true);

        borderMask.width += borderWidth * 2;
        borderMask.height += borderWidth * 2;

        this.mask = borderMask;
        this.addChild(borderMask);
    }

    /** Hides a border. */
    showBorder()
    {
        const width = this.borderWidth * 2;

        this.clear()
            .fill(this.borderColor)
            .drawRect(0, 0, this.target.width + width, this.target.height + width);

        this.target.x = this.borderWidth;
        this.target.y = this.borderWidth;
    }

    /** Hides a border. */
    hideBorder()
    {
        this.clear();
    }
}

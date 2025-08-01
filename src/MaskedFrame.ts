import { Container, FillStyleInputs, Graphics, Sprite } from 'pixi.js';
import { getView } from './utils/helpers/view';

export type MaskedFrameOptions = {
    target?: string | Container;
    mask?: string | Graphics;
    borderWidth?: number;
    borderColor?: FillStyleInputs;
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
export class MaskedFrame extends Container
{
    /** Target container. */
    target: Container | undefined;
    border = new Graphics();
    protected _targetMask: Container | undefined;
    protected maskData: string | Graphics | undefined;
    protected borderWidth: number = 0;
    protected borderColor: FillStyleInputs = 0x000000;

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

        if (target) {
            this.target = getView(target);
        }
        this.addChild(this.border);
        if (this.target) {
            this.addChild(this.target);
        }

        if (mask) this.applyMask(mask);
        if (borderWidth) this.setBorder(borderWidth, borderColor ?? 0x000000);
    }

    /**
     * Applies a mask to a target container.
     * @param mask
     */
    applyMask(mask: string | Graphics)
    {
        this.maskData = mask;

        this._targetMask = getView(mask);
        this.addChild(this._targetMask);
        if (this.target) {
            this.target.mask = this._targetMask;
        }
    }

    /**
     * Shows a border around the target Container, same shape as the mask.
     * @param borderWidth
     * @param borderColor
     */
    setBorder(borderWidth: number, borderColor: FillStyleInputs)
    {
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;

        this.showBorder();

        if (this.maskData)
        {
            const borderMask
                = typeof this.maskData === 'string'
                    ? Sprite.from(this.maskData)
                    : this.maskData.clone(true);

            borderMask.width += borderWidth * 2;
            borderMask.height += borderWidth * 2;

            this.mask = borderMask;
            this.addChild(borderMask);
            this._targetMask.position.set(borderWidth);
        }
    }

    /** Hides a border. */
    showBorder()
    {
        const width = this.borderWidth * 2;

        this.border
            .clear()
            .rect(0, 0, this.target.width + width, this.target.height + width)
            .fill(this.borderColor);

        this.target.x = this.borderWidth;
        this.target.y = this.borderWidth;
    }

    /** Hides a border. */
    hideBorder()
    {
        this.border.clear();
    }
}

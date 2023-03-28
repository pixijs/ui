import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { cleanup } from './utils/helpers/cleanup';
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
    public target: Container;

    private _targetMask: Container;
    private maskData: string | Graphics;
    private borderWidth: number;
    private borderColor: number;

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
        cleanup(this.target);

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
    public setBorder(borderWidth: number, borderColor: number)
    {
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;

        this.showBorder();

        const borderMask = typeof this.maskData === 'string' ? Sprite.from(this.maskData) : this.maskData.clone();

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
            .beginFill(this.borderColor)
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

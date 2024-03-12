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
    target: Container;

    protected _targetMaskView = new Container();
    protected _targetMask: Container;
    protected maskData: string | Graphics;
    protected border: Graphics = new Graphics();
    protected borderWidth: number;
    protected borderColor: FillStyleInputs;

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
        this.addChild(this.border, this.target);

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
        this._targetMaskView.addChild(this._targetMask);
        this.addChild(this._targetMaskView);
        this.target.mask = this._targetMaskView;
    }

    /** Updates mask position based on the border width. */
    protected updateMask()
    {
        if (this._targetMask)
        {
            this._targetMaskView.position.set(this.borderWidth);
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
            const borderMask = typeof this.maskData === 'string' ? Sprite.from(this.maskData) : this.maskData.clone(true);

            borderMask.width += borderWidth * 2;
            borderMask.height += borderWidth * 2;

            this.mask = borderMask;
            this.addChild(borderMask);
            this.updateMask();
        }
    }

    /** Hides a border. */
    showBorder()
    {
        const width = this.borderWidth * 2;

        this.border.clear()
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

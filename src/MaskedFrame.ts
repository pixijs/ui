import { Container, DisplayObject } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { getView } from './utils/helpers/view';

export type MaskedFrameOptions = {
    target?: string | Container;
    mask?: string | Graphics | Container;
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
    protected maskData: string | Graphics | Container;
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
    setMask(mask: string | Graphics | Container)
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

        let borderMask;

        if (typeof this.maskData === 'string')
        {
            borderMask = Sprite.from(this.maskData);
        }
        else if (this.maskData instanceof Graphics)
        {
            borderMask = this.maskData.clone();
        }
        else
        {
            // TODO: Find a more efficient way to deal with border for Container
            borderMask = cloneContainer(this.maskData);
        }

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

const cloneFunctions = {
    [Sprite.name]: (child: Sprite) => new Sprite(child.texture),
    [Graphics.name]: (child: Graphics) => child.clone(),
    [Container.name]: cloneContainer
};

function cloneContainer(container: Container)
{
    const clone = new Container();

    applyTransform(clone, container);

    for (const child of container.children)
    {
        const cloneFunction = cloneFunctions[child.constructor.name];

        if (cloneFunction)
        {
            const childClone = cloneFunction(child as any);

            applyTransform(childClone, child);
            clone.addChild(childClone);
        }
    }

    return clone;
}

function applyTransform(target: DisplayObject, ref: DisplayObject)
{
    target.position.set(ref.position.x, ref.position.y);
    target.rotation = ref.rotation;
    target.scale.set(ref.scale.x, ref.scale.y);
    target.pivot.set(ref.pivot.x, ref.pivot.y);
    target.skew.set(ref.skew.x, ref.skew.y);
}

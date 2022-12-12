import { Container, Graphics } from 'pixi.js';

export interface MaskedFrameOptions
{
    radius?: number;
    borderWidth?: number;
    borderColor?: number;
}

/**
 * Draws mask or/and border around any container based element
 *
 * @example
 * ```
 * const sprite = new Sprite(texture.from('picture.png'));
 * const button = new MaskedFrame(sprite,
 *     {
 *         radius: 12,
 *         borderWidth: 8,
 *         borderColor: 0xFFFFFF,
 *     }
 * );
 * ```
 */
export class MaskedFrame extends Container
{
    private readonly borderMask: Graphics;
    private readonly border?: Graphics;

    constructor(public target: Container, options: MaskedFrameOptions = {})
    {
        super();

        const isCircle = target.width === target.height && options.radius >= target.width / 2;

        if (options.borderColor !== undefined && options.borderWidth !== undefined)
        {
            this.border =
                isCircle
                ? this.getCircleLine(
                    options.borderColor,
                    options.borderWidth,
                )
                : this.getBoxLine(
                    options.borderColor,
                    options.borderWidth,
                    options.radius,
                );

            this.addChild(this.border);
        }

        if (isCircle) {
            this.borderMask = new Graphics()
                .beginFill(0x000000)
                .drawCircle(options.borderWidth / 2, options.borderWidth / 2, target.width / 2);
            
            this.borderMask.x = target.width / 2;    
            this.borderMask.y = target.height / 2;  
        } else {
            this.borderMask = new Graphics()
                .beginFill(0x000000)
                .drawRoundedRect(
                    -options.borderWidth / 2, -options.borderWidth / 2,
                    target.width, target.height,
                    options.radius);

            this.borderMask.x = options.borderWidth;    
            this.borderMask.y = options.borderWidth;    
        }
        
        
        target.x = options.borderWidth / 2;    
        target.y = options.borderWidth / 2;  
        
        this.addChild(target);
        this.addChild(this.borderMask);
        target.mask = this.borderMask;
    }

    private getBoxLine(color: number, w: number, r: number): Graphics
    {
        const offset = w;

        const box
            = new Graphics()
                .beginFill(color)
                .drawRoundedRect(
                    0,
                    0,
                    this.target.width + offset,
                    this.target.height + offset,
                    r);

        return box;
    }

    private getCircleLine(color: number, w: number): Graphics
    {
        const offset = w / 2;
        const middle = this.target.width / 2;

        const box
            = new Graphics()
                .beginFill(color)
                .drawCircle(
                    middle + offset,
                    middle + offset,
                    middle + offset);

        return box;
    }

    public showBorder()
    {
        this.border.visible = true;
    }

    public hideBorder()
    {
        this.border.visible = false;
    }
}

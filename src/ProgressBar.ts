import { Container } from '@pixi/display';
import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { getSpriteView } from './utils/helpers/view';
import { NineSlicePlane } from '@pixi/mesh-extras';
import { Graphics } from '@pixi/graphics';

type FillPaddings = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};

export type ViewType = Sprite | Graphics | string;

export type ProgressBarOptions = {
    bg: ViewType;
    fill: ViewType;
    fillPaddings?: FillPaddings;
    nineSlicePlane?: {
        bg: [number, number, number, number],
        fill: [number, number, number, number]
    },
    progress?: number;
};

/**
 * Creates a ProgressBar.
 * @example
 * new ProgressBar({
 *     bg: 'slider_bg.png',
 *     fill: 'slider.png',
 *     progress: 50,
 * });
 */
export class ProgressBar extends Container
{
    protected bg!: Sprite | NineSlicePlane | Graphics;
    protected fill!: Sprite | NineSlicePlane | Graphics;
    protected fillMask!: NineSlicePlane | Graphics;
    protected progressStart = 0;
    protected _progress = 0;

    protected options: ProgressBarOptions;

    /** Container, that holds all inner views. */
    innerView: Container;

    constructor(options?: ProgressBarOptions)
    {
        super();

        this.options = options;

        this.innerView = new Container();
        this.addChild(this.innerView);

        if (options?.bg && options?.fill)
        {
            this.init(options);
        }
    }

    /**
     * Initialize ProgressBar.
     * @param root0
     * @param root0.bg - Background texture.
     * @param root0.fill - Fill texture.
     * @param root0.fillPaddings - Fill offset.
     * @param root0.progress - Initial progress value.
     */
    init({ bg, fill, fillPaddings, progress }: ProgressBarOptions)
    {
        this.setBackground(bg);

        this.setFill(fill, fillPaddings);

        this.progress = progress;
    }

    /**
     * Set bg.
     * @param bg
     */
    setBackground(bg: ViewType)
    {
        if (this.bg)
        {
            this.bg.destroy();
        }

        if (this.options?.nineSlicePlane)
        {
            if (typeof bg === 'string')
            {
                this.bg = new NineSlicePlane(Texture.from(bg), ...this.options.nineSlicePlane.bg);
            }
            else
            {
                console.warn('NineSlicePlane can not be used with views set as Container.');
            }
        }

        if (bg instanceof Graphics)
        {
            this.bg = bg;
        }

        if (!this.bg && (typeof bg === 'string' || bg instanceof Sprite))
        {
            this.bg = getSpriteView(bg);
        }

        this.innerView.addChildAt(this.bg, 0);
    }

    /**
     * Set fill.
     * @param fill
     * @param fillPadding
     */
    setFill(fill: ViewType, fillPadding?: FillPaddings)
    {
        if (this.fill)
        {
            this.fill.destroy();
        }

        // in case if user is trying to use same instance for bg and fill
        if (this.bg instanceof Sprite && fill === this.bg)
        {
            console.warn('Can not use same Sprite instance for bg and fill.');

            return;
        }

        if (this.options?.nineSlicePlane)
        {
            if (typeof fill === 'string')
            {
                this.fill = new NineSlicePlane(Texture.from(fill), ...this.options.nineSlicePlane.fill);
            }
            else
            {
                console.warn('NineSlicePlane can not be used with views set as Container.');
            }
        }

        if (!this.fill)
        {
            if (fill instanceof Graphics)
            {
                this.fill = fill;
            }
            else
            {
                this.fill = getSpriteView(fill);
            }
        }

        this.innerView.addChildAt(this.fill, 1);

        const offsetX = fillPadding?.left ?? 0;
        const offsetY = fillPadding?.top ?? 0;

        this.fill.x = offsetX;
        this.fill.y = offsetY;

        if (this.fillMask)
        {
            this.fill.mask = null;
            this.fillMask.destroy();
        }

        const leftWidth = this.fill.width / 2;
        const rightWidth = this.fill.width / 2;
        const topHeight = this.fill.height / 2;
        const bottomHeight = this.fill.height / 2;

        let texture: Texture = Texture.WHITE;

        if (this.fill instanceof Sprite && this.fill.texture)
        {
            texture = this.fill.texture;
        }

        this.fillMask = new NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight);

        this.fill.addChild(this.fillMask);
        this.fill.mask = this.fillMask;
    }

    protected validate(progress: number): number
    {
        progress = Math.round(progress);

        if (progress < 0)
        {
            return 0;
        }

        if (progress > 100)
        {
            return 100;
        }

        return progress;
    }

    /** Set current progress percentage value. */
    set progress(progress: number)
    {
        this._progress = this.validate(progress);

        if (!this.fill) return;

        if (this.fillMask)
        {
            this.fillMask.width = this.fill.width / 100 * (this._progress - this.progressStart);
            this.fillMask.x = this.progressStart / 100 * this.fill.width;
            this.fillMask.height = this.fill.height;
        }
    }

    /** Return current progress percentage value. */
    get progress(): number
    {
        return this._progress;
    }

    override set width(width: number)
    {
        if (this.options?.nineSlicePlane)
        {
            if (this.bg)
            {
                this.bg.width = width;
            }

            if (this.fill)
            {
                const leftPadding = this.options.fillPaddings?.left ?? 0;
                const rightPadding = this.options.fillPaddings?.right ?? 0;

                this.fill.width = width - leftPadding - rightPadding;
                this.fillMask.width = width - leftPadding - rightPadding;
            }

            this.progress = this._progress;
        }
        else
        {
            super.width = width;
        }
    }

    override get width(): number
    {
        return super.width;
    }

    override set height(height: number)
    {
        if (this.options?.nineSlicePlane)
        {
            if (this.bg)
            {
                this.bg.height = height;
            }

            if (this.fill)
            {
                const topPadding = this.options.fillPaddings?.top ?? 0;
                const bottomPadding = this.options.fillPaddings?.bottom ?? 0;

                this.fill.height = height - topPadding - bottomPadding;
                this.fillMask.height = height - topPadding - bottomPadding;
            }

            this.progress = this._progress;
        }
        else
        {
            super.height = height;
        }
    }

    override get height(): number
    {
        return super.height;
    }
}

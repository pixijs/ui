import { Container } from '@pixi/display';
import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { getView, type GetViewSettings } from './utils/helpers/view';
import { NineSlicePlane as PixiNineSlicePlane } from '@pixi/mesh-extras';
import { Graphics } from '@pixi/graphics';

type FillPaddings = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};

export type ProgressBarViewType = GetViewSettings;
export type NineSlicePlane = {
    bg: [number, number, number, number],
    fill: [number, number, number, number]
};

export type ProgressBarOptions = {
    bg: ProgressBarViewType;
    fill: ProgressBarViewType;
    fillPaddings?: FillPaddings;
    nineSlicePlane?: NineSlicePlane,
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
    protected bg!: Sprite | PixiNineSlicePlane | Graphics;
    protected fill!: Sprite | PixiNineSlicePlane | Graphics;
    protected fillMask!: PixiNineSlicePlane | Graphics;
    protected progressStart = 0;
    protected _progress = 0;

    protected options: ProgressBarOptions;

    /** Container, that holds all inner views. */
    innerView: Container;

    /** Container, given as a constructor parameter that is a button view. */
    protected _view: Container;

    /**
     * Creates a ProgressBar.
     * @param options - Options.
     * @param { Sprite | Graphics | Texture | string } options.bg - Background of the ProgressBar.
     * @param { Sprite | Graphics | Texture | string } options.fill - Fill of the ProgressBar.
     * @param { FillPaddings } options.fillPaddings - Fill offsets.
     * @param { number } options.fillPaddings.top - Fill top offset.
     * @param { number } options.fillPaddings.right - Fill right offset.
     * @param { number } options.fillPaddings.bottom - Fill bottom offset.
     * @param { number } options.fillPaddings.left - Fill left offset.
     * @param { NineSlicePlane } options.nineSlicePlane - NineSlicePlane values for bg and fill.
     * @param { Array } options.nineSlicePlane.bg - NineSlicePlane config for bg ([number, number, number, number]).
     * @param { Array } options.nineSlicePlane.fill - NineSlicePlane config fill ([number, number, number, number]).
     * @param { number } options.progress - Initial progress value.
     */
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
    setBackground(bg: ProgressBarViewType)
    {
        if (this.bg)
        {
            this.bg.destroy();
        }

        if (this.options?.nineSlicePlane)
        {
            if (typeof bg === 'string')
            {
                this.bg = new PixiNineSlicePlane(Texture.from(bg), ...this.options.nineSlicePlane.bg);
            }
            else if (bg instanceof Texture)
            {
                this.bg = new PixiNineSlicePlane(bg, ...this.options.nineSlicePlane.bg);
            }
            else
            {
                console.warn('NineSlicePlane can not be used with views set as Container.');
            }
        }

        if (!this.bg)
        {
            this.bg = getView(bg) as Sprite | Graphics;
        }

        this.innerView.addChildAt(this.bg, 0);
    }

    /**
     * Set fill.
     * @param fill
     * @param fillPadding
     */
    setFill(fill: ProgressBarViewType, fillPadding?: FillPaddings)
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
                this.fill = new PixiNineSlicePlane(Texture.from(fill), ...this.options.nineSlicePlane.fill);
            }
            else if (fill instanceof Texture)
            {
                this.fill = new PixiNineSlicePlane(fill, ...this.options.nineSlicePlane.fill);
            }
            else
            {
                console.warn('NineSlicePlane can not be used with views set as Container.');
            }
        }

        if (!this.fill)
        {
            this.fill = getView(fill) as Sprite | Graphics;
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

        this.fillMask = new PixiNineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight);

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

    /**
     * Sets width of a ProgressBars background and fill.
     * If nineSlicePlane is set, then width will be set to nineSlicePlane.
     * If nineSlicePlane is not set, then width will control components width as Container.
     * @param width - Width value.
     */
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

    /** Gets width of a ProgressBar. */
    override get width(): number
    {
        return super.width;
    }

    /**
     * Sets height of a ProgressBars background and fill.
     * If nineSlicePlane is set, then height will be set to nineSlicePlane.
     * If nineSlicePlane is not set, then height will control components height as Container.
     * @param height - Height value.
     */
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

    /** Gets height of a ProgressBar. */
    override get height(): number
    {
        return super.height;
    }
}

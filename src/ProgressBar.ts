import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { getView } from './utils/helpers/view';

type FillOffset = {
    x?: number;
    y?: number;
};

export type ProgressBarOptions = {
    bg: Container | string;
    fill: Container | string;
    progress?: number;
    fillOffset?: FillOffset;
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
    protected bg!: Container;
    protected fill!: Container;
    protected fillMask!: Graphics;

    /** Container, that holds all inner views. */
    public innerView: Container;

    /** Start point of progress. */
    public progressStart = 0;

    /** Current progress value. */
    public _progress = 0;

    constructor(params?: ProgressBarOptions)
    {
        super();

        this.innerView = new Container();
        this.addChild(this.innerView);

        if (params?.bg && params?.fill)
        {
            this.init(params);
        }
    }

    /**
     * Initialize ProgressBar.
     * @param root0
     * @param root0.bg - Background texture.
     * @param root0.fill - Fill texture.
     * @param root0.fillOffset - Fill offset.
     * @param root0.progress - Initial progress value.
     */
    init({ bg, fill, fillOffset, progress }: ProgressBarOptions)
    {
        this.setBackground(bg);

        this.setFill(fill, fillOffset);

        this.progress = progress;
    }

    /**
     * Set bg.
     * @param bg
     */
    setBackground(bg: Container | string)
    {
        if (this.bg)
        {
            this.innerView.removeChild(this.bg);
        }

        this.bg = getView(bg);
        this.innerView.addChildAt(this.bg, 0);
    }

    /**
     * Set fill.
     * @param fill
     * @param fillOffset
     */
    setFill(fill: Container | string, fillOffset?: FillOffset)
    {
        if (this.fill)
        {
            this.innerView.removeChild(this.fill);
            this.fill.destroy();
        }

        // in case if user is trying to use same instance for bg and fill
        if (this.bg instanceof Sprite && fill === this.bg)
        {
            fill = Sprite.from(this.bg.texture);
        }

        this.fill = getView(fill);
        this.innerView.addChildAt(this.fill, 1);

        const offsetX = fillOffset?.x ?? 0;
        const offsetY = fillOffset?.y ?? 0;

        this.fill.x = ((this.bg.width - this.fill.width) / 2) + offsetX;
        this.fill.y = ((this.bg.height - this.fill.height) / 2) + offsetY;

        if (!this.fillMask)
        {
            this.fillMask = new Graphics();
        }

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

        const startPoint = (this.fill.width / 100) * this.progressStart;
        const endPoint = ((this.fill.width / 100) * this._progress) - startPoint;

        if (this.fillMask)
        {
            this.fillMask.clear().lineStyle(0).beginFill(0xffffff).drawRect(startPoint, 0, endPoint, this.fill.height);
        }
    }

    /** Return current progress percentage value. */
    get progress(): number
    {
        return this._progress;
    }
}

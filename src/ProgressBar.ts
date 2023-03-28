import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
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
     * Initializes ProgressBar.
     * @param root0
     * @param root0.bg - Background texture.
     * @param root0.fill - Fill texture.
     * @param root0.fillOffset - Fill offset.
     * @param root0.progress - Initial progress value.
     */
    init({ bg, fill, fillOffset, progress }: ProgressBarOptions)
    {
        this.innerView.removeChild(this.bg);
        this.innerView.removeChild(this.fill);

        this.bg = getView(bg);
        this.innerView.addChild(this.bg);

        this.fill = getView(fill);
        this.innerView.addChild(this.fill);

        const offsetX = fillOffset?.x ?? 0;
        const offsetY = fillOffset?.y ?? 0;

        this.fill.x = ((this.bg.width - this.fill.width) / 2) + offsetX;
        this.fill.y = ((this.bg.height - this.fill.height) / 2) + offsetY;

        if (!this.fillMask)
        {
            this.fillMask = new Graphics();
            this.fill.addChild(this.fillMask);
            this.fill.mask = this.fillMask;
        }

        this.progress = progress;
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

    /** Sets current progress percentage value. */
    set progress(progress: number)
    {
        if (!this.bg) return;

        this._progress = this.validate(progress);

        const percentage = (this.fill.width / 100) * this._progress;

        if (this.fillMask)
        {
            this.fillMask.clear().lineStyle(0).beginFill(0xffffff).drawRect(0, 0, percentage, this.fill.height);
        }
    }

    /** Returns current progress percentage value. */
    get progress(): number
    {
        return this._progress;
    }
}

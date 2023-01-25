import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { getView } from './utils/helpers/view';

export type ProgressBarOptions = {
    bg: Container | string;
    fill: Container | string;
    progress?: number;
    fillOffset?: {
        x?: number;
        y?: number;
    };
};

/**
 * Creates a ProgressBar
 * @example
 * ```
 * new ProgressBar({
 *     bg: 'slider_bg.png',
 *     fill: 'slider.png',
 *     progress: 50,
 * });
 *
 * singleSlider.onChange.connect((value) => {
 *     onChange(`Slider changed > ${value}`);
 * });
 * ```
 */
export class ProgressBar extends Container
{
    protected readonly bg: Container;
    protected readonly fill?: Container;
    protected readonly fillMask?: Graphics;

    /** Container, that holds all inner views. */
    public innerView: Container;

    /** Current progress value. */
    public _progress = 0;

    /** Current progress in percentage. In case if min and max of progress are not 0-100. */
    public percent = 0;

    /** Minimal value of the progress. */
    public min = 0;

    /** Maximal value of the progress. */
    public max = 100;

    constructor({ bg, fill, fillOffset, progress }: ProgressBarOptions)
    {
        super();

        this.innerView = new Container();
        this.addChild(this.innerView);

        this.bg = new Container();
        this.bg.addChild(getView(bg));

        this.innerView.addChild(this.bg);

        if (fill)
        {
            this.fill = new Container();
            this.fill.addChild(getView(fill));

            const offsetX = fillOffset?.x ?? 0;
            const offsetY = fillOffset?.y ?? 0;

            this.fill.x = ((this.bg.width - this.fill.width) / 2) + offsetX;
            this.fill.y = ((this.bg.height - this.fill.height) / 2) + offsetY;

            this.fillMask = new Graphics();
            this.fill.addChild(this.fillMask);
            this.fill.mask = this.fillMask;

            this.addChild(this.fill);
        }

        this.progress = progress;
    }

    protected validateSettings()
    {
        if (this._progress < this.min)
        {
            this._progress = this.min;
        }

        if (this._progress > this.max)
        {
            this._progress = this.max;
        }

        this._progress = this._progress ?? this.min ?? 0;
        this.percent = (this._progress * 100) / this.max;

        const scale = this.max - this.min;
        const scaledVal = this._progress - this.min;

        this.percent = (scaledVal * 100) / scale;
    }

    /** Sets current progress value. */
    set progress(progress: number)
    {
        this._progress = progress;

        this.validateSettings();

        const startPoint = 0;
        const endPoint = (this.bg.width / 100) * this._progress;

        if (this.fillMask)
        {
            this.fillMask
                .clear()
                .lineStyle(0)
                .beginFill(0xffffff)
                .drawRect(startPoint, 0, endPoint - startPoint, this.fill.height);
        }
    }

    /** Returns current progress value. */
    get progress(): number
    {
        return this._progress;
    }
}

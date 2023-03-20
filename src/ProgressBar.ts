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
    protected readonly bg: Container;
    protected readonly fill?: Container;
    protected readonly fillMask?: Graphics;

    /** Container, that holds all inner views. */
    public innerView: Container;

    /** Start point of progress. */
    public progressStart = 0;

    /** Current progress value. */
    public _progress = 0;

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
        this._progress = this.validate(progress);

        const startPoint = (this.bg.width / 100) * this.progressStart;
        const endPoint = ((this.bg.width / 100) * this._progress) - startPoint;

        if (this.fillMask)
        {
            this.fillMask.clear().lineStyle(0).beginFill(0xffffff).drawRect(startPoint, 0, endPoint, this.fill.height);
        }
    }

    /** Returns current progress percentage value. */
    get progress(): number
    {
        return this._progress;
    }
}

import { Container, DEG_TO_RAD, Graphics, LineCap } from 'pixi.js';

export type MaskedProgressBarOptions = {
    backgroundColor?: number;
    fillColor: number;
    lineWidth: number;
    radius: number;
    value?: number;
    backgroundAlpha?: number;
    fillAlpha?: number;
    cap?: LineCap;
};

/**
 * Creates a Circular ProgressBar.
 * @example
 * const progressBar = new CircularProgressBar({
 *    backgroundColor: 0x000000,
 *    backgroundAlpha: 0.5,
 *    lineWidth: 10,
 *    fillColor: 0xFFFFFF,
 *    radius: 50,
 *    value: 50,
 *    cap: 'round'
 * });
 *
 * progressBar.progress = 100;
 */
export class CircularProgressBar extends Container
{
    private _progress = 0;
    private options: MaskedProgressBarOptions;

    private bgCircle = new Graphics();
    private fillCircle = new Graphics();

    /** Container, that holds all inner views. */
    innerView = new Container();

    /**
     * Creates a Circular ProgressBar.
     * @param { number } options - Options object to use.
     * @param { number } options.backgroundColor - Background color.
     * @param { number } options.fillColor - Fill color.
     * @param { number } options.lineWidth - Line width.
     * @param { number } options.radius - Radius.
     * @param { number } options.value - Progress value.
     * @param { number } options.backgroundAlpha - Background alpha.
     * @param { number } options.fillAlpha - Fill alpha.
     * @param { 'butt' | 'round' | 'square' } options.cap - Line cap.
     */
    constructor(options?: MaskedProgressBarOptions)
    {
        super();

        this.options = options;

        this.addChild(this.innerView);

        this.innerView.addChild(this.bgCircle, this.fillCircle);

        this.addBackground();

        if (options.value)
        {
            this.progress = options.value;
        }
    }

    private addBackground()
    {
        const {
            backgroundColor,
            lineWidth,
            radius,
            backgroundAlpha,
        } = this.options;

        let alpha = 1;

        if (backgroundAlpha > 0)
        {
            alpha = backgroundAlpha;
        }

        if (backgroundColor === undefined)
        {
            alpha = 0.000001;
        }

        this.bgCircle
            .circle(0, 0, radius)
            .stroke({
                width: lineWidth,
                color: backgroundColor,
                alpha
            });
    }

    /**
     * Set progress value.
     * @param { number } value - Progress value.
     */
    set progress(value: number)
    {
        if (value > 100)
        {
            value = 100;
        }

        if (value < 0)
        {
            value = 0;
        }

        this._progress = value;

        const {
            lineWidth,
            radius,
            fillColor,
            fillAlpha,
            cap
        } = this.options;

        if (value === 0 && fillAlpha === 0)
        {
            this.fillCircle.clear();

            return;
        }

        const startAngle = 0;
        const endAngle = 360 / 100 * value;

        this.fillCircle
            .clear()
            .arc(0, 0, radius, (0 - 90 + startAngle) * DEG_TO_RAD, (0 - 90 + startAngle + endAngle) * DEG_TO_RAD)
            .stroke({
                width: lineWidth,
                color: fillColor,
                cap,
                alpha: fillAlpha
            });
    }

    /**
     * Current progress value.
     * @returns { number } - Progress value.
     */
    get progress(): number
    {
        return this._progress;
    }
}

import { DEG_TO_RAD } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics, LINE_CAP } from '@pixi/graphics';

export type MaskedProgressBarOptions = {
    backgroundColor?: number;
    fillColor: number;
    lineWidth: number;
    radius: number;
    value?: number;
    backgroundAlpha?: number;
    fillAlpha?: number;
    cap?: 'butt' | 'round' | 'square';
};

/**
 * Creates a Circular ProgressBar.
 * @example
 * new ProgressBar({
 *     fillColor: '#00b1dd',
 *     borderColor: '#FFFFFF',
 *     backgroundColor: '#fe6048',
 *     value: 50,
 *     radius: 25,
 *     border: 3,
 * });
 */
export class CircularProgressBar extends Container
{
    private _progress = 0;
    private options: MaskedProgressBarOptions;

    private bgCircle = new Graphics();
    private fillCircle = new Graphics();

    /** Container, that holds all inner views. */
    innerView = new Container();

    constructor(options?: MaskedProgressBarOptions)
    {
        super();

        this.options = options;

        this.addChild(this.innerView);

        this.innerView.addChild(this.bgCircle, this.fillCircle);

        this.drawBackground();

        if (options.value)
        {
            this.progress = options.value;
        }
    }

    private drawBackground()
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

        this.bgCircle.lineStyle({
            width: lineWidth,
            color: backgroundColor,
            alpha
        }).drawCircle(0, 0, radius);
    }

    /** Set progress value. */
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
            .lineStyle({
                width: lineWidth,
                color: fillColor,
                cap: cap as LINE_CAP,
                alpha: fillAlpha
            })
            .arc(0, 0, radius, (0 - 90 + startAngle) * DEG_TO_RAD, (0 - 90 + startAngle + endAngle) * DEG_TO_RAD);
    }

    /** Current progress value. */
    get progress(): number
    {
        return this._progress;
    }
}

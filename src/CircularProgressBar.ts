import { DEG_TO_RAD } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics, LINE_CAP, LINE_JOIN } from '@pixi/graphics';

export type MaskedProgressBarOptions = {
    backgroundColor?: number;
    fillColor: number;
    lineWidth: number;
    radius: number;
    value?: number;
    backgroundAlpha?: number;
    fillAlpha?: number;
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
export class CircularProgressBar extends Graphics
{
    private _progress = 0;
    private options: MaskedProgressBarOptions;

    private fillCircle = new Graphics();

    /** Container, that holds all inner views. */
    innerView = new Container();

    constructor(options?: MaskedProgressBarOptions)
    {
        super();

        this.options = options;

        this.addChild(this.fillCircle);

        const {
            backgroundColor,
            lineWidth,
            radius,
            backgroundAlpha,
        } = options;

        const x = radius + (lineWidth / 2);
        const y = radius - (lineWidth / 2);

        this.lineStyle({
            width: lineWidth,
            color: backgroundColor,
            join: LINE_JOIN.ROUND,
            cap: LINE_CAP.ROUND,
            // we need to render something, to have proper size, so user will be able to align component.
            alpha: backgroundAlpha > 0 ? backgroundAlpha : 0.0000001
        }).drawCircle(x, -y, options.radius);

        this.addChild(this.innerView);

        if (options.value)
        {
            this.progress = options.value;
        }
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
            fillAlpha
        } = this.options;

        if (value === 0 && fillAlpha === 0)
        {
            this.fillCircle.clear();

            return;
        }

        const startAngle = 0;
        const endAngle = 360 / 100 * value;

        const x = radius + (lineWidth / 2);
        const y = radius - (lineWidth / 2);

        this.fillCircle
            .clear()
            .lineStyle({
                width: lineWidth,
                color: fillColor,
                join: LINE_JOIN.ROUND,
                cap: LINE_CAP.ROUND,
                alpha: fillAlpha
            })
            .arc(x, -y, radius, (0 - 90 + startAngle) * DEG_TO_RAD, (0 - 90 + startAngle + endAngle) * DEG_TO_RAD);
    }

    /** Current progress value. */
    get progress(): number
    {
        return this._progress;
    }
}

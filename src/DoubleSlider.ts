import { FederatedPointerEvent } from '@pixi/events';
import type { DragObject } from './utils/HelpTypes';
import { BaseSliderOptions, SliderBase } from './SliderBase';
import { Signal } from 'typed-signals';

/**
 * Creates a slider with range selection option.
 * @example
 * const doubleSlider = new DoubleSlider({
 *      bg: 'slider_bg.png',
 *      fill: 'slider_progress.png',
 *      slider1: 'slider.png',
 *      slider2: 'slider.png',
 *  });
 *
 * doubleSlider.onChange.connect((value1, value2) =>
 *     console.log(`New slider range ${value1} - ${value2}`)
 * );
 */

export class DoubleSlider extends SliderBase
{
    protected options: BaseSliderOptions;

    private activeValue: 'value1' | 'value2';

    /** Signal that fires when value have changed. */
    public onChange: Signal<(value1: number, value2: number) => void> = new Signal();

    /** Signal that fires when value is changing. */
    public onUpdate: Signal<(value1: number, value2: number) => void> = new Signal();

    constructor(options: BaseSliderOptions)
    {
        super(options);

        this.options = options;

        this.value2 = options.value2 ?? this.max;
        this.value1 = options.value1 ?? this.min;
    }

    /** Returns left value. */
    get value1(): number
    {
        return this._value1;
    }

    /** Sets left value. */
    set value1(value1: number)
    {
        if (value1 === this._value1) return;

        if (value1 < this.min) value1 = this.min;
        if (value1 > this._value2) value1 = this._value2;

        this._value1 = value1;

        this.updateProgress();

        const progress = ((this.max - this.min) / 100) * value1;

        this.slider1.x = ((this.bg.width - this.slider1.width) / 100) * progress;

        if (this.options.showValue)
        {
            this.value1Text.text = `${value1}`;

            const sliderPosX = this.slider1.x + (this.slider1.width / 2);
            const sliderPosY = this.slider1.y;

            this.value1Text.x = sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.value1Text.y = sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }

        this.onUpdate?.emit(this.value1, this.value2);
    }

    /** Returns right value. */
    get value2(): number
    {
        return this._value2;
    }

    /** Sets right value. */
    set value2(value2: number)
    {
        if (value2 === this._value2) return;

        if (value2 < this._value1) value2 = this._value1;
        if (value2 > this.max) value2 = this.max;

        this._value2 = value2;

        this.updateProgress();

        const progress = ((this.max - this.min) / 100) * value2;

        this.slider2.x = ((this.bg.width - this.slider2.width) / 100) * progress;

        if (this.options.showValue)
        {
            this.value2Text.text = `${value2}`;

            const sliderPosX = this.slider2.x + (this.slider2.width / 2);
            const sliderPosY = this.slider2.y;

            this.value2Text.x = sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.value2Text.y = sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }

        this.onUpdate?.emit(this.value1, this.value2);
    }

    protected override update(event: FederatedPointerEvent)
    {
        if (!this.dragging) return;

        const obj = event.currentTarget as DragObject;
        const { x } = obj.parent.worldTransform.applyInverse(event.global);

        const slider1Dist = Math.abs(x - this.slider1.x - this.slider1.width);
        const slider2Dist = Math.abs(x - this.slider2.x);

        if (!this.activeValue)
        {
            this.activeValue = slider1Dist < slider2Dist ? 'value1' : 'value2';
        }

        const progress = this.validate((x / this.bg.width) * 100);

        if (this.activeValue === 'value1')
        {
            this.value1 = ((this.max - this.min) / 100) * progress;
        }
        else
        {
            this.value2 = ((this.max - this.min) / 100) * progress;
        }
    }

    protected override endUpdate()
    {
        super.endUpdate();

        this.activeValue = null;
    }

    private updateProgress()
    {
        this.progressStart = ((this.max - this.min) / 100) * this._value1;
        this.progress = ((this.max - this.min) / 100) * this._value2;
    }
}

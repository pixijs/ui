import { FederatedPointerEvent } from '@pixi/events';
import type { DragObject } from './utils/HelpTypes';
import { DoubleSliderOptions, SliderBase } from './SliderBase';
import { Signal } from 'typed-signals';
import { Container } from '@pixi/display';

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
 *     console.log(`New slider range ${value1} - ${value2}`)S
 * );
 */

export class DoubleSlider extends SliderBase
{
    protected options: DoubleSliderOptions;

    protected activeValue: 'value1' | 'value2';

    /** Signal that fires when value have changed. */
    onChange: Signal<(value1: number, value2: number) => void> = new Signal();

    /** Signal that fires when value is changing. */
    onUpdate: Signal<(value1: number, value2: number) => void> = new Signal();

    constructor(options: DoubleSliderOptions)
    {
        super(options);

        this.options = options;
        this.setInitialState();
    }

    protected setInitialState()
    {
        this.validateValues();

        const { value1, value2 } = this.options;

        this.updateProgress(value1, value2);

        this.value2 = value2;
        this.value1 = value1;
    }

    protected updateProgress(value1 = this.value1, value2 = this.value2)
    {
        this.progressStart = ((value1 - this.min) / (this.max - this.min)) * 100;
        this.progress = ((value2 - this.min) / (this.max - this.min)) * 100;
    }

    protected validateValues()
    {
        if (!this.options.value1)
        {
            this.options.value1 = this.min;
        }

        if (!this.options.value2)
        {
            this.options.value2 = this.options.max;
        }

        if (this.options.value2 < this.options.value1)
        {
            this.options.value2 = this.options.value1;
        }

        if (this.options.value1 < this.options.min)
        {
            this.options.value1 = this.options.min;
        }

        if (this.options.value1 > this.options.max)
        {
            this.options.value1 = this.options.max;
        }

        if (this.options.value2 > this.options.max)
        {
            this.options.value2 = this.options.max;
        }
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

        this.updateSlider1();

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

        this.updateSlider2();

        this.onUpdate?.emit(this.value1, this.value2);
    }

    protected override update(event: FederatedPointerEvent)
    {
        if (!this.dragging) return;

        const obj = event.currentTarget as DragObject;
        const { x } = obj.parent.worldTransform.applyInverse(event.global);

        const slider1Dist = Math.abs(x - this._slider1.x - this._slider1.width);
        const slider2Dist = Math.abs(x - this._slider2.x);

        if (!this.activeValue)
        {
            if (this.slider1 && x < this.slider1.x)
            {
                this.activeValue = 'value1';
            }
            else if (this.slider2 && x > this.slider2.x)
            {
                this.activeValue = 'value2';
            }
            else
            {
                this.activeValue = slider1Dist < slider2Dist ? 'value1' : 'value2';
            }
        }

        const progress = this.validate((x / this.bg.width) * 100);

        if (this.activeValue === 'value1')
        {
            this.progressStart = progress;
            this.value1 = this.min + (((this.max - this.min) / 100) * progress);
            this.updateProgress(this.value1, this.value2);
        }
        else
        {
            this.progress = progress;
            this.value2 = this.min + (((this.max - this.min) / 100) * progress);
        }
    }

    protected override endUpdate()
    {
        super.endUpdate();

        this.activeValue = null;
    }

    protected override change()
    {
        this.onChange?.emit(this.value1, this.value2);
    }

    /**
     * Set Slider1 instance.
     * @param value - Container or string with texture name.
     */
    override set slider1(value: Container | string)
    {
        super.slider1 = value;
        this.updateSlider1();
    }

    /** Get Slider1 instance. */
    override get slider1(): Container
    {
        return this._slider1;
    }

    /**
     * Sets Slider instance.
     * @param value - Container or string with texture name.
     */
    override set slider2(value: Container | string)
    {
        super.slider2 = value;
        this.updateSlider2();
    }

    /** Get Slider2 instance. */
    override get slider2(): Container
    {
        return this._slider2;
    }

    protected updateSlider1()
    {
        this._slider1.x = ((this.bg.width - this._slider1.width) / 100) * this.progressStart;

        if (this._slider2 && this._slider1.x > this._slider2.x)
        {
            this._slider1.x = this._slider2.x;
        }

        if (this.options?.showValue)
        {
            this.value1Text.text = `${Math.round(this.value1)}`;

            const sliderPosX = this._slider1.x + (this._slider1.width / 2);
            const sliderPosY = this._slider1.y;

            this.value1Text.x = sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.value1Text.y = sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }
    }

    protected updateSlider2()
    {
        this._slider2.x = ((this.bg.width - this._slider2.width) / 100) * this.progress;

        if (this._slider2.x < this._slider1.x)
        {
            this._slider2.x = this._slider1.x;
        }

        if (this.options?.showValue)
        {
            this.value2Text.text = `${Math.round(this.value2)}`;

            const sliderPosX = this._slider2.x + (this._slider2.width / 2);
            const sliderPosY = this._slider2.y;

            this.value2Text.x = sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.value2Text.y = sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }
    }
}

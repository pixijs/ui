import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Signal } from 'typed-signals';

import type { DragObject } from './utils/HelpTypes';
import { BaseSliderOptions, SliderBase } from './SliderBase';

export type SliderOptions = BaseSliderOptions & {
    slider: Container | string;
    value?: number;
};

/**
 * Creates a slider to select a single value.
 * @example
 * new Slider({
 *     bg: 'slider_bg.png',
 *     fill: 'slider.png',
 *     slider: 'slider.png',
 *     min: 0,
 *     max: 100,
 *     value: 50,
 * });
 *
 * singleSlider.onChange.connect((value) => {
 *     console.log(`Slider changed to ${value}`);
 * });
 */
export class Slider extends SliderBase
{
    protected sliderOptions: SliderOptions;

    /** Fires when value is changing, on every move of slider. */
    onUpdate: Signal<(value: number) => void> = new Signal();

    /** Fires when value changed, only when slider is released. */
    onChange: Signal<(value: number) => void> = new Signal();

    constructor(options: SliderOptions)
    {
        super({
            slider1: options.slider,
            value1: options.value,
            ...options
        });

        this.sliderOptions = options;

        this.progress = ((options.value ?? this.min) - this.min) / (this.max - this.min) * 100;

        this.value = options.value ?? this.min;
    }

    /** Return selected value. */
    get value(): number
    {
        return this._value1;
    }

    /** Set selected value. */
    set value(value: number)
    {
        if (value === this._value1) return;

        if (value < this.min) value = this.min;
        if (value > this.max) value = this.max;

        this._value1 = value;

        this.updateSlider();

        this.onUpdate?.emit(this.value);
    }

    /** Set slider instance ot texture. */
    // eslint-disable-next-line accessor-pairs
    set slider(value: Container | string)
    {
        this.slider1 = value;
        this.updateSlider();
    }

    protected override update(event: FederatedPointerEvent)
    {
        super.update(event);

        if (!this.dragging) return;

        const obj = event.currentTarget as DragObject;
        const { x } = obj.parent.worldTransform.applyInverse(event.global);

        this.progress = this.validate((x / this.bg.width) * 100);
        this.value = this.min + (((this.max - this.min) / 100) * this.progress);
    }

    protected override change()
    {
        this.onChange?.emit(this.value);
    }

    protected updateSlider()
    {
        this._slider1.x = ((this.bg.width - this._slider1.width) / 100) * this.progress;

        if (this.sliderOptions.showValue)
        {
            this.value1Text.text = `${Math.round(this.value)}`;

            const sliderPosX = this._slider1.x + (this._slider1.width / 2);
            const sliderPosY = this._slider1.y;

            this.value1Text.x = sliderPosX + (this.sliderOptions.valueTextOffset?.x ?? 0);
            this.value1Text.y = sliderPosY + (this.sliderOptions.valueTextOffset?.y ?? 0);
        }
    }

    override set width(value: number)
    {
        super.width = value;

        this.updateSlider();
    }

    override get width(): number
    {
        return super.width;
    }

    override set height(value: number)
    {
        super.height = value;

        this.updateSlider();
    }

    override get height(): number
    {
        return super.height;
    }
}

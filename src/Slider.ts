import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { ITextStyle, TextStyle } from '@pixi/text';
import { Signal } from 'typed-signals';

import type { DragObject } from './utils/HelpTypes';
import { SliderBase } from './SliderBase';

export type SliderOptions = {
    bg: Container | string;
    slider: Container | string;
    fill?: Container | string;
    min?: number;
    max?: number;
    value?: number;
    valueTextStyle?: TextStyle | Partial<ITextStyle>;
    showValue?: boolean;
    valueTextOffset?: {
        x?: number;
        y?: number;
    };
    fillOffset?: {
        x?: number;
        y?: number;
    };
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
    private options: SliderOptions;

    /** Fires when value is changing, on every move of slider. */
    public onUpdate: Signal<(value: number) => void> = new Signal();

    /** Fires when value changed, only when slider is released. */
    public onChange: Signal<(value: number) => void> = new Signal();

    constructor(options: SliderOptions)
    {
        super({
            bg: options.bg,
            slider1: options.slider,
            fill: options.fill ?? '',
            min: options.min,
            max: options.max,
            value1: options.value,
            valueTextStyle: options.valueTextStyle,
            showValue: options.showValue,
            valueTextOffset: options.valueTextOffset,
            fillOffset: options.fillOffset,
        });

        this.options = options;

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

        this.slider1.x = ((this.bg.width - this.slider1.width) / 100) * this.progress;

        if (this.options.showValue)
        {
            this.value1Text.text = `${Math.round(this.value)}`;

            const sliderPosX = this.slider1.x + (this.slider1.width / 2);
            const sliderPosY = this.slider1.y;

            this.value1Text.x = sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.value1Text.y = sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }

        this.onUpdate?.emit(this.value);
    }

    protected override update(event: FederatedPointerEvent)
    {
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
}

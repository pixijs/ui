import { Container, FederatedPointerEvent, Optional, Size } from 'pixi.js';
import { Signal } from 'typed-signals';
import { BaseSliderOptions, SliderBase } from './SliderBase';

import type { DragObject } from './utils/HelpTypes';

export type SliderOptions = BaseSliderOptions & {
    slider: Container | string;
    step?: number;
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
            ...options,
        });

        this.sliderOptions = options;

        // Avoid zero value
        this.step = options.step || 1;

        this.value = options.value ?? this.min;
        this.updateSlider();
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

    override set max(value: number)
    {
        super.max = value;
        this.updateSlider();
    }

    override get max(): number
    {
        return super.max;
    }

    override set min(value: number)
    {
        super.min = value;
        this.updateSlider();
    }

    override get min(): number
    {
        return super.min;
    }

    override set step(value: number)
    {
        super.step = value;
        this.updateSlider();
    }

    override get step(): number
    {
        return super.step;
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
        const positionRatio = x / (this.bg?.width || 1);
        const rawValue = this.min + (positionRatio * (this.max - this.min));

        // Snap the raw value to the nearest step
        this.value = Math.round(rawValue / this.step) * this.step;
    }

    protected override change()
    {
        this.onChange?.emit(this.value);
    }

    protected updateSlider()
    {
        if (!this._slider1) return;

        this.progress = (((this.value ?? this.min) - this.min) / (this.max - this.min)) * 100;

        this._slider1.x = ((this.bg?.width ?? 0) / 100 * this.progress) - (this._slider1.width / 2);
        this._slider1.y = (this.bg?.height ?? 0) / 2;

        if (this.sliderOptions?.showValue && this.value1Text)
        {
            this.value1Text.text = `${Math.round(this.value)}`;

            const sliderPosX = this._slider1.x + (this._slider1.width / 2);
            const sliderPosY = this._slider1.y;

            this.value1Text.x = sliderPosX + (this.sliderOptions.valueTextOffset?.x ?? 0);
            this.value1Text.y = sliderPosY + (this.sliderOptions.valueTextOffset?.y ?? 0);
        }
    }

    /**
     * Sets width of a Sliders background and fill.
     * If nineSliceSprite is set, then width will be set to nineSliceSprite.
     * If nineSliceSprite is not set, then width will control components width as Container.
     * @param value - Width value.
     */
    override set width(value: number)
    {
        super.width = value;

        this.updateSlider();
    }

    /** Gets width of a Slider. */
    override get width(): number
    {
        return super.width;
    }

    /**
     * Sets height of a Sliders background and fill.
     * If nineSliceSprite is set, then height will be set to nineSliceSprite.
     * If nineSliceSprite is not set, then height will control components height as Container.
     * @param value - Height value.
     */
    override set height(value: number)
    {
        super.height = value;

        this.updateSlider();
    }

    /** Gets height of a Slider. */
    override get height(): number
    {
        return super.height;
    }

    override setSize(value: number | Optional<Size, 'height'>, height?: number): void
    {
        super.setSize(value, height);
        this.updateSlider();
    }
}

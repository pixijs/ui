import { FederatedPointerEvent } from '@pixi/events';
import type { DragObject } from './utils/HelpTypes';
import { BaseSliderOptions, SliderBase } from './SliderBase';
import { Signal } from 'typed-signals';
import { Container } from '@pixi/display';

/**
 * Creates a slider with range selection option
 * @example
 * ```
 * const width = 250;
 * const height = 50;
 *
 * const bg = new Graphics()
 *     .beginFill(0x000000).drawRoundedRect(0, 0, width, height, height/2)
 *     .beginFill(0x808080).drawRoundedRect(5, 5, width-10, height-10, height/2);
 *
 * const fill = new Graphics()
 *     .beginFill(0xFFFFFF).drawRoundedRect(0, 0, width-10, height-10, (height-10)/2);
 *
 * const slider1 = new Graphics()
 *     .beginFill(0xDCDCDC).drawCircle(0, 0, 23)
 *     .beginFill(0x000000).drawCircle(0, 0, 20);
 *
 * const slider2 = new Graphics()
 *     .beginFill(0xDCDCDC).drawCircle(0, 0, 23)
 *     .beginFill(0x000000).drawCircle(0, 0, 20);
 *
 * const slider = new DoubleSlider({
 *     bg,
 *     fill,
 *     slider1,
 *     slider2,
 *     min: 0,
 *     max: 100,
 *     value1: 10,
 *     value2: 90,
 *     valueTextStyle: {
 *         fill: 0xDCDCDC,
 *         fontSize: 14
 *     }
 * });
 *
 * slider.onChange.connect((value1, value2) =>{
 *     console.log(`New slider range ${value1} - ${value2}`);
 * });
 * ```
 */

// TODO: make this fill to be draggable and move border values at the same time
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

        this.value2 = options.value2;
        this.value1 = options.value1;
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

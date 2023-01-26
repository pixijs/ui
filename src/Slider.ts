import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Sprite } from '@pixi/sprite';
import { ITextStyle, Text, TextStyle } from '@pixi/text';
import { Signal } from 'typed-signals';
import { removeHitBox } from './utils/helpers/hitbox';

import type { DragObject } from './utils/HelpTypes';
import { getView } from './utils/helpers/view';
import { ProgressBar } from './ProgressBar';

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
 * Creates a slider
 * @example
 * ```
 * new Slider({
 *     bg: 'slider_bg.png',
 *     fill: 'slider.png',
 *     slider: 'slider.png',
 *     min: 0,
 *     max: 100,
 *     value: 50,
 *     valueTextStyle: {
 *         fill: 0xffffff,
 *         fontSize: 22,
 *     },
 *     showValue: true,
 *     valueTextOffset: {
 *         y: -40,
 *     },
 * });
 *
 * singleSlider.onChange.connect((value) => {
 *     console.log(`Slider changed to ${value}`);
 * });
 * ```
 */
export class Slider extends ProgressBar
{
    protected slider: Container;
    protected valueText?: Text;

    private dragging = 0;
    protected readonly options: SliderOptions;

    private _value = 0;

    /** Minimal value. */
    public min = 0;

    /** Maximal value. */
    public max = 100;

    /** Signal that fires when value have changed. */
    public onChange: Signal<(value: number) => void> = new Signal();

    /** Signal that fires when value is changing. */
    public onUpdate: Signal<(value: number) => void> = new Signal();

    constructor(options: SliderOptions)
    {
        super({
            bg: options.bg,
            fill: options.fill ?? options.bg,
            fillOffset: options.fillOffset,
            progress: options.value
        });

        this.createSlider(options.slider);

        if (options.showValue)
        {
            this.valueText = new Text('', options.valueTextStyle || { fill: 0xffffff });
            this.valueText.anchor.set(0.5);
            this.addChild(this.valueText);
        }

        this.options = options;

        this.min = options.min ?? 0;
        this.max = options.max ?? 100;
        this.value = options.value ?? 0;

        this.activate();
    }

    protected activate()
    {
        this.slider.interactive = true;
        this.bg.interactive = true;

        this.bg
            .on('pointerdown', this.startUpdate, this)
            .on('pointermove', this.update, this)
            .on('pointerup', this.endUpdate, this)
            .on('pointerupoutside', this.endUpdate, this);

        this.slider
            .on('pointerdown', this.startUpdate, this)
            .on('pointermove', this.update, this)
            .on('pointerup', this.endUpdate, this)
            .on('pointerupoutside', this.endUpdate, this);

        removeHitBox(this.fill, this.valueText);
    }

    /** Returns value. */
    get value()
    {
        return this._value;
    }

    /** Sets value. */
    set value(value: number)
    {
        value = value;

        if (value === this._value) return;

        if (value < this.min) value = this.min;
        if (value > this.max) value = this.max;

        this._value = value;
        this.progress = ((this.max - this.min) / 100) * value;

        this.slider.x = ((this.bg.width - this.slider.width) / 100) * this.progress;

        if (this.options.showValue)
        {
            this.valueText.text = value;

            const sliderPosX = this.slider.x + (this.slider.width / 2);
            const sliderPosY = this.slider.y;

            this.valueText.x = sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.valueText.y = sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }

        this.onUpdate?.emit(this.value);
    }

    protected createSlider(sliderData: Container | string)
    {
        const slider = getView(sliderData);

        slider.x = slider.width / 2;

        this.slider = new Container();
        this.slider.addChild(slider);

        if (slider instanceof Sprite)
        {
            slider.anchor.set(0.5);
        }

        this.slider.y = this.bg.height / 2;

        this.addChild(this.slider);
    }

    private startUpdate(event: FederatedPointerEvent)
    {
        this.dragging = 1;
        this.update(event);
    }

    private update(event: FederatedPointerEvent)
    {
        if (!this.dragging) return;

        const obj = event.currentTarget as DragObject;
        const pos = obj.parent.worldTransform.applyInverse(event.global);

        const progress = this.validate((pos.x / this.bg.width) * 100);

        if (progress !== this.progress)
        {
            this.value = ((this.max - this.min) / 100) * progress;
        }
    }

    private endUpdate()
    {
        if (!this.dragging) return;
        this.dragging = 0;
        this.onChange.emit(this.value);
    }
}

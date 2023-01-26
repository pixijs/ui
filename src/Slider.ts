import { Point } from '@pixi/core';
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
 *     onChange(`Slider changed > ${value}`);
 * });
 * ```
 */
export class Slider extends ProgressBar
{
    protected slider: Container;
    protected valueText?: Text;

    private dragging = 0;
    protected readonly options: SliderOptions;

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

        this.options = options;

        if (options.min)
        {
            this.min = options.min;
        }

        if (options.max)
        {
            this.max = options.max;
        }

        this.createSlider(options.slider);

        if (options.showValue)
        {
            this.valueText = new Text('', options.valueTextStyle || { fill: 0xffffff });
            this.valueText.anchor.set(0.5);
            this.addChild(this.valueText);
        }

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
        return this._progress;
    }

    /** Sets value. */
    set value(value: number)
    {
        value = Math.max(this.min, Math.min(this.max, value));

        if (this.progress === Math.round(value)) return;

        this.progress = Math.round(value);

        this.slider.x = ((this.bg.width - this.slider.width) / 100) * this.progress;

        if (this.options.showValue)
        {
            this.valueText.text = this.progress;

            const sliderPosX = this.slider.x + (this.slider.width / 2);
            const sliderPosY = this.slider.y;

            this.valueText.x = sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.valueText.y = sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }

        this.onUpdate?.emit(this.progress);
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

        this.value = (pos.x / this.bg.width) * 100;
    }

    private endUpdate()
    {
        this.dragging = 0;
        this.onChange.emit(this.progress);
    }
}

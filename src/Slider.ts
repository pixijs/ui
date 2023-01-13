import { Point, Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { ITextStyle, Text, TextStyle } from '@pixi/text';
import { Signal } from 'typed-signals';
import { removeHitBox } from './utils/helpers/hitbox';

import type { DragObject } from './utils/HelpTypes';
import { getView } from './utils/helpers/view';

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

// TODO: implement vertical slider
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
export class Slider extends Container
{
    protected readonly bg: Container;
    protected readonly fill?: Container;
    protected readonly fillMask?: Graphics;
    protected readonly slider: Container;
    protected readonly valueText?: Text;

    private dragging = 0;
    protected readonly options: SliderOptions;

    /** TODO */
    public percent = 100;
    /** TODO */
    public value = 0;
    /** TODO */
    public onChange: Signal<(value: number) => void> = new Signal();

    constructor(options: SliderOptions)
    {
        super();

        this.options = options;
        const bg = getView(options.bg);

        this.bg = new Container();
        this.bg.addChild(bg);

        this.addChild(this.bg);

        if (options.fill)
        {
            const fill = getView(options.fill);

            this.fill = new Container();
            this.fill.addChild(fill);

            const offsetX = options.fillOffset?.x ?? 0;
            const offsetY = options.fillOffset?.y ?? 0;

            this.fill.x = ((this.bg.width - this.fill.width) / 2) + offsetX;
            this.fill.y = ((this.bg.height - this.fill.height) / 2) + offsetY;

            this.fillMask = new Graphics();
            this.fill.addChild(this.fillMask);
            this.fill.mask = this.fillMask;

            this.addChild(this.fill);
        }

        const slider = getView(options.slider);

        slider.x = slider.width / 2;

        this.slider = new Container();
        this.slider.addChild(slider);

        if (slider instanceof Sprite)
        {
            slider.anchor.set(0.5);
        }

        this.slider.y = this.bg.height / 2;

        this.addChild(this.slider);

        if (options.showValue)
        {
            this.valueText = new Text(
                '',
                options.valueTextStyle || { fill: 0xffffff },
            );
            this.valueText.anchor.set(0.5);
            this.addChild(this.valueText);
        }

        this.makeScrollable();
        this.validateSettings();
        this.update();
    }

    protected validateSettings()
    {
        const { options } = this;

        if (!options.min)
        {
            options.min = 0;
        }

        if (!options.max)
        {
            options.max = 100;
        }

        if (options.value < options.min)
        {
            options.value = options.min;
        }

        if (options.value > options.max)
        {
            options.value = options.max;
        }

        this.value = options.value ?? options.min ?? 0;
        this.percent = (this.value * 100) / options.max;

        const scale = options.max - options.min;
        const scaledVal = this.value - options.min;

        this.percent = (scaledVal * 100) / scale;
    }

    protected makeScrollable()
    {
        this.interactive = true;
        this.slider.interactive = true;
        this.bg.interactive = true;

        const { onSetByClick, onDragStart, onDragMove, onDragEnd } = this;

        this.slider
            .on('pointerdown', onDragStart, this)
            .on('pointermove', onDragMove, this)
            .on('pointerup', onDragEnd, this)
            .on('pointerupoutside', onDragEnd, this);
        this.bg.on('pointerdown', onSetByClick, this);
        this.on('pointerupoutside', onDragEnd, this);

        removeHitBox(this.fill, this.valueText);
    }

    protected onSetByClick(event: FederatedPointerEvent)
    {
        const obj = event.currentTarget as DragObject;
        let pos = obj.parent.worldTransform.applyInverse(event.global).x - (this.slider.width / 2);

        if (pos < 0)
        {
            pos = 0;
        }

        if (pos < 0)
        {
            pos = 0;
        }

        const maxPos = this.bg.width - this.slider.width;

        if (pos > maxPos)
        {
            pos = maxPos;
        }

        this.percent = Math.round((pos / maxPos) * 100);
        this.value = this.options.min + Math.round(
            ((this.options.max - this.options.min) / 100) * this.percent,
        );

        this.update();

        this.onChange?.emit(this.value);
    }

    private onDragStart(event: FederatedPointerEvent)
    {
        const obj = event.currentTarget as DragObject;

        obj.dragData = event;
        this.dragging = 1;
        obj.dragPointerStart = obj.parent.worldTransform.applyInverse(event.global);
        obj.dragObjStart = new Point();
        obj.dragObjStart.copyFrom(obj.position);
        obj.dragGlobalStart = new Point();
        obj.dragGlobalStart.copyFrom(event.data.global);
    }

    private onDragMove(event: FederatedPointerEvent)
    {
        const obj = event.currentTarget as DragObject;

        if (!this.dragging)
        {
            return;
        }

        const data = obj.dragData; // it can be different pointer!

        if (this.dragging === 1)
        {
            // click or drag?
            if (Math.abs(data.global.x - obj.dragGlobalStart?.x) + Math.abs(data.global.y - obj.dragGlobalStart?.y) >= 3)
            {
                // DRAG
                this.dragging = 2;
            }
        }

        if (this.dragging === 2)
        {
            const dragPointerEnd = obj.parent.worldTransform.applyInverse(data.global);
            let pos = obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x);

            if (pos < 0)
            {
                pos = 0;
            }

            const maxPos = this.bg.width - this.slider.width;

            if (pos > maxPos)
            {
                pos = maxPos;
            }

            this.percent = Math.round((pos / maxPos) * 100);
            this.value = this.options.min + Math.round(
                ((this.options.max - this.options.min) / 100) * this.percent,
            );

            this.update();
        }
    }

    private onDragEnd()
    {
        if (!this.dragging)
        {
            return;
        }

        this.dragging = 0;

        this.onChange?.emit(this.value);
    }

    protected update(pos?: number)
    {
        const position = pos ?? ((this.bg.width - this.slider.width) / 100) * this.percent;

        this.slider.x = position;

        const startPoint = 0;
        const endPoint = (this.bg.width / 100) * this.percent;

        if (this.fillMask)
        {
            this.fillMask
                .clear()
                .lineStyle(0)
                .beginFill(0xffffff)
                .drawRect(
                    startPoint,
                    0,
                    endPoint - startPoint,
                    this.fill.height,
                );
        }

        if (this.options.showValue)
        {
            this.valueText.text = this.value;

            const sliderPosX = this.slider.x + (this.slider.width / 2);
            const sliderPosY = this.slider.y;

            this.valueText.x = sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.valueText.y = sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }

        this.onChange?.emit(this.value);
    }
}

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

export type DoubleSliderOptions = {
    bg: Container | string;
    slider1: Container | string;
    slider2: Container | string;
    fill?: Container | string;
    min?: number;
    max?: number;
    value1?: number;
    value2?: number;
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

// TODO: implement vertical slider
// TODO: make this fill to be draggable and move border values at the same time
export class DoubleSlider extends Container
{
    protected readonly bg: Container;
    protected readonly fill?: Container;
    protected readonly fillMask?: Graphics;

    private readonly slider1: Container;
    private readonly slider2: Container;

    private readonly slider1Text?: Text;
    private readonly slider2Text?: Text;

    private dragging1 = 0;
    private dragging2 = 0;

    /** TODO */
    public percent1 = 0;
    /** TODO */
    public percent2 = 100;
    /** TODO */
    public value1 = 0;
    /** TODO */
    public value2 = 0;

    /** TODO */
    public onChange: Signal<(value1: number, value2: number) => void> = new Signal();

    private readonly options: DoubleSliderOptions;

    constructor(options: DoubleSliderOptions)
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

        const slider1 = getView(options.slider1);

        if (slider1 instanceof Sprite)
        {
            slider1.anchor.set(0.5);
        }

        slider1.x = slider1.width / 2;

        this.slider1 = new Container();
        this.slider1.addChild(slider1);
        this.slider1.y = this.bg.height / 2;
        const slider2 = getView(options.slider2);

        if (slider2 instanceof Sprite)
        {
            slider2.anchor.set(0.5);
        }

        slider2.x = slider2.width / 2;

        this.slider2 = new Container();
        this.slider2.addChild(slider2);
        this.slider2.y = this.bg.height / 2;

        this.addChild(this.slider2, this.slider1);

        if (options.showValue)
        {
            this.slider1Text = new Text(
                '',
                options.valueTextStyle || { fill: 0xffffff },
            );
            this.slider1Text.anchor.set(0.5);
            this.addChild(this.slider1Text);
        }

        if (options.showValue)
        {
            this.slider2Text = new Text(
                '',
                options.valueTextStyle || { fill: 0xffffff },
            );
            this.slider2Text.anchor.set(0.5);
            this.addChild(this.slider2Text);
        }

        this.validateSettings();

        this.makeScrollable();

        this.update();
    }

    private validateSettings()
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

        if (options.value1 < options.min)
        {
            options.value1 = options.min;
        }

        if (options.value2 > options.max)
        {
            options.value2 = options.max;
        }

        this.value1 = options.value1 ?? options.min ?? 0;
        this.percent1 = (this.value1 * 100) / options.max;

        this.value2 = options.value2 ?? options.min ?? 0;
        this.percent2 = (this.value2 * 100) / options.max;

        const scale = options.max - options.min;

        const scaledVal1 = this.value1 - options.min;
        const scaledVal2 = this.value2 - options.min;

        this.percent1 = (scaledVal1 * 100) / scale;
        this.percent2 = (scaledVal2 * 100) / scale;
    }

    private makeScrollable()
    {
        this.interactive = true;
        this.slider1.interactive = true;
        this.slider2.interactive = true;
        this.bg.interactive = true;

        const { onDragStart1, onDragMove1, onDragEnd1, onSetByClick, onDragStart2, onDragMove2, onDragEnd2 } = this;

        this.slider1
            .on('pointerdown', onDragStart1, this)
            .on('pointermove', onDragMove1, this)
            .on('pointerup', onDragEnd1, this)
            .on('pointerupoutside', onDragEnd1, this);

        this.slider2
            .on('pointerdown', onDragStart2, this)
            .on('pointermove', onDragMove2, this)
            .on('pointerup', onDragEnd2, this)
            .on('pointerupoutside', onDragEnd2, this);

        this.bg.on('pointerdown', onSetByClick, this);
        this.on('pointerupoutside', onDragEnd1, this);

        removeHitBox(this.fill, this.slider1Text, this.slider2Text);
    }

    private onSetByClick(event: FederatedPointerEvent)
    {
        const obj = event.currentTarget as DragObject;

        let pos = obj.parent.worldTransform.applyInverse(event.global).x - (this.slider2.width / 2);

        if (pos < 0)
        {
            pos = 0;
        }

        const maxPos = this.bg.width - this.slider2.width;

        if (pos > maxPos)
        {
            pos = maxPos;
        }

        if (pos < this.slider1.x)
        {
            this.setSlider1Val(pos);
        }
        else if (pos > this.slider2.x)
        {
            this.setSlider2Val(pos);
        }
        else
        {
            const distToSlider1 = pos - this.slider1.x;
            const distToSlider2 = this.slider2.x - pos;

            if (distToSlider1 < distToSlider2)
            {
                this.setSlider1Val(pos);
            }
            else
            {
                this.setSlider2Val(pos);
            }
        }

        this.update();

        this.onChange?.emit(this.value1, this.value2);
    }

    private onDragStart1(event: FederatedPointerEvent)
    {
        const obj = event.currentTarget as DragObject;

        obj.dragData = event;
        this.dragging1 = 1;
        obj.dragPointerStart = obj.parent.worldTransform.applyInverse(event.global);
        obj.dragObjStart = new Point();
        obj.dragObjStart.copyFrom(obj.position);
        obj.dragGlobalStart = new Point();
        obj.dragGlobalStart.copyFrom(event.data.global);
    }

    private onDragMove1(event: FederatedPointerEvent)
    {
        const obj = event.currentTarget as DragObject;

        if (!this.dragging1)
        {
            return;
        }

        const data = obj.dragData; // it can be different pointer!

        if (this.dragging1 === 1)
        {
            // click or drag?
            if (Math.abs(data.global.x - obj.dragGlobalStart?.x) + Math.abs(data.global.y - obj.dragGlobalStart?.y) >= 3)
            {
                // DRAG
                this.dragging1 = 2;
            }
        }

        if (this.dragging1 === 2)
        {
            const dragPointerEnd = obj.parent.worldTransform.applyInverse(data.global);

            let pos = obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x);

            if (pos < 0)
            {
                pos = 0;
            }

            if (pos > this.slider2.x)
            {
                pos = this.slider2.x;
            }

            const maxPos = this.bg.width - this.slider1.width;

            if (pos > maxPos)
            {
                pos = maxPos;
            }

            this.setSlider1Val(pos);

            this.update();
        }
    }

    private setSlider1Val(pos: number)
    {
        const maxPos = this.bg.width - this.slider1.width;

        this.percent1 = Math.round((pos / maxPos) * 100);
        this.value1 = this.options.min + Math.round(((this.options.max - this.options.min) / 100) * this.percent1);
    }

    private onDragEnd1()
    {
        if (!this.dragging1)
        {
            return;
        }

        this.dragging1 = 0;

        this.onChange?.emit(this.value1, this.value2);
    }

    private onDragStart2(event: FederatedPointerEvent)
    {
        const obj = event.currentTarget as DragObject;

        obj.dragData = event.data;
        this.dragging2 = 1;
        obj.dragPointerStart = obj.parent.worldTransform.applyInverse(event.global);
        obj.dragObjStart = new Point();
        obj.dragObjStart.copyFrom(obj.position);
        obj.dragGlobalStart = new Point();
        obj.dragGlobalStart.copyFrom(event.data.global);
    }

    private onDragMove2(event: FederatedPointerEvent)
    {
        const obj = event.currentTarget as DragObject;

        if (!this.dragging2)
        {
            return;
        }

        const data = obj.dragData; // it can be different pointer!

        if (this.dragging2 === 1)
        {
            // click or drag?
            if (Math.abs(data.global.x - obj.dragGlobalStart?.x) + Math.abs(data.global.y - obj.dragGlobalStart?.y) >= 3)
            {
                // DRAG
                this.dragging2 = 2;
            }
        }

        if (this.dragging2 === 2)
        {
            const dragPointerEnd = obj.parent.worldTransform.applyInverse(data.global);

            let pos = obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x);

            if (pos < this.slider1.x)
            {
                pos = this.slider1.x;
            }

            const maxPos = this.bg.width - this.slider2.width;

            if (pos > maxPos)
            {
                pos = maxPos;
            }

            this.setSlider2Val(pos);

            this.update();
        }
    }

    private setSlider2Val(pos: number)
    {
        const maxPos = this.bg.width - this.slider2.width;

        this.percent2 = Math.round((pos / maxPos) * 100);
        this.value2 = this.options.min + Math.round(((this.options.max - this.options.min) / 100) * this.percent2);
    }

    private onDragEnd2()
    {
        if (!this.dragging2)
        {
            return;
        }

        this.dragging2 = 0;

        this.onChange?.emit(this.value1, this.value2);
    }

    private update()
    {
        const position1 = ((this.bg.width - this.slider1.width) / 100) * this.percent1;
        const position2 = ((this.bg.width - this.slider2.width) / 100) * this.percent2;

        this.slider1.x = position1;
        this.slider2.x = position2;

        const startPoint = (this.bg.width / 100) * this.percent1;
        const endPoint = (this.bg.width / 100) * this.percent2;

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
            this.slider1Text.text = this.value1;
            this.slider2Text.text = this.value2;

            const slider1PosX = this.slider1.x + (this.slider1.width / 2);
            const slider1PosY = this.slider1.y;

            this.slider1Text.x = slider1PosX + (this.options.valueTextOffset?.x ?? 0);
            this.slider1Text.y = slider1PosY + (this.options.valueTextOffset?.y ?? 0);

            const slider2PosX = this.slider2.x + (this.slider2.width / 2);
            const slider2PosY = this.slider2.y;

            this.slider2Text.x = slider2PosX + (this.options.valueTextOffset?.x ?? 0);
            this.slider2Text.y = slider2PosY + (this.options.valueTextOffset?.y ?? 0);
        }

        this.onChange?.emit(this.value1, this.value2);
    }
}

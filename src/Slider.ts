import type { InteractionEvent, ITextStyle, TextStyle } from 'pixi.js';
import { Container, Graphics, Point, Sprite, Text, Texture } from 'pixi.js';
import { Signal } from 'typed-signals';

import type { DragObject } from './utils';

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
 * const slider = new Graphics()
 *     .beginFill(0xDCDCDC).drawCircle(0, 0, 23)
 *     .beginFill(0x000000).drawCircle(0, 0, 20);
 *
 * const slider = new Slider({
 *     bg,
 *     fill,
 *     slider,
 *     min: 0,
 *     max: 100,
 *     value: 50,
 *     valueTextStyle: {
 *         fill: 0xDCDCDC,
 *         fontSize: 14
 *     }
 * });
 *
 * slider.onChange.connect((value) =>{
 *     console.log(`New slider value ${value}`);
 * });
 * ```
 */
// TODO: implement vertical slider

export class Slider extends Container {
    protected readonly bg: Container;
    protected readonly fill?: Container;
    protected readonly fillMask?: Graphics;
    protected readonly slider: Container;
    protected readonly valueText?: Text;

    private dragging = 0;

    public percent = 100;
    public value = 0;

    public onChange: Signal<(value: number) => void> = new Signal();

    constructor(protected readonly options: SliderOptions) {
        super();

        const bg =
            typeof options.bg === 'string'
                ? new Sprite(Texture.from(options.bg))
                : options.bg;

        this.bg = new Container();
        this.bg.addChild(bg);

        this.addChild(this.bg);

        if (options.fill) {
            const fill =
                typeof options.fill === 'string'
                    ? new Sprite(Texture.from(options.fill))
                    : options.fill;

            this.fill = new Container();
            this.fill.addChild(fill);
            this.fill.x = (this.bg.width - this.fill.width) / 2;
            this.fill.y = (this.bg.height - this.fill.height) / 2;

            this.fillMask = new Graphics();
            this.fill.addChild(this.fillMask);
            this.fill.mask = this.fillMask;

            this.addChild(this.fill);
        }

        const slider =
            typeof options.slider === 'string'
                ? new Sprite(Texture.from(options.slider))
                : options.slider;

        slider.x = slider.width / 2;

        this.slider = new Container();
        this.slider.addChild(slider);

        if (slider instanceof Sprite) {
            slider.anchor.set(0.5);
        }

        this.slider.y = this.bg.height / 2;

        this.addChild(this.slider);

        if (options.showValue) {
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

    protected validateSettings() {
        const { options } = this;

        if (!options.min) {
            options.min = 0;
        }

        if (!options.max) {
            options.max = 100;
        }

        if (options.value < options.min) {
            options.value = options.min;
        }

        if (options.value > options.max) {
            options.value = options.max;
        }

        this.value = options.value ?? options.min ?? 0;
        this.percent = (this.value * 100) / options.max;

        const scale = options.max - options.min;
        const scaledVal = this.value - options.min;

        this.percent = (scaledVal * 100) / scale;
    }

    protected makeScrollable() {
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
    }

    protected onSetByClick(event: InteractionEvent) {
        const obj = event.currentTarget as DragObject;

        const data = event.data;

        let pos = data.getLocalPosition(obj.parent).x - this.slider.width / 2;

        if (pos < 0) {
            pos = 0;
        }

        if (pos < 0) {
            pos = 0;
        }

        const maxPos = this.bg.width - this.slider.width;

        if (pos > maxPos) {
            pos = maxPos;
        }

        this.percent = Math.round((pos / maxPos) * 100);
        this.value =
            this.options.min +
            Math.round(
                ((this.options.max - this.options.min) / 100) * this.percent,
            );

        this.update();

        this.onChange?.emit(this.value);
    }

    private onDragStart(event: InteractionEvent) {
        const obj = event.currentTarget as DragObject;

        obj.dragData = event.data;
        this.dragging = 1;
        obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
        obj.dragObjStart = new Point();
        obj.dragObjStart.copyFrom(obj.position);
        obj.dragGlobalStart = new Point();
        obj.dragGlobalStart.copyFrom(event.data.global);
    }

    private onDragMove(event: InteractionEvent) {
        const obj = event.currentTarget as DragObject;

        if (!this.dragging) {
            return;
        }

        const data = obj.dragData; // it can be different pointer!

        if (this.dragging === 1) {
            // click or drag?
            if (
                Math.abs(data.global.x - obj.dragGlobalStart?.x) +
                    Math.abs(data.global.y - obj.dragGlobalStart?.y) >=
                3
            ) {
                // DRAG
                this.dragging = 2;
            }
        }

        if (this.dragging === 2) {
            const dragPointerEnd = data.getLocalPosition(obj.parent);

            let pos =
                obj.dragObjStart.x +
                (dragPointerEnd.x - obj.dragPointerStart.x);

            if (pos < 0) {
                pos = 0;
            }

            const maxPos = this.bg.width - this.slider.width;

            if (pos > maxPos) {
                pos = maxPos;
            }

            this.percent = Math.round((pos / maxPos) * 100);
            this.value =
                this.options.min +
                Math.round(
                    ((this.options.max - this.options.min) / 100) *
                        this.percent,
                );

            this.update();
        }
    }

    private onDragEnd() {
        if (!this.dragging) {
            return;
        }

        this.dragging = 0;

        this.onChange?.emit(this.value);
    }

    protected update(pos?: number) {
        const position =
            pos ?? ((this.bg.width - this.slider.width) / 100) * this.percent;

        this.slider.x = position;

        const startPoint = 0;
        const endPoint = (this.bg.width / 100) * this.percent;

        if (this.fillMask) {
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

        if (this.options.showValue) {
            this.valueText.text = this.value;

            const sliderPosX = this.slider.x + this.slider.width / 2;
            const sliderPosY = this.slider.y;

            this.valueText.x =
                sliderPosX + (this.options.valueTextOffset?.x ?? 0);
            this.valueText.y =
                sliderPosY + (this.options.valueTextOffset?.y ?? 0);
        }

        this.onChange?.emit(this.value);
    }
}

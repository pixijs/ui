import { gsap } from 'gsap';
import type { InteractionEvent } from 'pixi.js';
import { Container, Graphics, Point, Sprite, Texture } from 'pixi.js';

import type { LayoutType } from './Layout';
import { Layout } from './Layout';
import type { DragObject } from './utils';

export type ScrollBoxOptions = {
    type?: LayoutType;
    background?: number | string;
    width?: number;
    height?: number;
    radius?: number;
    elementsMargin?: number;
    items?: Container[];
    padding?: number;
    disableDynamicRendering?: boolean;
    vertPadding?: number;
    horPadding?: number;
};

/**
 * ScrollBox for arranging and scrolling pixi containers withing some area with scrolling
 *
 * @example
 * ```
 * new ScrollBox({
 *     background: 0XFFFFFF,
 *     type: 'vertical',
 *     elementsMargin: 10,
 *     width: 200,
 *     height: 300,
 *     radius: 10,
 *     padding: 10,
 *     items: [
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *     ],
 * });
 * ```
 */

const DEFAULT_DURATION = 0.2;

// TODO: make scroll inertion
// TODO: fix snap on mouse scroll with high padding value

export class ScrollBox extends Container {
    private background: Graphics | Sprite;
    private borderMask: Graphics;
    private lastWidth: number;
    private lastHeight: number;
    private __width = 0;
    private __height = 0;

    private isInteractive = false;

    private readonly onMouseScrollBinded: (event: any) => void;

    private readonly layout: Layout;

    private isDragging: number;

    private readonly freeSlot = {
        x: 0,
        y: 0,
    };

    private childrenInteractiveStorage: boolean[] = [];

    constructor(private readonly options: ScrollBoxOptions) {
        super();

        this.addBackground();

        this.__width = options.width | this.background.width;
        this.__height = options.height | this.background.height;

        this.layout = new Layout({
            type: options.type,
            elementsMargin: options.elementsMargin,
            vertPadding: options.vertPadding,
            horPadding: options.horPadding,
        });

        this.layout.x = this.options.padding;
        this.layout.y = this.options.padding;

        super.addChild(this.layout);

        if (options.items?.length) {
            options.items.forEach((item) => {
                this.addItem(item);
            });
        }

        if (this.hasBounds) {
            this.addMask();
            this.makeScrollable();
        }

        this.onMouseScrollBinded = this.onMouseScroll.bind(this);

        this.update();
    }

    private get hasBounds(): boolean {
        return !!this.__width || !!this.__height;
    }

    protected override onChildrenChange() {
        // do nothing we manage this in addItem
    }

    public addItem<T extends Container[]>(...items: T): T[0] {
        if (items.length > 1) {
            items.forEach((item) => this.addItem(item));
        } else {
            const child = items[0];

            if (!child.width || !child.height) {
                console.error('ScrollBox item should have size');
            }

            child.x = this.freeSlot.x;
            child.y = this.freeSlot.y;

            this.layout.addChild(child);

            if (!this.options.disableDynamicRendering) {
                child.renderable = this.isItemVisible(child);
            }

            const elementsMargin = this.options?.elementsMargin ?? 0;

            switch (this.options.type) {
                case 'horizontal':
                    this.freeSlot.x += elementsMargin + child.width;
                    break;

                default:
                    this.freeSlot.y += elementsMargin + child.height;
                    break;
            }
        }

        this.update();

        return items[0];
    }

    public async removeItem(itemID: number) {
        const child = this.layout.children[itemID];

        if (!child) {
            return;
        }

        this.renderAllItems();

        this.layout.removeChild(child);

        await this.snap();

        this.update();
    }

    public isItemVisible(item: Container): boolean {
        const isVertical =
            this.options.type === 'vertical' || !this.options.type;
        let isVisible = false;
        const layout = this.layout;

        if (isVertical) {
            const posY = item.y + layout.y;

            if (
                posY + item.height + this.options.padding >= 0 &&
                posY - this.options.padding - this.options.elementsMargin <=
                    this.options.height
            ) {
                isVisible = true;
            }
        } else {
            const posX = item.x + layout.x;

            if (posX + item.width >= 0 && posX <= this.options.width) {
                isVisible = true;
            }
        }

        return isVisible;
    }

    public get items(): Container[] | [] {
        return this.layout?.children ?? [];
    }

    private addBackground() {
        this.background =
            typeof this.options.background === 'string'
                ? new Sprite(Texture.from(this.options.background))
                : new Graphics();

        this.addChild(this.background);

        this.update();
    }

    private addMask() {
        this.borderMask = new Graphics();
        super.addChild(this.borderMask);
        this.mask = this.borderMask;
        this.update();
    }

    private makeScrollable() {
        const { onDragStart, onDragMove, onDragEnd, onMouseHover, onMouseOut } =
            this;

        this.layout
            .on('pointerdown', onDragStart, this)
            .on('pointermove', onDragMove, this)
            .on('pointerup', onDragEnd, this)
            .on('pointerupoutside', onDragEnd, this);

        this.on('pointerupoutside', onDragEnd, this)
            .on('mouseover', onMouseHover, this)
            .on('mouseout', onMouseOut, this);
    }

    private setInteractive(interactive: boolean) {
        this.isInteractive = interactive;
        this.interactive = interactive;
        this.layout.interactive = interactive;
    }

    private onDragStart(event: InteractionEvent) {
        this.renderAllItems();

        const obj = event.currentTarget as DragObject;

        obj.dragData = event.data;
        this.isDragging = 1;
        obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
        obj.dragObjStart = new Point();
        obj.dragObjStart.copyFrom(obj.position);
        obj.dragGlobalStart = new Point();
        obj.dragGlobalStart.copyFrom(event.data.global);
    }

    private onDragMove(event: InteractionEvent) {
        const obj = event.currentTarget as DragObject;

        if (!this.isDragging) {
            return;
        }

        const data = obj.dragData; // it can be different pointer!

        if (this.isDragging === 1) {
            // click or drag?
            if (
                Math.abs(data.global.x - obj.dragGlobalStart?.x) +
                    Math.abs(data.global.y - obj.dragGlobalStart?.y) >=
                3
            ) {
                // DRAG
                this.isDragging = 2;
            }
        }

        if (this.isDragging === 2) {
            this.items.forEach((item, itemID) => {
                if (!this.childrenInteractiveStorage[itemID]) {
                    this.childrenInteractiveStorage[itemID] =
                        item.interactive === true;
                }
                item.interactive = false;
            });

            const dragPointerEnd = data.getLocalPosition(obj.parent);

            // DRAG
            if (this.options.type === 'horizontal') {
                obj.x =
                    obj.dragObjStart.x +
                    (dragPointerEnd.x - obj.dragPointerStart.x);
            } else {
                obj.y =
                    obj.dragObjStart.y +
                    (dragPointerEnd.y - obj.dragPointerStart.y);
            }
        }
    }

    private onDragEnd() {
        if (!this.isDragging) {
            return;
        }

        this.items.forEach((item, itemID) => {
            if (this.childrenInteractiveStorage[itemID]) {
                item.interactive = this.childrenInteractiveStorage[itemID];
                delete this.childrenInteractiveStorage[itemID];
            }
        });

        this.isDragging = 0;

        this.snap();
    }

    private snap(): Promise<void> {
        return new Promise((resolve) => {
            if (this.options.type === 'horizontal') {
                if (
                    this.layout.x < 0 &&
                    this.layout.x + this.layoutWidth < this.__width
                ) {
                    gsap.to(this.layout, {
                        duration: DEFAULT_DURATION,
                        x:
                            this.__width -
                            this.layoutWidth +
                            (this.options.padding ?? 0),
                        onComplete: () => {
                            this.stopRenderHiddenItems();
                            resolve();
                        },
                    });
                } else if (this.layout.x > 0) {
                    gsap.to(this.layout, {
                        duration: DEFAULT_DURATION,
                        x: this.options.padding ?? 0,
                        onComplete: () => {
                            this.stopRenderHiddenItems();
                            resolve();
                        },
                    });
                } else {
                    this.stopRenderHiddenItems();
                    resolve();
                }
            } else {
                const layoutHeight = this.layoutHeight;

                if (
                    this.layout.y < 0 &&
                    this.layout.y + layoutHeight < this.__height
                ) {
                    gsap.to(this.layout, {
                        duration: DEFAULT_DURATION,
                        y: this.__height - layoutHeight,
                        onComplete: () => {
                            this.stopRenderHiddenItems();
                            resolve();
                        },
                    });
                } else if (this.layout.y > 0) {
                    gsap.to(this.layout, {
                        duration: DEFAULT_DURATION,
                        y: this.options.padding ?? 0,
                        onComplete: () => {
                            this.stopRenderHiddenItems();
                            resolve();
                        },
                    });
                } else {
                    this.stopRenderHiddenItems();
                    resolve();
                }
            }
        });
    }

    private get layoutHeight(): number {
        return this.layout.height + (this.options.vertPadding ?? 0) * 2;
    }

    private get layoutWidth(): number {
        return this.layout.width + (this.options.horPadding ?? 0) * 2;
    }

    public update(): void {
        if (
            this.borderMask &&
            (this.lastWidth !== this.layoutWidth ||
                this.lastHeight !== this.layoutHeight)
        ) {
            this.renderAllItems();

            const of = this.options.padding | 0;

            if (!this.options.width) {
                this.__width += this.layoutWidth;
            }

            if (!this.options.height) {
                this.__height += this.layoutHeight;
            }

            this.borderMask
                .clear()
                .lineStyle(0)
                .beginFill(0xffffff)
                .drawRoundedRect(
                    0,
                    0,
                    this.__width + of + of,
                    this.__height + of,
                    this.options.radius | 0,
                );

            if (
                this.background instanceof Graphics &&
                typeof this.options.background === 'number'
            ) {
                this.background
                    .clear()
                    .lineStyle(0)
                    .beginFill(this.options.background)
                    .drawRect(0, 0, this.__width + of + of, this.__height + of);
            }

            if (this.options.type === 'horizontal') {
                this.setInteractive(this.layoutWidth > this.__width);
            } else {
                this.setInteractive(this.layoutHeight > this.__height);
            }

            this.lastWidth = this.layoutWidth;
            this.lastHeight = this.layoutHeight;

            this.stopRenderHiddenItems();
        }

        // this.x = this.__width / 2
        // this.y = this.__height / 2;
    }

    private onMouseHover() {
        document.addEventListener('mousewheel', this.onMouseScrollBinded);
        document.addEventListener('DOMMouseScroll', this.onMouseScrollBinded);
    }

    private onMouseOut() {
        document.removeEventListener('mousewheel', this.onMouseScrollBinded);
        document.removeEventListener(
            'DOMMouseScroll',
            this.onMouseScrollBinded,
        );
    }

    private onMouseScroll(event: any): void {
        this.renderAllItems();

        if (
            this.options.type === 'horizontal' &&
            (typeof event.deltaX !== 'undefined' ||
                typeof event.deltaY !== 'undefined')
        ) {
            this.layout.x -= event.deltaX;
            this.layout.x -= event.deltaY;
        } else if (typeof event.deltaY !== 'undefined') {
            this.layout.y -= event.deltaY;
        }

        if (
            this.layout.y < 0 &&
            this.layout.y + this.layoutHeight + (this.options.padding ?? 0) <
                this.__height
        ) {
            this.layout.y = this.__height - this.layoutHeight;
        }

        if (this.layout.y > 0) {
            this.layout.y = this.options.padding ?? 0;
        }

        this.snap();
    }

    public async scrollDown(duration = DEFAULT_DURATION) {
        if (!this.isInteractive) {
            await this.scrollTop();
        } else {
            await this.scrollTo(this.layout.children.length - 1, duration);
        }
    }

    public async scrollTop(duration = DEFAULT_DURATION): Promise<void> {
        return new Promise((resolve) => {
            this.renderAllItems();

            gsap.to(this.layout, {
                duration,
                x: 0,
                y: 0,
                onComplete: () => {
                    this.snap();
                    resolve();
                },
            });
        });
    }

    public renderAllItems() {
        if (this.options.disableDynamicRendering) {
            return;
        }

        this.items.forEach((child) => {
            child.renderable = true;
        });
    }

    public stopRenderHiddenItems() {
        if (this.options.disableDynamicRendering) {
            return;
        }

        this.items.forEach((child) => {
            child.renderable = this.isItemVisible(child);
        });
    }

    public scrollTo(
        elementID: number,
        duration = DEFAULT_DURATION,
    ): Promise<void> {
        return new Promise((resolve) => {
            if (!this.isInteractive) {
                resolve();
            }

            const target = this.layout.children[elementID];

            if (!target) {
                resolve();
            }

            const x =
                this.options.type === 'horizontal'
                    ? this.__width - target.x - target.width
                    : 0;
            const y =
                !this.options.type || this.options.type === 'vertical'
                    ? this.__height - target.y - target.height
                    : 0;

            this.renderAllItems();

            gsap.to(this.layout, {
                duration,
                x,
                y,
                onComplete: async () => {
                    await this.snap();
                    resolve();
                },
            });
        });
    }

    public override get height(): number {
        return this.__height;
    }

    public override get width(): number {
        return this.__width;
    }
}

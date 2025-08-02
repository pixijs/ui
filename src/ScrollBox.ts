import {
    ColorSource,
    Container,
    DestroyOptions,
    EventMode,
    FederatedPointerEvent,
    Graphics,
    isMobile,
    Optional,
    Point,
    PointData,
    Size,
    Ticker,
} from 'pixi.js';
import { Signal } from 'typed-signals';
import { List } from './List';
import { Trackpad } from './utils/trackpad/Trackpad';

import type { ListOptions, ListType } from './List';

export type ScrollBoxOptions = {
    width?: number;
    height?: number;
    background?: ColorSource;
    type?: ListType;
    radius?: number;
    disableDynamicRendering?: boolean;
    disableEasing?: boolean;
    dragTrashHold?: number;
    globalScroll?: boolean;
    shiftScroll?: boolean;
    proximityRange?: number;
    proximityDebounce?: number;
    disableProximityCheck?: boolean;
} & Omit<ListOptions, 'children'>;

type ProximityEventData = {
    item: Container;
    index: number;
    inRange: boolean;
};

/**
 * Scrollable view, for arranging lists of Pixi container-based elements.
 *
 * Items, that are out of the visible area, are not rendered by default.
 * This behavior can be changed by setting 'disableDynamicRendering' option to true.
 * @example
 * new ScrollBox({
 *     background: 0XFFFFFF,
 *     width: 200,
 *     height: 300,
 *     items: [
 *         new Graphics().drawRect(0, 0, 200, 50).fill(0x000000),
 *         new Graphics().drawRect(0, 0, 200, 50).fill(0x000000),
 *         new Graphics().drawRect(0, 0, 200, 50).fill(0x000000),
 *         new Graphics().drawRect(0, 0, 200, 50).fill(0x000000),
 *         new Graphics().drawRect(0, 0, 200, 50).fill(0x000000),
 *         new Graphics().drawRect(0, 0, 200, 50).fill(0x000000),
 *         new Graphics().drawRect(0, 0, 200, 50).fill(0x000000),
 *     ],
 * });
 */

export class ScrollBox extends Container
{
    protected background: Graphics | undefined;
    protected borderMask: Graphics | undefined;
    protected lastWidth: number = 0;
    protected lastHeight: number = 0;
    protected _width = 0;
    protected _height = 0;
    protected _dimensionChanged = false;

    /**
     * Arrange container, that holds all inner elements.
     * Use this control inner arrange container size in case of bidirectional scroll type.
     */
    list: List | undefined;

    protected _trackpad: Trackpad | undefined;
    protected isDragging = 0;
    protected interactiveStorage: {
        item: Container;
        eventMode: EventMode;
    }[] = [];
    protected visibleItems: Container[] = [];
    protected pressedChild: Container | undefined;
    protected ticker = Ticker.shared;
    protected options: ScrollBoxOptions = {};
    protected stopRenderHiddenItemsTimeout: NodeJS.Timeout | undefined;
    protected onMouseScrollBinding = this.onMouseScroll.bind(this);
    protected dragStarTouchPoint: Point | undefined;
    protected isOver = false;

    protected proximityRange: number = 0;
    protected proximityStatusCache: boolean[] = [];
    protected lastScrollX: number | undefined;
    protected lastScrollY: number | undefined;
    protected proximityCheckFrameCounter = 0;
    public onProximityChange = new Signal<(data: ProximityEventData) => void>();
    public onScroll: Signal<(value: number | PointData) => void> = new Signal();

    /**
     * @param options
     * @param {number} options.background - background color of the ScrollBox.
     * @param {number} options.width - width of the ScrollBox.
     * @param {number} options.height - height of the ScrollBox.
     * @param {number} options.radius - radius of the ScrollBox and its masks corners.
     * @param {number} options.elementsMargin - margin between elements.
     * @param {number} options.vertPadding - vertical padding of the ScrollBox.
     * @param {number} options.horPadding - horizontal padding of the ScrollBox.
     * @param {number} options.padding - padding of the ScrollBox (same horizontal and vertical).
     * @param {boolean} options.disableDynamicRendering - disables dynamic rendering of the ScrollBox,
     * so even elements the are not visible will be rendered. Be careful with this options as it can impact performance.
     * @param {boolean} [options.globalScroll=true] - if true, the ScrollBox will scroll even if the mouse is not over it.
     * @param {boolean} [options.shiftScroll=false] - if true, the ScrollBox will only scroll horizontally if the shift key
     * is pressed, and the type is set to 'horizontal'.
     */
    constructor(options?: ScrollBoxOptions)
    {
        super();

        if (options)
        {
            this.init(options);
        }

        this.ticker.add(this.update, this);
    }

    /**
     * Initiates ScrollBox.
     * @param options
     * @param {number} options.background - background color of the ScrollBox.
     * @param {number} options.width - width of the ScrollBox.
     * @param {number} options.height - height of the ScrollBox.
     * @param {number} options.radius - radius of the ScrollBox and its masks corners.
     * @param {number} options.elementsMargin - margin between elements.
     * @param {number} options.vertPadding - vertical padding of the ScrollBox.
     * @param {number} options.horPadding - horizontal padding of the ScrollBox.
     * @param {number} options.padding - padding of the ScrollBox (same horizontal and vertical).
     * @param {boolean} options.disableDynamicRendering - disables dynamic rendering of the ScrollBox,
     * so even elements the are not visible will be rendered. Be careful with this options as it can impact performance.
     * @param {boolean} [options.globalScroll=true] - if true, the ScrollBox will scroll even if the mouse is not over it.
     * @param {boolean} [options.shiftScroll=false] - if true, the ScrollBox will only scroll horizontally if the shift key
     */
    init(options: ScrollBoxOptions)
    {
        this.options = options;
        this.setBackground(options.background);

        this._width = options.width ?? this.background?.width ?? 100;
        this._height = options.height ?? this.background?.height ?? 100;

        this.proximityRange = options.proximityRange ?? 0;

        if (!this.list)
        {
            this.list = new List();

            super.addChild(this.list);
        }

        this.list?.init({
            type: options.type,
            elementsMargin: options.elementsMargin,
            padding: options.padding,
            vertPadding: options.vertPadding,
            horPadding: options.horPadding,
            topPadding: options.topPadding,
            bottomPadding: options.bottomPadding,
            leftPadding: options.leftPadding,
            rightPadding: options.rightPadding,
            // For bidirectional type (including when options.type is null/undefined since List defaults to bidirectional),
            // use ScrollBox width as maxWidth to enable multi-column layout. Other types get 0 to disable width constraints.
            maxWidth: options.maxWidth || (options.type !== 'horizontal' && options.type !== 'vertical' ? this._width : 0),
        });

        if (options.items)
        {
            this.addItems(options.items);
        }

        if (this.hasBounds)
        {
            this.addMask();
            this.makeScrollable();
        }

        if (this._trackpad)
        {
            this._trackpad.xAxis.value = 0;
            this._trackpad.yAxis.value = 0;
        }

        this.options.globalScroll = options.globalScroll ?? true;
        this.options.shiftScroll = options.shiftScroll ?? false;
        this.resize();
    }

    protected get hasBounds(): boolean
    {
        return !!this._width || !!this._height;
    }

    /**
     *  Adds array of items to a scrollable list.
     * @param {Container[]} items - items to add.
     */
    addItems(items: Container[])
    {
        if (!items?.length) return;

        items.forEach((item) => this.addItem(item));
    }

    /** Remove all items from a scrollable list. */
    removeItems()
    {
        this.proximityStatusCache.length = 0;
        this.list?.removeChildren();
    }

    /**
     * Adds one or more items to a scrollable list.
     * @param {Container} items - one or more items to add.
     */
    addItem<T extends Container[]>(...items: T): T[0]
    {
        if (items.length > 1)
        {
            items.forEach((item) => this.addItem(item));
        }
        else
        {
            const child = items[0];

            if (!child.width || !child.height)
            {
                console.error('ScrollBox item should have size');
            }

            child.eventMode = 'static';

            this.list?.addChild(child);
            this.proximityStatusCache.push(false);

            if (!this.options.disableDynamicRendering)
            {
                child.renderable = this.isItemVisible(child);
            }
        }

        this.resize();

        return items[0];
    }

    /**
     * Removes an item from a scrollable list.
     * @param {number} itemID - id of the item to remove.
     */
    removeItem(itemID: number)
    {
        this.list?.removeItem(itemID);
        this.proximityStatusCache.splice(itemID, 1);
        this.resize();
    }

    /**
     * Checks if the item is visible or scrolled out of the visible part of the view.* Adds an item to a scrollable list.
     * @param {Container} item - item to check.
     * @param padding - proximity padding to consider the item visible.
     */
    isItemVisible(item: Container, padding = 0): boolean
    {
        let isVisible = false;
        const list = this.list;

        if (!list) return false;

        if (this.isVertical || this.isBidirectional)
        {
            const posY = item.y + list.y;

            if (posY + item.height >= -padding && posY <= this.options.height + padding)
            {
                isVisible = true;
            }
        }

        if (this.isHorizontal || this.isBidirectional)
        {
            const posX = item.x + list.x;

            if (posX + item.width >= -padding && posX <= this.options.width + padding)
            {
                isVisible = true;
            }
        }

        return isVisible;
    }

    /**
     * Returns all inner items in a list.
     * @returns {Array<Container> | Array} - list of items.
     */
    get items(): Container[] | []
    {
        return this.list?.children ?? [];
    }

    /**
     * Set ScrollBox background.
     * @param {number | string} background - background color or texture.
     */
    setBackground(background?: ColorSource)
    {
        if (this.background)
        {
            this.removeChild(this.background);
        }

        this.options.background = background;

        this.background = new Graphics();

        this.addChildAt(this.background, 0);

        this.resize();
    }

    protected addMask()
    {
        if (!this.borderMask)
        {
            this.borderMask = new Graphics();
            super.addChild(this.borderMask);
            this.mask = this.borderMask;
        }

        this.resize();
    }

    protected makeScrollable()
    {
        if (!this._trackpad)
        {
            this._trackpad = new Trackpad({
                disableEasing: this.options.disableEasing,
            });
        }

        this.on('pointerdown', (e: FederatedPointerEvent) =>
        {
            this.renderAllItems();

            this.isDragging = 1;
            this.dragStarTouchPoint = this.worldTransform.applyInverse(e.global);

            if (this._trackpad)
            {
                this._trackpad.pointerDown(this.dragStarTouchPoint);
            }

            const listTouchPoint = this.list?.worldTransform.applyInverse(e.global);

            this.visibleItems.forEach((item) =>
            {
                if (
                    item.x < listTouchPoint.x
                    && item.x + item.width > listTouchPoint.x
                    && item.y < listTouchPoint.y
                    && item.y + item.height > listTouchPoint.y
                )
                {
                    this.pressedChild = item;
                }
            });
        });

        this.on('pointerup', () =>
        {
            this.isDragging = 0;
            this._trackpad?.pointerUp();
            this.restoreItemsInteractivity();

            this.pressedChild = undefined;

            this.stopRenderHiddenItems();
        });

        this.on('pointerover', () =>
        {
            this.isOver = true;
        });

        this.on('pointerout', () =>
        {
            this.isOver = false;
        });

        this.on('pointerupoutside', () =>
        {
            this.isDragging = 0;
            this._trackpad?.pointerUp();
            this.restoreItemsInteractivity();

            this.pressedChild = undefined;

            this.stopRenderHiddenItems();
        });

        this.on('globalpointermove', (e: FederatedPointerEvent) =>
        {
            if (!this.isDragging) return;

            const touchPoint = this.worldTransform.applyInverse(e.global);

            if (this.dragStarTouchPoint)
            {
                const dragTrashHold = this.options.dragTrashHold ?? 10;

                if (this.isHorizontal || this.isBidirectional)
                {
                    const xDist = touchPoint.x - this.dragStarTouchPoint.x;

                    if (Math.abs(xDist) > dragTrashHold)
                    {
                        this.isDragging = 2;
                    }
                }

                if (this.isVertical || this.isBidirectional)
                {
                    const yDist = touchPoint.y - this.dragStarTouchPoint.y;

                    if (Math.abs(yDist) > dragTrashHold)
                    {
                        this.isDragging = 2;
                    }
                }
            }

            if (this.dragStarTouchPoint && this.isDragging !== 2) return;

            this._trackpad?.pointerMove(touchPoint);

            if (this.pressedChild)
            {
                this.revertClick(this.pressedChild);
                this.pressedChild = undefined;
            }

            if (this.isBidirectional)
            {
                this.onScroll?.emit({ x: this.scrollX, y: this.scrollY });
            }
            else
            {
                this.onScroll?.emit(this.isVertical ? this.scrollY : this.scrollX);
            }
        });

        document.addEventListener('wheel', this.onMouseScrollBinding, true);
    }

    protected setInteractive(interactive: boolean)
    {
        this.eventMode = interactive ? 'static' : 'auto';
    }

    protected get listHeight(): number
    {
        return (this.list?.height ?? 0) + (this.list?.topPadding ?? 0) + (this.list?.bottomPadding ?? 0);
    }

    protected get listWidth(): number
    {
        return (this.list?.width ?? 0) + (this.list?.leftPadding ?? 0) + (this.list?.rightPadding ?? 0);
    }

    /**
     * Controls item positions and visibility.
     * @param force
     */
    resize(force = false): void
    {
        if (!this.hasBounds) return;

        this.renderAllItems();

        if (
            this.borderMask
            && (force
                || this._dimensionChanged
                || this.lastWidth !== this.listWidth
                || this.lastHeight !== this.listHeight)
        )
        {
            if (!this.options.width)
            {
                this._width += this.listWidth;
            }

            if (!this.options.height)
            {
                this._height += this.listHeight;
            }

            this.borderMask
                .clear()
                .roundRect(0, 0, this._width, this._height, this.options.radius | 0)
                .fill(0xff00ff)
                .stroke(0x0);
            this.borderMask.eventMode = 'none';

            const color = this.options.background;

            this.background
                .clear()
                .roundRect(0, 0, this._width, this._height, this.options.radius | 0)
                .fill({
                    color: color ?? 0x000000,
                    alpha: color ? 1 : 0.0000001, // if color is not set, set alpha to 0 to be able to drag by click on bg
                });

            if (this.isBidirectional)
            {
                this.setInteractive(this.listWidth > this._width || this.listHeight > this._height);
            }
            else if (this.isHorizontal)
            {
                this.setInteractive(this.listWidth > this._width);
            }
            else
            {
                this.setInteractive(this.listHeight > this._height);
            }

            this.lastWidth = this.listWidth;
            this.lastHeight = this.listHeight;
        }

        if (this._trackpad && this.borderMask)
        {
            const maxWidth
                = this.borderMask.width
                - (this.list?.width ?? 0)
                - (this.list?.leftPadding ?? 0)
                - (this.list?.rightPadding ?? 0);

            const maxHeight
                = this.borderMask.height
                - (this.list?.height ?? 0)
                - (this.list?.topPadding ?? 0)
                - (this.list?.bottomPadding ?? 0);

            if (this.isBidirectional)
            {
                this._trackpad.yAxis.max = -Math.abs(maxHeight);
                this._trackpad.xAxis.max = -Math.abs(maxWidth);
            }
            else if (this.isVertical)
            {
                this._trackpad.yAxis.max = -Math.abs(maxHeight);
            }
            else if (this.isHorizontal)
            {
                this._trackpad.xAxis.max = -Math.abs(maxWidth);
            }
        }

        if (this._dimensionChanged)
        {
            this.list?.arrangeChildren();
            // Since the scrolling adjustment can happen due to the resize,
            // we shouldn't update the visible items immediately.
            this.stopRenderHiddenItems();

            this._dimensionChanged = false;
        }
        else
        {
            if (force) this.list?.arrangeChildren();
            this.updateVisibleItems();
        }

        this.lastScrollX = undefined;
        this.lastScrollY = undefined;
    }

    protected onMouseScroll(event: WheelEvent): void
    {
        if (!this.isOver && !this.options.globalScroll) return;

        this.renderAllItems();

        const shiftScroll = !!this.options.shiftScroll;
        const scrollOnX = shiftScroll
            ? typeof event.deltaX !== 'undefined' || typeof event.deltaY !== 'undefined'
            : typeof event.deltaX !== 'undefined';
        const scrollOnY = typeof event.deltaY !== 'undefined';

        if ((this.isHorizontal || this.isBidirectional) && scrollOnX)
        {
            const delta = shiftScroll || this.isBidirectional ? event.deltaX : event.deltaY;
            const targetPos = (this.list?.x ?? 0) - delta;

            if (this.listWidth < this._width)
            {
                this._trackpad.xAxis.value = 0;
            }
            else
            {
                const min = this._width - this.listWidth;
                const max = 0;

                this._trackpad.xAxis.value = Math.min(max, Math.max(min, targetPos));
            }
        }

        if ((this.isVertical || this.isBidirectional) && scrollOnY)
        {
            const targetPos = (this.list?.y ?? 0) - event.deltaY;

            if (this.listHeight < this._height)
            {
                this._trackpad.yAxis.value = 0;
            }
            else
            {
                const min = this._height - this.listHeight;
                const max = 0;

                this._trackpad.yAxis.value = Math.min(max, Math.max(min, targetPos));
            }
        }

        if (this.isBidirectional && (scrollOnX || scrollOnY))
        {
            this.onScroll?.emit({ x: this._trackpad.xAxis.value, y: this._trackpad.yAxis.value });
        }
        else if (this.isHorizontal && scrollOnX)
        {
            this.onScroll?.emit(this._trackpad.xAxis.value);
        }
        else if (this.isVertical && scrollOnY)
        {
            this.onScroll?.emit(this._trackpad.yAxis.value);
        }
        this.stopRenderHiddenItems();
    }

    /** Makes it scroll down to the last element. */
    scrollBottom()
    {
        if (!this.interactive)
        {
            this.scrollTop();
        }
        else
        {
            this.scrollTo((this.list?.children.length ?? 1) - 1);
        }
    }

    /** Makes it scroll up to the first element. */
    scrollTop()
    {
        this.renderAllItems();

        if (this._trackpad)
        {
            this._trackpad.xAxis.value = 0;
            this._trackpad.yAxis.value = 0;
        }

        this.stopRenderHiddenItems();
    }

    protected renderAllItems()
    {
        clearTimeout(this.stopRenderHiddenItemsTimeout);
        this.stopRenderHiddenItemsTimeout = undefined;

        if (this.options.disableDynamicRendering)
        {
            return;
        }

        this.items.forEach((child) =>
        {
            child.renderable = true;
        });
    }

    protected stopRenderHiddenItems()
    {
        if (this.options.disableDynamicRendering)
        {
            return;
        }

        if (this.stopRenderHiddenItemsTimeout)
        {
            clearTimeout(this.stopRenderHiddenItemsTimeout);
            this.stopRenderHiddenItemsTimeout = undefined;
        }

        this.stopRenderHiddenItemsTimeout = setTimeout(() => this.updateVisibleItems(), 2000);
    }

    protected updateVisibleItems()
    {
        this.visibleItems.length = 0;

        this.items.forEach((child) =>
        {
            child.renderable = this.isItemVisible(child);
            this.visibleItems.push(child);
        });
    }

    /**
     * Scrolls to the element with the given ID.
     * @param elementID
     */
    scrollTo(elementID: number)
    {
        if (!this.interactive)
        {
            return;
        }

        const target = this.list?.children[elementID];

        if (!target)
        {
            return;
        }

        this.renderAllItems();

        this._trackpad.xAxis.value
            = this.isHorizontal || this.isBidirectional
                ? this._width - target.x - target.width - this.list.rightPadding
                : 0;

        this._trackpad.yAxis.value
            = this.isVertical || this.isBidirectional
                ? this._height - target.y - target.height - this.list.bottomPadding
                : 0;

        this.stopRenderHiddenItems();
    }

    /**
     * Scrolls to the given position.
     * @param position - x and y position object.
     * @param position.x - x position.
     * @param position.y - y position.
     */
    scrollToPosition({ x, y }: Partial<PointData>)
    {
        if (x === undefined && y === undefined) return;
        this.renderAllItems();
        if (x !== undefined) this.scrollX = -x;
        if (y !== undefined) this.scrollY = -y;
        this.stopRenderHiddenItems();
    }

    /** Gets component height. */
    override get height(): number
    {
        return this._height;
    }

    override set height(value: number)
    {
        this._height = value;
        this._dimensionChanged = true;
        this.resize();
        this.scrollTop();
    }

    /** Gets component width. */
    override get width(): number
    {
        return this._width;
    }

    override set width(value: number)
    {
        this._width = value;
        this._dimensionChanged = true;
        this.resize();
        this.scrollTop();
    }

    override setSize(value: number | Optional<Size, 'height'>, height?: number): void
    {
        if (typeof value === 'object')
        {
            height = value.height ?? value.width;
            value = value.width;
        }
        else
        {
            height = height ?? value;
        }

        this._width = value;
        this._height = height;
        this._dimensionChanged = true;
        this.resize();
        this.scrollTop();
    }

    override getSize(out?: Size): Size
    {
        out = out || { width: 0, height: 0 };
        out.width = this._width;
        out.height = this._height;

        return out;
    }

    /** Gets the current raw scroll position on the x-axis (Negated Value). */
    get scrollX(): number
    {
        return this._trackpad.xAxis.value;
    }

    /** Sets the current raw scroll position on the x-axis (Negated Value). */
    set scrollX(value: number)
    {
        this._trackpad.xAxis.value = value;
    }

    /** Gets the current raw scroll position on the y-axis (Negated Value). */
    get scrollY(): number
    {
        return this._trackpad.yAxis.value;
    }

    /** Sets the current raw scroll position on the y-axis (Negated Value). */
    set scrollY(value: number)
    {
        this._trackpad.yAxis.value = value;
    }

    protected update()
    {
        if (!this.list) return;

        this._trackpad.update();

        if (this.isHorizontal || this.isBidirectional)
        {
            if (this.list.x !== this._trackpad.x)
            {
                this.list.x = this._trackpad.x;
            }
        }

        if (this.isVertical || this.isBidirectional)
        {
            if (this.list.y !== this._trackpad.y)
            {
                this.list.y = this._trackpad.y;
            }
        }

        if (
            !this.options.disableProximityCheck
            && (this._trackpad.x !== this.lastScrollX || this._trackpad.y !== this.lastScrollY)
        )
        {
            this.proximityCheckFrameCounter++;
            if (this.proximityCheckFrameCounter >= (this.options.proximityDebounce ?? 10))
            {
                this.items.forEach((item, index) =>
                {
                    const inRange = this.isItemVisible(item, this.proximityRange);
                    const wasInRange = this.proximityStatusCache[index];

                    if (inRange !== wasInRange)
                    {
                        this.proximityStatusCache[index] = inRange;
                        this.onProximityChange.emit({ item, index, inRange });
                    }
                });
                this.lastScrollX = this._trackpad.x;
                this.lastScrollY = this._trackpad.y;
                this.proximityCheckFrameCounter = 0;
            }
        }
    }

    /**
     * Destroys the component.
     * @param {boolean | DestroyOptions} [options] - Options parameter.
     * A boolean will act as if all options have been set to that value
     */
    override destroy(options?: DestroyOptions | boolean)
    {
        this.ticker.remove(this.update, this);

        document.removeEventListener('wheel', this.onMouseScrollBinding, true);

        this.background.destroy();
        this.list.destroy();

        super.destroy(options);
    }

    protected restoreItemsInteractivity()
    {
        this.interactiveStorage.forEach((element) =>
        {
            element.item.eventMode = element.eventMode;
        });

        this.interactiveStorage.length = 0;
    }

    protected revertClick(item: Container)
    {
        if (item.eventMode !== 'auto')
        {
            isMobile.any ? item.emit('pointerupoutside', null) : item.emit('mouseupoutside', null);

            this.interactiveStorage.push({
                item,
                eventMode: item.eventMode,
            });

            item.eventMode = 'auto';
        }

        // need to disable click for all children too
        if (item instanceof Container && item.children)
        {
            item.children.forEach((child) => this.revertClick(child));
        }
    }

    get scrollHeight(): number
    {
        return this.list.height;
    }

    get scrollWidth(): number
    {
        return this.list.width;
    }

    protected get isVertical(): boolean
    {
        const type = this.options.type ?? 'vertical';

        return type === 'vertical';
    }

    protected get isHorizontal(): boolean
    {
        return this.options.type === 'horizontal';
    }

    protected get isBidirectional(): boolean
    {
        return this.options.type === 'bidirectional';
    }
}

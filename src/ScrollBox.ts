import {
    ColorSource,
    Container,
    DestroyOptions,
    EventMode,
    FederatedPointerEvent,
    Graphics,
    isMobile,
    Point,
    Ticker,
} from 'pixi.js';
import { List } from './List';
import { Trackpad } from './utils/trackpad/Trackpad';

import type { ListOptions, ListType } from './List';

export type ScrollBoxOptions = {
    width: number;
    height: number;
    background?: ColorSource;
    type?: ListType;
    radius?: number;
    disableDynamicRendering?: boolean;
    disableEasing?: boolean;
    dragTrashHold?: number;
    globalScroll?: boolean;
    shiftScroll?: boolean;
} & Omit<ListOptions, 'children'>;

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
    protected background: Graphics;
    protected borderMask: Graphics;
    protected lastWidth: number;
    protected lastHeight: number;
    protected __width = 0;
    protected __height = 0;
    protected _dimensionChanged = false;

    protected list: List;

    protected _trackpad: Trackpad;
    protected isDragging = 0;
    protected interactiveStorage: {
        item: Container;
        eventMode: EventMode;
    }[] = [];
    protected visibleItems: Container[] = [];
    protected pressedChild: Container;
    protected ticker = Ticker.shared;
    protected options: ScrollBoxOptions;
    protected stopRenderHiddenItemsTimeout!: NodeJS.Timeout;
    protected onMouseScrollBinding = this.onMouseScroll.bind(this);
    protected dragStarTouchPoint: Point;
    protected isOver = false;

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

        this.__width = options.width | this.background.width;
        this.__height = options.height | this.background.height;

        if (!this.list)
        {
            this.list = new List();

            super.addChild(this.list);
        }

        this.list.init({
            type: options.type,
            elementsMargin: options.elementsMargin,
            padding: options.padding,
            vertPadding: options.vertPadding,
            horPadding: options.horPadding,
            topPadding: options.topPadding,
            bottomPadding: options.bottomPadding,
            leftPadding: options.leftPadding,
            rightPadding: options.rightPadding,
        });

        this.addItems(options.items);

        if (this.hasBounds)
        {
            this.addMask();
            this.makeScrollable();
        }

        this._trackpad.xAxis.value = 0;
        this._trackpad.yAxis.value = 0;

        this.options.globalScroll = options.globalScroll ?? true;
        this.options.shiftScroll = options.shiftScroll ?? false;
        this.resize();
    }

    protected get hasBounds(): boolean
    {
        return !!this.__width || !!this.__height;
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
        this.list.removeChildren();
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

            this.list.addChild(child);

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
        this.list.removeItem(itemID);

        this.resize();
    }

    /**
     * Checks if the item is visible or scrolled out of the visible part of the view.* Adds an item to a scrollable list.
     * @param {Container} item - item to check.
     */
    isItemVisible(item: Container): boolean
    {
        const isVertical = this.options.type === 'vertical' || !this.options.type;
        let isVisible = false;
        const list = this.list;

        if (isVertical)
        {
            const posY = item.y + list.y;

            if (
                posY + item.height + this.list.bottomPadding >= 0
                && posY - this.list.topPadding <= this.options.height
            )
            {
                isVisible = true;
            }
        }
        else
        {
            const posX = item.x + list.x;

            if (posX + item.width >= 0 && posX <= this.options.width)
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

            this._trackpad.pointerDown(this.dragStarTouchPoint);

            const listTouchPoint = this.list.worldTransform.applyInverse(e.global);

            this.visibleItems.forEach((item) =>
            {
                if (item.x < listTouchPoint.x
                    && item.x + item.width > listTouchPoint.x
                    && item.y < listTouchPoint.y
                    && item.y + item.height > listTouchPoint.y)
                {
                    this.pressedChild = item;
                }
            });
        });

        this.on('pointerup', () =>
        {
            this.isDragging = 0;
            this._trackpad.pointerUp();
            this.restoreItemsInteractivity();

            this.pressedChild = null;

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
            this._trackpad.pointerUp();
            this.restoreItemsInteractivity();

            this.pressedChild = null;

            this.stopRenderHiddenItems();
        });

        this.on('globalpointermove', (e: FederatedPointerEvent) =>
        {
            if (!this.isDragging) return;

            const touchPoint = this.worldTransform.applyInverse(e.global);

            if (this.dragStarTouchPoint)
            {
                const dragTrashHold = this.options.dragTrashHold ?? 10;

                if (this.options.type === 'horizontal')
                {
                    const xDist = touchPoint.x - this.dragStarTouchPoint.x;

                    if (Math.abs(xDist) > dragTrashHold)
                    {
                        this.isDragging = 2;
                    }
                }
                else
                {
                    const yDist = touchPoint.y - this.dragStarTouchPoint.y;

                    if (Math.abs(yDist) > dragTrashHold)
                    {
                        this.isDragging = 2;
                    }
                }
            }

            if (this.dragStarTouchPoint && this.isDragging !== 2) return;

            this._trackpad.pointerMove(touchPoint);

            if (this.pressedChild)
            {
                this.revertClick(this.pressedChild);

                this.pressedChild = null;
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
        return this.list.height + this.list.topPadding + this.list.bottomPadding;
    }

    protected get listWidth(): number
    {
        return this.list.width + this.list.leftPadding + this.list.rightPadding;
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
                this.__width += this.listWidth;
            }

            if (!this.options.height)
            {
                this.__height += this.listHeight;
            }

            this.borderMask
                .clear()
                .roundRect(
                    0,
                    0,
                    this.__width,
                    this.__height,
                    this.options.radius | 0,
                )
                .fill(0xff00ff)
                .stroke(0x0);
            this.borderMask.eventMode = 'none';

            const color = this.options.background;

            this.background
                .clear()
                .roundRect(
                    0,
                    0,
                    this.__width,
                    this.__height,
                    this.options.radius | 0,
                )
                .fill({
                    color: color ?? 0x000000,
                    alpha: color ? 1 : 0.0000001, // if color is not set, set alpha to 0 to be able to drag by click on bg
                });

            if (this.options.type === 'horizontal')
            {
                this.setInteractive(this.listWidth > this.__width);
            }
            else
            {
                this.setInteractive(this.listHeight > this.__height);
            }

            this.lastWidth = this.listWidth;
            this.lastHeight = this.listHeight;
        }

        if (this._trackpad)
        {
            const maxWidth
                = this.borderMask.width
                - this.list.width
                - this.list.leftPadding
                - this.list.rightPadding;

            const maxHeight
                = this.borderMask.height
                - this.list.height
                - this.list.topPadding
                - this.list.bottomPadding;

            if (this.options.type === 'vertical')
            {
                this._trackpad.yAxis.max = -Math.abs(maxHeight);
            }
            else if (this.options.type === 'horizontal')
            {
                this._trackpad.xAxis.max = -Math.abs(maxWidth);
            }
            else
            {
                this._trackpad.yAxis.max = -Math.abs(maxHeight);
                this._trackpad.xAxis.max = -Math.abs(maxWidth);
            }
        }

        if (this._dimensionChanged)
        {
            this.list.arrangeChildren();

            // Since the scrolling adjustment can happen due to the resize,
            // we shouldn't update the visible items immediately.
            this.stopRenderHiddenItems();

            this._dimensionChanged = false;
        }
        else this.updateVisibleItems();
    }

    protected onMouseScroll(event: WheelEvent): void
    {
        if (!this.isOver && !this.options.globalScroll) return;

        this.renderAllItems();

        const scrollOnX = this.options.shiftScroll
            ? (typeof event.deltaX !== 'undefined' || typeof event.deltaY !== 'undefined')
            : typeof event.deltaX !== 'undefined';

        if (this.options.type === 'horizontal' && scrollOnX)
        {
            const delta = this.options.shiftScroll ? event.deltaX : event.deltaY;
            const targetPos = this.list.x - delta;

            if (this.listWidth < this.__width)
            {
                this._trackpad.xAxis.value = 0;
            }
            else
            {
                const min = this.__width - this.listWidth;
                const max = 0;

                this._trackpad.xAxis.value = Math.min(max, Math.max(min, targetPos));
            }
        }
        else if (typeof event.deltaY !== 'undefined')
        {
            const targetPos = this.list.y - event.deltaY;

            if (this.listHeight < this.__height)
            {
                this._trackpad.yAxis.value = 0;
            }
            else
            {
                const min = this.__height - this.listHeight;
                const max = 0;

                this._trackpad.yAxis.value = Math.min(max, Math.max(min, targetPos));
            }
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
            this.scrollTo(this.list.children.length - 1);
        }
    }

    /** Makes it scroll up to the first element. */
    scrollTop()
    {
        this.renderAllItems();

        this._trackpad.xAxis.value = 0;
        this._trackpad.yAxis.value = 0;

        this.stopRenderHiddenItems();
    }

    protected renderAllItems()
    {
        clearTimeout(this.stopRenderHiddenItemsTimeout);
        this.stopRenderHiddenItemsTimeout = null;

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
            this.stopRenderHiddenItemsTimeout = null;
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

        const target = this.list.children[elementID];

        if (!target)
        {
            return;
        }

        this.renderAllItems();

        this._trackpad.xAxis.value
            = this.options.type === 'horizontal'
                ? this.__width
                  - target.x
                  - target.width
                  - this.list.rightPadding
                : 0;

        this._trackpad.yAxis.value
            = !this.options.type || this.options.type === 'vertical'
                ? this.__height
                  - target.y
                  - target.height
                  - this.list.bottomPadding
                : 0;

        this.stopRenderHiddenItems();
    }

    /** Gets component height. */
    override get height(): number
    {
        return this.__height;
    }

    override set height(value: number)
    {
        this.__height = value;
        this._dimensionChanged = true;
        this.resize();
        this.scrollTop();
    }

    /** Gets component width. */
    override get width(): number
    {
        return this.__width;
    }

    override set width(value: number)
    {
        this.__width = value;
        this._dimensionChanged = true;
        this.resize();
        this.scrollTop();
    }

    protected update()
    {
        if (!this.list) return;

        this._trackpad.update();

        const type = this.options.type === 'horizontal' ? 'x' : 'y';

        if (this.list[type] !== this._trackpad[type])
        {
            this.list[type] = this._trackpad[type];
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
            isMobile.any
                ? item.emit('pointerupoutside', null)
                : item.emit('mouseupoutside', null);

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
}

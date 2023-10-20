import { ColorSource, Ticker, utils } from '@pixi/core';
import { Container, DisplayObject, IDestroyOptions } from '@pixi/display';
import { EventMode, FederatedPointerEvent } from '@pixi/events';
import { Graphics } from '@pixi/graphics';
import type { ListType } from './List';
import { List } from './List';
import { Trackpad } from './utils/trackpad/Trackpad';

export type ScrollBoxOptions = {
    width: number;
    height: number;
    background?: ColorSource;
    type?: ListType;
    radius?: number;
    elementsMargin?: number;
    items?: Container[];
    disableDynamicRendering?: boolean;
    vertPadding?: number;
    horPadding?: number;
    padding?: number;
    disableEasing?: boolean;
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
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
 *         new Graphics().beginFill(0x000000).drawRect(0, 0, 200, 50),
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

    protected list: List;

    protected _trackpad: Trackpad;
    protected isDragging = 0;
    protected interactiveStorage: {
        item: DisplayObject;
        eventMode: EventMode;
    }[] = [];
    protected visibleItems: Container[] = [];
    protected pressedChild: Container;
    protected ticker = Ticker.shared;
    protected options: ScrollBoxOptions;
    protected stopRenderHiddenItemsTimeout!: NodeJS.Timeout;
    protected onMouseScrollBinding = this.onMouseScroll.bind(this);

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
     */
    init(options: ScrollBoxOptions)
    {
        this.options = options;
        this.setBackground(options.background);

        this.__width = options.width | this.background.width;
        this.__height = options.height | this.background.height;

        options.vertPadding = options.vertPadding ?? options.padding ?? 0;
        options.horPadding = options.horPadding ?? options.padding ?? 0;

        if (!this.list)
        {
            this.list = new List();

            super.addChild(this.list);
        }

        this.list.init({
            type: options.type,
            elementsMargin: options.elementsMargin,
            vertPadding: options.vertPadding,
            horPadding: options.horPadding,
        });

        this.addItems(options.items);

        if (this.hasBounds)
        {
            this.addMask();
            this.makeScrollable();
        }

        this._trackpad.xAxis.value = 0;
        this._trackpad.yAxis.value = 0;

        this.resize();
    }

    protected get hasBounds(): boolean
    {
        return !!this.__width || !!this.__height;
    }

    protected override onChildrenChange()
    {
        // do nothing we manage this in addItem
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
        const child = this.list.children[itemID];

        if (!child)
        {
            return;
        }

        this.list.removeChild(child);

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
                posY + item.height + this.options.vertPadding >= 0
                && posY - this.options.vertPadding <= this.options.height
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
            const touchPoint = this.worldTransform.applyInverse(e.global);

            this._trackpad.pointerDown(touchPoint);

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
            const touchPoint = this.worldTransform.applyInverse(e.global);

            this._trackpad.pointerMove(touchPoint);

            if (!this.isDragging) return;

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
        return this.list.height + (this.options.vertPadding * 2);
    }

    protected get listWidth(): number
    {
        return this.list.width + (this.options.horPadding * 2);
    }

    /** Controls item positions and visibility. */
    resize(): void
    {
        if (!this.hasBounds) return;

        this.renderAllItems();

        if (
            this.borderMask
            && (this.lastWidth !== this.listWidth
                || this.lastHeight !== this.listHeight)
        )
        {
            const verPadding = this.options.vertPadding;
            const horPadding = this.options.horPadding;

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
                .lineStyle(0)
                .beginFill(0xffffff)
                .drawRoundedRect(
                    0,
                    0,
                    this.__width,
                    this.__height,
                    this.options.radius | 0,
                );
            this.borderMask.eventMode = 'none';

            this.background.clear().lineStyle(0);

            const color = this.options.background;

            this.background.beginFill(
                color ?? 0x000000,
                color ? 1 : 0.0000001, // if color is not set, set alpha to 0 to be able to drag by click on bg
            );

            this.background.drawRoundedRect(
                0,
                0,
                this.__width + horPadding,
                this.__height + verPadding,
                this.options.radius | 0,
            );

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
                - (this.options.horPadding * 2);

            const maxHeight
                = this.borderMask.height
                - this.list.height
                - (this.options.vertPadding * 2);

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

        this.updateVisibleItems();
    }

    protected onMouseScroll(event: WheelEvent): void
    {
        this.renderAllItems();

        if (
            this.options.type === 'horizontal'
            && (typeof event.deltaX !== 'undefined'
                || typeof event.deltaY !== 'undefined')
        )
        {
            const targetPos = event.deltaY
                ? this.list.x - event.deltaY
                : this.list.x - event.deltaX;

            if (
                targetPos < 0
                && targetPos + this.listWidth + this.options.horPadding
                    < this.__width
            )
            {
                this._trackpad.xAxis.value = this.__width - this.listWidth;
            }
            else if (targetPos > this.options.horPadding)
            {
                this._trackpad.xAxis.value = 0;
            }
            else
            {
                this._trackpad.xAxis.value = targetPos;
            }
        }
        else if (typeof event.deltaY !== 'undefined')
        {
            const targetPos = this.list.y - event.deltaY;

            if (
                targetPos < 0
                && targetPos + this.listHeight + this.options.vertPadding
                    < this.__height
            )
            {
                this._trackpad.yAxis.value = this.__height - this.listHeight;
            }
            else if (targetPos > this.options.vertPadding)
            {
                this._trackpad.yAxis.value = 0;
            }
            else
            {
                this._trackpad.yAxis.value = targetPos;
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
                  - this.options.horPadding
                : 0;

        this._trackpad.yAxis.value
            = !this.options.type || this.options.type === 'vertical'
                ? this.__height
                  - target.y
                  - target.height
                  - this.options.vertPadding
                : 0;

        this.stopRenderHiddenItems();
    }

    /** Gets component height. */
    override get height(): number
    {
        return this.__height;
    }

    /** Gets component width. */
    override get width(): number
    {
        return this.__width;
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
     * @param {boolean | IDestroyOptions} [options] - Options parameter.
     * A boolean will act as if all options have been set to that value
     */
    override destroy(options?: IDestroyOptions | boolean)
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

    protected revertClick(item: DisplayObject)
    {
        if (item.eventMode !== 'auto')
        {
            utils.isMobile.any
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

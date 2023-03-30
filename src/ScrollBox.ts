import { Ticker } from '@pixi/core';
import { Container, DisplayObject } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import type { ListType } from './List';
import { List } from './List';
import ScrollSpring from './utils/trackpad/ScrollSpring';
import { Trackpad } from './utils/trackpad/Trackpad';

export type ScrollBoxOptions = {
    type?: ListType;
    background?: number | string;
    width?: number;
    height?: number;
    radius?: number;
    elementsMargin?: number;
    items?: Container[];
    disableDynamicRendering?: boolean;
    vertPadding?: number;
    horPadding?: number;
    padding?: number;
};

/**
 * Scrollable view, for arranging lists of Pixi container-based elements.
 *
 * Items, that are out of the visible area, are not rendered.
 * @example
 * new ScrollBox({
 *     background: 0XFFFFFF,
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
    private background: Graphics | Sprite;
    private borderMask: Graphics;
    private lastWidth: number;
    private lastHeight: number;
    private __width = 0;
    private __height = 0;

    private readonly onMouseScrollBinded: (event: any) => void;

    private list: List;

    private readonly freeSlot = {
        x: 0,
        y: 0,
    };

    private _trackpad: Trackpad;
    private isDragging = 0;
    private interactiveStorage: Map<number, DisplayObject> = new Map();
    private ticker = Ticker.shared;
    private options: ScrollBoxOptions;

    constructor(options?: ScrollBoxOptions)
    {
        super();

        if (options)
        {
            this.init(options);
        }

        const spring = new ScrollSpring();

        this._trackpad = new Trackpad({
            constrain: true,
            yEase: spring,
        });

        this.ticker.add(this.update, this);

        this.onMouseScrollBinded = this.onMouseScroll.bind(this);
    }

    /**
     * Initiates ScrollBox.
     * @param options
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

    private get hasBounds(): boolean
    {
        return !!this.__width || !!this.__height;
    }

    protected override onChildrenChange()
    {
        // do nothing we manage this in addItem
    }

    /**
     * Add an items to a scrollable list.
     * @param {...any} items
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
     * Adds an item to a scrollable list.
     * @param {...any} items
     */
    public addItem<T extends Container[]>(...items: T): T[0]
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

            child.x = this.freeSlot.x;
            child.y = this.freeSlot.y;

            this.list.addChild(child);

            if (!this.options.disableDynamicRendering)
            {
                child.renderable = this.isItemVisible(child);
            }

            const elementsMargin = this.options?.elementsMargin ?? 0;

            switch (this.options.type)
            {
                case 'horizontal':
                    this.freeSlot.x += elementsMargin + child.width;
                    break;

                default:
                    this.freeSlot.y += elementsMargin + child.height;
                    break;
            }
        }

        this.resize();

        return items[0];
    }

    /**
     * Removes an item from a scrollable list.
     * @param itemID
     */
    public removeItem(itemID: number)
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
     * @param item
     */
    public isItemVisible(item: Container): boolean
    {
        const isVertical = this.options.type === 'vertical' || !this.options.type;
        let isVisible = false;
        const list = this.list;

        if (isVertical)
        {
            const posY = item.y + list.y;

            if (
                posY + item.height + this.options.vertPadding >= 0
                && posY - this.options.vertPadding - this.options.elementsMargin <= this.options.height
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

    /** Returns all inner items in a list. */
    public get items(): Container[] | []
    {
        return this.list?.children ?? [];
    }

    /**
     * Set ScrollBox background.
     * @param {number | string} background - background color or texture.
     */
    setBackground(background?: number | string)
    {
        if (this.background)
        {
            this.removeChild(this.background);
            if (this.background instanceof Sprite)
            {
                this.background.destroy();
            }
        }

        this.options.background = background;

        this.background = (background !== undefined && typeof background === 'string')
            ? Sprite.from(background)
            : new Graphics();

        this.addChildAt(this.background, 0);

        this.resize();
    }

    private addMask()
    {
        if (!this.borderMask)
        {
            this.borderMask = new Graphics();
            super.addChild(this.borderMask);
            this.mask = this.borderMask;
        }

        this.resize();
    }

    private makeScrollable()
    {
        this.on('pointerdown', (e: FederatedPointerEvent) =>
        {
            this.isDragging = 1;
            this._trackpad.pointerDown(e.global);
        });

        this.on('pointerup', () =>
        {
            this.isDragging = 0;
            this._trackpad.pointerUp();
            this.restoreInteractivity();
        });

        this.on('pointerupoutside', () =>
        {
            this.isDragging = 0;
            this._trackpad.pointerUp();
            this.restoreInteractivity();
        });

        this.on('globalpointermove', (e: FederatedPointerEvent) =>
        {
            this._trackpad.pointerMove(e.global);

            if (!this.isDragging) return;

            if (this.interactiveStorage.size === 0)
            {
                this.disableInteractivity(this.items);
            }
        });

        const { onMouseHover, onMouseOut } = this;

        this.on('mouseover', onMouseHover, this).on('mouseout', onMouseOut, this);
    }

    // prevent interactivity on all children
    private disableInteractivity(items: DisplayObject[])
    {
        items.forEach((item, id) =>
        {
            this.emitPointerOpOutside(item);

            if (item.interactive)
            {
                this.interactiveStorage.set(id, item);
                item.eventMode = 'auto';
                item.interactiveChildren = false;
            }
        });
    }

    private emitPointerOpOutside(item: DisplayObject)
    {
        if (item.eventMode !== 'auto')
        {
            item.emit('pointerupoutside', null);
        }

        if (item instanceof Container && item.children)
        {
            item.children.forEach((child) => this.emitPointerOpOutside(child));
        }
    }

    // restore interactivity on all children that had it
    private restoreInteractivity()
    {
        this.interactiveStorage.forEach((item, itemID) =>
        {
            item.eventMode = 'static';
            item.interactiveChildren = false;
            this.interactiveStorage.delete(itemID);
        });
    }

    private setInteractive(interactive: boolean)
    {
        this.eventMode = interactive ? 'static' : 'auto';
    }

    private get listHeight(): number
    {
        return this.list.height + (this.options.vertPadding * 2);
    }

    private get listWidth(): number
    {
        return this.list.width + (this.options.horPadding * 2);
    }

    /** Controls item positions and visibility. */
    public resize(): void
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

            if (this.background instanceof Graphics)
            {
                this.background.clear().lineStyle(0);

                const color = this.options.background;

                this.background.beginFill(
                    color ?? 0x000000,
                    color ? 1 : 0.0000001, // if color is not set, set alpha to 0 to be able to drag by click on bg
                );

                this.background.drawRect(
                    0,
                    0,
                    this.__width + horPadding,
                    this.__height + verPadding,
                );
            }

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

        this.stopRenderHiddenItems();
    }

    private onMouseHover()
    {
        this.renderAllItems();

        document.addEventListener('mousewheel', this.onMouseScrollBinded);
        document.addEventListener('DOMMouseScroll', this.onMouseScrollBinded);
    }

    private onMouseOut()
    {
        this.stopRenderHiddenItems();

        document.removeEventListener('mousewheel', this.onMouseScrollBinded);
        document.removeEventListener(
            'DOMMouseScroll',
            this.onMouseScrollBinded,
        );
    }

    private onMouseScroll(event: any): void
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
    public scrollBottom()
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
    public scrollTop()
    {
        this._trackpad.xAxis.value = 0;
        this._trackpad.yAxis.value = 0;
    }

    private renderAllItems()
    {
        if (this.options.disableDynamicRendering)
        {
            return;
        }

        this.items.forEach((child) =>
        {
            child.renderable = true;
        });
    }

    private stopRenderHiddenItems()
    {
        if (this.options.disableDynamicRendering)
        {
            return;
        }

        this.items.forEach((child) =>
        {
            child.renderable = this.isItemVisible(child);
        });
    }

    /**
     * Scrolls to the element with the given ID.
     * @param elementID
     */
    public scrollTo(elementID: number)
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
    }

    /** Gets component height. */
    public override get height(): number
    {
        return this.__height;
    }

    /** Gets component width. */
    public override get width(): number
    {
        return this.__width;
    }

    private update()
    {
        if (!this.list) return;

        this._trackpad.update();

        if (this.options.type === 'horizontal')
        {
            if (this.list.x !== this._trackpad.x)
            {
                this.renderAllItems();
                this.list.x = this._trackpad.x;
            }
            else
            {
                this.stopRenderHiddenItems();
            }
        }
        else
        if (this.list.y !== this._trackpad.y)
        {
            this.renderAllItems();
            this.list.y = this._trackpad.y;
        }
        else
        {
            this.stopRenderHiddenItems();
        }
    }
}

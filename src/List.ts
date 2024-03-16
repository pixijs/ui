import { Container } from '@pixi/display';

export type ListType = 'horizontal' | 'vertical';

export type ListOptions = {
    elementsMargin?: number;
    children?: Container[];
    padding?: number;
    vertPadding?: number;
    horPadding?: number;
    topPadding?: number;
    bottomPadding?: number;
    leftPadding?: number;
    rightPadding?: number;
    items?: Container[];
};

/**
 * Container-based component for arranging Pixi containers one after another based on their sizes.
 *
 * Type option is used to set the direction of the arrangement.
 *
 * If type is not specified, it will be acting like a bidirectional, items will be arranged to fit horizontally,
 * after there is no space left, new line will be started, so items will be arranged like `inline-block` in css.
 *
 * It is used inside elements with repeatable content, like {@link Select} or {@link ScrollBox}.
 * @example
 * const list = new List({
 *    children: [
        new Graphics().beginFill(0x000000).drawRect(0, 0, 50, 50),
        new Graphics().beginFill(0xFFFFFF).drawRect(0, 0, 50, 50),
 *    ],
 * });
 *
 * list.addChild(new Graphics().beginFill(0x000000).drawRect(0, 0, 50, 50));
 */
export class List extends Container
{
    protected options?: { type?: ListType } & ListOptions;

    /** Container, that holds all inner elements. */
    view: Container;

    /** Arrange direction. */
    protected _type: ListType;

    /** Returns all arranged elements. */
    override readonly children: Container[] = [];

    constructor(options?: { type?: ListType } & ListOptions)
    {
        super();

        if (options)
        {
            this.init(options);
        }

        options?.items?.forEach((item) => this.addChild(item));

        this.on('added', () => this.arrangeChildren());
        this.on('childAdded', () => this.arrangeChildren());
    }

    /**
     * Initiates list component.
     * @param options
     */
    init(options?: { type?: ListType } & ListOptions)
    {
        this.options = options;

        if (options?.type)
        {
            this.type = options.type;
        }

        if (options?.children)
        {
            options.children.forEach((child) => this.addChild(child));
        }
    }

    /**
     * Set items arrange direction.
     * @param type - Arrange direction.
     */
    set type(type: ListType)
    {
        this._type = type;
        this.arrangeChildren();
    }

    /**
     * Get items arrange direction.
     * @returns Arrange direction.
     */
    get type(): ListType
    {
        return this._type;
    }

    /**
     * Set element margin.
     * @param margin - Margin between elements.
     */
    set elementsMargin(margin: number)
    {
        if (!this.options) throw new Error('List has not been initiated!');
        this.options.elementsMargin = margin;
        this.arrangeChildren();
    }

    /**
     * Get element margin.
     * @returns Margin between elements.
     */
    get elementsMargin(): number
    {
        return this.options?.elementsMargin ?? 0;
    }

    /**
     * Set padding, overriding all padding options.
     * @param padding - Padding surrounding list elements and its border.
     */
    set padding(padding: number)
    {
        if (!this.options) throw new Error('List has not been initiated!');
        this.options.padding = padding;
        this.options.vertPadding = padding;
        this.options.horPadding = padding;
        this.options.leftPadding = padding;
        this.options.rightPadding = padding;
        this.options.topPadding = padding;
        this.options.bottomPadding = padding;
        this.arrangeChildren();
    }

    /**
     * Get padding.
     * @returns Padding surrounding list elements and its border.
     */
    get padding(): number
    {
        return this.options?.padding ?? 0;
    }

    /**
     * Set vertical padding, overriding all top and bottom padding options.
     * @param padding - Vertical padding between list border and its elements.
     */
    set vertPadding(padding: number)
    {
        if (!this.options) throw new Error('List has not been initiated!');
        this.options.vertPadding = padding;
        this.options.topPadding = padding;
        this.options.bottomPadding = padding;
        this.arrangeChildren();
    }

    /**
     * Get vertical padding.
     * @returns Vertical padding between list border and its elements.
     */
    get vertPadding(): number
    {
        return this.options?.vertPadding ?? this.padding ?? 0;
    }

    /**
     * Set horizontal padding, overriding all left and right padding options.
     * @param padding - Horizontal padding between list border and its elements.
     */
    set horPadding(padding: number)
    {
        if (!this.options) throw new Error('List has not been initiated!');
        this.options.horPadding = padding;
        this.options.leftPadding = padding;
        this.options.rightPadding = padding;
        this.arrangeChildren();
    }

    /**
     * Get horizontal padding.
     * @returns Horizontal padding between list border and its elements.
     */
    get horPadding(): number
    {
        return this.options?.horPadding ?? this.padding ?? 0;
    }

    /**
     * Set left padding.
     * @param padding - Left padding between list border and its elements.
     */
    set leftPadding(padding: number)
    {
        if (!this.options) throw new Error('List has not been initiated!');
        this.options.leftPadding = padding;
        this.arrangeChildren();
    }

    /**
     * Get left padding.
     * @returns Left padding between list border and its elements.
     */
    get leftPadding(): number
    {
        return this.options?.leftPadding ?? this.horPadding;
    }

    /**
     * Set right padding.
     * @param padding - Right padding between list border and its elements.
     */
    set rightPadding(padding: number)
    {
        if (!this.options) throw new Error('List has not been initiated!');
        this.options.rightPadding = padding;
        this.arrangeChildren();
    }

    /**
     * Get right padding.
     * @returns Right padding between list border and its elements.
     */
    get rightPadding(): number
    {
        return this.options?.rightPadding ?? this.horPadding;
    }

    /**
     * Set top padding.
     * @param padding - Top padding between list border and its elements.
     */
    set topPadding(padding: number)
    {
        if (!this.options) throw new Error('List has not been initiated!');
        this.options.topPadding = padding;
        this.arrangeChildren();
    }

    /**
     * Get top padding.
     * @returns Top padding between list border and its elements.
     */
    get topPadding(): number
    {
        return this.options?.topPadding ?? this.vertPadding;
    }

    /**
     * Set bottom padding.
     * @param padding - Bottom padding between list border and its elements.
     */
    set bottomPadding(padding: number)
    {
        if (!this.options) throw new Error('List has not been initiated!');
        this.options.bottomPadding = padding;
        this.arrangeChildren();
    }

    /**
     * Get bottom padding.
     * @returns Bottom padding between list border and its elements.
     */
    get bottomPadding(): number
    {
        return this.options?.bottomPadding ?? this.vertPadding;
    }

    /**
     * Arrange all elements basing in their sizes and component options.
     * Can be arranged vertically, horizontally or bidirectional.
     */
    protected arrangeChildren()
    {
        let x = this.leftPadding;
        let y = this.topPadding;

        const elementsMargin = this.options?.elementsMargin ?? 0;
        let maxWidth = this.parent?.width;

        if (this.rightPadding)
        {
            maxWidth -= this.rightPadding;
        }

        this.children.forEach((child, id) =>
        {
            switch (this.type)
            {
                case 'vertical':
                    child.y = y;
                    child.x = x;

                    y += elementsMargin + child.height;
                    break;

                case 'horizontal':
                    child.x = x;
                    child.y = y;

                    x += elementsMargin + child.width;
                    break;

                default: // bidirectional
                    child.x = x;
                    child.y = y;

                    if (child.x + child.width >= maxWidth && id > 0)
                    {
                        y += elementsMargin + child.height;
                        x = this.leftPadding;

                        child.x = x;
                        child.y = y;
                    }

                    x += elementsMargin + child.width;
                    break;
            }
        });
    }

    /**
     * Removes items from the list. (Does not destroy them)
     * @param itemID - Item to remove (starting from 0).
     */
    removeItem(itemID: number)
    {
        const child = this.children[itemID];

        if (!child)
        {
            return;
        }

        this.removeChild(child);
        this.arrangeChildren();
    }
}

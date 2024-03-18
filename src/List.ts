import { Container } from '@pixi/display';

export type ListType = 'horizontal' | 'vertical';

export type ListOptions = {
    type?: ListType;
    elementsMargin?: number;
    elementsMarginHor?: number;
    elementsMarginVert?: number;
    children?: Container[];
    padding?: number;
    paddingVert?: number;
    paddingHor?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    items?: Container[];
    alignHor?: 'left' | 'center' | 'right';
    verticalVert?: 'top' | 'center' | 'bottom';
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
    protected options: ListOptions = {};

    /** Container, that holds all inner elements. */
    view: Container;

    /** Returns all arranged elements. */
    override readonly children: Container[] = [];

    constructor(options?: ListOptions)
    {
        super();

        this.init(options);

        this.on('added', () => this.arrangeChildren());
        this.on('childAdded', () => this.arrangeChildren());
    }

    /**
     * Initiates list component.
     * @param options
     */
    init(options?: ListOptions)
    {
        if (options) {
            this.options = options;

            options.children?.forEach((child) => this.addChild(child));
            options.items?.forEach((item) => this.addChild(item));
        }

        this.arrangeChildren();
    }

    /**
     * Set items arrange direction.
     * @param type - Arrange direction.
     */
    set type(type: ListType)
    {
        this.options.type = type;
        this.arrangeChildren();
    }

    /**
     * Get items arrange direction.
     * @returns Arrange direction.
     */
    get type(): ListType | undefined
    {
        return this.options.type;
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
     * Set horizontal elements margin.
     * @param margin - Horizontal margin between elements.
     */
    set elementsMarginHor(margin: number)
    {
        this.options.elementsMarginHor = margin;
        this.arrangeChildren();
    }

    /**
     * Get horizontal elements margin.
     * @returns Horizontal margin between elements.
     */
    get elementsMarginHor(): number
    {
        return this.options?.elementsMarginHor ?? 0;
    }

    /**
     * Set vertical elements margin.
     * @param margin - Vertical margin between elements.
     */
    set elementsMarginVert(margin: number)
    {
        this.options.elementsMarginVert = margin;
        this.arrangeChildren();
    }

    /**
     * Get vertical elements margin.
     * @returns Vertical margin between elements.
     */
    get elementsMarginVert(): number
    {
        return this.options?.elementsMarginVert ?? 0;
    }

    /**
     * Set padding, overriding all padding options.
     * @param padding - Padding surrounding list elements and its border.
     */
    set padding(padding: number)
    {
        this.options.padding = padding;
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
    set paddingVert(padding: number)
    {
        this.options.paddingVert = padding;
        this.arrangeChildren();
    }

    /**
     * Get vertical padding.
     * @returns Vertical padding between list border and its elements.
     */
    get paddingVert(): number
    {
        return this.options?.paddingVert ?? 0;
    }

    /**
     * Set horizontal padding, overriding all left and right padding options.
     * @param padding - Horizontal padding between list border and its elements.
     */
    set paddingHor(padding: number)
    {
        this.options.paddingHor = padding;
        this.arrangeChildren();
    }

    /**
     * Get horizontal padding.
     * @returns Horizontal padding between list border and its elements.
     */
    get paddingHor(): number
    {
        return this.options?.paddingHor ?? 0;
    }

    /**
     * Set left padding.
     * @param padding - Left padding between list border and its elements.
     */
    set paddingLeft(padding: number)
    {
        this.options.paddingLeft = padding;
        this.arrangeChildren();
    }

    /**
     * Get left padding.
     * @returns Left padding between list border and its elements.
     */
    get paddingLeft(): number
    {
        return this.options?.paddingLeft ?? 0;
    }

    /**
     * Set right padding.
     * @param padding - Right padding between list border and its elements.
     */
    set paddingRight(padding: number)
    {
        this.options.paddingRight = padding;
        this.arrangeChildren();
    }

    /**
     * Get right padding.
     * @returns Right padding between list border and its elements.
     */
    get paddingRight(): number
    {
        return this.options?.paddingRight ?? 0;
    }

    /**
     * Set top padding.
     * @param padding - Top padding between list border and its elements.
     */
    set paddingTop(padding: number)
    {
        this.options.paddingTop = padding;
        this.arrangeChildren();
    }

    /**
     * Get top padding.
     * @returns Top padding between list border and its elements.
     */
    get paddingTop(): number
    {
        return this.options?.paddingTop ?? 0;
    }

    /**
     * Set bottom padding.
     * @param padding - Bottom padding between list border and its elements.
     */
    set paddingBottom(padding: number)
    {
        this.options.paddingBottom = padding;
        this.arrangeChildren();
    }

    /**
     * Get bottom padding.
     * @returns Bottom padding between list border and its elements.
     */
    get paddingBottom(): number
    {
        return this.options?.paddingBottom ?? 0;
    }

    /**
     * Arrange all elements basing in their sizes and component options.
     * Can be arranged vertically, horizontally or bidirectional.
     */
    protected arrangeChildren()
    {
        const {
            paddingTop,
            paddingLeft,
            paddingRight,
            paddingHor,
            paddingVert,
            padding,
            elementsMargin,
            elementsMarginHor,
            elementsMarginVert,
        } = this.options;

        let maxWidth = this.parent?.width - (paddingRight ?? 0);

        if (this.paddingRight)
        {
            maxWidth -= this.paddingRight;
        }

        const horStart = paddingLeft ?? paddingHor ?? padding ?? 0

        let x = horStart;
        let y = paddingTop ?? paddingVert ?? padding ?? 0;
        const marginHor = elementsMarginHor ?? elementsMargin ?? 0;
        const marginVert = elementsMarginVert ?? elementsMargin ?? 0;

        this.children.forEach((child, id) =>
        {
            switch (this.type)
            {
                case 'vertical':
                    child.y = y;
                    child.x = x;

                    y += marginVert + child.height;
                    break;

                case 'horizontal':
                    child.x = x;
                    child.y = y;

                    x += marginHor + child.width;
                    break;

                default: // bidirectional
                    child.x = x;
                    child.y = y;

                    if (child.x + child.width >= maxWidth && id > 0)
                    {
                        y += marginVert + child.height;
                        x = horStart;

                        child.x = x;
                        child.y = y;
                    }

                    x += marginHor + child.width;
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

import { Container } from '@pixi/display';

export type ListType = 'horizontal' | 'vertical';

export type ListOptions = {
    elementsMargin?: number;
    children?: Container[];
    vertPadding?: number;
    horPadding?: number;
};

/**
 * Container-based component for arranging Pixi containers one after another based on their sizes.
 *
 * If type is not specified, it will be set, items will be arranged to fit horizontally,
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
    private readonly options?: { type?: ListType } & ListOptions;

    /** Container, that holds all inner elements. */
    public view: Container;

    /** Arrange direction. */
    public type: ListType;

    /** Returns all arranged elements. */
    public override readonly children: Container[] = [];

    constructor(options?: { type?: ListType } & ListOptions)
    {
        super();

        this.options = options;

        if (options?.type)
        {
            this.type = options.type;
        }

        if (options?.children)
        {
            options.children.map((child) => this.addChild(child));
        }

        this.on('added', () => this.arrangeChildren());
    }

    protected override onChildrenChange()
    {
        this.arrangeChildren();
    }

    private arrangeChildren()
    {
        let x = this.options?.horPadding ?? 0;
        let y = this.options?.vertPadding ?? 0;

        const elementsMargin = this.options?.elementsMargin ?? 0;
        const maxWidth = this.parent?.width - this.options?.horPadding;

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
                        x = this.options?.horPadding ?? 0;

                        child.x = x;
                        child.y = y;
                    }

                    x += elementsMargin + child.width;
                    break;
            }
        });
    }
}

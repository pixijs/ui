import { Container } from '@pixi/display';
import { Padding, PaddingController } from './controllers/PaddingController';

export type LayoutType = 'horizontal' | 'vertical';

export type LayoutOptions = {
    elementsMargin?: number;
    children?: Container[];
    padding?: Padding;
};

/**
 * Container-based element for arranging Pixi containers based on their sizes.
 *
 * It is used inside elements with repeatable content, like {@link Select} or {@link ScrollBox}.
 * @example
 * const layout = new Layout({
 *    children: [
        new Graphics().beginFill(0x000000).drawRect(0, 0, 50, 50),
        new Graphics().beginFill(0xFFFFFF).drawRect(0, 0, 50, 50),
 *    ],
 * });
 *
 * layout.addChild(new Graphics().beginFill(0x000000).drawRect(0, 0, 50, 50));
 */
export class Layout extends Container
{
    private readonly options?: { type?: LayoutType } & LayoutOptions;

    /** Container, that holds all inner elements. */
    public view: Container;

    /** Arrange direction. */
    public type: LayoutType;

    /** Returns all arranged elements. */
    public override readonly children: Container[] = [];

    /** Store control flexible padding config */
    public padding: PaddingController;

    constructor(options?: { type?: LayoutType } & LayoutOptions)
    {
        super();

        this.options = options;

        this.padding = new PaddingController(options.padding ?? 0);

        if (options?.type)
        {
            this.type = options.type;
        }

        if (options?.children)
        {
            options.children.map((child) => this.addChild(child));
        }
    }

    protected override onChildrenChange()
    {
        const { left, right, top } = this.padding;

        let x = left;
        let y = top;

        const elementsMargin = this.options?.elementsMargin ?? 0;

        this.children.forEach((child) =>
        {
            if (!this.type && x + child.width >= this.parent.width - right)
            {
                y += elementsMargin + child.height;
                x = left;

                child.x = x;
                child.y = y;
            }
            else
            {
                child.x = x;
                child.y = y;
            }

            switch (this.type)
            {
                case 'horizontal':
                    x += elementsMargin + child.width;
                    break;

                case 'vertical':
                    y += elementsMargin + child.height;
                    break;

                default:
                    x += elementsMargin + child.width;
                    break;
            }
        });
    }
}

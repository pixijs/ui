import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Text, TextStyle } from '@pixi/text';
import { Signal } from 'typed-signals';
import { FancyButton } from './FancyButton';
import { ScrollBox, ScrollBoxOptions } from './ScrollBox';
import { getView } from './utils/helpers/view';

const defaultVisibleItems = 5;

type Offset = {
    y: number;
    x: number;
};

export type SelectItemsOptions = {
    items: string[];
    backgroundColor: number;
    hoverColor?: number;
    width?: number;
    height?: number;
    textStyle?: Partial<TextStyle>;
    radius?: number;
};

export type SelectOptions = {
    closedBG: string | Container;
    openBG?: string | Container;
    textStyle?: Partial<TextStyle>;
    selected?: number;
    selectedTextOffset?: { x?: number; y?: number };

    items: SelectItemsOptions;

    scrollBoxOffset?: { x?: number; y?: number };
    scrollBoxWidth?: number;
    scrollBoxHeight?: number;
    scrollBoxRadius?: number;

    visibleItems?: number;

    scrollBox?: ScrollBoxOptions & {
        offset?: Offset;
    };
};

/**
 * Container-based component that gives us a selection dropdown.
 *
 * It is a composition of a {@link Button} and a {@link ScrollBox}.
 * @example
 * new Select({
 *     closedBG: `select_closed.png`,
 *     openBG: `select_open.png`,
 *     textStyle: { fill: 0xffffff, fontSize: 20 },
 *     items: {
 *         items,
 *         backgroundColor: 0x000000,
 *         hoverColor: 0x000000,
 *         width: 200,
 *         height: 50,
 *     },
 *     scrollBox: {
 *         width: 200,
 *         height: 350,
 *         radius: 30,
 *     },
 * });
 */

// TODO: rewrite this basing on Swich
export class Select extends Container
{
    private readonly openButton: FancyButton;
    private readonly closeButton: FancyButton;
    private readonly openView: Container;
    private scrollBox: ScrollBox;

    /** Selected value ID. */
    public value: number;

    /** Fires when selected value is changed. */
    public onSelect: Signal<(value: number, text: string) => void>;

    constructor({ closedBG, textStyle, items, openBG, selected, selectedTextOffset, scrollBox, visibleItems }: SelectOptions)
    {
        super();

        this.openButton = new FancyButton({
            defaultView: getView(closedBG),
            text: new Text(items?.items ? items.items[0] : '', textStyle),
            textOffset: selectedTextOffset
        });
        this.openButton.onPress.connect(() => this.toggle());
        this.addChild(this.openButton);

        this.openView = getView(openBG);
        this.openView.visible = false;
        this.addChild(this.openView);

        const defaultView = new Graphics()
            .beginFill(0x000000, 0.00001)
            .drawRect(0, 0, this.openButton.width, this.openButton.height);

        this.closeButton = new FancyButton({
            defaultView,
            text: new Text(items?.items ? items.items[0] : '', textStyle),
            textOffset: selectedTextOffset
        });
        this.closeButton.onPress.connect(() => this.toggle());
        this.openView.addChild(this.closeButton);

        this.scrollBox = new ScrollBox({
            type: 'vertical',
            elementsMargin: 0,
            width: this.openButton.width,
            height: this.openButton.height * (visibleItems ?? defaultVisibleItems),
            radius: 0,
            padding: 0,
            ...scrollBox
        });
        this.scrollBox.y = this.openButton.height;
        this.openView.addChild(this.scrollBox);

        if (scrollBox?.offset)
        {
            this.scrollBox.x += scrollBox.offset.x ?? 0;
            this.scrollBox.y += scrollBox.offset.y ?? 0;
        }

        this.onSelect = new Signal();

        this.convertItemsToButtons(items).forEach((button, id) =>
        {
            const text = button.text;

            if (id === selected)
            {
                this.openButton.text = text;
                this.closeButton.text = text;
            }

            button.onPress.connect(() =>
            {
                this.value = id;
                this.onSelect.emit(id, text);
                this.openButton.text = text;
                this.closeButton.text = text;
                this.close();
            });

            this.scrollBox.addItem(button);
        });
    }

    /** Toggle the select state (open if closed, closes - id open). */
    public toggle()
    {
        this.openView.visible = !this.openView.visible;
        this.openButton.visible = !this.openButton.visible;
    }

    /** Show dropdown. */
    public open()
    {
        this.openView.visible = true;
        this.openButton.visible = false;
    }

    /** Hide dropdown. */
    public close()
    {
        this.openView.visible = false;
        this.openButton.visible = true;
    }

    private convertItemsToButtons({
        items,
        backgroundColor,
        hoverColor,
        width,
        height,
        textStyle,
        radius
    }: SelectItemsOptions): FancyButton[]
    {
        const buttons: FancyButton[] = [];

        items.forEach((item) =>
        {
            const defaultView = new Graphics().beginFill(backgroundColor).drawRoundedRect(0, 0, width, height, radius);

            const color = hoverColor ?? backgroundColor;
            const hoverView = new Graphics().beginFill(color).drawRoundedRect(0, 0, width, height, radius);
            const text = new Text(item, textStyle);
            const button = new FancyButton({ defaultView, hoverView, text });

            buttons.push(button);
        });

        return buttons;
    }
}

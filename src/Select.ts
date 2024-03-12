import { Container, FillStyleInputs, Graphics, Text, TextStyle } from 'pixi.js';
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
    backgroundColor: FillStyleInputs
    width: number;
    height: number;
    hoverColor?: FillStyleInputs;
    textStyle?: Partial<TextStyle>;
    radius?: number;
};

export type SelectOptions = {
    closedBG: string | Container;
    openBG: string | Container;
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

export class Select extends Container
{
    protected view: Container = new Container();
    protected openButton!: FancyButton;
    protected closeButton!: FancyButton;
    protected openView!: Container;
    protected scrollBox: ScrollBox;

    /** Selected value ID. */
    value: number;

    /** Fires when selected value is changed. */
    onSelect: Signal<(value: number, text: string) => void>;

    constructor(options?: SelectOptions)
    {
        super();

        this.addChild(this.view);
        this.onSelect = new Signal();

        if (options)
        {
            this.init(options);
        }
    }

    /**
     * Initiates Select.
     * @param root0
     * @param root0.closedBG
     * @param root0.textStyle
     * @param root0.items
     * @param root0.openBG
     * @param root0.selected
     * @param root0.selectedTextOffset
     * @param root0.scrollBox
     * @param root0.visibleItems
     */
    init({ closedBG, textStyle, items, openBG, selected, selectedTextOffset, scrollBox, visibleItems }: SelectOptions)
    {
        if (this.openView && this.openView !== openBG)
        {
            this.view.removeChild(this.openView);
        }

        // openButton
        if (!this.openButton)
        {
            this.openButton = new FancyButton({
                defaultView: getView(closedBG),
                text: new Text({ text: items?.items ? items.items[0] : '', style: textStyle }),
                textOffset: selectedTextOffset
            });
            this.openButton.onPress.connect(() => this.toggle());
            this.addChild(this.openButton);
        }
        else
        {
            this.openButton.defaultView = getView(closedBG);
            this.openButton.textView = new Text({ text: items?.items ? items.items[0] : '', style: textStyle });

            this.openButton.textOffset = selectedTextOffset;
        }

        // openView
        if (this.openView !== openBG)
        {
            this.openView = getView(openBG);
            this.view.visible = false;
            this.view.addChild(this.openView);
        }

        // closeButton
        if (!this.closeButton)
        {
            this.closeButton = new FancyButton({
                defaultView: new Graphics()
                    .rect(0, 0, this.openButton.width, this.openButton.height)
                    .fill({ color: 0x000000, alpha: 0.00001 }),
                text: new Text({ text: items?.items ? items.items[0] : '', style: textStyle }),
                textOffset: selectedTextOffset
            });
            this.closeButton.onPress.connect(() => this.toggle());
            this.view.addChild(this.closeButton);
        }
        else
        {
            this.closeButton.defaultView = new Graphics()
                .rect(0, 0, this.openButton.width, this.openButton.height)
                .fill({ color: 0x000000, alpha: 0.00001 });

            this.closeButton.textView = new Text({ text: items?.items ? items.items[0] : '', style: textStyle });

            this.openButton.textOffset = selectedTextOffset;
        }

        // ScrollBox
        if (!this.scrollBox)
        {
            this.scrollBox = new ScrollBox();

            this.view.addChild(this.scrollBox);
        }
        else
        {
            this.scrollBox.removeItems();
        }

        this.scrollBox.init({
            type: 'vertical',
            elementsMargin: 0,
            width: this.openButton.width,
            height: this.openButton.height * (visibleItems ?? defaultVisibleItems),
            radius: 0,
            padding: 0,
            ...scrollBox
        });

        this.scrollBox.y = this.openButton.height;

        if (scrollBox?.offset)
        {
            this.scrollBox.x = scrollBox.offset.x ?? 0;
            this.scrollBox.y += scrollBox.offset.y ?? 0;
        }

        this.addItems(items, selected);
    }

    /**
     * Adds items to the dropdown.
     * @param items
     * @param selected
     */
    addItems(items: SelectItemsOptions, selected = 0)
    {
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

    /**
     * Remove items from the dropdown.
     * @param itemID - Item to remove (starting from 0).
     */
    removeItem(itemID: number)
    {
        this.scrollBox.removeItem(itemID);
    }

    /** Toggle the select state (open if closed, closes - id open). */
    toggle()
    {
        this.view.visible = !this.view.visible;
        this.openButton.visible = !this.openButton.visible;
    }

    /** Show dropdown. */
    open()
    {
        this.view.visible = true;
        this.openButton.visible = false;
    }

    /** Hide dropdown. */
    close()
    {
        this.view.visible = false;
        this.openButton.visible = true;
    }

    protected convertItemsToButtons({
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
            const defaultView = new Graphics().roundRect(0, 0, width, height, radius).fill(backgroundColor);

            const color = hoverColor ?? backgroundColor;
            const hoverView = new Graphics().roundRect(0, 0, width, height, radius).fill(color);

            const text = new Text({ text: item, style: textStyle });

            const button = new FancyButton({ defaultView, hoverView, text });

            buttons.push(button);
        });

        return buttons;
    }
}

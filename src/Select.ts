import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Text, TextStyle } from '@pixi/text';
import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { ColorSource } from '@pixi/color';
import { Signal } from 'typed-signals';
import { ButtonOptions, FancyButton } from './FancyButton';
import { ScrollBox, ScrollBoxOptions } from './ScrollBox';
import { getView } from './utils/helpers/view';

const defaultVisibleItems = 5;

type Offset = {
    y: number;
    x: number;
};

type ItemOptions = {
    /** Width of a dropdown item */
    width: number;
    /** Height of a dropdown item */
    height: number;
    /** Specify a background color for the item view, defaults to transparency */
    backgroundColor?: ColorSource;
    /** Specify a hover color for the item view, defaults to transparency */
    hoverColor?: ColorSource;
    /** Specify the corner radius of the item view, defaults to 0 */
    radius?: number;
    /** Specify the padding around the content within the item view, defaults to 0 */
    padding?: number;
};

type BaseSelectOptions = {
    /** Options for the individual dropdown item */
    itemOptions: ItemOptions;
    /** Texture alias or a view container that will be used for the closed state */
    closedBG: string | Container;
    /** Texture alias or a view container that will be used for the open state */
    openBG: string | Container;
    /** Specify the initial selected index, otherwise it will use the first item */
    selected?: number;
    /** Specify the selected item offset within the open/close view */
    selectedItemOffset?: { x?: number; y?: number };
    /** Specify the dropdown scroll box options */
    scrollBox?: ScrollBoxOptions & {
        offset?: Offset;
    };
    /** Specify the amount of items should be displayed on the dropdown */
    visibleItems?: number;
};

type TextSelectOptions = {
    /** Specify which type of content is being used in the dropdown */
    type: 'text';
    /** Override the text class to use, otherwise it will use the default Pixi Text */
    textClass?: any;
    /** Specify the text style options */
    textStyle?: Partial<TextStyle>;
    textUpdate?: (view: any, text: string) => void;
    /** Provide an array of text strings for the dropdown */
    items: string[];
} & BaseSelectOptions;

type SpriteSelectOptions = {
    /** Specify which type of content is being used in the dropdown */
    type: 'sprite';
    /** Provide an array of sprite source for the dropdown, can be aliases or Texture instances */
    items: (Texture | string)[];
} & BaseSelectOptions;

export type SelectOptions = TextSelectOptions | SpriteSelectOptions;

/**
 * Container-based component that gives us a selection dropdown
 * for a list of items which can be either text or sprites.
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
    protected options: SelectOptions;
    protected openButton!: FancyButton;
    protected closeButton!: FancyButton;
    protected openView!: Container;
    protected scrollBox: ScrollBox;

    /** Selected index. */
    index: number;

    /** Selected value. */
    value: string | Texture;

    /** Fires when selected value is changed. */
    onSelect: Signal<(index: number, value: string | Texture) => void>;

    constructor(options?: SelectOptions)
    {
        super();
        this.onSelect = new Signal();
        if (options) this.init(options);
    }

    /**
     * Initiates Select.
     * @param root0
     * @param root0.closedBG
     * @param root0.items
     * @param root0.openBG
     * @param root0.selected
     * @param root0.selectedItemOffset
     * @param root0.scrollBox
     * @param root0.visibleItems
     * @param root0.type
     * @param options
     */
    init(options: SelectOptions)
    {
        this.options = options;

        // Destructure common options.
        const { closedBG, openBG, items, itemOptions, selected, scrollBox, visibleItems, selectedItemOffset } = options;

        const baseItemOpts = {
            textOffset: selectedItemOffset,
            iconOffset: selectedItemOffset,
            padding: itemOptions.padding ?? 0,
        };

        // Get the item options, containing a view instance.
        const openItemOpts = this.getContentOptions(items[selected ?? 0]);

        // Create / update the open button.
        if (!this.openButton)
        {
            this.openButton = new FancyButton({
                defaultView: getView(closedBG),
                ...baseItemOpts,
                ...openItemOpts,
            });
            this.openButton.onPress.connect(() => this.toggle());
            this.addChild(this.openButton);
        }
        else
        {
            this.openButton.defaultView = getView(closedBG);
            this.openButton.textView = openItemOpts.text;
            this.openButton.iconView = openItemOpts.icon;
            this.openButton.textOffset = this.openButton.iconOffset = selectedItemOffset;
            this.openButton.padding = openItemOpts.padding;
        }

        // Add the open view.
        if (this.openView !== openBG)
        {
            // Remove the old open view, if exists.
            if (this.openView) this.removeChild(this.openView);
            this.openView = getView(openBG);
            this.openView.visible = false;
            this.addChild(this.openView);
        }

        // Get the item options, containing another view instance.
        const closeItemOpts = this.getContentOptions(items[selected ?? 0]);

        // Create / update the close button.
        if (!this.closeButton)
        {
            this.closeButton = new FancyButton({
                defaultView: new Graphics()
                    .beginFill(0x000000, 0.00001)
                    .drawRect(0, 0, this.openButton.width, this.openButton.height),
                ...baseItemOpts,
                ...closeItemOpts
            });
            this.closeButton.onPress.connect(() => this.toggle());
            this.openView.addChild(this.closeButton);
        }
        else
        {
            this.closeButton.defaultView = new Graphics()
                .beginFill(0x000000, 0.00001)
                .drawRect(0, 0, this.openButton.width, this.openButton.height);

            this.closeButton.textView = closeItemOpts.text;
            this.closeButton.iconView = closeItemOpts.icon;
            this.closeButton.textOffset = this.openButton.iconOffset = selectedItemOffset;
            this.closeButton.padding = closeItemOpts.padding;
        }

        // Create / clean the scroll box.
        if (!this.scrollBox)
        {
            this.scrollBox = new ScrollBox();

            this.openView.addChild(this.scrollBox);
        }
        else
        {
            this.scrollBox.removeItems();
        }

        // Update the scroll box.
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

        // Add items to the dropdown.
        this.addItems(items, selected);
    }

    /**
     * Adds items to the dropdown.
     * @param items
     * @param selected
     */
    addItems(items: string[] | (Texture | string)[], selected = 0)
    {
        this.convertItemsToButtons(items).forEach((button, i) =>
        {
            const value = items[i];

            if (i === selected) this.updateSelected(value);

            button.onPress.connect(() =>
            {
                this.index = i;
                this.value = value;
                this.onSelect.emit(i, value);
                this.updateSelected(value);
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
        this.openView.visible = !this.openView.visible;
        this.openButton.visible = !this.openButton.visible;
    }

    /** Show dropdown. */
    open()
    {
        this.openView.visible = true;
        this.openButton.visible = false;
    }

    /** Hide dropdown. */
    close()
    {
        this.openView.visible = false;
        this.openButton.visible = true;
    }

    protected updateSelected(value: string | Texture)
    {
        if (this.options.type === 'sprite')
        {
            const openView = this.openButton.iconView as Sprite;
            const closeView = this.closeButton.iconView as Sprite;
            const texture = typeof value === 'string' ? Texture.from(value) : value;

            openView.texture = texture;
            closeView.texture = texture;

            return;
        }

        const openView = this.openButton.textView;
        const closeView = this.closeButton.textView;
        const text = value as string;

        if (this.options.textUpdate)
        {
            this.options.textUpdate(openView, text);
            this.options.textUpdate(closeView, text);

            return;
        }

        openView.text = text;
        closeView.text = text;
    }

    protected convertItemsToButtons(items: string[] | (Texture | string)[]): FancyButton[]
    {
        const buttons: FancyButton[] = [];

        items.forEach((item) => buttons.push(this.createItemButton(item)));

        return buttons;
    }

    protected createItemButton(item: string | Texture)
    {
        const { backgroundColor, hoverColor, width, height, radius, padding } = this.options.itemOptions;
        const defaultView = new Graphics().beginFill(backgroundColor).drawRoundedRect(0, 0, width, height, radius);
        const color = hoverColor ?? backgroundColor;
        const hoverView = new Graphics().beginFill(color).drawRoundedRect(0, 0, width, height, radius);

        return new FancyButton({
            defaultView,
            hoverView,
            padding: padding ?? 0,
            ...this.getContentOptions(item)
        });
    }

    protected getContentOptions(item: string | Texture): Partial<ButtonOptions>
    {
        if (this.options.type === 'text')
        {
            const TextClass = this.options.textClass ?? Text;
            const text = new TextClass(item, this.options.textStyle);

            return { text };
        }

        const sprite = Sprite.from(item);

        return { icon: sprite };
    }
}

import { Button } from './Button';
import { ScrollBox, ScrollBoxOptions } from './ScrollBox';
import { Signal } from 'typed-signals';
import { Container, TextStyle, Sprite, Texture, Text, Graphics } from 'pixi.js';

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

    scrollBox?: ScrollBoxOptions & {
        offset?: Offset;
    };
};

/**
 * Container based component that gives us a selection dropdown.
 * It is a composition of a [[Button]] and a [[ScrollBox]].
 *
 * @example
 * ```
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
 *         textStyle: { fill: 0xffffff, fontSize: 20 },,
 *         radius: 25,
 *     },
 *     selectedTextOffset: {
 *         y: -13,
 *     },
 *     scrollBox: {
 *         width: 200,
 *         height: 350,
 *         radius: 30,
 *         offset: {
 *             y: -16,
 *             x: 24,
 *         },
 *     },
 * });
 *
 * ```
 */
export class Select extends Container {
    private readonly closedBG: Container;
    private readonly openBG: Container;
    public selectedText: Text;

    public value: number;

    public onSelect: Signal<(value: number, text: string) => void>;

    constructor({
        closedBG,
        textStyle,
        items,
        openBG,
        selected,
        selectedTextOffset,
        scrollBox,
    }: SelectOptions) {
        super();

        this.closedBG =
            typeof closedBG === 'string'
                ? new Sprite(Texture.from(closedBG))
                : closedBG;

        this.openBG =
            typeof openBG === 'string'
                ? new Sprite(Texture.from(openBG))
                : openBG;

        this.openBG.visible = false;

        // this.addChild(this.closedBG);

        this.addChild(this.closedBG, this.openBG);

        const openButton = new Button({
            view: this.closedBG,
        });

        this.addChild(openButton);

        openButton.onPress.connect(() => this.toggle());

        this.selectedText = new Text(
            items?.items ? items.items[0] : '',
            textStyle,
        );

        const selectedTextButton = new Button({
            view: this.selectedText,
        });

        selectedTextButton.onPress.connect(() => this.toggle());

        this.addChild(selectedTextButton);

        this.selectedText.anchor.set(0.5);
        this.selectedText.x =
            this.closedBG.width / 2 + (selectedTextOffset?.x || 0);
        this.selectedText.y =
            this.closedBG.height / 2 + (selectedTextOffset?.y || 0);

        const scroll = new ScrollBox({
            type: 'vertical',
            elementsMargin: 0,
            width: this.closedBG.width,
            height: this.closedBG.height * 5,
            radius: 0,
            padding: 0,
            ...scrollBox,
        });

        this.openBG.addChild(scroll);

        scroll.y = this.closedBG.height;

        if (scrollBox?.offset) {
            scroll.x += scrollBox.offset.x ?? 0;
            scroll.y += scrollBox.offset.y ?? 0;
        }

        this.onSelect = new Signal();

        this.convertItemsToButtons(items).forEach((button, id) => {
            const text = button.getText();

            if (id === selected) {
                this.selectedText.text = text;
            }

            button.onPress.connect(() => {
                this.value = id;
                this.onSelect.emit(id, text);
                this.selectedText.text = text;
                this.close();
            });

            scroll.addItem(button);
        });
    }

    public toggle() {
        this.openBG.visible = !this.openBG.visible;
        this.closedBG.visible = !this.closedBG.visible;
    }

    public open() {
        this.openBG.visible = true;
        this.closedBG.visible = false;
    }

    public close() {
        this.openBG.visible = false;
        this.closedBG.visible = true;
    }

    private convertItemsToButtons({
        items,
        backgroundColor,
        hoverColor,
        width,
        height,
        textStyle,
        radius,
    }: SelectItemsOptions): Button[] {
        const buttons: Button[] = [];

        items.forEach((item) => {
            const view = new Graphics()
                .beginFill(backgroundColor)
                .drawRoundedRect(0, 0, width, height, radius);
            const hoverView = new Graphics()
                .beginFill(hoverColor ?? backgroundColor)
                .drawRoundedRect(0, 0, width, height, radius);
            const textView = new Text(item, textStyle);

            const button = new Button({ view, hoverView, textView });

            buttons.push(button);
        });

        return buttons;
    }
}

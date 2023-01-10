import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { ITextStyle, TextStyle } from '@pixi/text';
import { Signal } from 'typed-signals';
import { CheckBox } from './CheckBox';
import { Layout, LayoutType } from './Layout';

export type GraphicsType = {
    color: number;
    fillColor?: number;
    width?: number;
    height?: number;
    radius?: number;
    padding?: number;
};

export type RadioBoxStyle = {
    bg: string | GraphicsType;
    checked: string | GraphicsType;
    textStyle?: TextStyle | Partial<ITextStyle>;
};

export type RadioBoxOptions = {
    items: string[];
    type: LayoutType;
    elementsMargin: number;
    style: RadioBoxStyle;
    selectedItem?: number;
};

/**
 * Creates a container based group of checkbox elements that can be used as radio buttons
 * @example
 * ```
 * new RadioGroup({
 *     selectedItem: 0,
 *     items: ['Option 1', 'Option 2', 'Option 3'],
 *     type: 'vertical',
 *     elementsMargin: 10,
 *     style: {
 *         bg: 'radio.png',
 *         checked: 'radio_checked.png',
 *         textStyle: {
 *             fontSize: 22,
 *             fill: 0xFFFFFF,
 *         }
 *     },
 * });
 *
 * ```
 */
export class RadioGroup extends Container
{
    private items: CheckBox[] = [];

    /** TODO */
    public value: string;
    /** TODO */
    public selected: number;

    /** TODO */
    public onChange: Signal<(selectedItemID: number, selectedVal: string) => void>;
    /** TODO */
    public view: Layout;

    private readonly options: RadioBoxOptions;

    constructor(options: RadioBoxOptions)
    {
        super();

        this.options = options;
        this.value = options.items[options.selectedItem];

        this.selected = options.selectedItem;

        this.view = new Layout({
            type: options.type,
            elementsMargin: options.elementsMargin,
        });

        options.items.forEach((item, id) =>
        {
            const unchecked = typeof options.style.bg === 'string'
                ? new Sprite(Texture.from(options.style.bg))
                : this.getGraphics(options.style.bg);

            const checked = typeof options.style.checked === 'string'
                ? new Sprite(Texture.from(options.style.checked))
                : this.getGraphics(options.style.checked);

            const checkBox = new CheckBox({
                text: item,
                checked: options.selectedItem === id,
                style: {
                    unchecked,
                    checked,
                    text: options.style.textStyle,
                },
            });

            this.view.addChild(checkBox);

            checkBox.onChange.connect(() => this.selectItem(id));

            this.items.push(checkBox);

            this.view.addChild(checkBox);
        });

        this.onChange = new Signal();
    }

    private getGraphics({
        color,
        fillColor,
        width,
        height,
        radius,
        padding,
    }: GraphicsType)
    {
        const graphics = new Graphics().beginFill(color);

        const isCircle = width === height && radius >= width / 2;

        isCircle
            ? graphics.drawCircle(width / 2, width / 2, width / 2)
            : graphics.drawRoundedRect(0, 0, width, height, radius);

        if (fillColor !== undefined)
        {
            graphics.beginFill(fillColor);

            const center = width / 2;

            if (isCircle)
            {
                graphics.drawCircle(center, center, center - padding);
            }
            else
            {
                graphics.drawRoundedRect(
                    padding,
                    padding,
                    width - (padding * 2),
                    height - (padding * 2),
                    radius,
                );
            }
        }

        return graphics;
    }

    /**
     * TODO
     * @param id
     */
    public selectItem(id: number)
    {
        this.selected = id;

        this.items.map((item) => (item.checked = false));

        this.items[id].checked = true;

        this.value = this.options.items[this.selected];
        this.onChange.emit(this.selected, this.value);
    }
}

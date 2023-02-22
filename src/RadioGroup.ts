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
 * Creates a container-based group of checkbox elements, that can be used as radio buttons.
 *
 * Only one checkbox can be selected at a time.
 * @example
 * new RadioGroup({
 *     selectedItem: 0,
 *     items: ['Option 1', 'Option 2', 'Option 3'],
 *     style: {
 *         bg: 'radio.png',
 *         checked: 'radio_checked.png'
 *     },
 * });
 */
export class RadioGroup extends Container
{
    private readonly options: RadioBoxOptions;
    private items: CheckBox[] = [];

    /** {@link Layout}, that holds and control all inned checkboxes.S  */
    public innerView: Layout;

    /** Text value of the selected item. */
    public value: string;

    /** ID of the selected item. */
    public selected: number;

    /** Fires, when new item is selected. */
    public onChange: Signal<(selectedItemID: number, selectedVal: string) => void>;

    constructor(options: RadioBoxOptions)
    {
        super();

        this.options = options;
        this.value = options.items[options.selectedItem];

        this.selected = options.selectedItem;

        this.innerView = new Layout({
            type: options.type,
            elementsMargin: options.elementsMargin
        });

        options.items.forEach((item, id) =>
        {
            const unchecked = this.getView(options.style.bg);
            const checked = this.getView(options.style.checked);

            const checkBox = new CheckBox({
                text: item,
                checked: options.selectedItem === id,
                style: {
                    unchecked,
                    checked,
                    text: options.style.textStyle
                }
            });

            this.innerView.addChild(checkBox);

            checkBox.onChange.connect(() => this.selectItem(id));

            this.items.push(checkBox);

            this.innerView.addChild(checkBox);
        });

        this.onChange = new Signal();
    }

    private getView(view: string | GraphicsType): Container
    {
        if (typeof view === 'string')
        {
            return Sprite.from(view);
        }

        return this.getGraphics(view as GraphicsType);
    }

    private getGraphics({ color, fillColor, width, height, radius, padding }: GraphicsType)
    {
        const graphics = new Graphics().beginFill(color);

        const isCircle = width === height && radius >= width / 2;

        if (isCircle)
        {
            graphics.drawCircle(width / 2, width / 2, width / 2);
        }
        else
        {
            graphics.drawRoundedRect(0, 0, width, height, radius);
        }

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
                graphics.drawRoundedRect(padding, padding, width - (padding * 2), height - (padding * 2), radius);
            }
        }

        return graphics;
    }

    /**
     * Select item by ID.
     * @param id
     */
    public selectItem(id: number)
    {
        this.items.forEach((item, key) =>
        {
            item.forceCheck(key === id);
        });

        this.value = this.options.items[id];

        if (this.selected !== id)
        {
            this.onChange.emit(id, this.value);
        }

        this.selected = id;
    }
}

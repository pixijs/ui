import { Container } from 'pixi.js';
import { Signal } from 'typed-signals';
import { CheckBox } from './CheckBox';
import { List, ListType } from './List';

export type RadioBoxOptions = {
    items: CheckBox[];
    type: ListType;
    elementsMargin: number;
    selectedItem?: number;
};

/**
 * Creates a container-based controlling wrapper for checkbox elements,
 * for them top behave as radio buttons.
 *
 * Only one checkbox/radio button can be selected at a time.
 *
 * List of items is passed as an array of {@link CheckBox} objects.
 * @example
 * new RadioGroup({
 *     items: [
 *          new CheckBox({
 *              style: {
 *                  unchecked: `switch_off.png`,
 *                  checked: `switch_on.png`,
 *              }
 *          }),
 *         new CheckBox({
 *              style: {
 *                  unchecked: `switch_off.png`,
 *                  checked: `switch_on.png`,
 *              }
 *          }),
 *          new CheckBox({
 *              style: {
 *                  unchecked: `switch_off.png`,
 *                  checked: `switch_on.png`,
 *              }
 *          }),
 *     ],
 *     type: 'vertical'
 * });
 */
export class RadioGroup extends Container
{
    protected items: CheckBox[] = [];

    /** {@link List}, that holds and control all inned checkboxes.  */
    innerView: List;

    /** Text value of the selected item. */
    value: string;

    /** ID of the selected item. */
    selected: number;

    /** Fires, when new item is selected. */
    onChange: Signal<(selectedItemID: number, selectedVal: string) => void>;

    protected options: RadioBoxOptions;

    constructor(options?: RadioBoxOptions)
    {
        super();

        if (options)
        {
            this.init(options);
        }

        this.onChange = new Signal();
    }

    /**
     * Initiates a group.
     * @param options
     */
    init(options: RadioBoxOptions)
    {
        this.options = options;

        this.value = options.items[options.selectedItem || 0].labelText?.text;

        this.selected = options.selectedItem ?? 0; // first item by default

        if (this.innerView)
        {
            this.innerView.type = options.type;
            this.innerView.elementsMargin = options.elementsMargin;
        }
        else
        {
            this.innerView = new List({
                type: options.type,
                elementsMargin: options.elementsMargin
            });
        }

        this.addItems(options.items);

        this.addChild(this.innerView);

        this.selectItem(this.selected);
    }

    /**
     * Add items to a group.
     * @param {CheckBox[]} items - array of {@link CheckBox} instances.
     */
    addItems(items: CheckBox[])
    {
        items.forEach((checkBox, id) =>
        {
            checkBox.onChange.connect(() => this.selectItem(id));

            this.items.push(checkBox);

            this.innerView.addChild(checkBox);
        });
    }

    /**
     * Remove items from a group.
     * @param ids
     */
    removeItems(ids: number[])
    {
        ids.forEach((id) =>
        {
            const item = this.items[id];

            if (!item) return;

            item.onChange.disconnectAll();

            this.innerView.removeChild(item);

            this.items.splice(id, 1);
        });
    }

    /**
     * Select item by ID.
     * @param id
     */
    selectItem(id: number)
    {
        this.items.forEach((item, key) =>
        {
            item.forceCheck(key === id);
        });

        if (this.selected !== id)
        {
            this.onChange.emit(id, this.items[id].labelText?.text);
        }

        this.value = this.options.items[id].labelText?.text;
        this.selected = id;
    }
}

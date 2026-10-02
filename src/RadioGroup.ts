import { Container, ContainerOptions } from 'pixi.js';
import { CheckBox } from './CheckBox';
import { List, ListType } from './List';
import { Signal, SignalConnection } from './utils/Signal';

export type RadioBoxOptions = {
    items: CheckBox[];
    type: ListType;
    elementsMargin: number;
    selectedItem?: number;
} & ContainerOptions;

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

    /**
     * This group's own subscriptions to each item, so they can be released
     * individually. Calling onChange.disconnectAll() on a CheckBox would also
     * sever the connection it makes to its own onCheck signal.
     */
    protected itemConnections: SignalConnection[] = [];

    /** {@link List}, that holds and control all inned checkboxes.  */
    innerView: List | undefined;

    /** Text value of the selected item. */
    value: string = '';

    /** ID of the selected item. */
    selected: number = 0;

    /** Fires, when new item is selected. */
    onChange: Signal<(selectedItemID: number, selectedVal: string) => void>;

    protected options: RadioBoxOptions;

    constructor(options?: RadioBoxOptions)
    {
        if (options)
        {
            const {
                items: _0,
                type: _1,
                elementsMargin: _2,
                selectedItem: _3,
                ...rest
            } = options;

            super(rest);
        }
        else
        {
            super();
        }

        const defaultOptions: RadioBoxOptions = {
            items: [],
            type: 'vertical',
            elementsMargin: 0,
            selectedItem: 0,
        };

        this.options = { ...defaultOptions, ...options };
        this.onChange = new Signal();

        this.init(this.options);
    }

    /**
     * Initiates a group.
     * @param options
     */
    init(options: RadioBoxOptions)
    {
        this.options = options;

        this.selected = options.selectedItem ?? 0; // first item by default
        this.value = options.items[this.selected]?.labelText?.text ?? '';

        if (this.innerView)
        {
            this.innerView.type = options.type;
            this.innerView.elementsMargin = options.elementsMargin;
        }
        else
        {
            this.innerView = new List({
                type: options.type,
                elementsMargin: options.elementsMargin,
            });
        }

        this.resetItems();
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
        if (!items?.length) return;

        items.forEach((checkBox) =>
        {
            // Resolved at emit time so it survives a later removeItems splice.
            this.itemConnections.push(
                checkBox.onChange.connect(() => this.selectItem(this.items.indexOf(checkBox))),
            );

            this.items.push(checkBox);

            this.innerView?.addChild(checkBox);
        });
    }

    /** Detaches every item, so a repeated init() does not stack duplicates. */
    protected resetItems()
    {
        this.itemConnections.forEach((connection) => connection.disconnect());
        this.itemConnections.length = 0;

        this.items.forEach((item) => this.innerView?.removeChild(item));
        this.items.length = 0;
    }

    /**
     * Remove items from a group.
     * @param ids
     */
    removeItems(ids: number[])
    {
        // Descending, so each splice cannot shift an index that is still pending.
        [...ids].sort((a, b) => b - a).forEach((id) =>
        {
            const item = this.items[id];

            if (!item) return;

            this.itemConnections[id]?.disconnect();
            this.itemConnections.splice(id, 1);

            this.innerView?.removeChild(item);

            this.items.splice(id, 1);
        });
    }

    /**
     * Select item by ID.
     * @param id
     */
    selectItem(id: number)
    {
        const target = this.items[id];

        if (!target) return;

        this.items.forEach((item, key) =>
        {
            item.forceCheck(key === id);
        });

        const value = target.labelText?.text ?? '';

        if (this.selected !== id)
        {
            this.onChange.emit(id, value);
        }

        this.value = value;
        this.selected = id;
    }
}

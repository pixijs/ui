import { Container } from '@pixi/display';
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
 * Creates a container-based group of checkbox elements, that can be used as radio buttons.
 *
 * Only one checkbox can be selected at a time.
 *
 * List of items is passed as an array of {@link CheckBox} objects.
 * That should be created before passing to the RadioGroup.
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
    private items: CheckBox[] = [];

    /** {@link List}, that holds and control all inned checkboxes.S  */
    public innerView: List;

    /** Text value of the selected item. */
    public value: string;

    /** ID of the selected item. */
    public selected: number;

    /** Fires, when new item is selected. */
    public onChange: Signal<(selectedItemID: number, selectedVal: string) => void>;

    private options: RadioBoxOptions;

    constructor(options: RadioBoxOptions)
    {
        super();

        this.options = options;

        this.value = options.items[options.selectedItem || 0].label.text;

        this.selected = options.selectedItem;

        this.innerView = new List({
            type: options.type,
            elementsMargin: options.elementsMargin
        });

        options.items.forEach((checkBox, id) =>
        {
            checkBox.onChange.connect(() => this.selectItem(id));

            this.items.push(checkBox);

            this.innerView.addChild(checkBox);
        });

        this.selectItem(options.selectedItem || 0); // select first item by default

        this.addChild(this.innerView);

        this.onChange = new Signal();
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

        if (this.selected !== id)
        {
            this.onChange.emit(id, this.items[id].label.text);
        }

        this.value = this.options.items[id].label.text;
        this.selected = id;
    }
}

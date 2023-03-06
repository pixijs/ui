import { Container } from '@pixi/display';
import { TextStyle, ITextStyle, Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Switcher } from './Switcher';
import { getView } from './utils/helpers/view';

type CheckBoxStyle = {
    checked: Container | string;
    unchecked: Container | string;
    text?: TextStyle | Partial<ITextStyle>;
    textOffset?: {
        x?: number;
        y?: number;
    };
};

export type CheckBoxOptions = {
    style: CheckBoxStyle;
    text?: string;
    checked?: boolean;
};

/**
 * Creates a container-based checkbox element.
 * @example
 *  new CheckBox({
 *     style: {
 *         unchecked: `switch_off.png`,
 *         checked: `switch_on.png`,
 *     }
 *  });
 */
export class CheckBox extends Switcher
{
    //* Text label */
    public label!: Text;

    /** Signal emitted when checkbox state changes. */
    public onCheck: Signal<(state: boolean) => void>;

    constructor(options: CheckBoxOptions)
    {
        const unchecked = getView(options.style.unchecked);
        const checked = getView(options.style.checked);

        super([unchecked, checked], ['onPress'], options.checked ? 1 : 0);

        this.label = new Text(options.text ?? '', options.style.text);
        this.label.visible = options.text?.length > 0;
        this.label.x = unchecked.width + 10 + (options.style.textOffset?.x ?? 0);
        this.label.y
            = ((unchecked.height - this.label.height) / 2) + (options.style.textOffset?.y ?? 0);

        this.addChild(this.label);

        this.onCheck = new Signal();

        this.onChange.connect(() => this.onCheck.emit(this.checked));
    }

    /** Getter, which returns a checkbox state. */
    public get checked(): boolean
    {
        return this.active === 1;
    }

    /** Setter, which sets a checkbox state. */
    public set checked(checked: boolean)
    {
        this.switch(checked ? 1 : 0, 'onPress');
    }

    /**
     * Setter, that sets a checkbox state without emitting a signal.
     * @param checked
     */
    public forceCheck(checked: boolean)
    {
        this.forceSwitch(checked ? 1 : 0);
    }
}

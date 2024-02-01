import { Container } from '@pixi/display';
import { TextStyle, ITextStyle, Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Switcher } from './Switcher';
import { cleanup } from './utils/helpers/cleanup';
import { getView } from './utils/helpers/view';

type LabelStyle = TextStyle | Partial<ITextStyle>;

type CheckBoxStyle = {
    checked: Container | string;
    unchecked: Container | string;
    text?: LabelStyle;
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
    label!: Text;

    /** Signal emitted when checkbox state changes. */
    onCheck: Signal<(state: boolean) => void>;

    protected _style: CheckBoxStyle;

    constructor(options: CheckBoxOptions)
    {
        super();

        this.text = options.text;

        this.style = options.style;

        this.checked = options.checked;

        this.triggerEvents = ['onPress'];

        this.innerView.cursor = 'pointer';

        this.onCheck = new Signal();

        this.onChange.connect(() => this.onCheck.emit(this.checked));
    }

    protected addLabel(text?: string, style?: LabelStyle)
    {
        if (!text) return;

        this.label = new Text(text ?? '', style ?? this._style?.text);
        this.addChild(this.label);

        this.label.cursor = 'pointer';
        this.label.eventMode = 'static';
        this.label.on('pointertap', () => (this.checked = !this.checked));
    }

    /** Setter, which sets a checkbox text. */
    set text(text: string)
    {
        if (!text)
        {
            cleanup(this.label);

            return;
        }

        this.label ? (this.label.text = text) : this.addLabel(text);
    }

    /** Getter, which returns a checkbox text. */
    get text(): string | ''
    {
        return this.label?.text ?? '';
    }

    /** Setter, which sets a checkbox style settings. */
    set style(style: CheckBoxStyle)
    {
        // Preserve checked state for the end of the method
        const wasChecked = this.checked;

        this._style = style;

        const { unchecked, checked } = style;

        const uncheckedView = getView(unchecked);
        const checkedView = getView(checked);

        this.views = [uncheckedView, checkedView];

        if (wasChecked)
        {
            checkedView.visible = true;
            this.active = 1;
        }
        else
        {
            uncheckedView.visible = true;
        }

        if (this.label)
        {
            if (style.text) this.label.style = style.text;

            this.label.x = uncheckedView.width + 10 + (style.textOffset?.x ?? 0);
            this.label.y = ((uncheckedView.height - this.label.height) / 2) + (style.textOffset?.y ?? 0);
        }
    }

    /** Getter, which returns a checkbox style settings. */
    get style(): CheckBoxStyle
    {
        return this._style;
    }

    /** Getter, which returns a checkbox state. */
    get checked(): boolean
    {
        return this.active === 1;
    }

    /** Setter, which sets a checkbox state. */
    set checked(checked: boolean)
    {
        this.switch(checked ? 1 : 0);
    }

    /**
     * Setter, that sets a checkbox state without emitting a signal.
     * @param checked
     */
    forceCheck(checked: boolean)
    {
        this.forceSwitch(checked ? 1 : 0);
    }
}

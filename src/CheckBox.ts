import { Container } from '@pixi/display';
import { TextStyle, ITextStyle, Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Switcher } from './Switcher';
import { cleanup } from './utils/helpers/cleanup';
import { getView } from './utils/helpers/view';

type LabelStyle = TextStyle | Partial<ITextStyle>;

type CustomTextOptions = {
    /** Override the text class to use, otherwise it will use the default Pixi Text */
    textClass?: new (...args: any[]) => any;
    /**
     * Custom options to be passed to the custom text class which will be
     * in form of an array of arguments and will append after the text string when instantiating.
     * If it's a single option object, please also wrap it in an array.
     *
     * eg:
     * - [arg1, arg2, arg3] => new TextClass(text, arg1, arg2, arg3)
     * - [{ arg1, arg2, arg3 }] => new TextClass(text, { arg1, arg2, arg3 })
     *
     * If not provided, it will use the specified text style if also supplied.
     */
    textArgs?: any;
    /**
     * This is explicity for custom text classes that expect text string to be supplied
     * within a single options object. The text string will be added to the object with the
     * key specified here.
     *
     * eg:
     * { `consolidateOptionsWithKey`: 'label', textArgs: [{ arg1, arg2, arg3 }] }
     * => new TextClass({ arg1, arg2, arg3, label: text })
     */
    consolidateOptionsWithKey?: string;
    /**
     * Provide a function to update the text view.
     * Good for the custom text class that doesn't have a direct text property
     * that the default update function makes use of.
     */
    textUpdate?: (label: any, text: string) => void;
};

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
    customText?: CustomTextOptions;
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

    protected _customTextOptions: CustomTextOptions;

    constructor(options: CheckBoxOptions)
    {
        super();

        this._customTextOptions = options.customText;

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

        const TextClass = this._customTextOptions?.textClass ?? Text;
        const args = this._customTextOptions?.textArgs;
        const textKey = this._customTextOptions?.consolidateOptionsWithKey;

        text = text ?? '';
        style = style ?? this._style?.text;

        if (textKey)
        {
            this.label = new TextClass({ [textKey]: text, ...style, ...args });
        }
        else if (args)
        {
            this.label = new TextClass(text, ...args);
        }
        else
        {
            this.label = new TextClass(text, style);
        }

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

        this.label ? this.updateText(text) : this.addLabel(text);
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
            if (style.text && this.label.style) this.label.style = style.text;

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

    protected updateText(value: string)
    {
        if (!this.label) return;

        if (this._customTextOptions.textUpdate)
        {
            this._customTextOptions.textUpdate(this.label, value);

            return;
        }

        this.label.text = value;
    }
}

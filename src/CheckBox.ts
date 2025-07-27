import { Text } from 'pixi.js';
import { Signal } from 'typed-signals';
import { Switcher } from './Switcher';
import { cleanup } from './utils/helpers/cleanup';
import { PixiText, PixiTextClass, PixiTextStyle } from './utils/helpers/text';
import { getView, type GetViewSettings } from './utils/helpers/view';

type CheckBoxStyle = {
    checked: GetViewSettings;
    unchecked: GetViewSettings;
    text?: PixiTextStyle;
    textOffset?: {
        x?: number;
        y?: number;
    };
};

export type CheckBoxOptions = {
    style: CheckBoxStyle;
    text?: string;
    TextClass?: PixiTextClass;
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
    labelText!: PixiText;

    /** Signal emitted when checkbox state changes. */
    onCheck: Signal<(state: boolean) => void>;

    protected _style: CheckBoxStyle;
    protected _textClass: PixiTextClass;

    constructor(options: CheckBoxOptions)
    {
        super();

        this._textClass = options.TextClass ?? Text;
        this.text = options.text;

        this.style = options.style;

        this.checked = options.checked;

        this.triggerEvents = ['onPress'];

        this.innerView.cursor = 'pointer';

        this.onCheck = new Signal();

        this.onChange.connect(() => this.onCheck.emit(this.checked));
    }

    protected addLabel(text?: string, style?: PixiTextStyle)
    {
        if (!text) return;

        this.labelText = new this._textClass({
            text: text ?? '',
            style: style ?? this._style?.text,
        });
        this.addChild(this.labelText);

        this.labelText.cursor = 'pointer';
        this.labelText.eventMode = 'static';
        this.labelText.on('pointertap', () => (this.checked = !this.checked));
    }

    /** Setter, which sets a checkbox text. */
    set text(text: string)
    {
        if (!text)
        {
            cleanup(this.labelText);

            return;
        }

        this.labelText ? (this.labelText.text = text) : this.addLabel(text);

        this.alignText();
    }

    /** Getter, which returns a checkbox text. */
    get text(): string | ''
    {
        return this.labelText?.text ?? '';
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

        if (this.labelText)
        {
            checkedView.visible = true;
            this.active = 1;
            this.alignText();
        }
        else
        {
            uncheckedView.visible = true;
        }
    }

    /** Getter, which returns a checkbox style settings. */
    get style(): CheckBoxStyle
    {
        return this._style;
    }

    /**
     * Aligns the text label based on the checkbox style.
     * This method calculates the position of the text label based on the checkbox's unchecked view dimensions
     * and applies any specified text offsets.
     * It ensures that the text label is centered vertically and positioned to the right of the checkbox
     * with an optional offset.
     * This method is called after the checkbox style is set or when the text label is updated
     * to ensure that the text label is always correctly positioned relative to the checkbox.
     * @see {@link CheckBoxStyle.textOffset} for offset options.
     * @see {@link getView} for how views are created.
     */
    alignText()
    {
        if (this.style.text)
        {
            this.labelText.style = this.style.text;
        }

        const { unchecked } = this.style;

        const uncheckedView = getView(unchecked);

        this.labelText.x = uncheckedView.width + 10 + (this.style.textOffset?.x ?? 0);
        this.labelText.y
            = ((uncheckedView.height - this.labelText.height) / 2) + (this.style.textOffset?.y ?? 0);
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

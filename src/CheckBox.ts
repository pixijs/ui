import { Text } from '@pixi/text';
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
    label!: PixiText;

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

        this.label = new this._textClass(text ?? '', style ?? this._style?.text);
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

        this.alignLabel();
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
            if (style.text)
            {
                if ('style' in this.label)
                {
                    this.label.style = style.text;
                }
                else
                {
                    Object.assign(this.label, style.text);
                }
            }

            this.alignLabel();
        }
    }

    /** Getter, which returns a checkbox style settings. */
    get style(): CheckBoxStyle
    {
        return this._style;
    }

    /**
     * Aligns the label to the checkbox view.
     * This method calculates the position of the label based on the checkbox view dimensions and applies the
     * specified text offset.
     * This method is called after the checkbox style is set or when the label text changes.
     * It ensures that the label is positioned correctly relative to the checkbox view.
     * @see {@link CheckBoxStyle.textOffset} for customizing the label position.
     */
    alignLabel()
    {
        const { unchecked } = this.style;

        const uncheckedView = getView(unchecked);

        this.label.x = uncheckedView.width + 10 + (this.style.textOffset?.x ?? 0);
        this.label.y = ((uncheckedView.height - this.label.height) / 2) + (this.style.textOffset?.y ?? 0);
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

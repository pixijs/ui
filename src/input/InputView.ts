import {
    BitmapFontManager,
    BitmapText,
    CanvasTextMetrics,
    Color,
    ColorSource,
    Container,
    Graphics,
    NineSliceSprite,
    Optional,
    Size,
    Sprite,
    Text,
    TextStyle,
    Texture,
} from 'pixi.js';
import { getView } from '../utils/helpers/view';
import {
    SECURE_CHARACTER,
    SELECTION_ALPHA,
} from './constants';

import type { PixiText } from '../utils/helpers/text';
import type { Padding } from '../utils/HelpTypes';
import type { InputOptions, SelectionDirection, ViewType } from './types';

/**
 * First layer of {@link Input}: the state it is drawn from, the background, mask and sizing, and
 * how the text is measured, mapped to positions, laid out and scrolled. Not meant to be used on
 * its own; {@link Input} is the component.
 */
export class InputView extends Container
{
    /**
     * Resolves the options and sets up the parts that do not depend on the subclasses' state;
     * the background, and with it the text, are created by {@link Input}'s constructor.
     * @param options - options of the input, see {@link Input}.
     */
    constructor(options: InputOptions)
    {
        const {
            bg: _bg,
            textStyle: _0,
            TextClass: _1,
            placeholder: _2,
            value: _3,
            maxLength: _4,
            secure: _5,
            align: _6,
            padding: _7,
            cleanOnFocus: _8,
            nineSliceSprite: _9,
            addMask: _10,
            inputAttributes: _11,
            ...rest
        } = options;

        super(rest);

        // Establish sensible defaults for all input options
        // to avoid null checks throughout the component
        const defaultOptions: InputOptions = {
            bg: Texture.WHITE,
            textStyle: {
                fill: 0x000000,
                align: 'center',
            },
            TextClass: Text,
            placeholder: '',
            value: '',
            maxLength: undefined,
            secure: false,
            align: 'left',
            padding: 0,
            cleanOnFocus: false,
            addMask: false,
        };

        this.options = { ...defaultOptions, ...options };

        this.padding = this.options.padding ?? 0;
        this._secure = this.options.secure ?? false;

        this.cursor = 'text';
        this.interactive = true;
    }

    protected _bg?: Container | NineSliceSprite | Graphics;

    protected inputMask: Container | NineSliceSprite | Graphics | undefined;

    protected _cursor: Sprite | undefined;

    protected _selection: Graphics | undefined;

    protected _value: string = '';

    protected _secure: boolean = false;

    protected inputField: PixiText | undefined;

    protected placeholder: PixiText | undefined;

    protected editing = false;

    protected tick = 0;

    protected textColor: ColorSource = 0x000000;

    /**
     * Mirror of the hidden field's selection, in UTF-16 code units of {@link Input.value}.
     * Collapsed (start === end) when there is just a caret.
     */
    protected selectionStart = 0;

    protected selectionEnd = 0;

    protected selectionDirection: SelectionDirection = 'none';

    /**
     * How far the text is shifted left, in local units, so the caret stays inside the visible
     * width when the text is wider than it. Zero while the text fits or the input is idle.
     */
    protected scrollX = 0;

    /** Prefix widths of the displayed text at each grapheme boundary, measured once per text and style. */
    protected metricsCache: { key: string; boundaries: number[]; widths: number[] } | undefined;

    protected readonly options: InputOptions;

    protected input: HTMLInputElement | undefined;

    /** Top side padding */
    paddingTop = 0;

    /** Right side padding */
    paddingRight = 0;

    /** Bottom side padding */
    paddingBottom = 0;

    /** Left side padding */
    paddingLeft = 0;

    /** What is drawn: the value itself, or one mask character per code unit when secure. */
    protected get displayText(): string
    {
        return this._secure ? SECURE_CHARACTER.repeat(this._value.length) : this._value;
    }

    /**
     * Width of a string in the text field's style. Only ever used as a ratio against the full
     * string, so the unit does not matter — which also keeps bitmap and canvas text on one path.
     * @param text - string to measure.
     */
    protected measureText(text: string): number
    {
        if (!this.inputField || !text.length) return 0;

        const style = this.inputField.style as TextStyle;

        if (this.inputField instanceof BitmapText)
        {
            return BitmapFontManager.measureText(text, style).width;
        }

        return CanvasTextMetrics.measureText(text, style).width;
    }

    /** Left edge of the drawn text in local coordinates, whatever its anchor. */
    protected get textLeft(): number
    {
        if (!this.inputField) return 0;

        return this.inputField.x - (this.inputField.anchor.x * this.inputField.width);
    }

    /**
     * Horizontal offset from {@link Input.textLeft} to the caret position before `index`.
     * @param index - position in the displayed text.
     */
    protected offsetAt(index: number): number
    {
        const { boundaries, widths } = this.textMetrics();
        const total = widths[widths.length - 1];

        if (!this.inputField || !total) return 0;

        // Selections sit on grapheme boundaries, so the width is normally already measured.
        const at = boundaries.indexOf(index);
        const prefix = at >= 0 ? widths[at] : this.measureText(this.displayText.substring(0, index));

        return this.inputField.width * (prefix / total);
    }

    /**
     * Widths of every grapheme prefix of the displayed text, in the text's style. Measured once
     * per text and style rather than on every pointer move, which would be quadratic in the length.
     */
    protected textMetrics(): { boundaries: number[]; widths: number[] }
    {
        const text = this.displayText;
        const style = this.inputField?.style as TextStyle | undefined;
        // Keyed on the value, not the drawn text: masked values of one length draw the same but
        // have different character boundaries.
        const key = `${style?.styleKey ?? ''}\u0000${this._secure ? 1 : 0}\u0000${this._value}`;

        if (this.metricsCache?.key === key) return this.metricsCache;

        const boundaries = [0];
        const widths = [0];
        let index = 0;

        // Boundaries are those of the value, so a press can never land inside a surrogate pair or
        // combining sequence even when it is masked. The mask has one character per code unit, so
        // the same index measures the drawn prefix.
        for (const grapheme of CanvasTextMetrics.graphemeSegmenter(this._value))
        {
            index += grapheme.length;
            boundaries.push(index);
            widths.push(this.measureText(text.substring(0, index)));
        }

        this.metricsCache = { key, boundaries, widths };

        return this.metricsCache;
    }

    /**
     * The caret index nearest to an x in local coordinates, see {@link Input.indexAt}.
     * @param localX - x in the component's local space.
     */
    protected indexAtLocalX(localX: number): number
    {
        if (!this.inputField) return 0;

        const x = localX - this.textLeft;
        const { boundaries, widths } = this.textMetrics();
        const total = widths[widths.length - 1];

        if (!total) return 0;

        const scale = this.inputField.width / total;
        let best = 0;
        let bestDistance = Math.abs(x);

        for (let i = 1; i < boundaries.length; i++)
        {
            const distance = Math.abs(x - (widths[i] * scale));

            if (distance < bestDistance)
            {
                best = boundaries[i];
                bestDistance = distance;
            }
        }

        return best;
    }

    protected init()
    {
        const {
            textStyle = { fill: 0x000000, align: 'center' },
            TextClass = Text,
            placeholder = ''
        } = this.options;

        const colorSource = textStyle.fill && Color.isColorLike(textStyle.fill)
            ? textStyle.fill
            : 0x000000;

        this.textColor = colorSource;

        this.inputField = new TextClass({
            text: '',
            style: textStyle,
        });

        // An input is one line: a wrapping style would stack it, and the caret is mapped along one line.
        this.inputField.style.wordWrap = false;

        this._cursor = new Sprite(Texture.WHITE);

        this._cursor.tint = colorSource;
        this._cursor.anchor.set(0.5);
        this._cursor.width = 2;
        this._cursor.height = this.inputField.height * 0.8;
        this._cursor.alpha = 0;

        this._selection = new Graphics();

        this.placeholder = new TextClass({
            text: placeholder,
            style: textStyle,
        });
        this.placeholder.visible = !!placeholder;

        // The highlight sits under the text so the glyphs stay legible over it.
        this.addChild(this._selection, this.inputField, this.placeholder, this._cursor);

        this.value = this.options.value ?? '';

        this.align();
    }

    set bg(bg: ViewType)
    {
        const previous = this._bg;

        // Use Texture.WHITE as fallback if bg is undefined
        const bgValue = bg ?? Texture.WHITE;
        let view: Container | NineSliceSprite | Graphics | undefined;

        if (this.options?.nineSliceSprite)
        {
            if (typeof bgValue === 'string')
            {
                view = new NineSliceSprite({
                    texture: Texture.from(bgValue),
                    leftWidth: this.options.nineSliceSprite[0],
                    topHeight: this.options.nineSliceSprite[1],
                    rightWidth: this.options.nineSliceSprite[2],
                    bottomHeight: this.options.nineSliceSprite[3],
                });
            }
            else if (bgValue instanceof Texture)
            {
                view = new NineSliceSprite({
                    texture: bgValue,
                    leftWidth: this.options.nineSliceSprite[0],
                    topHeight: this.options.nineSliceSprite[1],
                    rightWidth: this.options.nineSliceSprite[2],
                    bottomHeight: this.options.nineSliceSprite[3],
                });
            }
            else
            {
                console.warn(`NineSliceSprite can not be used with views set as Container.
                    Pass the texture or texture name as instead of the Container extended instance.`);
            }
        }

        if (!view)
        {
            view = getView(bgValue);
        }

        previous?.destroy();

        this._bg = view;
        this._bg.cursor = 'text';
        this._bg.interactive = true;

        this.addChildAt(this._bg, 0);

        if (!this.inputField)
        {
            this.init();
        }

        if (this.options.addMask)
        {
            this.createInputMask(bg);
        }
    }

    get bg(): Container | NineSliceSprite | Graphics | undefined
    {
        return this._bg;
    }

    protected align()
    {
        if (!this._bg) return;

        const align = this.getAlign();

        if (this.inputField)
        {
            this.updateScroll();

            this.inputField.anchor.set(align, 0.5);
            this.inputField.x
                = (this._bg.width * align) + (align === 1 ? -this.paddingRight : this.paddingLeft) - this.scrollX;
            this.inputField.y = (this._bg.height / 2) + this.paddingTop - this.paddingBottom;
        }

        if (this.placeholder)
        {
            this.placeholder.anchor.set(align, 0.5);
            this.placeholder.x
                = (this._bg.width * align) + (align === 1 ? -this.paddingRight : this.paddingLeft);
            this.placeholder.y = this._bg.height / 2;
        }

        if (this._cursor && this.inputField)
        {
            this._cursor.x = this.getCursorPosX();
            this._cursor.y = this.inputField.y;
        }

        this.drawSelection();
    }

    /** Redraws the selection highlight behind the selected range, or clears it when collapsed. */
    protected drawSelection(): void
    {
        if (!this._selection || !this.inputField || !this._cursor) return;

        this._selection.clear();

        if (!this.editing || this.selectionStart === this.selectionEnd) return;

        const from = this.offsetAt(this.selectionStart);
        const to = this.offsetAt(this.selectionEnd);
        const height = this._cursor.height;

        this._selection
            .rect(this.textLeft + from, this.inputField.y - (height / 2), to - from, height)
            .fill({ color: this.textColor, alpha: SELECTION_ALPHA });
    }

    /** Width available to the text: the background less the horizontal padding. */
    protected get viewWidth(): number
    {
        return (this._bg?.width ?? 0) - this.paddingLeft - this.paddingRight;
    }

    /** Whether the drawn text is wider than the space it has. */
    protected get isOverflowing(): boolean
    {
        return !!this.inputField && this.inputField.width > this.viewWidth;
    }

    /**
     * Shifts overflowing text so the caret stays inside the visible width, scrolling only as far
     * as needed in the caret's direction, as a native field does. Idle text shows its start.
     */
    protected updateScroll(): void
    {
        if (!this.inputField || !this.editing || !this.isOverflowing)
        {
            this.scrollX = 0;

            return;
        }

        const viewWidth = this.viewWidth;
        const caretIndex = this.selectionDirection === 'backward' ? this.selectionStart : this.selectionEnd;
        const caret = this.offsetAt(Math.min(caretIndex, this.displayText.length));
        let scroll = this.scrollX;

        if (caret - scroll > viewWidth)
        {
            scroll = caret - viewWidth;
        }
        else if (caret - scroll < 0)
        {
            scroll = caret;
        }

        this.scrollX = Math.max(0, Math.min(scroll, this.inputField.width - viewWidth));
    }

    protected getAlign(): 0 | 1 | 0.5
    {
        if (!(this._bg && this.inputField)) return 0;

        // Overflowing text is anchored at the left and scrolled behind the caret, as a native
        // field does; idle it shows its start.
        if (this.isOverflowing) return 0;

        switch (this.options.align)
        {
            case 'left':
                return 0;
            case 'center':
                return 0.5;
            case 'right':
                return 1;
            default:
                return 0;
        }
    }

    /** X of the drawn caret: the focus end of the selection, measured along the displayed text. */
    protected getCursorPosX()
    {
        if (!this.inputField) return 0;

        const caret = this.selectionDirection === 'backward' ? this.selectionStart : this.selectionEnd;

        return this.textLeft + this.offsetAt(Math.min(caret, this.displayText.length));
    }

    /** Sets the input text. */
    set value(text: string)
    {
        const value = text ?? '';
        const textLength = value.length;

        this._value = value;

        // A programmatic set has no selection of its own; keep the caret inside the new text.
        this.selectionStart = Math.min(this.selectionStart, textLength);
        this.selectionEnd = Math.min(this.selectionEnd, textLength);

        // During a session the hidden field is what the next keystroke edits, so a value set from
        // outside has to reach it, or that keystroke would bring the old text back. Equal values
        // are left alone: that is the field reporting its own edit, possibly mid-composition.
        if (this.editing && this.input && this.input.value !== value)
        {
            // A range over text that has been replaced means nothing, so it collapses to its end,
            // where a native field would put the caret; a plain caret stays where it was.
            this.selectionStart = this.selectionEnd;
            this.selectionDirection = 'none';
            this.input.value = value;
            this.input.setSelectionRange(this.selectionEnd, this.selectionEnd);
        }

        if (this.inputField)
        {
            this.inputField.text = this.displayText;
        }

        if (this.placeholder)
        {
            this.placeholder.visible = textLength === 0 && !this.editing;
        }

        this.align();
    }

    /** Return text of the input. */
    get value(): string
    {
        return this._value;
    }

    set secure(val: boolean)
    {
        this._secure = val;

        const type = val ? 'password' : 'text';

        if (this.input && this.input.type !== type)
        {
            // Changing the type resets the selection in some browsers; keep the caret where it was.
            const { selectionStart, selectionEnd, selectionDirection } = this.input;

            this.input.type = type;
            this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? 'none');
        }

        // Update text based on secure state (useful for show/hide password implementations)
        this.value = this._value;
    }

    get secure(): boolean
    {
        return this._secure;
    }

    /**
     * Set paddings
     * @param value - number, array of 4 numbers or object with keys: top, right, bottom, left
     * or: [top, right, bottom, left]
     * or: [top&bottom, right&left]
     * or: {
     *  left: 10,
     *  right: 10,
     *  top: 10,
     *  bottom: 10,
     * }
     */
    set padding(value: Padding)
    {
        if (typeof value === 'number')
        {
            this.paddingTop = value;
            this.paddingRight = value;
            this.paddingBottom = value;
            this.paddingLeft = value;
        }

        if (Array.isArray(value))
        {
            this.paddingTop = value[0] ?? 0;
            this.paddingRight = value[1] ?? value[0] ?? 0;
            this.paddingBottom = value[2] ?? value[0] ?? 0;
            this.paddingLeft = value[3] ?? value[1] ?? value[0] ?? 0;
        }
        else if (typeof value === 'object')
        {
            this.paddingTop = value.top ?? 0;
            this.paddingRight = value.right ?? 0;
            this.paddingBottom = value.bottom ?? 0;
            this.paddingLeft = value.left ?? 0;
        }
    }

    // Return array of paddings [top, right, bottom, left]
    get padding(): [number, number, number, number]
    {
        return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft];
    }

    /**
     * Sets width of a Input.
     * If nineSliceSprite is set, then width will be set to nineSliceSprite.
     * If nineSliceSprite is not set, then width will control components width as Container.
     * @param width - Width value.
     */
    override set width(width: number)
    {
        if (this.options?.nineSliceSprite)
        {
            if (this._bg)
            {
                this._bg.width = width;
            }

            this.updateInputMaskSize();

            this.align();
        }
        else
        {
            super.width = width;
        }
    }

    /** Gets width of Input. */
    override get width(): number
    {
        return super.width;
    }

    /**
     * Sets height of a Input.
     * If nineSliceSprite is set, then height will be set to nineSliceSprite.
     * If nineSliceSprite is not set, then height will control components height as Container.
     * @param height - Height value.
     */
    override set height(height: number)
    {
        if (this.options?.nineSliceSprite)
        {
            if (this._bg)
            {
                this._bg.height = height;
            }

            this.updateInputMaskSize();

            this.align();
        }
        else
        {
            super.height = height;
        }
    }

    /** Gets height of Input. */
    override get height(): number
    {
        return super.height;
    }

    override setSize(value: number | Optional<Size, 'height'>, height?: number): void
    {
        if (this.options?.nineSliceSprite)
        {
            if (this._bg)
            {
                this._bg.setSize(value, height);
            }

            this.updateInputMaskSize();
            this.align();
        }
        else
        {
            super.setSize(value, height);
        }
    }

    protected createInputMask(bg: ViewType)
    {
        if (this.inputMask)
        {
            if (this.inputField)
            {
                this.inputField.mask = null; // PixiJS API expects null
            }
            if (this._cursor)
            {
                this._cursor.mask = null; // PixiJS API expects null
            }
            if (this._selection)
            {
                this._selection.mask = null; // PixiJS API expects null
            }
            this.inputMask.destroy();
        }

        if (this.options?.nineSliceSprite && typeof bg === 'string')
        {
            this.inputMask = new NineSliceSprite({
                texture: Texture.from(bg),
                leftWidth: this.options.nineSliceSprite[0],
                topHeight: this.options.nineSliceSprite[1],
                rightWidth: this.options.nineSliceSprite[2],
                bottomHeight: this.options.nineSliceSprite[3],
            });
        }
        else if (bg instanceof Sprite)
        {
            this.inputMask = new Sprite(bg.texture);
        }
        else if (bg instanceof Graphics)
        {
            this.inputMask = bg.clone(true);
        }
        else
        {
            this.inputMask = getView(bg);
        }

        if (this.inputField)
        {
            this.inputField.mask = this.inputMask;
        }

        if (this._cursor)
        {
            this._cursor.mask = this.inputMask;
        }

        if (this._selection)
        {
            this._selection.mask = this.inputMask;
        }

        this.updateInputMaskSize();

        this.addChildAt(this.inputMask, 0);
    }

    protected updateInputMaskSize()
    {
        if (!this.inputMask || !this._bg) return;

        this.inputMask.setSize(
            this._bg.width - this.paddingLeft - this.paddingRight,
            this._bg.height - this.paddingTop - this.paddingBottom,
        );

        this.inputMask.position.set(this.paddingLeft, this.paddingTop);
    }
}

import {
    BitmapFontManager,
    BitmapText,
    CanvasTextMetrics,
    Color,
    Graphics,
    Sprite,
    Text,
    TextStyle,
    Texture,
} from 'pixi.js';
import { SELECTION_ALPHA } from './constants';
import { InputView } from './InputView';

/**
 * Second layer of {@link Input}: the text itself — creating the text, caret, highlight and
 * placeholder, measuring the drawn text, mapping between character indices and positions, and
 * laying it out, including the horizontal scroll that keeps the caret in view. Not meant to be
 * used on its own; {@link Input} is the component.
 */
export class InputText extends InputView
{
    /**
     * How far the text is shifted left, in local units, so the caret stays inside the visible
     * width when the text is wider than it. Zero while the text fits or the input is idle.
     */
    protected scrollX = 0;

    /** Prefix widths of the displayed text at each grapheme boundary, measured once per text and style. */
    protected metricsCache: { key: string; boundaries: number[]; widths: number[] } | undefined;

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
}

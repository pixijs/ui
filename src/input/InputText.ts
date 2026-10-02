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

/** One drawn line of a multiline text: a range of the value, and, once needed, where its characters sit. */
type TextLine = {
    /** Index of the first character in the value. */
    start: number;
    /** Index after the last character; the line break after it, if any, is not part of the line. */
    end: number;
    boundaries?: number[];
    widths?: number[];
};

/**
 * Second layer of {@link Input}: the text itself — creating the text, caret, highlight and
 * placeholder, measuring the drawn text, mapping between character indices and positions, and
 * laying it out, including the horizontal scroll that keeps the caret in view. Not meant to be
 * used on its own; {@link Input} is the component.
 * @ignore
 */
export class InputText extends InputView
{
    /**
     * How far the text is shifted left, in local units, so the caret stays inside the visible
     * width when the text is wider than it. Zero while the text fits or the input is idle.
     */
    protected scrollX = 0;

    /** How far a multiline text is shifted up, in local units, so the caret's line stays visible. */
    protected scrollY = 0;

    /** Wrapped lines of a multiline text, kept until the text, style or width changes. */
    protected layoutCache: { key: string; lines: TextLine[]; text: string } | undefined;

    /** Local size of a measured unit and the distance between lines, kept until the style changes. */
    protected probeCache: { key: string; unit: number; pitch: number } | undefined;

    /** Caret position the multiline text was last scrolled to follow. */
    protected scrolledTo = '';

    /** Whether this Input is a text area. */
    protected get multiline(): boolean
    {
        return !!this.options.multiline;
    }

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
        if (this.multiline) return this.offsetInLine(this.lineIndexOf(index), index);

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
     * The caret index nearest to an x in local coordinates, on the first line.
     * @deprecated Use {@link Input.indexAtLocal}, which also takes the y that picks the line of a multiline text.
     * @param localX - x in the component's local space.
     */
    protected indexAtLocalX(localX: number): number
    {
        return this.indexAtLocal(localX, 0);
    }

    /**
     * The caret index nearest to a point in local coordinates, see {@link Input.indexAt}.
     * @param localX - x in the component's local space.
     * @param localY - y in the component's local space; only a multiline text has more than one line to pick.
     */
    protected indexAtLocal(localX: number, localY = 0): number
    {
        if (!this.inputField) return 0;

        if (this.multiline)
        {
            const { lines } = this.layoutLines();
            const { pitch } = this.textProbe();
            const row = Math.max(0, Math.min(Math.floor((localY - this.inputField.y) / pitch), lines.length - 1));

            return this.indexInLine(row, localX - this.textLeft);
        }

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

        // The component wraps the lines itself, so the text object never does: the caret is mapped
        // along the lines it is given.
        this.inputField.style.wordWrap = false;

        if (this.multiline)
        {
            // The style may be shared with the placeholder or the caller; lines must start at the left.
            this.inputField.style = (this.inputField.style as TextStyle).clone();
            this.inputField.style.wordWrap = false;
            this.inputField.style.align = 'left';
        }

        this._cursor = new Sprite(Texture.WHITE);

        this._cursor.tint = colorSource;
        this._cursor.anchor.set(0.5);
        this._cursor.width = 2;
        this._cursor.height = this.multiline ? this.textProbe().pitch * 0.8 : this.inputField.height * 0.8;
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

        if (this.multiline)
        {
            this.alignLines();

            return;
        }

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

        if (this.multiline)
        {
            this.drawLineSelection();

            return;
        }

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
        return !this.multiline && !!this.inputField && this.inputField.width > this.viewWidth;
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
        if (!(this._bg && this.inputField) || this.multiline) return 0;

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

    /** Height available to a multiline text: the background less the vertical padding. */
    protected get viewHeight(): number
    {
        return (this._bg?.height ?? 0) - this.paddingTop - this.paddingBottom;
    }

    /** Whether a multiline text is taller than the space it has. */
    protected get isOverflowingY(): boolean
    {
        return this.multiline && !!this.inputField
            && this.layoutLines().lines.length * this.textProbe().pitch > this.viewHeight;
    }

    /** What the text object is given: the value cut into the lines it is drawn as. */
    protected override get drawnText(): string
    {
        return this.multiline && this.inputField ? this.layoutLines().text : this.displayText;
    }

    /**
     * Measures what a string of the text's style looks like on screen, once per style: the local
     * size of a unit of {@link InputText.measureText}, which differs between text classes, and the
     * distance between two lines.
     */
    protected textProbe(): { unit: number; pitch: number }
    {
        const field = this.inputField;
        const style = field?.style as TextStyle | undefined;
        const key = style?.styleKey ?? '';

        if (this.probeCache?.key === key) return this.probeCache;

        let unit = 1;
        let pitch = (Number(style?.fontSize) || 26) * 1.2;

        if (field)
        {
            const text = field.text;
            const sample = '0123456789';

            field.text = sample;

            const measured = this.measureText(sample);
            const oneLine = field.height;

            if (measured > 0 && field.width > 0) unit = field.width / measured;

            field.text = 'M\nM';

            if (field.height > oneLine) pitch = field.height - oneLine;

            field.text = text;
        }

        this.probeCache = { key, unit, pitch };

        return this.probeCache;
    }

    /**
     * Cuts the value into drawn lines: at every line break, and where a line would be wider than
     * the view, after the last space that fits or, for a word that does not, between characters.
     * Done once per text, style and width.
     */
    protected layoutLines(): { lines: TextLine[]; text: string }
    {
        const style = this.inputField?.style as TextStyle | undefined;
        const width = this.viewWidth;
        const key = `${style?.styleKey ?? ''}\u0000${this._secure ? 1 : 0}\u0000${width}\u0000${this._value}`;

        if (this.layoutCache?.key === key) return this.layoutCache;

        const lines: TextLine[] = [];
        const display = this.displayText;
        const limit = width / this.textProbe().unit;
        let base = 0;

        for (const paragraph of this._value.split('\n'))
        {
            this.wrapParagraph(lines, base, display.substring(base, base + paragraph.length), limit);
            base += paragraph.length + 1;
        }

        const text = lines.map((line) => display.substring(line.start, line.end)).join('\n');

        this.layoutCache = { key, lines, text };

        return this.layoutCache;
    }

    /**
     * Wraps one line of the value, which holds no line break, into `lines`.
     * @param lines - lines found so far, added to.
     * @param base - index of the paragraph's first character in the value.
     * @param paragraph - the paragraph as drawn.
     * @param limit - widest a line may be, in measured units; not positive for no limit.
     */
    protected wrapParagraph(lines: TextLine[], base: number, paragraph: string, limit: number): void
    {
        const ends: number[] = [];
        let index = 0;

        for (const grapheme of CanvasTextMetrics.graphemeSegmenter(paragraph))
        {
            index += grapheme.length;
            ends.push(index);
        }

        let lineStart = 0;
        let lastBreak = -1;
        let k = 0;

        while (k < ends.length)
        {
            const end = ends[k];
            const previous = k ? ends[k - 1] : 0;
            // A line always keeps one character, and spaces at its end may hang past the edge.
            const fits = limit <= 0 || previous <= lineStart
                || this.measureText(paragraph.substring(lineStart, end).trimEnd()) <= limit;

            if (!fits)
            {
                const at = lastBreak > lineStart ? lastBreak : previous;

                lines.push({ start: base + lineStart, end: base + at });
                lineStart = at;
                lastBreak = -1;

                continue;
            }

            if ((/\s/).test(paragraph.substring(previous, end))) lastBreak = end;

            k++;
        }

        lines.push({ start: base + lineStart, end: base + paragraph.length });
    }

    /**
     * The line a caret index is drawn on. An index where a wrapped line ends is the start of the next.
     * @param index - position in the value.
     */
    protected lineIndexOf(index: number): number
    {
        const { lines } = this.layoutLines();
        let row = 0;

        while (row + 1 < lines.length && lines[row + 1].start <= index) row++;

        return row;
    }

    /**
     * Where the characters of a line sit, measured once per layout.
     * @param row - index of the line.
     */
    protected lineMetrics(row: number): { line: TextLine; boundaries: number[]; widths: number[] }
    {
        const line = this.layoutLines().lines[row];

        if (!line.boundaries || !line.widths)
        {
            const { unit } = this.textProbe();
            const display = this.displayText;
            const boundaries = [0];
            const widths = [0];
            let index = 0;

            for (const grapheme of CanvasTextMetrics.graphemeSegmenter(this._value.substring(line.start, line.end)))
            {
                index += grapheme.length;
                boundaries.push(index);
                widths.push(this.measureText(display.substring(line.start, line.start + index)) * unit);
            }

            line.boundaries = boundaries;
            line.widths = widths;
        }

        return { line, boundaries: line.boundaries, widths: line.widths };
    }

    /**
     * Horizontal offset from the left of the text to a caret index on a line.
     * @param row - index of the line.
     * @param index - position in the value.
     */
    protected offsetInLine(row: number, index: number): number
    {
        const { line, boundaries, widths } = this.lineMetrics(row);
        const at = boundaries.indexOf(index - line.start);

        if (at >= 0) return widths[at];

        return this.measureText(this.displayText.substring(line.start, index)) * this.textProbe().unit;
    }

    /**
     * The caret index on a line nearest to an offset from the left of the text.
     * @param row - index of the line.
     * @param x - offset from {@link InputText.textLeft}.
     */
    protected indexInLine(row: number, x: number): number
    {
        const { line, boundaries, widths } = this.lineMetrics(row);
        // Where a wrapped line ends the caret is drawn on the next line, so it is not a choice here.
        const wrapped = this.layoutLines().lines[row + 1]?.start === line.end;
        const last = wrapped ? boundaries.length - 2 : boundaries.length - 1;
        let best = 0;
        let bestDistance = Math.abs(x);

        for (let i = 1; i <= last; i++)
        {
            const distance = Math.abs(x - widths[i]);

            if (distance < bestDistance)
            {
                best = i;
                bestDistance = distance;
            }
        }

        return line.start + boundaries[best];
    }

    /** Index of the caret end of the selection. */
    protected get caretIndex(): number
    {
        return Math.min(
            this.selectionDirection === 'backward' ? this.selectionStart : this.selectionEnd,
            this._value.length,
        );
    }

    /** Top of the drawn text in local coordinates. */
    protected get textTop(): number
    {
        return this.inputField?.y ?? 0;
    }

    /** Scrolls a multiline text vertically, only as far as needed to show the caret's line after the caret moved. */
    protected updateScrollY(): void
    {
        const total = this.layoutLines().lines.length * this.textProbe().pitch;
        const viewHeight = this.viewHeight;

        if (!this.editing || total <= viewHeight)
        {
            this.scrollY = 0;
            this.scrolledTo = '';

            return;
        }

        const { pitch } = this.textProbe();
        const caret = this.caretIndex;
        const marker = `${caret}:${this._value.length}`;
        let scroll = this.scrollY;

        // Moving the text some other way, such as the wheel, must not be undone by the next redraw.
        if (marker !== this.scrolledTo)
        {
            const top = this.lineIndexOf(caret) * pitch;

            if (top < scroll) scroll = top;
            else if (top + pitch > scroll + viewHeight) scroll = top + pitch - viewHeight;

            this.scrolledTo = marker;
        }

        this.scrollY = Math.max(0, Math.min(scroll, total - viewHeight));
    }

    /** Lays out a multiline text: the lines from the top-left, the caret on its line, the placeholder at the top. */
    protected alignLines(): void
    {
        if (!this._bg) return;

        const field = this.inputField;

        if (field)
        {
            field.text = this.layoutLines().text;
            this.updateScrollY();
            field.anchor.set(0, 0);
            field.x = this.paddingLeft;
            field.y = this.paddingTop - this.scrollY;
        }

        if (this.placeholder)
        {
            this.placeholder.anchor.set(0, 0);
            this.placeholder.x = this.paddingLeft;
            this.placeholder.y = this.paddingTop;
        }

        if (this._cursor && field)
        {
            const { pitch } = this.textProbe();

            this._cursor.height = pitch * 0.8;
            this._cursor.x = this.getCursorPosX();
            this._cursor.y = field.y + (this.lineIndexOf(this.caretIndex) * pitch) + (pitch / 2);
        }

        this.drawSelection();
    }

    /** Draws the selection highlight of a multiline text, one rectangle per line it touches. */
    protected drawLineSelection(): void
    {
        if (!this._selection || !this.inputField || !this._cursor) return;

        const { lines } = this.layoutLines();
        const { pitch } = this.textProbe();
        const height = this._cursor.height;
        const from = this.selectionStart;
        const to = this.selectionEnd;

        for (let row = this.lineIndexOf(from); row < lines.length && lines[row].start <= to; row++)
        {
            const { start, end } = lines[row];
            const left = Math.max(from, start);
            const right = Math.min(to, end);
            // A selected line break is drawn as a little extra width, as editors do.
            const breakSelected = this._value[end] === '\n' && from <= end && to > end;
            const x0 = this.offsetInLine(row, left);
            const x1 = this.offsetInLine(row, right) + (breakSelected ? pitch * 0.3 : 0);

            if (x1 > x0)
            {
                this._selection
                    .rect(this.textLeft + x0, this.textTop + (row * pitch) + ((pitch - height) / 2), x1 - x0, height)
                    .fill({ color: this.textColor, alpha: SELECTION_ALPHA });
            }
        }
    }

    /** X of the drawn caret: the focus end of the selection, measured along the displayed text. */
    protected getCursorPosX()
    {
        if (!this.inputField) return 0;

        const caret = this.selectionDirection === 'backward' ? this.selectionStart : this.selectionEnd;

        if (this.multiline) return this.textLeft + this.offsetAt(Math.min(caret, this._value.length));

        return this.textLeft + this.offsetAt(Math.min(caret, this.displayText.length));
    }
}

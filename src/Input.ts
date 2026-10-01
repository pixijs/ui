import {
    BitmapFontManager,
    BitmapText,
    CanvasTextMetrics,
    Color,
    ColorSource,
    Container,
    ContainerOptions,
    DestroyOptions,
    FederatedPointerEvent,
    Graphics,
    isMobile,
    NineSliceSprite,
    Optional,
    Size,
    Sprite,
    Text,
    TextStyle,
    Texture,
    Ticker,
} from 'pixi.js';
import { Signal } from 'typed-signals';
import { PixiText, PixiTextClass, PixiTextStyle } from './utils/helpers/text';
import { getView } from './utils/helpers/view';
import { ALIGN, type Padding } from './utils/HelpTypes';

type ViewType = Sprite | Graphics | Texture | string;

export type InputAlign = typeof ALIGN[number];

export type InputOptions = {
    bg: ViewType;
    textStyle?: PixiTextStyle;
    TextClass?: PixiTextClass;
    placeholder?: string;
    value?: string;
    maxLength?: number;
    secure?: boolean;
    align?: InputAlign;
    padding?: Padding;
    cleanOnFocus?: boolean;
    nineSliceSprite?: [number, number, number, number];
    addMask?: boolean;
    /**
     * Attributes set on the hidden native field, merged over the defaults: `autocomplete`,
     * `autocapitalize` and `autocorrect` off and `spellcheck` false, so keyboards neither
     * rewrite nor remember what is typed. Pass `inputmode` or `enterkeyhint` here as well.
     */
    inputAttributes?: Record<string, string>;
} & ContainerOptions;

const SECURE_CHARACTER = '*';
const SELECTION_ALPHA = 0.35;

const DEFAULT_INPUT_ATTRIBUTES: Record<string, string> = {
    autocomplete: 'off',
    autocapitalize: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    // Password managers key on these to leave a field alone.
    'data-lpignore': 'true',
    'data-1p-ignore': 'true',
    'data-bwignore': 'true',
};

/**
 * How long after a press on the component a blur of the hidden field is still taken to be caused
 * by that press. Desktop browsers move focus during the press itself, but touch browsers do it on
 * the tap gesture, which arrives after the pointer has already been released.
 */
const PRESS_BLUR_GRACE = 500;

/** Taps closer together than this, in time and in distance, count as one multi-tap sequence. */
const MULTI_TAP_INTERVAL = 350;
const MULTI_TAP_DISTANCE = 12;

/** A press on the hidden field that moves further than this, in CSS pixels, is a drag-selection rather than a tap. */
const DRAG_THRESHOLD = 6;

type SelectionDirection = 'forward' | 'backward' | 'none';

/**
 * Cuts a string to a length in UTF-16 code units without splitting a surrogate pair, so the
 * result never holds a lone surrogate.
 * @param text - string to cut.
 * @param maxLength - length to cut to.
 */
function clampLength(text: string, maxLength: number): string
{
    if (text.length <= maxLength) return text;

    const last = text.charCodeAt(maxLength - 1);
    const end = last >= 0xD800 && last <= 0xDBFF ? maxLength - 1 : maxLength;

    return text.substring(0, end);
}

/**
 * Container-based component that creates an input to read the user's text.
 * @example
 * new Input({
 *     bg: Sprite.from('input.png'),
 *     placeholder: 'Enter text',
 *     padding: {
 *      top: 11,
 *      right: 11,
 *      bottom: 11,
 *      left: 11
 *     } // alternatively you can use [11, 11, 11, 11] or [11, 11] or just 11
 * });
 */
export class Input extends Container
{
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

    /** Selection to apply once the hidden field exists, set by a pointer press before editing began. */
    protected pendingSelection: [number, number] | undefined;

    /** Index the pointer went down on while editing; set while a drag-selection is in progress. */
    protected dragAnchor: number | undefined;

    /**
     * `performance.now()` of the last press, drag or release on the component, so a blur of the
     * hidden field that the press caused can be told apart from focus genuinely leaving.
     */
    protected lastPressTime = -Infinity;

    /** True while the browser is composing text in the field (IME, or an Android keyboard composing a word). */
    protected composing = false;

    /** The component's own multi-tap count: Pixi counts per pointer id, and touch pointers change ids. */
    protected tapCount = 0;
    protected lastTapTime = -Infinity;
    protected lastTapX = 0;
    protected lastTapY = 0;

    /** Set around the synthetic `click()` on focus so it is not mistaken for a tap on the field. */
    protected clickingField = false;

    /** Selection a right-button press settled on, to put back after the context-menu request collapses it. */
    protected contextSelection: [number, number, SelectionDirection] | undefined;

    /**
     * How far the text is shifted left, in local units, so the caret stays inside the visible
     * width when the text is wider than it. Zero while the text fits or the input is idle.
     */
    protected scrollX = 0;

    /** Prefix widths of the displayed text at each grapheme boundary, measured once per text and style. */
    protected metricsCache: { key: string; boundaries: number[]; widths: number[] } | undefined;

    protected activation = false;
    protected readonly options: InputOptions;
    protected input: HTMLInputElement | undefined;

    protected handleActivationBinding = this.handleActivation.bind(this);
    protected onKeyDownBinding = this.onKeyDown.bind(this);
    protected onBlurBinding = this.onBlur.bind(this);
    protected onInputBinding = this.onInput.bind(this);
    protected onCompositionStartBinding = this.onCompositionStart.bind(this);
    protected onCompositionEndBinding = this.onCompositionEnd.bind(this);
    protected onFieldClickBinding = this.onFieldClick.bind(this);
    protected onFieldPointerDownBinding = this.onFieldPointerDown.bind(this);
    protected onFieldPointerMoveBinding = this.onFieldPointerMove.bind(this);
    protected onFieldPointerUpBinding = this.onFieldPointerUp.bind(this);

    /** Index a press on the hidden field went down on, while a drag-selection on it is possible. */
    protected fieldDragAnchor: number | undefined;

    /** True once a press on the hidden field has dragged, so the click that ends it is not taken as a tap. */
    protected fieldDragged = false;
    protected fieldPressX = 0;
    protected fieldPressY = 0;
    protected onAnyPointerDownBinding = this.onAnyPointerDown.bind(this);
    protected onContextMenuBinding = this.onContextMenu.bind(this);

    /**
     * Kept as a field so destroy() can detach it from the shared ticker.
     * @param ticker - shared ticker, supplying the delta that drives the cursor blink.
     */
    protected readonly tickerUpdate = (ticker: Ticker) => this.update(ticker.deltaTime);

    /** Fires when input loses focus. */
    onEnter: Signal<(text: string) => void>;

    /** Fires every time input string is changed. */
    onChange: Signal<(text: string) => void>;

    /** Top side padding */
    paddingTop = 0;

    /** Right side padding */
    paddingRight = 0;

    /** Bottom side padding */
    paddingBottom = 0;

    /** Left side padding */
    paddingLeft = 0;

    /**
     * Creates an input.
     * @param { number } options - Options object to use.
     * @param { Sprite | Graphics | Texture | string } options.bg - Background of the Input.
     * <br> Can be a string (name of texture) or an instance of Texture, Sprite or Graphics.
     * <br> If you want to use NineSliceSprite, you have to pass a text (name of texture)
     * or an instance of Texture as a parameter.
     * @param { PixiTextStyle } options.textStyle - Text style of the Input.
     * @param { string } options.placeholder - Placeholder of the Input.
     * @param { string } options.value - Value of the Input.
     * @param { number } options.maxLength - Max length of the Input.
     * @param { 'left' | 'center' | 'right' } options.align - Align of the Input.
     * @param { Padding } options.padding - Padding of the Input.
     * @param { number } options.padding.top - Top padding of the Input.
     * @param { number } options.padding.right - Right padding of the Input.
     * @param { number } options.padding.bottom - Bottom padding of the Input.
     * @param { number } options.padding.left - Left padding of the Input.
     * @param { boolean } options.cleanOnFocus - Clean Input on focus.
     * @param { Record<string, string> } options.inputAttributes - Attributes for the hidden native field,
     * merged over the defaults that turn off autocomplete, autocapitalize, autocorrect and spellcheck.
     * @param { boolean } options.addMask - Add mask to the Input text, so it is cut off when it does not fit.
     * @param { Array } options.nineSliceSprite - NineSliceSprite values for bg and fill ([number, number, number, number]).
     * <br> <b>!!! IMPORTANT:</b> To make it work, you have to pass a texture name or texture instance as a bg parameter.
     */
    constructor(options: InputOptions)
    {
        const {
            bg,
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

        this.on('pointerdown', this.onPointerDown, this);
        this.on('globalpointermove', this.onPointerMove, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerupoutside', this.onPointerUp, this);
        this.on('pointertap', (e: FederatedPointerEvent) =>
        {
            // Counted before the editing check so a double click on an idle input, which starts
            // editing on its first tap, still selects a word on its second as a native field does.
            // Only the main button selects by multi-click; a right click is a context-menu gesture.
            const clicks = (e.button ?? 0) === 0 ? Math.max(e.detail ?? 1, this.countTap(e)) : 1;

            // A tap during a session is a caret or selection gesture, not an activation; leaving
            // `activation` set here would restart editing on the very click that ends it.
            if (this.editing)
            {
                this.onPointerTap(e, clicks);

                return;
            }

            this.activation = true;
            isMobile.any && this.handleActivation(); // handleActivation always call before this function called.
        });

        window.addEventListener(isMobile.any ? 'touchstart' : 'click', this.handleActivationBinding);
        // Capture phase: runs before the component's own pointerdown, which re-marks the press if it was on it.
        window.addEventListener('pointerdown', this.onAnyPointerDownBinding, true);
        window.addEventListener('contextmenu', this.onContextMenuBinding, true);

        this.onEnter = new Signal();
        this.onChange = new Signal();

        Ticker.shared.add(this.tickerUpdate);

        if (bg)
        {
            this.bg = bg;
        }
        else
        {
            console.error('Input: bg is not defined, please define it.');
        }
    }

    /**
     * Mirrors the hidden native input, which is the only thing that knows what the text
     * actually is. Reconstructing it from `keydown` cannot work on mobile: on-screen
     * keyboards report `Unidentified` there and only send the real characters on `input`,
     * and composition, autocorrect and suggestions have no `keydown` representation at all.
     */
    protected onInput()
    {
        if (!this.input) return;

        if (!this.editing)
        {
            this.input.value = '';

            return;
        }

        const { maxLength } = this.options;
        let text = this.input.value;
        let overLimit = false;

        if (maxLength && text.length > maxLength)
        {
            // Native maxLength does not apply to suggestions, replacements or an over-long seed.
            // Writing the field during a composition would abort it (and confuse Android keyboards,
            // which compose every word), so the cut waits for compositionend; until then the
            // over-long text is mirrored but not reported.
            if (this.composing)
            {
                overLimit = true;
            }
            else
            {
                const { selectionStart, selectionEnd, selectionDirection } = this.input;

                text = clampLength(text, maxLength);
                this.input.value = text;
                this.input.setSelectionRange(
                    Math.min(selectionStart ?? text.length, text.length),
                    Math.min(selectionEnd ?? text.length, text.length),
                    selectionDirection ?? 'none',
                );
            }
        }

        if (text !== this.value)
        {
            this.value = text;

            if (!overLimit)
            {
                this.onChange.emit(this.value);
            }
        }

        this.syncSelection();
    }

    protected onCompositionStart(): void
    {
        this.composing = true;
    }

    /** The composed text is committed; apply anything that had to wait for it, such as the maxLength cut. */
    protected onCompositionEnd(): void
    {
        this.composing = false;
        this.onInput();
    }

    /**
     * Copies the hidden field's selection into the component and moves the drawn caret and
     * selection highlight to match. The browser owns caret movement — arrows, Home/End,
     * Shift-selection, word jumps — so this is read back rather than reimplemented.
     */
    protected syncSelection(): void
    {
        if (!this.input) return;

        const length = this.value.length;
        const start = Math.min(this.input.selectionStart ?? length, length);
        const end = Math.min(this.input.selectionEnd ?? length, length);
        const direction = this.input.selectionDirection ?? 'none';

        if (start === this.selectionStart && end === this.selectionEnd && direction === this.selectionDirection)
        {
            return;
        }

        this.selectionStart = start;
        this.selectionEnd = end;
        this.selectionDirection = direction;

        // Keep the caret solid while it is being moved, as native fields do.
        this.tick = 0;

        this.align();
    }

    /**
     * Sets the selection on the hidden field and mirrors it back.
     * @param start - first selected index.
     * @param end - index after the last selected one; equal to `start` for a plain caret.
     * @param direction - which end holds the caret, for Shift-extension.
     */
    protected setSelection(start: number, end: number, direction: SelectionDirection = 'none'): void
    {
        if (!this.input) return;

        this.input.setSelectionRange(start, end, direction);
        this.syncSelection();
    }

    /** Selects the whole value. */
    selectAll(): void
    {
        this.setSelection(0, this.value.length);
    }

    /**
     * Selects the run of like characters (word, whitespace or punctuation) around an index,
     * as a double click does in a native field.
     * @param index - position in {@link Input.value} to expand from.
     */
    protected selectWordAt(index: number): void
    {
        const text = this.displayText;

        if (!text.length) return;

        const kind = (ch: string) =>
        {
            if ((/[\p{L}\p{N}_]/u).test(ch)) return 'word';

            return (/\s/).test(ch) ? 'space' : 'other';
        };

        let pivot = Math.min(index, text.length - 1);

        // A click just past a word belongs to that word, not to the gap after it.
        if (pivot > 0 && kind(text[pivot]) === 'space' && kind(text[pivot - 1]) !== 'space')
        {
            pivot--;
        }

        const target = kind(text[pivot]);
        let start = pivot;
        let end = pivot + 1;

        while (start > 0 && kind(text[start - 1]) === target) start--;
        while (end < text.length && kind(text[end]) === target) end++;

        this.setSelection(start, end);
    }

    protected onPointerDown(e: FederatedPointerEvent): void
    {
        // A second finger must not move the caret or start a drag of its own.
        if (e.isPrimary === false) return;

        const index = this.indexAt(e);

        if (!this.editing || !this.input)
        {
            // Editing starts on the following tap; place the caret where the press landed.
            this.pendingSelection = [index, index];

            return;
        }

        // Cancelling pointerdown drops the compatibility mouse events, but browsers still move
        // focus to the canvas; onBlur uses the press time to hand it straight back to the field.
        (e.nativeEvent as Event | undefined)?.preventDefault?.();
        this.lastPressTime = performance.now();

        if (e.button === 2)
        {
            // A right click inside a selection keeps it, as native fields do; outside, it places the caret.
            const inside = this.selectionStart !== this.selectionEnd
                && index >= this.selectionStart && index <= this.selectionEnd;

            if (!inside)
            {
                this.setSelection(index, index);
            }

            // Chromium collapses the focused field's selection when the context menu is requested
            // outside the document selection; onContextMenu puts this back once that has happened.
            this.contextSelection = [this.selectionStart, this.selectionEnd, this.selectionDirection];

            return;
        }

        if (e.shiftKey)
        {
            const anchor = this.selectionDirection === 'backward' ? this.selectionEnd : this.selectionStart;

            this.dragAnchor = anchor;
            this.setSelection(Math.min(anchor, index), Math.max(anchor, index), index < anchor ? 'backward' : 'forward');
        }
        else
        {
            this.dragAnchor = index;
            this.setSelection(index, index);
        }
    }

    protected onPointerMove(e: FederatedPointerEvent): void
    {
        if (this.dragAnchor === undefined || !this.editing) return;

        this.lastPressTime = performance.now();

        const anchor = this.dragAnchor;
        const index = this.indexAt(e);

        this.setSelection(Math.min(anchor, index), Math.max(anchor, index), index < anchor ? 'backward' : 'forward');
    }

    protected onPointerUp(): void
    {
        if (this.dragAnchor !== undefined)
        {
            this.lastPressTime = performance.now();
        }

        this.dragAnchor = undefined;
    }

    /**
     * Any press anywhere on the page forgets the component's own, so a blur that follows a press
     * elsewhere, however quickly, ends the session. The component's pointerdown runs after this
     * and marks the press again when it was on the component.
     * @param e - the press, anywhere on the page.
     */
    protected onAnyPointerDown(e: Event): void
    {
        if ((e as PointerEvent).isPrimary === false) return;

        this.lastPressTime = -Infinity;

        // iOS Safari does not blur a field when non-interactive content is tapped, so a press that
        // turns out not to be on the component ends the session here. Where the browser does blur,
        // the session is already over by the time this runs.
        if (!this.editing || e.target === this.input) return;

        setTimeout(() =>
        {
            if (this.editing && this.lastPressTime === -Infinity)
            {
                this.stopEditing();
            }
        }, 0);
    }

    /**
     * Restores the selection a right-button press settled on. The browser adjusts the document
     * selection as part of showing a context menu, after the press, which collapses the hidden
     * field's selection; it is put back once the menu request has been processed.
     */
    protected onContextMenu(): void
    {
        const selection = this.contextSelection;

        this.contextSelection = undefined;

        if (!selection) return;

        setTimeout(() =>
        {
            if (this.editing && this.input)
            {
                this.setSelection(...selection);
            }
        }, 0);
    }

    /**
     * Ends the session when focus genuinely leaves — a click elsewhere, Tab, a dismissed keyboard.
     * A press on the component itself also blurs the hidden field, because the canvas takes
     * focus; that would end and restart editing on every caret move, losing the selection and
     * emitting onEnter, so focus is handed back instead. The press is recognised by time rather
     * than by a held flag: touch browsers move focus on the tap gesture, after the release, and a
     * cancelled pointer never reports a release at all.
     */
    protected onBlur(): void
    {
        const input = this.input;
        const pressInduced = performance.now() - this.lastPressTime < PRESS_BLUR_GRACE;

        if (!pressInduced || !input)
        {
            this.stopEditing();

            return;
        }

        const { selectionStart, selectionEnd, selectionDirection } = input;
        const restore = () =>
        {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? 'none');
        };

        // Synchronously keeps this inside the user gesture, which on-screen keyboards require;
        // if the browser has not finished moving focus yet, try again once it has.
        restore();

        if (document.activeElement !== input)
        {
            setTimeout(restore, 0);
        }
    }

    /**
     * Counts taps in a quick sequence at one spot, as a multi-click. Pixi's `detail` does this
     * per pointer id, and touch browsers issue a new id for every touch, so it stays at 1 there.
     * @param e - the tap.
     */
    protected countTap(e: FederatedPointerEvent): number
    {
        return this.countTapAt(e.global.x, e.global.y);
    }

    /**
     * Counts a tap at a position; see {@link Input.countTap}. The canvas path passes global
     * coordinates and the hidden-field path client coordinates, which never mix on one device.
     * @param x - horizontal position of the tap.
     * @param y - vertical position of the tap.
     */
    protected countTapAt(x: number, y: number): number
    {
        const now = performance.now();
        const near = Math.hypot(x - this.lastTapX, y - this.lastTapY) <= MULTI_TAP_DISTANCE;

        this.tapCount = near && now - this.lastTapTime <= MULTI_TAP_INTERVAL ? this.tapCount + 1 : 1;
        this.lastTapTime = now;
        this.lastTapX = x;
        this.lastTapY = y;

        return this.tapCount;
    }

    /**
     * @param e - the tap.
     * @param clicks - click count: 2 selects a word, 3 the whole value.
     */
    protected onPointerTap(e: FederatedPointerEvent, clicks = e.detail ?? 1): void
    {
        if (clicks === 2)
        {
            this.selectWordAt(this.indexAt(e));
        }
        else if (clicks >= 3)
        {
            this.selectAll();
        }
    }

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
        const key = `${style?.styleKey ?? ''}\u0000${text}`;

        if (this.metricsCache?.key === key) return this.metricsCache;

        const boundaries = [0];
        const widths = [0];
        let index = 0;

        for (const grapheme of CanvasTextMetrics.graphemeSegmenter(text))
        {
            index += grapheme.length;
            boundaries.push(index);
            widths.push(this.measureText(text.substring(0, index)));
        }

        this.metricsCache = { key, boundaries, widths };

        return this.metricsCache;
    }

    /**
     * The caret index nearest to a pointer, snapped to grapheme boundaries so a click can
     * never land inside a surrogate pair or combining sequence.
     * @param e - pointer event in global coordinates.
     */
    protected indexAt(e: FederatedPointerEvent): number
    {
        return this.indexAtLocalX(this.toLocal(e.global).x);
    }

    /**
     * Whether presses should land on the hidden field itself rather than on the canvas. On touch
     * devices the field has to stay the touch target: its long-press callout is the only paste
     * path on iOS. Taps on it are mapped onto the drawn text by {@link Input.onFieldClick}.
     */
    protected get fieldTakesPointer(): boolean
    {
        return isMobile.any;
    }

    /**
     * A tap on the hidden field placed the native caret by the field's own layout, which never
     * matches the canvas; move it to where the tap landed on the drawn text instead.
     * @param e - the click on the field.
     */
    protected onFieldClick(e: MouseEvent): void
    {
        const input = this.input;

        if (!input || !this.editing || this.clickingField) return;

        // The press dragged, so the selection is already where the drag left it.
        if (this.fieldDragged)
        {
            this.fieldDragged = false;

            return;
        }

        // The field's own double tap would select by its invisible layout, so taps are counted
        // here and resolved against the drawn text, as on the canvas.
        const index = this.indexAtClient(e.clientX, e.clientY);
        const clicks = this.countTapAt(e.clientX, e.clientY);

        if (clicks >= 3)
        {
            this.selectAll();
        }
        else if (clicks === 2)
        {
            this.selectWordAt(index);
        }
        else
        {
            this.setSelection(index, index);
        }
    }

    /**
     * A press on the hidden field may become a drag-selection; the field's own drag would
     * select nothing on touch devices, or select by its invisible layout.
     * @param e - the press on the field.
     */
    protected onFieldPointerDown(e: PointerEvent): void
    {
        if (!this.input || !this.editing || e.isPrimary === false) return;

        this.fieldDragAnchor = this.indexAtClient(e.clientX, e.clientY);
        this.fieldDragged = false;
        this.fieldPressX = e.clientX;
        this.fieldPressY = e.clientY;
    }

    protected onFieldPointerMove(e: PointerEvent): void
    {
        const anchor = this.fieldDragAnchor;

        if (anchor === undefined || !this.editing || e.isPrimary === false) return;

        if (!this.fieldDragged
            && Math.hypot(e.clientX - this.fieldPressX, e.clientY - this.fieldPressY) < DRAG_THRESHOLD)
        {
            return;
        }

        this.fieldDragged = true;

        const index = this.indexAtClient(e.clientX, e.clientY);

        this.setSelection(Math.min(anchor, index), Math.max(anchor, index), index < anchor ? 'backward' : 'forward');
    }

    protected onFieldPointerUp(): void
    {
        this.fieldDragAnchor = undefined;
    }

    /**
     * The caret index nearest to a point on the hidden field. The field sits at the component's
     * global position, so an offset into it is an offset in global space.
     * @param clientX - horizontal position in the viewport.
     * @param clientY - vertical position in the viewport.
     */
    protected indexAtClient(clientX: number, clientY: number): number
    {
        if (!this.input) return 0;

        const rect = this.input.getBoundingClientRect();
        const origin = this.getGlobalPosition();
        const local = this.toLocal({ x: origin.x + (clientX - rect.left), y: origin.y + (clientY - rect.top) });

        return this.indexAtLocalX(local.x);
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

    /**
     * Handles the keys that control the editing session itself. Text content is handled by
     * {@link Input.onInput}, so this deliberately does not insert or delete characters.
     * @param e - the native keyboard event.
     */
    protected onKeyDown(e: KeyboardEvent)
    {
        if (e.metaKey || e.ctrlKey) return;

        // Enter and Escape confirm or cancel a composition first; Firefox and Safari report the real
        // key with `isComposing` set, Chrome reports 'Process' with keyCode 229.
        if (e.isComposing || e.keyCode === 229) return;

        if (e.key === 'Escape' || e.key === 'Enter')
        {
            this.stopEditing();
        }
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

    protected _add(key: string): void
    {
        if (!this.editing)
        {
            return;
        }

        let addition = key;

        if (this.options.maxLength)
        {
            const room = this.options.maxLength - this.value.length;

            if (room <= 0)
            {
                return;
            }

            addition = clampLength(key, room);
        }

        this.value = this.value + addition;
        this.writeToField();

        this.onChange.emit(this.value);
    }

    protected _delete(): void
    {
        const length = this.value.length;

        if (!this.editing || length === 0) return;

        this.value = this.value.substring(0, length - 1);
        this.writeToField();

        this.onChange.emit(this.value);
    }

    /** Pushes a programmatic edit into the hidden field, so it does not overwrite the change on the next `input`. */
    protected writeToField(): void
    {
        if (!this.input) return;

        this.input.value = this.value;
        this.setSelection(this.value.length, this.value.length);
    }

    protected _startEditing(): void
    {
        if (this.options.cleanOnFocus)
        {
            this.value = '';
        }

        this.tick = 0;
        this.editing = true;
        if (this.placeholder)
        {
            this.placeholder.visible = false;
        }
        if (this._cursor)
        {
            this._cursor.alpha = 1;
        }

        this.createInputField();

        this.align();
    }

    protected createInputField()
    {
        this.removeInputField();

        const input: HTMLInputElement = document.createElement('input');

        document.body.appendChild(input);

        input.style.position = 'fixed';
        input.style.left = `${this.getGlobalPosition().x}px`;
        input.style.top = `${this.getGlobalPosition().y}px`;
        input.style.opacity = '0.0000001';
        // iOS Safari zooms the page in to any focused field whose font is smaller than 16px, which
        // moves the invisible field out from under the finger and scales the canvas with it.
        input.style.fontSize = '16px';
        input.style.width = `${this._bg?.width ?? 100}px`;
        input.style.height = `${this._bg?.height ?? 30}px`;
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.background = 'white';
        // The field overlays the component; presses must reach the canvas, where the drawn text
        // is, so the caret lands by what the user sees rather than by the invisible field's layout.
        // Touch devices keep the field as the target, for its paste callout, and map taps instead.
        if (this.fieldTakesPointer)
        {
            input.addEventListener('click', this.onFieldClickBinding);
            input.addEventListener('pointerdown', this.onFieldPointerDownBinding);
            input.addEventListener('pointermove', this.onFieldPointerMoveBinding);
            input.addEventListener('pointerup', this.onFieldPointerUpBinding);
            input.addEventListener('pointercancel', this.onFieldPointerUpBinding);
            // A drag across the field must reach pointermove rather than scroll the page.
            input.style.touchAction = 'none';
        }
        else
        {
            input.style.pointerEvents = 'none';
        }

        // A password field keeps on-screen keyboards from suggesting, or learning, the value.
        input.type = this._secure ? 'password' : 'text';

        // Keyboards would otherwise capitalise, correct and learn what is typed, and password
        // managers would offer to fill or save it.
        const attributes = { ...DEFAULT_INPUT_ATTRIBUTES, ...this.options.inputAttributes };

        for (const [name, value] of Object.entries(attributes))
        {
            input.setAttribute(name, value);
        }

        // Seed the field with the current text so the browser edits the real string:
        // backspace, caret movement, autocorrect and suggestions all need it to be there.
        input.value = this.value;

        if (this.options.maxLength)
        {
            input.maxLength = this.options.maxLength;
        }

        const length = this.value.length;
        const [start, end] = this.pendingSelection ?? [length, length];

        this.pendingSelection = undefined;

        const focus = () =>
        {
            input.focus();
            // The synthetic click is part of the keyboard hack below, not a tap to place the caret by.
            this.clickingField = true;
            input.click();
            this.clickingField = false;
            // After focus: some browsers reset the selection when a field gains focus.
            input.setSelectionRange(Math.min(start, length), Math.min(end, length));
            this.syncSelection();
        };

        input.addEventListener('blur', this.onBlurBinding);
        input.addEventListener('keydown', this.onKeyDownBinding);
        input.addEventListener('input', this.onInputBinding as EventListener);
        input.addEventListener('compositionstart', this.onCompositionStartBinding);
        input.addEventListener('compositionend', this.onCompositionEndBinding);

        this.input = input;

        // This hack fixes instant hiding keyboard on mobile after showing it
        if (isMobile.android.device)
        {
            setTimeout(focus, 100);
        }
        else
        {
            focus();
        }

        this.align();
    }

    protected handleActivation()
    {
        if (this.editing) return;

        this.stopEditing();

        if (this.activation)
        {
            this._startEditing();

            this.activation = false;
        }
    }

    protected stopEditing(): void
    {
        if (!this.editing) return;

        if (this._cursor)
        {
            this._cursor.alpha = 0;
        }
        this.editing = false;
        this.dragAnchor = undefined;
        this.composing = false;

        if (this.placeholder && this.value.length === 0)
        {
            this.placeholder.visible = true;
        }

        this.removeInputField();

        // Park the caret at the end so the next session, and the idle caret, start from there.
        this.selectionStart = this.selectionEnd = this.value.length;
        this.selectionDirection = 'none';

        this.align();

        this.onEnter.emit(this.value);
    }

    protected update(dt: number): void
    {
        if (!this.editing) return;

        // Caret movement has no event of its own on every browser, so poll it with the blink.
        this.syncSelection();

        this.tick += dt * 0.1;
        if (this._cursor)
        {
            // Native fields hide the caret while a range is selected.
            this._cursor.alpha = this.selectionStart === this.selectionEnd
                ? Math.round((Math.sin(this.tick) * 0.5) + 0.5)
                : 0;
        }
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

    override destroy(options?: DestroyOptions | boolean)
    {
        this.off('pointertap');
        this.off('pointerdown', this.onPointerDown, this);
        this.off('globalpointermove', this.onPointerMove, this);
        this.off('pointerup', this.onPointerUp, this);
        this.off('pointerupoutside', this.onPointerUp, this);

        window.removeEventListener(isMobile.any ? 'touchstart' : 'click', this.handleActivationBinding);
        window.removeEventListener('pointerdown', this.onAnyPointerDownBinding, true);
        window.removeEventListener('contextmenu', this.onContextMenuBinding, true);

        Ticker.shared.remove(this.tickerUpdate);

        this.removeInputField();

        super.destroy(options);
    }

    /** Detaches and removes the hidden DOM input, if one is currently mounted. */
    protected removeInputField()
    {
        if (!this.input) return;

        this.input.removeEventListener('blur', this.onBlurBinding);
        this.input.removeEventListener('keydown', this.onKeyDownBinding);
        this.input.removeEventListener('input', this.onInputBinding as EventListener);
        this.input.removeEventListener('compositionstart', this.onCompositionStartBinding);
        this.input.removeEventListener('compositionend', this.onCompositionEndBinding);
        this.input.removeEventListener('click', this.onFieldClickBinding);
        this.input.removeEventListener('pointerdown', this.onFieldPointerDownBinding);
        this.input.removeEventListener('pointermove', this.onFieldPointerMoveBinding);
        this.input.removeEventListener('pointerup', this.onFieldPointerUpBinding);
        this.input.removeEventListener('pointercancel', this.onFieldPointerUpBinding);
        this.fieldDragAnchor = undefined;
        this.fieldDragged = false;

        // Empty the field before it leaves the DOM, so a password manager has nothing to offer to save.
        this.input.value = '';
        this.input.blur();
        this.input.remove();
        this.input = undefined;
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

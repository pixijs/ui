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
} & ContainerOptions;

const SECURE_CHARACTER = '*';
const SELECTION_ALPHA = 0.35;

type SelectionDirection = 'forward' | 'backward' | 'none';

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

    /** True from a press on the component until its release, so a blur it causes can be told apart. */
    protected pressed = false;

    protected activation = false;
    protected readonly options: InputOptions;
    protected input: HTMLInputElement | undefined;

    protected handleActivationBinding = this.handleActivation.bind(this);
    protected onKeyDownBinding = this.onKeyDown.bind(this);
    protected onBlurBinding = this.onBlur.bind(this);
    protected onInputBinding = this.onInput.bind(this);

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
            // A tap during a session is a caret or selection gesture, not an activation; leaving
            // `activation` set here would restart editing on the very click that ends it.
            if (this.editing)
            {
                this.onPointerTap(e);

                return;
            }

            this.activation = true;
            isMobile.any && this.handleActivation(); // handleActivation always call before this function called.
        });

        window.addEventListener(isMobile.any ? 'touchstart' : 'click', this.handleActivationBinding);

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

        if (maxLength && text.length > maxLength)
        {
            // Native maxLength does not apply to pastes, suggestions or an over-long seed.
            const { selectionStart, selectionEnd, selectionDirection } = this.input;

            text = text.substring(0, maxLength);
            this.input.value = text;
            this.input.setSelectionRange(
                Math.min(selectionStart ?? maxLength, maxLength),
                Math.min(selectionEnd ?? maxLength, maxLength),
                selectionDirection ?? 'none',
            );
        }

        if (text !== this.value)
        {
            this.value = text;

            this.onChange.emit(this.value);
        }

        this.syncSelection();
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
        const index = this.indexAt(e);

        if (!this.editing || !this.input)
        {
            // Editing starts on the following tap; place the caret where the press landed.
            this.pendingSelection = [index, index];

            return;
        }

        // Cancelling pointerdown drops the compatibility mouse events, but browsers still move
        // focus to the canvas; onBlur uses `pressed` to hand it straight back to the field.
        (e.nativeEvent as Event | undefined)?.preventDefault?.();
        this.pressed = true;

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

        const anchor = this.dragAnchor;
        const index = this.indexAt(e);

        this.setSelection(Math.min(anchor, index), Math.max(anchor, index), index < anchor ? 'backward' : 'forward');
    }

    protected onPointerUp(): void
    {
        this.dragAnchor = undefined;
        this.pressed = false;
    }

    /**
     * Ends the session when focus genuinely leaves — a click elsewhere, Tab, a dismissed keyboard.
     * A press on the component itself also blurs the hidden field, because the canvas takes
     * focus; that would end and restart editing on every caret move, losing the selection and
     * emitting onEnter, so focus is handed back instead.
     */
    protected onBlur(): void
    {
        const input = this.input;

        if (!this.pressed || !input)
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

    protected onPointerTap(e: FederatedPointerEvent): void
    {
        // `detail` is the click count: 2 selects a word, 3 the whole value.
        const clicks = e.detail ?? 1;

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
     * @param total - measured width of the whole displayed text, if already known.
     */
    protected offsetAt(index: number, total = this.measureText(this.displayText)): number
    {
        if (!this.inputField || total === 0) return 0;

        const prefix = this.measureText(this.displayText.substring(0, index));

        return this.inputField.width * (prefix / total);
    }

    /**
     * The caret index nearest to a pointer, snapped to grapheme boundaries so a click can
     * never land inside a surrogate pair or combining sequence.
     * @param e - pointer event in global coordinates.
     */
    protected indexAt(e: FederatedPointerEvent): number
    {
        if (!this.inputField) return 0;

        const text = this.displayText;
        const x = this.toLocal(e.global).x - this.textLeft;
        const total = this.measureText(text);

        let best = 0;
        let bestDistance = Math.abs(x);
        let index = 0;

        for (const grapheme of CanvasTextMetrics.graphemeSegmenter(text))
        {
            index += grapheme.length;

            const distance = Math.abs(x - this.offsetAt(index, total));

            if (distance < bestDistance)
            {
                best = index;
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

            addition = key.substring(0, room);
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
        input.style.width = `${this._bg?.width ?? 100}px`;
        input.style.height = `${this._bg?.height ?? 30}px`;
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.background = 'white';
        // The field overlays the component; presses must reach the canvas, where the drawn text
        // is, so the caret lands by what the user sees rather than by the invisible field's layout.
        input.style.pointerEvents = 'none';

        // A password field keeps on-screen keyboards from suggesting, or learning, the value.
        input.type = this._secure ? 'password' : 'text';

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
            input.click();
            // After focus: some browsers reset the selection when a field gains focus.
            input.setSelectionRange(Math.min(start, length), Math.min(end, length));
            this.syncSelection();
        };

        input.addEventListener('blur', this.onBlurBinding);
        input.addEventListener('keydown', this.onKeyDownBinding);
        input.addEventListener('input', this.onInputBinding as EventListener);

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
        this.pressed = false;

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
            this.inputField.anchor.set(align, 0.5);
            this.inputField.x
                = (this._bg.width * align) + (align === 1 ? -this.paddingRight : this.paddingLeft);
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

        const total = this.measureText(this.displayText);
        const from = this.offsetAt(this.selectionStart, total);
        const to = this.offsetAt(this.selectionEnd, total);
        const height = this._cursor.height;

        this._selection
            .rect(this.textLeft + from, this.inputField.y - (height / 2), to - from, height)
            .fill({ color: this.textColor, alpha: SELECTION_ALPHA });
    }

    protected getAlign(): 0 | 1 | 0.5
    {
        if (!(this._bg && this.inputField)) return 0;

        const maxWidth = this._bg.width * 0.95;
        const paddings = this.paddingLeft + this.paddingRight - 10;
        const isOverflowed = this.inputField.width + paddings > maxWidth;

        if (isOverflowed)
        {
            return this.editing ? 1 : 0;
        }
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

        if (this.input)
        {
            this.input.type = val ? 'password' : 'text';
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

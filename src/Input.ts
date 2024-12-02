import { isMobile, Texture, Ticker, utils } from '@pixi/core';
import { Container, IDestroyOptions } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { NineSlicePlane } from '@pixi/mesh-extras';
import { Sprite } from '@pixi/sprite';
import { Text, TextStyle } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Padding } from './utils/HelpTypes';
import { PixiText, PixiTextClass, PixiTextStyle } from './utils/helpers/text';
import { getView } from './utils/helpers/view';

type ViewType = Sprite | Graphics | Texture | string;

export type InputOptions = {
    bg: ViewType;
    textStyle?: PixiTextStyle;
    TextClass?: PixiTextClass;
    placeholder?: string;
    value?: string;
    maxLength?: number;
    secure?: boolean;
    align?: 'left' | 'center' | 'right';
    padding?: Padding;
    cleanOnFocus?: boolean;
    nineSlicePlane?: [number, number, number, number];
};

const SECURE_CHARACTER = '*';

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
    protected _bg?: Container | NineSlicePlane | Graphics;
    protected inputMask: Container | NineSlicePlane | Graphics;
    protected _cursor: Sprite;
    protected _value = '';
    protected _secure: boolean;
    protected inputField: PixiText;
    protected placeholder: PixiText;
    protected editing = false;
    protected tick = 0;
    protected lastInputData: string;

    protected activation = false;
    protected readonly options: InputOptions;
    protected input: HTMLInputElement;

    protected handleActivationBinding = this.handleActivation.bind(this);
    protected onKeyUpBinding = this.onKeyUp.bind(this);
    protected stopEditingBinding = this.stopEditing.bind(this);
    protected onInputBinding = this.onInput.bind(this);
    protected onPasteBinding = this.onPaste.bind(this);

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
     * @param { Partial<TextStyle> } options.textStyle - Text style of the Input.
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
     * @param { Array } options.nineSlicePlane - NineSlicePlane values for bg and fill ([number, number, number, number]).
     */
    constructor(options: InputOptions)
    {
        super();

        this.options = options;

        this.options = options;
        this.padding = options.padding;
        this._secure = options.secure ?? false;

        this.cursor = 'text';
        this.eventMode = 'static';

        this.on('pointertap', () =>
        {
            this.activation = true;
            utils.isMobile.any && this.handleActivation(); // handleActivation always call before this function called.
        });

        window.addEventListener(isMobile.any ? 'touchstart' : 'click', this.handleActivationBinding);

        this.onEnter = new Signal();
        this.onChange = new Signal();

        Ticker.shared.add((delta) => this.update(delta));

        if (options.bg)
        {
            this.bg = options.bg;
        }
        else
        {
            console.error('Input: bg is not defined, please define it.');
        }
    }

    protected onInput(e: InputEvent)
    {
        this.lastInputData = e.data;
    }

    protected onKeyUp(e: KeyboardEvent)
    {
        const key = e.key;

        const keysToSkip = ['Shift', 'Control', 'Alt', 'Meta', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

        if (keysToSkip.includes(key)) return;

        if (e.metaKey) return;
        if (e.ctrlKey) return;

        if (key === 'Backspace')
        {
            this._delete();
        }
        else if (key === 'Escape' || key === 'Enter')
        {
            this.stopEditing();
        }
        else if (key.length === 1)
        {

            this._add(key);
        }
        else if (this.lastInputData && this.lastInputData.length === 1)
        {
            this._add(this.lastInputData);
        }

        if (this.input) {
            this.input.value = '';
        }
    }

    protected init()
    {
        const options = this.options;

        const defaultTextStyle = {
            fill: 0x000000,
            align: 'center'
        } as TextStyle;

        this.options.textStyle = options.textStyle ?? defaultTextStyle;
        this.options.TextClass = options.TextClass ?? Text;
        const textStyle = { ...defaultTextStyle, ...options.textStyle };

        this.inputField = new this.options.TextClass('', textStyle);

        this._cursor = new Sprite(Texture.WHITE);

        if ('tint' in options.textStyle)
        {
            this._cursor.tint = options.textStyle.tint;
        }
        else if ('fill' in options.textStyle)
        {
            const fill = options.textStyle.fill;

            this._cursor.tint = typeof fill === 'string' || typeof fill === 'number' ? fill : 0x000000;
        }
        else
        {
            this._cursor.tint = 0x000000;
        }

        this._cursor.anchor.set(0.5);
        this._cursor.width = 2;
        this._cursor.height = this.inputField.height * 0.8;
        this._cursor.alpha = 0;

        this.placeholder = new this.options.TextClass(options.placeholder, textStyle ?? defaultTextStyle);
        this.placeholder.visible = !!options.placeholder;

        this.addChild(this.inputField, this.placeholder, this._cursor);

        this.value = options.value ?? '';

        this.align();
    }

    set bg(bg: ViewType)
    {
        if (this._bg)
        {
            this._bg.destroy();
        }

        if (this.options?.nineSlicePlane)
        {
            if (typeof bg === 'string')
            {
                this._bg = new NineSlicePlane(Texture.from(bg), ...this.options.nineSlicePlane);
            }
            else if (bg instanceof Texture)
            {
                this._bg = new NineSlicePlane(bg, ...this.options.nineSlicePlane);
            }
            else
            {
                console.warn('NineSlicePlane can not be used with views set as Container.');
            }
        }

        if (!this._bg)
        {
            this._bg = getView(bg);
        }

        this._bg.cursor = 'text';
        this._bg.eventMode = 'static';

        this.addChildAt(this._bg, 0);

        if (!this.inputField)
        {
            this.init();
        }

        this.createInputMask(bg);
    }

    get bg(): Container | string
    {
        return this._bg;
    }

    protected _add(key: string): void
    {
        if (!this.editing)
        {
            return;
        }

        if (this.options.maxLength && this.value.length >= this.options.maxLength)
        {
            return;
        }

        this.value = this.value + key;

        this.onChange.emit(this.value);
    }

    protected _delete(): void
    {
        const length = this.value.length;

        if (!this.editing || length === 0) return;

        this.value = this.value.substring(0, length - 1);

        this.onChange.emit(this.value);
    }

    protected _startEditing(): void
    {
        if (this.options.cleanOnFocus)
        {
            this.value = '';
        }

        this.tick = 0;
        this.editing = true;
        this.placeholder.visible = false;
        this._cursor.alpha = 1;

        this.createInputField();

        this.align();
    }

    protected createInputField()
    {
        if (this.input)
        {
            this.input.removeEventListener('blur', this.stopEditingBinding);
            this.input.removeEventListener('keydown', this.onKeyUpBinding);
            this.input.removeEventListener('input', this.onInputBinding as EventListener);
            this.input.removeEventListener('paste', this.onPasteBinding);

            this.input?.blur();
            this.input?.remove();
            this.input = null;
        }

        const input: HTMLInputElement = document.createElement('input');

        document.body.appendChild(input);

        input.style.position = 'fixed';
        input.style.left = `${this.getGlobalPosition().x}px`;
        input.style.top = `${this.getGlobalPosition().y}px`;
        input.style.opacity = '0.0000001';
        input.style.width = `${this._bg.width}px`;
        input.style.height = `${this._bg.height}px`;
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.background = 'white';

        // This hack fixes instant hiding keyboard on mobile after showing it
        if (utils.isMobile.android.device)
        {
            setTimeout(() =>
            {
                input.focus();
                input.click();
            }, 100);
        }
        else
        {
            input.focus();
            input.click();
        }

        input.addEventListener('blur', this.stopEditingBinding);
        input.addEventListener('keydown', this.onKeyUpBinding);
        input.addEventListener('input', this.onInputBinding as EventListener);
        input.addEventListener('paste', this.onPasteBinding);

        this.input = input;

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

        this._cursor.alpha = 0;
        this.editing = false;

        if (this.inputField.text === '')
        {
            this.placeholder.visible = true;
        }

        if (this.value.length === 0) this.placeholder.visible = true;

        this.input?.blur();
        this.input?.remove();
        this.input = null;

        this.align();

        this.onEnter.emit(this.value);
    }

    protected update(dt: number): void
    {
        if (!this.editing) return;
        this.tick += dt * 0.1;
        this._cursor.alpha = Math.round((Math.sin(this.tick) * 0.5) + 0.5);
    }

    protected align()
    {
        if (!this._bg) return;

        const align = this.getAlign();

        this.inputField.anchor.set(align, 0.5);
        this.inputField.x = (this._bg.width * align) + (align === 1 ? -this.paddingRight : this.paddingLeft);
        this.inputField.y = (this._bg.height / 2) + this.paddingTop - this.paddingBottom;

        this.placeholder.anchor.set(align, 0.5);
        this.placeholder.x = (this._bg.width * align) + (align === 1 ? -this.paddingRight : this.paddingLeft);
        this.placeholder.y = this._bg.height / 2;

        this._cursor.x = this.getCursorPosX();
        this._cursor.y = this.inputField.y;
    }

    protected getAlign(): 0 | 1 | 0.5
    {
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

    protected getCursorPosX()
    {
        const align = this.getAlign();

        switch (align)
        {
            case 0:
                return this.inputField.x + this.inputField.width;
            case 0.5:
                return this.inputField.x + (this.inputField.width * 0.5);
            case 1:
                return this.inputField.x;
            default:
                return 0;
        }
    }

    /** Sets the input text. */
    set value(text: string)
    {
        const textLength = text.length;

        this._value = text;
        this.inputField.text = this.secure ? SECURE_CHARACTER.repeat(textLength) : text;

        if (textLength !== 0)
        {
            this.placeholder.visible = false;
        }
        else
        {
            this.placeholder.visible = !this.editing;
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

    override destroy(options?: IDestroyOptions | boolean)
    {
        this.off('pointertap');

        window.removeEventListener(isMobile.any ? 'touchstart' : 'click', this.handleActivationBinding);

        super.destroy(options);
    }

    /**
     * Sets width of a Input.
     * If nineSlicePlane is set, then width will be set to nineSlicePlane.
     * If nineSlicePlane is not set, then width will control components width as Container.
     * @param width - Width value.
     */
    override set width(width: number)
    {
        if (this.options?.nineSlicePlane)
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
     * If nineSlicePlane is set, then height will be set to nineSlicePlane.
     * If nineSlicePlane is not set, then height will control components height as Container.
     * @param height - Height value.
     */
    override set height(height: number)
    {
        if (this.options?.nineSlicePlane)
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

    protected createInputMask(bg: ViewType)
    {
        if (this.inputMask)
        {
            this.inputField.mask = null;
            this._cursor.mask = null;
            this.inputMask.destroy();
        }

        if (this.options?.nineSlicePlane && typeof bg === 'string')
        {
            this.inputMask = new NineSlicePlane(Texture.from(bg), ...this.options.nineSlicePlane);
        }
        else if (bg instanceof Sprite)
        {
            this.inputMask = new Sprite(bg.texture);
        }
        else if (bg instanceof Graphics)
        {
            this.inputMask = bg.clone();
        }
        else
        {
            this.inputMask = getView(bg);
        }

        this.inputField.mask = this.inputMask;

        this._cursor.mask = this.inputMask;

        this.updateInputMaskSize();

        this.addChildAt(this.inputMask, 0);
    }

    protected updateInputMaskSize()
    {
        if (!this.inputMask || !this._bg) return;

        this.inputMask.width = this._bg.width - this.paddingLeft - this.paddingRight;
        this.inputMask.height = this._bg.height - this.paddingTop - this.paddingBottom;

        this.inputMask.position.set(this.paddingLeft, this.paddingTop);
    }

    protected onPaste(e: any) {
        e.preventDefault();

        const text = (e.clipboardData || (window as any).clipboardData).getData("text");

        if (!text) return;

        this._add(text);
    }
}

import { Texture, utils, Ticker } from '@pixi/core';
import { Container, IDestroyOptions } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { TextStyle, Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { getView } from './utils/helpers/view';
import { Padding } from './utils/HelpTypes';

export type InputOptions = {
    bg: Container | string;
    textStyle?: Partial<TextStyle>;
    placeholder?: string;
    value?: string;
    maxLength?: number;
    align?: 'left' | 'center' | 'right';
    padding?: Padding;
    cleanOnFocus?: boolean;
};

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
    protected _bg?: Container;
    protected _cursor: Sprite;
    protected inputMask: Graphics;
    protected inputField: Text;
    protected placeholder: Text;
    protected editing = false;
    protected tick = 0;

    protected activation = false;
    protected readonly options: InputOptions;
    protected input: HTMLInputElement;

    protected handleActivationBinding = this.handleActivation.bind(this);
    protected onKeyUpBinding = this.onKeyUp.bind(this);
    protected stopEditingBinding = this.stopEditing.bind(this);

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

    constructor(options: InputOptions)
    {
        super();

        this.options = options;
        this.padding = options.padding;

        this.cursor = 'text';
        this.interactive = true;

        this.on('pointertap', () =>
        {
            this.activation = true;
            utils.isMobile.any && this.handleActivation(); // handleActivation always call before this function called.
        });

        if (utils.isMobile.any)
        {
            window.addEventListener('touchstart', this.handleActivationBinding);
        }
        else if (!utils.isMobile.any)
        {
            window.addEventListener('click', this.handleActivationBinding);

            window.addEventListener('keyup', this.onKeyUpBinding);
        }

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

    protected onKeyUp(e: KeyboardEvent)
    {
        const key = e.key;

        if (key === 'Backspace')
        {
            this._delete();
        }
        else if (key === 'Escape' || key === 'Enter')
        {
            this.stopEditing();
        }
        else if (key.length === 1) this._add(key);
    }

    protected init()
    {
        const options = this.options;

        const defaultTextStyle = {
            fill: 0x000000,
            align: 'center'
        } as TextStyle;

        this.options.textStyle = options.textStyle ?? defaultTextStyle;

        const textStyle = new TextStyle(options.textStyle ?? defaultTextStyle);

        this.inputField = new Text('', textStyle);

        this._cursor = new Sprite(Texture.WHITE);
        this._cursor.tint = Number(options.textStyle.fill) || 0x000000;
        this._cursor.anchor.set(0.5);
        this._cursor.width = 2;
        this._cursor.height = this.inputField.height * 0.8;
        this._cursor.alpha = 0;

        this.placeholder = new Text(options.placeholder, textStyle ?? defaultTextStyle);
        this.placeholder.visible = !!options.placeholder;

        this.addChild(this.inputField, this.placeholder, this._cursor);

        this.value = options.value ?? '';

        this.align();
    }

    set bg(bg: Container | string)
    {
        if (this._bg)
        {
            this.removeChild(this._bg);
            this._bg.destroy();
        }

        this._bg = getView(bg);
        this._bg.cursor = 'text';
        this._bg.interactive = true;

        this.addChildAt(this._bg, 0);

        if (!this.inputField)
        {
            this.init();
        }

        if (this.inputMask)
        {
            this.inputField.mask = null;
            this._cursor.mask = null;
            this.removeChild(this.inputMask);
            this.inputMask.destroy();
        }

        this.inputMask = new Graphics()
            .beginFill(0xffffff)
            .drawRect(
                this.paddingLeft,
                this.paddingTop,
                this._bg.width - this.paddingRight - this.paddingLeft,
                this._bg.height - this.paddingBottom - this.paddingTop
            );

        this.inputField.mask = this.inputMask;

        this._cursor.mask = this.inputMask;

        this.addChildAt(this.inputMask, 0);
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
        if (!this.editing || this.value.length === 0) return;
        const array = this.value.split('');

        array.pop();
        this.value = array.join('');

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

        if (utils.isMobile.any)
        {
            this.createInputField();
        }

        this.align();
    }

    protected createInputField()
    {
        if (this.input)
        {
            this.input.removeEventListener('blur', this.stopEditingBinding);
            this.input.removeEventListener('keyup', this.onKeyUpBinding);

            this.input?.blur();
            this.input?.remove();
            this.input = null;
        }

        const input: HTMLInputElement = document.createElement('input');

        document.body.appendChild(input);

        input.setAttribute('inputmode', 'decimal');

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
        input.addEventListener('keyup', this.onKeyUpBinding);

        this.input = input;

        this.align();
    }

    protected handleActivation()
    {
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

        if (utils.isMobile.any)
        {
            this.input?.blur();
            this.input?.remove();
            this.input = null;
        }

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
        this.inputField.text = text;

        if (text.length !== 0)
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
        return this.inputField.text;
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

        if (utils.isMobile.any)
        {
            window.removeEventListener('touchstart', this.handleActivationBinding);
        }
        else if (!utils.isMobile.any)
        {
            window.removeEventListener('click', this.handleActivationBinding);

            window.removeEventListener('keyup', this.onKeyUpBinding);
        }

        super.destroy(options);
    }
}

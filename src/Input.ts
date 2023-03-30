import { Texture, utils, Ticker } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { TextStyle, Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { getView } from './utils/helpers/view';
import { Padding } from './utils/HelpTypes';

export type InputOptions = {
    bg?: Container | string;
    textStyle?: Partial<TextStyle>;
    placeholder?: string;
    value?: string;
    maxLength?: number;
    align?: 'left' | 'center' | 'right';
    padding?: Padding;
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

        this.on('pointertap', () => (this.activation = true));

        if (utils.isMobile.any)
        {
            window.addEventListener('touchstart', () => this.handleActivation());

            let keyboard = document.getElementById('v-keyboard') as HTMLInputElement;

            if (!keyboard)
            {
                keyboard = document.createElement('input');

                document.body.appendChild(keyboard);
                keyboard.setAttribute('id', 'v-keyboard');

                keyboard.style.opacity = '0';
            }

            keyboard.oninput = () =>
            {
                let value = keyboard.value;

                const maxLength = this.options.maxLength;

                if (maxLength && value.length > this.options.maxLength)
                {
                    value = value.substring(0, maxLength);
                    keyboard.value = value;
                }

                this.value = value;

                this.onChange.emit(this.value);
            };
        }
        else
        {
            window.addEventListener('click', () =>
            {
                this.handleActivation();
            });

            window.addEventListener('keydown', (e) =>
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
            });
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

    protected init()
    {
        const options = this.options;

        const defaultTextStyle = {
            fill: 0x000000,
            align: 'center'
        } as TextStyle;

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
        this._bg = getView(bg);
        this._bg.cursor = 'text';
        this._bg.interactive = true;

        if (!this._bg.parent)
        {
            this.addChild(this._bg);
        }

        if (!this.inputField)
        {
            this.init();
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

        if (!this.inputMask.parent)
        {
            this.addChild(this.inputMask);
        }
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
        this.tick = 0;
        this.editing = true;
        this.placeholder.visible = false;
        this._cursor.alpha = 1;

        if (utils.isMobile.any)
        {
            const keyboard = document.getElementById('v-keyboard') as HTMLInputElement;

            keyboard.focus();
            keyboard.click();
            keyboard.value = this.value;
        }

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
        if (utils.isMobile.any) document.getElementById('v-keyboard')?.blur();

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
}

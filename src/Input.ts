import {
    Container,
    Sprite,
    Text,
    TextStyle,
    Texture,
    Graphics,
    utils,
} from 'pixi.js';
import { Signal } from 'typed-signals';

export type InputOptions = {
    bg?: Container | string;
    textStyle?: Partial<TextStyle>;
    placeholder?: string;
    value?: string;
    maxLength?: number;
    align?: 'left' | 'center' | 'right';
    padding?: number;
};

/**
 * Container based component that creates an input element, so we can read users input text.
 * @example
 * ```
 * new Input({
 *     bg: new PixiSprite(Texture.from('item.png')),
 *     padding,
 *     textStyle: {
 *         ...buttonTextStyle,
 *         fill: textColor,
 *         fontSize,
 *     },
 *     maxLength,
 *     align,
 *     placeholder,
 *     value: text,
 * });
 * ```
 */

// TODO: make this editable (read keys and move cursor, detect mouse click position)
export class Input extends Container
{
    private readonly bg: Container;
    private readonly inputField: Text;
    private readonly inputMask: Graphics;
    private readonly placeholder: Text;
    private _cursor: Sprite;
    private editing = false;
    private tick = 0;

    public readonly onEnter: Signal<(text: string) => void>;
    public readonly onChange: Signal<(text: string) => void>;

    private activation = false;

    // TODO: make cursor blink
    constructor(private readonly options: InputOptions)
    {
        super();

        this.bg
            = typeof options.bg === 'string'
                ? new Sprite(Texture.from(options.bg))
                : options.bg;

        this.bg.buttonMode = this.bg.interactive = true;

        const defaultTextStyle = {
            fill: 0x000000,
            align: 'center',
        } as TextStyle;

        const textStyle = new TextStyle(options.textStyle ?? defaultTextStyle);

        this.inputField = new Text('', textStyle);

        this.inputMask = new Graphics()
            .beginFill(0xffffff)
            .drawRect(
                this.padding,
                this.padding,
                this.bg.width - (this.padding * 2),
                this.bg.height - (this.padding * 2),
            );

        this._cursor = new Sprite(Texture.WHITE);
        this._cursor.tint = Number(options.textStyle.fill) || 0x000000;
        this._cursor.anchor.set(0.5);
        this._cursor.width = 2;
        this._cursor.height = this.inputField.height * 0.8;
        this._cursor.alpha = 0;

        this.inputField.mask = this.inputMask;
        this._cursor.mask = this.inputMask;

        this.placeholder = new Text(
            options.placeholder,
            textStyle ?? defaultTextStyle,
        );
        this.placeholder.visible = !!options.placeholder;

        this.value = options.value ?? '';

        this.addChild(
            this.bg,
            this.inputField,
            this.placeholder,
            this._cursor,
            this.inputMask,
        );

        this.align();

        this.interactive = this.buttonMode = true;

        this.on('pointertap', () => (this.activation = true));

        if (utils.isMobile.any)
        {
            window.addEventListener('touchstart', () =>
                this.handleActivation(),
            );

            let keyboard = document.getElementById(
                'v-keyboard',
            ) as HTMLInputElement;

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
                this.onEnter.emit(this.value);
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
                    this.onEnter.emit(this.value);
                }
                else if (key.length === 1) this._add(key);
            });
        }

        this.onEnter = new Signal();
        this.onChange = new Signal();
    }

    private _add(key: string): void
    {
        if (!this.editing)
        {
            return;
        }

        if (
            this.options.maxLength
            && this.value.length >= this.options.maxLength
        )
        {
            return;
        }

        this.value = this.value + key;

        this.onChange.emit(this.value);
    }

    private _delete(): void
    {
        if (!this.editing || this.value.length === 0) return;
        const array = this.value.split('');

        array.pop();
        this.value = array.join('');

        this.onChange.emit(this.value);
    }

    private _startEditing(): void
    {
        this.tick = 0;
        this.editing = true;
        this.placeholder.visible = false;
        this._cursor.alpha = 1;

        if (utils.isMobile.any)
        {
            const keyboard = document.getElementById(
                'v-keyboard',
            ) as HTMLInputElement;

            keyboard.focus();
            keyboard.click();
            keyboard.value = this.value;
        }

        this.align();
    }

    private handleActivation()
    {
        this.stopEditing();

        if (this.activation)
        {
            this._startEditing();

            this.activation = false;
        }
    }

    public stopEditing(): void
    {
        this._cursor.alpha = 0;
        this.editing = false;

        if (this.inputField.text === '')
        {
            this.placeholder.visible = true;
        }

        if (this.value.length === 0) this.placeholder.visible = true;
        if (utils.isMobile.any) document.getElementById('v-keyboard')?.blur();

        this.align();
    }

    public update(dt: number): void
    {
        if (!this.editing) return;
        this.tick += dt * 0.1;
        this._cursor.alpha = Math.round((Math.sin(this.tick) * 0.5) + 0.5);
    }

    private align()
    {
        const align = this.getAlign();

        this.inputField.anchor.set(align, 0.5);
        this.inputField.x
            = (this.bg.width * align)
            + (align === 1 ? -this.padding : this.padding);
        this.inputField.y = this.bg.height / 2;

        this.placeholder.anchor.set(align, 0.5);
        this.placeholder.x
            = (this.bg.width * align)
            + (align === 1 ? -this.padding : this.padding);
        this.placeholder.y = this.bg.height / 2;

        this._cursor.x = this.getCursorPosX();
        this._cursor.y = this.inputField.y;
    }

    private get padding(): number
    {
        return this.options.padding | 0;
    }

    private getAlign(): 0 | 1 | 0.5
    {
        const maxWidth = this.bg.width * 0.95;
        const isOverflowed
            = this.inputField.width + (this.padding * 3) > maxWidth;

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

    private getCursorPosX()
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
        }
    }

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

    get value(): string
    {
        return this.inputField.text;
    }
}

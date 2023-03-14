import { Container } from '@pixi/display';
import { Signal } from 'typed-signals';
import { getView } from './utils/helpers/view';
import { Ticker } from '@pixi/core';
import { Padding } from './utils/HelpTypes';

export type NativeInputOptions = {
    id: string;
    canvas: HTMLCanvasElement;
    bg: Container | string;
    placeholder?: string;
    maxLength?: number;
    value?: string;
    styles?: Partial<CSSStyleDeclaration>;
    padding?: Padding;
};

/**
 * Container-based component that creates an HTMLInputElement to read the user's text.
 * It is positioning on top of the canvas tries to bind the position over the container background.
 * @example
 * new Input({
 *     id: `input-1`, // unique id to avoid duplications and recreation of the same element
 *     canvas, // pixi Application canvas, required to bind the input position relatively to the canvas position
 *     value: '',
 *     placeholder: 'Enter text',
 *     bg: 'input.png',
 *     padding: {
 *         top: 5,
 *         right: 5,
 *         bottom: 5,
 *         left: 5
 *     } // alternatively you can use [11, 11, 11, 11] or [11, 11] or just 11
 * });
 */
export class NativeInput extends Container
{
    /** Fires every time input string is changed. */
    public readonly onChange: Signal<(text: string) => void>;

    /** Fires when input loses focus. */
    public readonly onEnter: Signal<(text: string) => void>;

    private ticker = Ticker.shared;
    private bg: Container;

    public nativeElement: HTMLInputElement;
    private canvas: HTMLCanvasElement;

    /** Top side padding */
    public paddingTop = 0;

    /** Right side padding */
    public paddingRight = 0;

    /** Bottom side padding */
    public paddingBottom = 0;

    /** Left side padding */
    public paddingLeft = 0;

    public id: string;

    constructor(options: NativeInputOptions)
    {
        super();

        this.canvas = options.canvas;

        this.padding = options.padding;

        this.id = options.id;

        this.bg = getView(options.bg);

        this.addChild(this.bg);

        const input = document.getElementById(options.id);

        if (input && input instanceof HTMLInputElement && input.parentElement === this.canvas.parentElement)
        {
            input.remove();
        }

        this.nativeElement = document.createElement('input');
        this.nativeElement.maxLength = options.maxLength ?? 100;
        this.nativeElement.type = 'text';
        this.nativeElement.id = options.id;
        this.nativeElement.value = options.value ?? '';
        this.nativeElement.placeholder = options.placeholder ?? '';

        this.setDefaultStyles();
        this.setStyles(options.styles);

        this.canvas.parentElement?.appendChild(this.nativeElement);

        this.onChange = new Signal();
        this.onEnter = new Signal();

        this.ticker.add(this.update, this);

        this.on('destroyed', () =>
        {
            this.nativeElement.remove();
            this.ticker.remove(this.update, this);
        });

        this.nativeElement.addEventListener('input', () => this.onEnter.emit(this.nativeElement.value));
        this.nativeElement.addEventListener('blur', () => this.onChange.emit(this.nativeElement.value));
    }

    private setDefaultStyles()
    {
        this.nativeElement.style.color = 'black';
        this.nativeElement.style.fontSize = '7vh';
        this.nativeElement.style.position = 'absolute';
        this.nativeElement.style.top = '0';
        this.nativeElement.style.left = '0';
        this.nativeElement.style.zIndex = '100';
        this.nativeElement.style.backgroundColor = 'transparent';
        this.nativeElement.style.border = 'none';
        this.nativeElement.style.outline = 'none';
    }

    public setStyles(styles?: Partial<CSSStyleDeclaration>)
    {
        for (const prop in styles)
        {
            if (Object.hasOwn(this.nativeElement.style, prop))
            {
                this.nativeElement.style[prop as any] = styles[prop];
            }
        }
    }

    private update()
    {
        const bgPos = this.bg.getGlobalPosition();
        // const canvasLeft = this.canvas.offsetLeft;
        // const canvasTop = this.canvas.offsetTop;
        const canvasStyle = this.canvas.getBoundingClientRect();

        this.nativeElement.style.left = `${canvasStyle.x + bgPos.x + this.paddingLeft}px`;
        this.nativeElement.style.top = `${canvasStyle.y + bgPos.y + this.paddingTop}px`;

        this.nativeElement.style.width = `${this.bg.width - this.paddingLeft - this.paddingRight}px`;
        this.nativeElement.style.height = `${this.bg.height - this.paddingTop - this.paddingBottom}px`;
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
    public set padding(value: Padding)
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

    /** Return array of paddings [top, right, bottom, left] */
    public get padding(): [number, number, number, number]
    {
        return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft];
    }

    /** Return input value. */
    get value(): string
    {
        return this.nativeElement.value;
    }
}

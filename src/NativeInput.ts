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
    value?: string;
    styles?: CSSStyleDeclaration;
    padding?: Padding;
};

export class NativeInput extends Container
{
    /** Fires every time input string is changed. */
    public readonly onChange: Signal<(text: string) => void>;

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

    constructor(options: NativeInputOptions)
    {
        super();

        this.canvas = options.canvas;

        this.padding = options.padding;

        this.bg = getView(options.bg);

        this.addChild(this.bg);

        const input = document.getElementById(options.id);

        if (input && input instanceof HTMLInputElement && input.parentElement === this.canvas.parentElement)
        {
            input.remove();
        }

        this.nativeElement = document.createElement('input');
        this.nativeElement.type = 'text';
        this.nativeElement.id = options.id;
        this.nativeElement.value = options.value ?? '';
        this.nativeElement.placeholder = options.placeholder ?? '';

        this.setDefaultStyles();
        this.setStyles(options.styles);

        this.canvas.parentElement?.appendChild(this.nativeElement);

        this.onChange = new Signal();

        this.ticker.add(this.update, this);

        this.on('destroyed', () =>
        {
            this.nativeElement.remove();
            this.ticker.remove(this.update, this);
        });

        this.nativeElement.addEventListener('input', () => this.onChange.emit(this.nativeElement.value));
    }

    private setDefaultStyles()
    {
        this.nativeElement.style.color = 'black';
        this.nativeElement.style.fontSize = '3vh';
        this.nativeElement.style.position = 'absolute';
        this.nativeElement.style.top = '0';
        this.nativeElement.style.left = '0';
        this.nativeElement.style.zIndex = '100';
        this.nativeElement.style.backgroundColor = 'transparent';
        this.nativeElement.style.border = 'none';
        this.nativeElement.style.outline = 'none';
    }

    public setStyles(styles?: CSSStyleDeclaration)
    {
        for (const prop in styles)
        {
            if (Object.hasOwn(this.nativeElement, prop))
            {
                this.nativeElement.style[prop as any] = styles[prop];
            }
        }
    }

    private update()
    {
        const bgPos = this.bg.getGlobalPosition();

        this.nativeElement.style.left = `${bgPos.x + this.paddingLeft}px`;
        this.nativeElement.style.top = `${bgPos.y + this.paddingTop}px`;
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

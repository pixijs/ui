import {
    ColorSource,
    Container,
    Graphics,
    NineSliceSprite,
    Optional,
    Size,
    Sprite,
    Text,
    Texture,
} from 'pixi.js';
import { getView } from '../utils/helpers/view';
import { SECURE_CHARACTER } from './constants';

import type { PixiText } from '../utils/helpers/text';
import type { Padding } from '../utils/HelpTypes';
import type { InputOptions, SelectionDirection, ViewType } from './types';

/**
 * First layer of {@link Input}: the state it is drawn from — options, value, secure flag, editing
 * flag, selection and paddings — and the background, mask and sizing. It calls into
 * {@link InputText} to create and lay out the text. Not meant to be used on its own; {@link Input}
 * is the component.
 */
export abstract class InputView extends Container
{
    /**
     * Resolves the options and sets up the parts that do not depend on the subclasses' state;
     * the background, and with it the text, are created by {@link Input}'s constructor.
     * @param options - options of the input, see {@link Input}.
     */
    constructor(options: InputOptions)
    {
        const {
            bg: _bg,
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
    }

    /** Creates the text, caret, selection highlight and placeholder; implemented by {@link InputText}. */
    protected abstract init(): void;

    /** Lays out the text, caret and highlight; implemented by {@link InputText}. */
    protected abstract align(): void;

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

    /** End of the mirrored selection; equal to {@link InputView#selectionStart} for a plain caret. */
    protected selectionEnd = 0;

    /** Which end of the mirrored selection holds the caret. */
    protected selectionDirection: SelectionDirection = 'none';

    protected readonly options: InputOptions;

    protected input: HTMLInputElement | undefined;

    /** Top side padding */
    paddingTop = 0;

    /** Right side padding */
    paddingRight = 0;

    /** Bottom side padding */
    paddingBottom = 0;

    /** Left side padding */
    paddingLeft = 0;

    /** What is drawn: the value itself, or one mask character per code unit when secure. */
    protected get displayText(): string
    {
        return this._secure ? SECURE_CHARACTER.repeat(this._value.length) : this._value;
    }

    /**
     * Sets the background: a texture name, a Texture, a Sprite or a Graphics. A texture name or Texture
     * becomes a NineSliceSprite when `nineSliceSprite` is set. The previous background is destroyed.
     */
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

    /** Background view of the Input. */
    get bg(): Container | NineSliceSprite | Graphics | undefined
    {
        return this._bg;
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

        // During a session the hidden field is what the next keystroke edits, so a value set from
        // outside has to reach it, or that keystroke would bring the old text back. Equal values
        // are left alone: that is the field reporting its own edit, possibly mid-composition.
        if (this.editing && this.input && this.input.value !== value)
        {
            // A range over text that has been replaced means nothing, so it collapses to its end,
            // where a native field would put the caret; a plain caret stays where it was.
            this.selectionStart = this.selectionEnd;
            this.selectionDirection = 'none';
            this.input.value = value;
            this.input.setSelectionRange(this.selectionEnd, this.selectionEnd);
        }

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

    /**
     * Masks the drawn text with `*` and switches the hidden field to `type="password"`. Can be toggled
     * while editing, e.g. for a show/hide password button; the caret and selection are kept.
     */
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

    /** Whether the value is masked. */
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

    /** Paddings as [top, right, bottom, left]. */
    get padding(): [number, number, number, number]
    {
        return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft];
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

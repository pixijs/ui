import {
    DestroyOptions,
    FederatedPointerEvent,
    isMobile,
    Ticker,
} from 'pixi.js';
import { Signal } from 'typed-signals';
import {
    DEFAULT_INPUT_ATTRIBUTES,
    PRESS_BLUR_GRACE,
} from './constants';
import { InputSelection } from './InputSelection';
import { clampLength } from './text';

import type { InputOptions } from './types';

/**
 * Container-based component that creates an input to read the user's text.
 *
 * The text, caret and selection live in a hidden native `<input>`, so typing, composition,
 * autocorrect, suggestions and paste work as the platform does them; the component draws what
 * that field holds. It is built in layers: {@link InputView} draws, {@link InputSelection} handles
 * the caret, selection and pointer gestures, and this class runs the editing session.
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
export class Input extends InputSelection
{
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
        super(options);

        this.on('pointertap', (e: FederatedPointerEvent) =>
        {
            // Counted before the editing check so a double click on an idle input, which starts
            // editing on its first tap, still selects a word on its second as a native field does.
            // Only the main button selects by multi-click; a right click is a context-menu gesture.
            // Pixi's own `detail` counts any quick clicks on the component, wherever they land, so
            // the component's count, which also checks distance, is the only one used.
            const clicks = (e.button ?? 0) === 0 ? this.countTap(e) : 1;

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

        // Last, once every layer's fields are initialised: setting the background builds the text,
        // and laying it out reads the selection and scroll state.
        if (options.bg)
        {
            this.bg = options.bg;
        }
        else
        {
            console.error('Input: bg is not defined, please define it.');
        }
    }

    /** True while the browser is composing text in the field (IME, or an Android keyboard composing a word). */
    protected composing = false;

    protected activation = false;

    protected handleActivationBinding = this.handleActivation.bind(this);

    protected onKeyDownBinding = this.onKeyDown.bind(this);

    protected onBlurBinding = this.onBlur.bind(this);

    protected onInputBinding = this.onInput.bind(this);

    protected onCompositionStartBinding = this.onCompositionStart.bind(this);

    protected onCompositionEndBinding = this.onCompositionEnd.bind(this);

    protected onAnyPointerDownBinding = this.onAnyPointerDown.bind(this);

    /**
     * Kept as a field so destroy() can detach it from the shared ticker.
     * @param ticker - shared ticker, supplying the delta that drives the cursor blink.
     */
    protected readonly tickerUpdate = (ticker: Ticker) => this.update(ticker.deltaTime);

    /** Fires when input loses focus. */
    onEnter: Signal<(text: string) => void>;

    /** Fires every time input string is changed. */
    onChange: Signal<(text: string) => void>;

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
        let textLength = text.length;
        let overLimit = false;

        if (maxLength && textLength > maxLength)
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
                textLength = text.length;
                this.input.value = text;
                this.input.setSelectionRange(
                    Math.min(selectionStart ?? textLength, textLength),
                    Math.min(selectionEnd ?? textLength, textLength),
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
        this.dragLocalX = undefined;
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
        this.autoScrollDrag(dt);

        this.tick += dt * 0.1;
        if (this._cursor)
        {
            // Native fields hide the caret while a range is selected.
            this._cursor.alpha = this.selectionStart === this.selectionEnd
                ? Math.round((Math.sin(this.tick) * 0.5) + 0.5)
                : 0;
        }
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
}

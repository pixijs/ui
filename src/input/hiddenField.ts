import { DEFAULT_INPUT_ATTRIBUTES } from './constants';

/** Where and how to create the hidden field, see {@link createHiddenField}. */
export type HiddenFieldOptions = {
    /** Left edge, in viewport pixels. */
    x: number;
    /** Top edge, in viewport pixels. */
    y: number;
    width: number;
    height: number;
    /** Text to seed the field with, so the browser edits the real string. */
    value: string;
    /** A password field keeps on-screen keyboards from suggesting, or learning, the value. */
    secure: boolean;
    /** Create a `<textarea>` rather than an `<input>`, so the text can hold line breaks. */
    multiline?: boolean;
    maxLength?: number;
    /** Merged over {@link DEFAULT_INPUT_ATTRIBUTES}. */
    attributes?: Record<string, string>;
    /**
     * Whether presses land on the field itself. On touch devices it has to stay the target, for
     * its paste callout; elsewhere presses go through to the canvas, where the drawn text is.
     */
    takesPointer: boolean;
};

/**
 * Creates the invisible native `<input>` that holds the text, caret and selection while an
 * {@link Input} is being edited, and adds it to the document. Listeners are the caller's.
 * @param options - where to put it and what it holds. A multiline field is a `<textarea>`,
 * typed as the input it stands in for.
 */
export function createHiddenField(options: HiddenFieldOptions): HTMLInputElement
{
    // A textarea has the value, selection, maxLength and events used here, so one type covers both.
    const input = document.createElement(options.multiline ? 'textarea' : 'input') as HTMLInputElement;

    document.body.appendChild(input);

    input.style.position = 'fixed';
    input.style.left = `${options.x}px`;
    input.style.top = `${options.y}px`;
    input.style.opacity = '0.0000001';
    // iOS Safari zooms the page in to any focused field whose font is smaller than 16px, which
    // moves the invisible field out from under the finger and scales the canvas with it.
    input.style.fontSize = '16px';
    input.style.width = `${options.width}px`;
    input.style.height = `${options.height}px`;
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.background = 'white';

    if (options.takesPointer)
    {
        // A drag across the field must reach pointermove rather than scroll the page.
        input.style.touchAction = 'none';
    }
    else
    {
        // The field overlays the component; presses must reach the canvas, so the caret lands by
        // what the user sees rather than by the invisible field's layout.
        input.style.pointerEvents = 'none';
    }

    if (options.multiline)
    {
        // Lines are wrapped by the component, not the browser; the field only needs the hard breaks.
        input.setAttribute('wrap', 'off');
        input.style.resize = 'none';
        input.style.overflow = 'hidden';
        input.style.padding = '0';
    }
    else
    {
        input.type = options.secure ? 'password' : 'text';
    }

    // Keyboards would otherwise capitalise, correct and learn what is typed, and password
    // managers would offer to fill or save it.
    const attributes = { ...DEFAULT_INPUT_ATTRIBUTES, ...options.attributes };

    for (const [name, value] of Object.entries(attributes))
    {
        input.setAttribute(name, value);
    }

    input.value = options.value;

    if (options.maxLength)
    {
        input.maxLength = options.maxLength;
    }

    return input;
}

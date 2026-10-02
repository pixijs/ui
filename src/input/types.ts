import type { ContainerOptions, Graphics, Sprite, Texture } from 'pixi.js';
import type { PixiTextClass, PixiTextStyle } from '../utils/helpers/text';
import type { ALIGN, Padding } from '../utils/HelpTypes';

/** What the background of an {@link Input} can be made from. */
export type ViewType = Sprite | Graphics | Texture | string;

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
    /**
     * Attributes set on the hidden native field, merged over the defaults: `autocomplete`,
     * `autocapitalize` and `autocorrect` off and `spellcheck` false, so keyboards neither
     * rewrite nor remember what is typed. Pass `inputmode` or `enterkeyhint` here as well.
     */
    inputAttributes?: Record<string, string>;
} & ContainerOptions;

/** Which end of a selection holds the caret, as in `HTMLInputElement.selectionDirection`. */
export type SelectionDirection = 'forward' | 'backward' | 'none';

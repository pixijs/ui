/** Drawn in place of each character of a secure value. */
export const SECURE_CHARACTER = '*';

/** Opacity of the selection highlight, drawn in the text colour. */
export const SELECTION_ALPHA = 0.35;

/** Attributes the hidden native field gets unless `inputAttributes` overrides them. */
export const DEFAULT_INPUT_ATTRIBUTES: Record<string, string> = {
    autocomplete: 'off',
    autocapitalize: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    // Password managers key on these to leave a field alone.
    'data-lpignore': 'true',
    'data-1p-ignore': 'true',
    'data-bwignore': 'true',
};

/**
 * How long after a press on the component a blur of the hidden field is still taken to be caused
 * by that press. Desktop browsers move focus during the press itself, but touch browsers do it on
 * the tap gesture, which arrives after the pointer has already been released.
 */
export const PRESS_BLUR_GRACE = 500;

/**
 * Clicks closer together than this, in time and in distance, count as one multi-click. Mouse
 * values follow the common OS default for a double click; a finger needs more room to land
 * twice on the same spot, and touch platforms use a shorter double-tap window.
 */
export const MULTI_TAP_INTERVAL = 500;
export const MULTI_TAP_DISTANCE = 12;
export const MULTI_TAP_INTERVAL_TOUCH = 350;
export const MULTI_TAP_DISTANCE_TOUCH = 30;

/** While a drag-selection is held past an edge of overflowing text, extend it by one character every this many frames. */
export const AUTO_SCROLL_FRAMES = 3;

/** A press on the hidden field that moves further than this, in CSS pixels, is a drag-selection rather than a tap. */
export const DRAG_THRESHOLD = 6;

import {
    FederatedPointerEvent,
    isMobile,
} from 'pixi.js';
import {
    AUTO_SCROLL_FRAMES,
    DRAG_THRESHOLD,
    MULTI_TAP_DISTANCE,
    MULTI_TAP_DISTANCE_TOUCH,
    MULTI_TAP_INTERVAL,
    MULTI_TAP_INTERVAL_TOUCH,
} from './constants';
import { InputView } from './InputView';
import { wordRangeAt } from './text';

import type { InputOptions, SelectionDirection } from './types';

/**
 * Second layer of {@link Input}: the caret and selection, mirrored from the hidden field, and the
 * pointer gestures that set them — presses, drags with auto-scroll, multi-clicks and the context
 * menu, on the canvas and, on touch devices, on the hidden field itself. Not meant to be used on
 * its own; {@link Input} is the component.
 */
export class InputSelection extends InputView
{
    /**
     * @param options - options of the input, see {@link Input}.
     */
    constructor(options: InputOptions)
    {
        super(options);

        this.on('pointerdown', this.onPointerDown, this);
        this.on('globalpointermove', this.onPointerMove, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerupoutside', this.onPointerUp, this);
    }

    /** Selection to apply once the hidden field exists, set by a pointer press before editing began. */
    protected pendingSelection: [number, number] | undefined;

    /** Index the pointer went down on while editing; set while a drag-selection is in progress. */
    protected dragAnchor: number | undefined;

    /**
     * `performance.now()` of the last press, drag or release on the component, so a blur of the
     * hidden field that the press caused can be told apart from focus genuinely leaving.
     */
    protected lastPressTime = -Infinity;

    /** The component's own multi-tap count: Pixi counts per pointer id, and touch pointers change ids. */
    protected tapCount = 0;

    protected lastTapTime = -Infinity;

    protected lastTapX = 0;

    protected lastTapY = 0;

    /** Set around the synthetic `click()` on focus so it is not mistaken for a tap on the field. */
    protected clickingField = false;

    /** Selection a right-button press settled on, to put back after the context-menu request collapses it. */
    protected contextSelection: [number, number, SelectionDirection] | undefined;

    /** Local x of the pointer during a drag-selection, on the canvas or the hidden field, for auto-scrolling. */
    protected dragLocalX: number | undefined;

    /** Frames since the drag-selection last auto-scrolled. */
    protected autoScrollElapsed = 0;

    protected onFieldClickBinding = this.onFieldClick.bind(this);

    protected onFieldPointerDownBinding = this.onFieldPointerDown.bind(this);

    protected onFieldPointerMoveBinding = this.onFieldPointerMove.bind(this);

    protected onFieldPointerUpBinding = this.onFieldPointerUp.bind(this);

    /** Index a press on the hidden field went down on, while a drag-selection on it is possible. */
    protected fieldDragAnchor: number | undefined;

    /** True once a press on the hidden field has dragged, so the click that ends it is not taken as a tap. */
    protected fieldDragged = false;

    protected fieldPressX = 0;

    protected fieldPressY = 0;

    protected onContextMenuBinding = this.onContextMenu.bind(this);

    /**
     * Copies the hidden field's selection into the component and moves the drawn caret and
     * selection highlight to match. The browser owns caret movement — arrows, Home/End,
     * Shift-selection, word jumps — so this is read back rather than reimplemented.
     */
    protected syncSelection(): void
    {
        if (!this.input) return;

        const length = this.value.length;
        const start = Math.min(this.input.selectionStart ?? length, length);
        const end = Math.min(this.input.selectionEnd ?? length, length);
        const direction = this.input.selectionDirection ?? 'none';

        if (start === this.selectionStart && end === this.selectionEnd && direction === this.selectionDirection)
        {
            return;
        }

        this.selectionStart = start;
        this.selectionEnd = end;
        this.selectionDirection = direction;

        // Keep the caret solid while it is being moved, as native fields do.
        this.tick = 0;

        this.align();
    }

    /**
     * Sets the selection on the hidden field and mirrors it back.
     * @param start - first selected index.
     * @param end - index after the last selected one; equal to `start` for a plain caret.
     * @param direction - which end holds the caret, for Shift-extension.
     */
    protected setSelection(start: number, end: number, direction: SelectionDirection = 'none'): void
    {
        if (!this.input) return;

        this.input.setSelectionRange(start, end, direction);
        this.syncSelection();
    }

    /** Selects the whole value. */
    selectAll(): void
    {
        this.setSelection(0, this.value.length);
    }

    /**
     * Selects the run of like characters (word, whitespace or punctuation) around an index,
     * as a double click does in a native field.
     * @param index - position in {@link Input.value} to expand from.
     */
    protected selectWordAt(index: number): void
    {
        const range = wordRangeAt(this.displayText, index);

        if (range) this.setSelection(range[0], range[1]);
    }

    protected onPointerDown(e: FederatedPointerEvent): void
    {
        // A second finger must not move the caret or start a drag of its own.
        if (e.isPrimary === false) return;

        const index = this.indexAt(e);

        if (!this.editing || !this.input)
        {
            // Editing starts on the following tap; place the caret where the press landed.
            this.pendingSelection = [index, index];

            return;
        }

        // Cancelling pointerdown drops the compatibility mouse events, but browsers still move
        // focus to the canvas; onBlur uses the press time to hand it straight back to the field.
        (e.nativeEvent as Event | undefined)?.preventDefault?.();
        this.lastPressTime = performance.now();

        if (e.button === 2)
        {
            // A right click inside a selection keeps it, as native fields do; outside, it places the caret.
            const inside = this.selectionStart !== this.selectionEnd
                && index >= this.selectionStart && index <= this.selectionEnd;

            if (!inside)
            {
                this.setSelection(index, index);
            }

            // Chromium collapses the focused field's selection when the context menu is requested
            // outside the document selection; onContextMenu puts this back once that has happened.
            this.contextSelection = [this.selectionStart, this.selectionEnd, this.selectionDirection];

            return;
        }

        if (e.shiftKey)
        {
            const anchor = this.selectionDirection === 'backward' ? this.selectionEnd : this.selectionStart;

            this.dragAnchor = anchor;
            this.setSelection(Math.min(anchor, index), Math.max(anchor, index), index < anchor ? 'backward' : 'forward');
        }
        else
        {
            this.dragAnchor = index;
            this.setSelection(index, index);
        }
    }

    protected onPointerMove(e: FederatedPointerEvent): void
    {
        if (this.dragAnchor === undefined || !this.editing) return;

        this.lastPressTime = performance.now();

        const localX = this.toLocal(e.global).x;

        this.dragLocalX = localX;
        this.extendDragTo(this.dragAnchor, this.indexAtLocalX(this.clampToView(localX)));
    }

    protected onPointerUp(): void
    {
        if (this.dragAnchor !== undefined)
        {
            this.lastPressTime = performance.now();
        }

        this.dragAnchor = undefined;
        this.dragLocalX = undefined;
    }

    /**
     * Sets a drag-selection from its anchor to a focus index, with the direction the drag went.
     * @param anchor - index the drag started from.
     * @param focus - index the drag is at now.
     */
    protected extendDragTo(anchor: number, focus: number): void
    {
        this.setSelection(Math.min(anchor, focus), Math.max(anchor, focus), focus < anchor ? 'backward' : 'forward');
    }

    /**
     * Clamps a local x to the visible text area while the text overflows, so a drag past an edge
     * selects up to the edge and auto-scrolls from there, rather than jumping into the hidden text.
     * @param localX - x in the component's local space.
     */
    protected clampToView(localX: number): number
    {
        if (!this.isOverflowing) return localX;

        return Math.max(this.paddingLeft, Math.min(localX, (this._bg?.width ?? 0) - this.paddingRight));
    }

    /**
     * Keeps a drag-selection held past an edge of overflowing text moving, one character every
     * few frames, as a native field auto-scrolls; the text follows the focus end.
     * @param dt - ticker delta, in frames.
     */
    protected autoScrollDrag(dt: number): void
    {
        const anchor = this.dragAnchor ?? (this.fieldDragged ? this.fieldDragAnchor : undefined);
        const x = this.dragLocalX;
        let direction = 0;

        if (x !== undefined && this.isOverflowing)
        {
            if (x < this.paddingLeft) direction = -1;
            else if (x > (this._bg?.width ?? 0) - this.paddingRight) direction = 1;
        }

        if (anchor === undefined || !direction)
        {
            this.autoScrollElapsed = 0;

            return;
        }

        this.autoScrollElapsed += dt;

        if (this.autoScrollElapsed < AUTO_SCROLL_FRAMES) return;

        this.autoScrollElapsed = 0;

        const focus = this.selectionDirection === 'backward' ? this.selectionStart : this.selectionEnd;
        const { boundaries } = this.textMetrics();
        const next = direction < 0
            ? [...boundaries].reverse().find((b) => b < focus)
            : boundaries.find((b) => b > focus);

        if (next === undefined) return;

        this.extendDragTo(anchor, next);
    }

    /**
     * Restores the selection a right-button press settled on. The browser adjusts the document
     * selection as part of showing a context menu, after the press, which collapses the hidden
     * field's selection; it is put back once the menu request has been processed.
     */
    protected onContextMenu(): void
    {
        const selection = this.contextSelection;

        this.contextSelection = undefined;

        if (!selection) return;

        setTimeout(() =>
        {
            if (this.editing && this.input)
            {
                this.setSelection(...selection);
            }
        }, 0);
    }

    /**
     * Counts taps in a quick sequence at one spot, as a multi-click. Pixi's `detail` does this
     * per pointer id, and touch browsers issue a new id for every touch, so it stays at 1 there.
     * @param e - the tap.
     */
    protected countTap(e: FederatedPointerEvent): number
    {
        return this.countTapAt(e.global.x, e.global.y, e.pointerType === 'touch');
    }

    /**
     * Counts a tap at a position; see {@link Input.countTap}. The canvas path passes global
     * coordinates and the hidden-field path client coordinates, which never mix on one device.
     * @param x - horizontal position of the tap.
     * @param y - vertical position of the tap.
     * @param touch - whether it is a finger, which gets a wider spot and a shorter window.
     */
    protected countTapAt(x: number, y: number, touch = false): number
    {
        const now = performance.now();
        const distance = touch ? MULTI_TAP_DISTANCE_TOUCH : MULTI_TAP_DISTANCE;
        const interval = touch ? MULTI_TAP_INTERVAL_TOUCH : MULTI_TAP_INTERVAL;
        const near = Math.hypot(x - this.lastTapX, y - this.lastTapY) <= distance;

        this.tapCount = near && now - this.lastTapTime <= interval ? this.tapCount + 1 : 1;
        this.lastTapTime = now;
        this.lastTapX = x;
        this.lastTapY = y;

        return this.tapCount;
    }

    /**
     * @param e - the tap.
     * @param clicks - click count: 2 selects a word, 3 the whole value.
     */
    protected onPointerTap(e: FederatedPointerEvent, clicks = e.detail ?? 1): void
    {
        if (clicks === 2)
        {
            this.selectWordAt(this.indexAt(e));
        }
        else if (clicks >= 3)
        {
            this.selectAll();
        }
    }

    /**
     * The caret index nearest to a pointer, snapped to grapheme boundaries so a click can
     * never land inside a surrogate pair or combining sequence.
     * @param e - pointer event in global coordinates.
     */
    protected indexAt(e: FederatedPointerEvent): number
    {
        return this.indexAtLocalX(this.toLocal(e.global).x);
    }

    /**
     * Whether presses should land on the hidden field itself rather than on the canvas. On touch
     * devices the field has to stay the touch target: its long-press callout is the only paste
     * path on iOS. Taps on it are mapped onto the drawn text by {@link Input.onFieldClick}.
     */
    protected get fieldTakesPointer(): boolean
    {
        return isMobile.any;
    }

    /**
     * A tap on the hidden field placed the native caret by the field's own layout, which never
     * matches the canvas; move it to where the tap landed on the drawn text instead.
     * @param e - the click on the field.
     */
    protected onFieldClick(e: MouseEvent): void
    {
        const input = this.input;

        if (!input || !this.editing || this.clickingField) return;

        // The press dragged, so the selection is already where the drag left it.
        if (this.fieldDragged)
        {
            this.fieldDragged = false;

            return;
        }

        // The field's own double tap would select by its invisible layout, so taps are counted
        // here and resolved against the drawn text, as on the canvas.
        const index = this.indexAtClient(e.clientX, e.clientY);
        // The field only takes presses on touch devices, so these are taps.
        const clicks = this.countTapAt(e.clientX, e.clientY, true);

        if (clicks >= 3)
        {
            this.selectAll();
        }
        else if (clicks === 2)
        {
            this.selectWordAt(index);
        }
        else
        {
            this.setSelection(index, index);
        }
    }

    /**
     * A press on the hidden field may become a drag-selection; the field's own drag would
     * select nothing on touch devices, or select by its invisible layout.
     * @param e - the press on the field.
     */
    protected onFieldPointerDown(e: PointerEvent): void
    {
        if (!this.input || !this.editing || e.isPrimary === false) return;

        this.fieldDragAnchor = this.indexAtClient(e.clientX, e.clientY);
        this.fieldDragged = false;
        this.fieldPressX = e.clientX;
        this.fieldPressY = e.clientY;
    }

    protected onFieldPointerMove(e: PointerEvent): void
    {
        const anchor = this.fieldDragAnchor;

        if (anchor === undefined || !this.editing || e.isPrimary === false) return;

        if (!this.fieldDragged
            && Math.hypot(e.clientX - this.fieldPressX, e.clientY - this.fieldPressY) < DRAG_THRESHOLD)
        {
            return;
        }

        this.fieldDragged = true;

        const localX = this.localXAtClient(e.clientX, e.clientY);

        this.dragLocalX = localX;
        this.extendDragTo(anchor, this.indexAtLocalX(this.clampToView(localX)));
    }

    protected onFieldPointerUp(): void
    {
        this.fieldDragAnchor = undefined;
        this.dragLocalX = undefined;
    }

    /**
     * The caret index nearest to a point on the hidden field. The field sits at the component's
     * global position, so an offset into it is an offset in global space.
     * @param clientX - horizontal position in the viewport.
     * @param clientY - vertical position in the viewport.
     */
    protected indexAtClient(clientX: number, clientY: number): number
    {
        return this.indexAtLocalX(this.localXAtClient(clientX, clientY));
    }

    /**
     * The local x of a point on the hidden field; see {@link Input.indexAtClient}.
     * @param clientX - horizontal position in the viewport.
     * @param clientY - vertical position in the viewport.
     */
    protected localXAtClient(clientX: number, clientY: number): number
    {
        if (!this.input) return 0;

        const rect = this.input.getBoundingClientRect();
        const origin = this.getGlobalPosition();

        return this.toLocal({ x: origin.x + (clientX - rect.left), y: origin.y + (clientY - rect.top) }).x;
    }
}

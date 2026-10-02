import { FederatedPointerEvent } from 'pixi.js';
import { AUTO_SCROLL_FRAMES } from './constants';
import { InputText } from './InputText';
import { TapCounter } from './TapCounter';
import { wordRangeAt } from './text';

import type { InputOptions, SelectionDirection } from './types';

/**
 * Third layer of {@link Input}: the caret and selection, mirrored from the hidden field, and the
 * pointer gestures on the canvas that set them — presses, drags with auto-scroll, multi-clicks and
 * the context menu. The gestures on the hidden field, on touch devices, are in {@link InputTouch}.
 * Not meant to be used on its own; {@link Input} is the component.
 * @ignore
 */
export class InputSelection extends InputText
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

    /** Multi-click counting; see {@link TapCounter}. */
    protected readonly tapCounter = new TapCounter();

    /** Selection a right-button press settled on, to put back after the context-menu request collapses it. */
    protected contextSelection: [number, number, SelectionDirection] | undefined;

    /** Local x of the pointer during a drag-selection, on the canvas or the hidden field, for auto-scrolling. */
    protected dragLocalX: number | undefined;

    /** Local y of the pointer during a drag-selection, for auto-scrolling a multiline text. */
    protected dragLocalY: number | undefined;

    /** X a run of Up/Down presses keeps aiming for, as native fields do across lines of different lengths. */
    protected caretGoalX: number | undefined;

    /** Set while a key moves the caret vertically, so the goal x outlives that move. */
    protected keepGoalX = false;

    /** Frames since the drag-selection last auto-scrolled. */
    protected autoScrollElapsed = 0;

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

        if (!this.keepGoalX) this.caretGoalX = undefined;

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

    /** Selects the whole value. Only takes effect while the input is being edited. */
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

        const local = this.toLocal(e.global);

        this.dragLocalX = local.x;
        this.dragLocalY = local.y;
        this.extendDragTo(this.dragAnchor, this.indexAtLocalX(this.clampToView(local.x), this.clampToViewY(local.y)));
    }

    protected onPointerUp(): void
    {
        if (this.dragAnchor !== undefined)
        {
            this.lastPressTime = performance.now();
        }

        this.dragAnchor = undefined;
        this.dragLocalX = undefined;
        this.dragLocalY = undefined;
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
     * Clamps a local y to the visible text area of a multiline text, as {@link Input.clampToView}
     * does for x, so a drag below the box selects the last visible line and scrolls from there.
     * @param localY - y in the component's local space.
     */
    protected clampToViewY(localY: number): number
    {
        if (!this.multiline) return localY;

        return Math.max(this.paddingTop, Math.min(localY, (this._bg?.height ?? 0) - this.paddingBottom));
    }

    /**
     * Anchor of the drag-selection in progress, if any. A drag on the canvas here;
     * {@link InputTouch} adds the one on the hidden field.
     */
    protected get activeDragAnchor(): number | undefined
    {
        return this.dragAnchor;
    }

    /**
     * Keeps a drag-selection held past an edge of overflowing text moving, one character every
     * few frames, as a native field auto-scrolls; the text follows the focus end.
     * @param dt - ticker delta, in frames.
     */
    protected autoScrollDrag(dt: number): void
    {
        const anchor = this.activeDragAnchor;
        const x = this.dragLocalX;
        let direction = 0;

        if (this.multiline)
        {
            const y = this.dragLocalY;

            if (y !== undefined && this.isOverflowingY)
            {
                if (y < this.paddingTop) direction = -1;
                else if (y > (this._bg?.height ?? 0) - this.paddingBottom) direction = 1;
            }
        }
        else if (x !== undefined && this.isOverflowing)
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

        if (this.multiline)
        {
            this.extendDragTo(anchor, this.indexOnAdjacentLine(focus, direction, x ?? 0));

            return;
        }

        const { boundaries } = this.textMetrics();
        const next = direction < 0
            ? [...boundaries].reverse().find((b) => b < focus)
            : boundaries.find((b) => b > focus);

        if (next === undefined) return;

        this.extendDragTo(anchor, next);
    }

    /**
     * The caret index one line up or down from an index, nearest to an x; the start of the text
     * above the first line and the end of it below the last, as native fields do.
     * @param index - position to move from.
     * @param direction - -1 for the line above, 1 for the line below.
     * @param x - local x to aim for.
     */
    protected indexOnAdjacentLine(index: number, direction: number, x: number): number
    {
        const { lines } = this.layoutLines();
        const row = this.lineIndexOf(index) + direction;

        if (row < 0) return 0;
        if (row >= lines.length) return this.value.length;

        return this.indexInLine(row, x - this.textLeft);
    }

    /**
     * Moves the caret by lines in a multiline text, which the hidden field cannot do, as it does
     * not know how the component wrapped them: Up, Down, Home and End, with Shift to extend.
     * @param e - the key press.
     * @returns whether the key was handled.
     */
    protected moveCaretByLines(e: KeyboardEvent): boolean
    {
        const { key } = e;

        if (!this.multiline || !this.input || e.altKey) return false;
        if (key !== 'ArrowUp' && key !== 'ArrowDown' && key !== 'Home' && key !== 'End') return false;

        const focus = this.caretIndex;
        const row = this.lineIndexOf(focus);
        let target: number;

        if (key === 'Home')
        {
            target = this.layoutLines().lines[row].start;
        }
        else if (key === 'End')
        {
            const { line, boundaries } = this.lineMetrics(row);
            const wrapped = this.layoutLines().lines[row + 1]?.start === line.end;

            // The end of a wrapped line is drawn on the next one; stay on this line, before its last character.
            target = line.start + boundaries[wrapped ? boundaries.length - 2 : boundaries.length - 1];
        }
        else
        {
            const goal = this.caretGoalX ?? this.offsetInLine(row, focus);

            this.caretGoalX = goal;
            target = this.indexOnAdjacentLine(focus, key === 'ArrowUp' ? -1 : 1, this.textLeft + goal);
        }

        e.preventDefault();
        this.keepGoalX = key === 'ArrowUp' || key === 'ArrowDown';

        if (e.shiftKey)
        {
            const anchor = this.selectionDirection === 'backward' ? this.selectionEnd : this.selectionStart;

            this.setSelection(Math.min(anchor, target), Math.max(anchor, target), target < anchor ? 'backward' : 'forward');
        }
        else
        {
            this.setSelection(target, target);
        }

        this.keepGoalX = false;

        return true;
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
        return this.tapCounter.next(x, y, touch);
    }

    /**
     * Handles a tap during editing: a double click selects a word, a triple click the whole value.
     * @param e - the tap.
     * @param clicks - click count from {@link TapCounter}: 2 selects a word, 3 the whole value.
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
        const local = this.toLocal(e.global);

        return this.indexAtLocalX(local.x, local.y);
    }
}

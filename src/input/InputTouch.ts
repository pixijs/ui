import { isMobile } from 'pixi.js';
import { DRAG_THRESHOLD } from './constants';
import { InputSelection } from './InputSelection';

/**
 * Fourth layer of {@link Input}: presses on the hidden field itself, on touch devices. The field
 * has to stay the touch target there, because its long-press callout is the only way to paste on
 * iOS, so taps, multi-taps and drags arrive on it rather than on the canvas and are mapped onto
 * the drawn text here. Not meant to be used on its own; {@link Input} is the component.
 * @ignore
 */
export class InputTouch extends InputSelection
{
    /** Set around the synthetic `click()` on focus so it is not mistaken for a tap on the field. */
    protected clickingField = false;

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

        const local = this.localAtClient(e.clientX, e.clientY);

        this.dragLocalX = local.x;
        this.dragLocalY = local.y;
        this.extendDragTo(anchor, this.indexAtLocalX(this.clampToView(local.x), this.clampToViewY(local.y)));
    }

    protected onFieldPointerUp(): void
    {
        this.fieldDragAnchor = undefined;
        this.dragLocalX = undefined;
        this.dragLocalY = undefined;
    }

    /**
     * The caret index nearest to a point on the hidden field. The field sits at the component's
     * global position, so an offset into it is an offset in global space.
     * @param clientX - horizontal position in the viewport.
     * @param clientY - vertical position in the viewport.
     */
    protected indexAtClient(clientX: number, clientY: number): number
    {
        const local = this.localAtClient(clientX, clientY);

        return this.indexAtLocalX(local.x, local.y);
    }

    /**
     * The local x of a point on the hidden field; see {@link Input.indexAtClient}.
     * @param clientX - horizontal position in the viewport.
     * @param clientY - vertical position in the viewport.
     */
    protected localXAtClient(clientX: number, clientY: number): number
    {
        return this.localAtClient(clientX, clientY).x;
    }

    /**
     * The local position of a point on the hidden field; see {@link Input.indexAtClient}.
     * @param clientX - horizontal position in the viewport.
     * @param clientY - vertical position in the viewport.
     */
    protected localAtClient(clientX: number, clientY: number): { x: number; y: number }
    {
        if (!this.input) return { x: 0, y: 0 };

        const rect = this.input.getBoundingClientRect();
        const origin = this.getGlobalPosition();

        return this.toLocal({ x: origin.x + (clientX - rect.left), y: origin.y + (clientY - rect.top) });
    }

    /** A drag on the hidden field counts once it has moved past the threshold. */
    protected override get activeDragAnchor(): number | undefined
    {
        return super.activeDragAnchor ?? (this.fieldDragged ? this.fieldDragAnchor : undefined);
    }
}

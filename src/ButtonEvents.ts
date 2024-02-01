import { Container, FederatedPointerEvent, isMobile } from 'pixi.js';
import { Signal } from 'typed-signals';

/** Events controller used for {@link Button}. */
export class ButtonEvents
{
    protected _isMouseIn: boolean;
    protected _isDown: boolean;

    /** Event that is fired when the button is down. */
    onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /**
     * Event that fired when a down event happened inside the button
     * and up event happened inside or outside of the button
     */
    onUp: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /**
     * Event that fired when mouse up event happens outside of the button
     * after the down event happened inside the button boundaries.
     */
    onUpOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that fired when the mouse is out of the view */
    onOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that is fired when the button is pressed. */
    onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that is fired when the mouse hovers the button. Fired only if device is not mobile.*/
    onHover: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    constructor()
    {
        this.onPress = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onHover = new Signal();
        this.onOut = new Signal();
        this.onUpOut = new Signal();
    }

    protected connectEvents(view: Container)
    {
        if (isMobile.any)
        {
            view.on('pointerdown', this.processDown, this);
            view.on('pointerup', this.processUp, this);
            view.on('pointerupoutside', this.processUpOut, this);
            view.on('pointerout', this.processOut, this);
            view.on('pointertap', this.processPress, this);
            view.on('pointerover', this.processOver, this);
        }
        else
        {
            view.on('mousedown', this.processDown, this);
            view.on('mouseup', this.processUp, this);
            view.on('mouseupoutside', this.processUpOut, this);
            view.on('mouseout', this.processOut, this);
            view.on('click', this.processPress, this);
            view.on('mouseover', this.processOver, this);
        }
    }

    protected disconnectEvents(view: Container)
    {
        if (isMobile.any)
        {
            view.off('pointerdown', this.processDown, this);
            view.off('pointerup', this.processUp, this);
            view.off('pointerupoutside', this.processUpOut, this);
            view.off('pointerout', this.processOut, this);
            view.off('pointertap', this.processPress, this);
            view.off('pointerover', this.processOver, this);
        }
        else
        {
            view.off('mousedown', this.processDown, this);
            view.off('mouseup', this.processUp, this);
            view.off('mouseupoutside', this.processUpOut, this);
            view.off('mouseout', this.processOut, this);
            view.off('click', this.processPress, this);
            view.off('mouseover', this.processOver, this);
        }
    }

    protected processDown(e: FederatedPointerEvent): void
    {
        this._isDown = true;
        this.onDown.emit(this, e);
        this.down(e);
    }

    protected processUp(e?: FederatedPointerEvent)
    {
        if (this._isDown)
        {
            this.onUp.emit(this, e);
            this.up(e);
        }

        this._isDown = false;
    }

    protected processUpOut(e?: FederatedPointerEvent)
    {
        if (this._isDown)
        {
            this.onUp.emit(this, e);
            this.onUpOut.emit(this, e);
            this.up(e);
            this.upOut(e);
        }

        this._isDown = false;
    }

    protected processOut(e?: FederatedPointerEvent)
    {
        if (this._isMouseIn)
        {
            this._isMouseIn = false;
            this.onOut.emit(this, e);
            this.out(e);
        }
    }

    protected processPress(e: FederatedPointerEvent)
    {
        this._isDown = false;
        this.onPress.emit(this, e);
        this.press(e);
    }

    protected processOver(e: FederatedPointerEvent)
    {
        if (isMobile.any) return;

        this._isMouseIn = true;
        this.onHover.emit(this, e);
        this.hover(e);
    }

    /**
     * Method called when the button pressed.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    down(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the button is up.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    up(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the up event happens outside of the button,
     * after the down event happened inside the button boundaries.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    upOut(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse leaves the button.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    out(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse press down the button.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    press(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse hovers the button.
     * To be overridden.
     * Fired only if device is not mobile.
     * @param {FederatedPointerEvent} _e - event data
     */
    hover(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /** Getter that returns if the button is down. */
    get isDown(): boolean
    {
        return this._isDown;
    }
}

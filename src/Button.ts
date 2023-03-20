import { utils } from '@pixi/core';
import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Signal } from 'typed-signals';

/**
 * Adds button events to a given container-based view
 *
 * so you can subscribe to them and use your container-based instance as a button.
 * @example
 * const container = new Container();
 * const button = new Button(
 *      new Graphics()
 *          .beginFill(0xFFFFFF)
 *          .drawRoundedRect(0, 0, 100, 50, 15)
 * );
 *
 * buttonEvents.onPress.connect(() => console.log('onPress'));
 *
 * container.addChild(buttonEvents.view);
 */
export class Button
{
    private _view: Container;
    private _isDown: boolean;
    private _isMouseIn: boolean;
    private _enabled = true;

    /** Event that is fired when the button is pressed. */
    public onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that is fired when the button is down. */
    public onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /**
     * Event that fired when a down event happened inside the button
     * and up event happened inside or outside of the button
     */
    public onUp: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that is fired when the mouse hovers the button. */
    public onHover: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that fired when the mouse is out of the view */
    public onOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /**
     * Event that fired when mouse up event happens outside of the button
     * after the down event happened inside the button boundaries.
     */
    public onUpOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /**
     * Turns a given container-based view into a button by adding all button events.
     * @param {Container} view - Contained-based view
     */
    constructor(view: Container)
    {
        this._view = view;
        this.init();

        this.enabled = true;
    }

    /** Creates and connect interaction events. */
    init()
    {
        this.createEvents();
        this.connectEvents();
    }

    /** Set button view, thar all the interaction events are applied to. */
    set view(view: Container)
    {
        this.disconnectEvents();

        this._view = view;

        this.connectEvents();
    }

    /** Get button view, thar all the interaction events are applied to. */
    get view(): Container
    {
        return this._view;
    }

    /**
     * Method called when the button pressed.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    public down(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the button is up.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    public up(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse hovers the button.
     * To be overridden.
     * This is fired only on PC.
     * @param {FederatedPointerEvent} _e - event data
     */
    public hover(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse press down the button.
     * To be overridden.
     * This is fired only on PC.
     * @param {FederatedPointerEvent} _e - event data
     */
    public press(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse leaves the button.
     * To be overridden.
     * This is fired only on PC.
     * @param {FederatedPointerEvent} _e - event data
     */
    public out(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the up event happens outside of the button,
     * after the down event happened inside the button boundaries.
     * To be overridden.
     * This is fired only on PC.
     * @param {FederatedPointerEvent} _e - event data
     */
    public upOut(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /** Getter that returns if the button is down. */
    get isDown(): boolean
    {
        return this._isDown;
    }

    /**
     * Switcher, which prevents all button events from firing.
     * @param {boolean} enabled
     */
    set enabled(enabled: boolean)
    {
        this._enabled = enabled;
        this.view.eventMode = enabled ? 'static' : 'auto';
        this.view.cursor = enabled ? 'pointer' : 'default';

        if (!enabled)
        {
            this._processUp();
        }
    }

    /** Getter that returns button state, that controls if button events are firing. */
    get enabled(): boolean
    {
        return this._enabled;
    }

    private _processUp(_e?: FederatedPointerEvent)
    {
        if (this._isDown)
        {
            this.onUp.emit(this, _e);
        }
        this._isDown = false;
    }

    private _processUpOut(_e?: FederatedPointerEvent)
    {
        if (this._isDown)
        {
            this.onUp.emit(this, _e);
            this.onUpOut.emit(this, _e);
        }

        this._isDown = false;
    }

    private _processOut(_e?: FederatedPointerEvent)
    {
        if (this._isMouseIn)
        {
            this._isMouseIn = false;
            this.onOut.emit(this, _e);
        }
    }

    private _upOut(_e?: FederatedPointerEvent)
    {
        this.upOut(_e);
    }

    private _out(_e?: FederatedPointerEvent)
    {
        this.out(_e);
    }

    private _processOver(_e: FederatedPointerEvent)
    {
        this._isMouseIn = true;
        this.onHover.emit(this, _e);
    }

    private _processTap(_e: FederatedPointerEvent)
    {
        this._isDown = false;
        this.onPress.emit(this, _e);
        this.press(_e);
    }

    private _processDown(_e: FederatedPointerEvent): void
    {
        this._isDown = true;
        this.onDown.emit(this, _e);
    }

    private createEvents()
    {
        this.onPress = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onHover = new Signal();
        this.onOut = new Signal();
        this.onUpOut = new Signal();
    }

    private connectEvents()
    {
        this.view.on('pointerdown', this._processDown, this);
        this.view.on('pointerup', this._processUp, this);
        this.view.on('pointerupoutside', this._processUpOut, this);
        this.view.on('pointerout', this._processOut, this);
        this.view.on('pointertap', this._processTap, this);
        this.view.on('pointerover', this._processOver, this);

        this.onDown.connect(() => this.down());
        this.onUp.connect(() => this.up());
        this.onUpOut.connect(() => this._upOut());
        this.onOut.connect(() => this._out());

        if (!utils.isMobile.any)
        {
            this.onHover.connect(() => this.hover());
        }
    }

    private disconnectEvents()
    {
        this.view.off('pointerdown', this._processDown, this);
        this.view.off('pointerup', this._processUp, this);
        this.view.off('pointerupoutside', this._processUpOut, this);
        this.view.off('pointerout', this._processOut, this);
        this.view.off('pointertap', this._processTap, this);
        this.view.off('pointerover', this._processOver, this);

        this.onDown.disconnectAll();
        this.onUp.disconnectAll();
        this.onUpOut.disconnectAll();
        this.onOut.disconnectAll();

        if (!utils.isMobile.any)
        {
            this.onHover.disconnectAll();
        }
    }

    /** Disconnects nad deletes all interaction events. */
    destroy()
    {
        this.disconnectEvents();

        delete this.onPress;
        delete this.onDown;
        delete this.onUp;
        delete this.onHover;
        delete this.onOut;
        delete this.onUpOut;

        this._view = null;
    }
}

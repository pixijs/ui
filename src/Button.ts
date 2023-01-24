import { utils } from '@pixi/core';
import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Signal } from 'typed-signals';

/**
 * Adds button events to a given container based view so you can subscribe to them
 * and use your container based instance as a button.
 * @example
 * ```
 * const button = new Button(
 *      new Graphics()
 *          .beginFill(0xFFFFFF)
 *          .drawRoundedRect(0, 0, width, height, radius)
 * );
 *
 * buttonEvents.onPress.connect(() => console.log('onPress'));
 *
 * parrent.addChild(buttonEvents.view);
 * ```
 */
export class Button
{
    /** Container, given as a constructor parameter that is a button view. */
    public view: Container;

    /** Event that is fired when button is pressed. */
    public onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that is fired when button is down. */
    public onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /**
     * Event that is fired when down event happened inside the button
     * and up event happened inside or outside of the button
     */
    public onUp: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that is fired when mouse hovers the button. */
    public onHover: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that is fired when mouse leaves button view. */
    public onOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /**
     * Event that is fired when up event happens outside of the button
     * when down event happened inside the button boundaries.
     */
    public onUpOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    private _isDown: boolean;
    private _isMouseIn: boolean;
    private _enabled: boolean;

    /**
     * Turns a given container based view into a button by adding all button events to it.
     * @param {Container} view - Contained based view
     */
    constructor(view: Container)
    {
        this.view = view;

        this.createEvents();

        this.enabled = true;
    }

    /**
     * Method called when button is pressed down.
     * To be override.
     * @param {FederatedPointerEvent} _e - event data
     */
    public down(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when button is pressed up.
     * To be override.
     * @param {FederatedPointerEvent} _e - event data
     */
    public up(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when mouse hovers the button.
     * To be override.
     * This is fired only on PC.
     * @param {FederatedPointerEvent} _e - event data
     */
    public hover(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when mouse hovers the button.
     * To be override.
     * This is fired only on PC.
     * @param {FederatedPointerEvent} _e - event data
     */
    public press(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when mouse leaves button view.
     * To be override.
     * This is fired only on PC.
     * @param {FederatedPointerEvent} _e - event data
     */
    public out(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when when up event happens outside of the button
     * when down event happened inside the button boundaries.
     * To be override.
     * This is fired only on PC.
     * @param {FederatedPointerEvent} _e - event data
     */
    public upOut(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    get isDown(): boolean
    {
        return this._isDown;
    }

    /**
     * Setter, that prevents all button events from firing.
     * @param {boolean} enabled
     */
    set enabled(enabled: boolean)
    {
        this._enabled = enabled;
        this.view.interactive = enabled;
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

    private _processUp(e?: FederatedPointerEvent)
    {
        if (this._isDown)
        {
            this.onUp.emit(this, e);
        }
        this._isDown = false;
    }

    private _processUpOut(e?: FederatedPointerEvent)
    {
        if (this._isDown)
        {
            this.onUp.emit(this, e);
            this.onUpOut.emit(this, e);
        }

        this._isDown = false;
    }

    private _processOut(e?: FederatedPointerEvent)
    {
        if (this._isMouseIn)
        {
            this._isMouseIn = false;
            this.onOut.emit(this, e);
        }
    }

    private _upOut(e?: FederatedPointerEvent)
    {
        this.upOut(e);
    }

    private _out(e?: FederatedPointerEvent)
    {
        this.out(e);
    }

    private createEvents()
    {
        this.onPress = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onHover = new Signal();
        this.onOut = new Signal();
        this.onUpOut = new Signal();

        this.view.on('pointerdown', (e: FederatedPointerEvent) =>
        {
            this._isDown = true;
            this.onDown.emit(this, e);
        });

        this.view.on('pointerup', (e: FederatedPointerEvent) =>
        {
            this._processUp(e);
        });

        this.view.on('pointerupoutside', (e: FederatedPointerEvent) =>
        {
            this._processUpOut(e);
        });

        this.view.on('pointerout', (e: FederatedPointerEvent) =>
        {
            this._processOut(e);
        });

        this.view.on('pointertap', (e: FederatedPointerEvent) =>
        {
            this._isDown = false;
            this.onPress.emit(this, e);
            this.press(e);
        });

        this.view.on('pointerover', (e: FederatedPointerEvent) =>
        {
            this._isMouseIn = true;
            this.onHover.emit(this, e);
        });

        this.onDown.connect((_btn, e) =>
        {
            this.down(e);
        });

        this.onUp.connect((_btn, e) =>
        {
            this.up(e);
        });

        this.onUpOut.connect((_bth, e) =>
        {
            this._upOut(e);
        });

        if (!utils.isMobile.any)
        {
            this.onHover.connect((_bth, e) =>
            {
                this.hover(e);
            });
        }

        this.onOut.connect((_bth, e) =>
        {
            this._out(e);
        });
    }
}

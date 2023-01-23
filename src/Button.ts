import { utils } from '@pixi/core';
import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Signal } from 'typed-signals';

/**
 * Container based component that gives us a starting point for UI buttons.
 * @example
 * ```
 * const button = new Button(
 *      new Graphics()
 *          .beginFill(0xFFFFFF)
 *          .drawRoundedRect(0, 0, width, height, radius)
 * );
 *
 * ```
 */
export class Button extends Container
{
    /** Holder for all the inner views. */
    public innerView: Container;

    /** Event that is fired when button is pressed. */
    public onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that is fired when button is down. */
    public onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that is fired when button is up. */
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
     * Turns a given contained based view into a button by wrapping it with a container and adding events.
     * @param {Container} view - Contained based view
     */
    constructor(view: Container)
    {
        super();

        this.innerView = new Container();
        this.innerView.addChild(view);

        this.addChild(this.innerView);

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
        this.interactive = enabled;
        this.cursor = enabled ? 'pointer' : 'default';

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
        this.up(e);
    }

    private _out(e?: FederatedPointerEvent)
    {
        this.up(e);
    }

    private createEvents()
    {
        this.onPress = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onHover = new Signal();
        this.onOut = new Signal();
        this.onUpOut = new Signal();

        this.on('pointerdown', (e: FederatedPointerEvent) =>
        {
            this._isDown = true;
            this.onDown.emit(this, e);
        });

        this.on('pointerup', (e: FederatedPointerEvent) =>
        {
            this._processUp(e);
        });

        this.on('pointerupoutside', (e: FederatedPointerEvent) =>
        {
            this._processUpOut(e);
        });

        this.on('pointerout', (e: FederatedPointerEvent) =>
        {
            this._processOut(e);
        });

        this.on('pointertap', (e: FederatedPointerEvent) =>
        {
            this._isDown = false;
            this.onPress.emit(this, e);
            this.press(e);
        });

        this.on('pointerover', (e: FederatedPointerEvent) =>
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
            this.upOut(e);
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
            this.out(e);
        });
    }
}

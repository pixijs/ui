import { Container } from '@pixi/display';
import { Signal } from 'typed-signals';
import { getView } from './utils/helpers/view';
import { Button } from './Button';
import { ButtonEvent } from './utils/HelpTypes';

/**
 * Container based component that switches visibility of a given containers by any of the button events.
 *
 * By default it switches on press.
 *
 * Can be used for creating tabs, radio buttons, checkboxes etc.
 * @example
 * // switch on click
 * const switch = new Swich([`switch_off.png`, `switch_on.png`]);
 *
 * // switch on hover
 * const button = new Swich([`button_default.png`, `button_hover.png`], ['onHover', 'onOut']);
 *
 * button.events.onPress.connect(() => console.log('button pressed'));
 */
export class Switcher extends Button
{
    private _triggerEvents: Set<ButtonEvent>;

    /** Container that holds all the content of the component. */
    public innerView: Container;

    /** The id of the visible(active) view. */
    public active = 0;

    /** Fired when active view changes. */
    public onChange: Signal<(state: number | boolean) => void>;

    /**
     * @param {Array<Container | string>} views - Array of views or textures that will be switching.
     * @param triggerEvents - Button events, to switch views (can be one event or an array of events).
     * @param activeViewID - The id of the view, visible by default.
     */
    constructor(views?: Array<Container | string>, triggerEvents?: ButtonEvent | ButtonEvent[], activeViewID = 0)
    {
        super(new Container());

        this.innerView = new Container();
        this.view.addChild(this.innerView);

        this.active = activeViewID;

        this.onChange = new Signal();

        if (views) this.views = views;
        if (triggerEvents) this.triggerEvents = triggerEvents;
    }

    /** Returns the active view. */
    public get activeView(): Container | undefined
    {
        if (this.views && this.views[this.active])
        {
            return this.views[this.active] as Container;
        }

        return undefined;
    }

    /** Sets the list of instances for switching. */
    public set views(views: Array<Container | string>)
    {
        views.map((stateView, id) =>
        {
            const view = getView(stateView);

            this.innerView.addChild(view);

            view.visible = id === this.active;

            return view;
        });
    }

    /** Returns all the switchable views */
    get views(): Array<Container>
    {
        return this.innerView.children as Array<Container>;
    }

    /**
     * Sets a list of events that will make a switcher switch to the next view.
     * @param {ButtonEvent | ButtonEvent[]} triggerEvents - Button events,
     * to switch views (can be one event or an array of events).
     */
    public set triggerEvents(triggerEvents: ButtonEvent | ButtonEvent[])
    {
        if (triggerEvents)
        {
            Array.isArray(triggerEvents)
                ? (this._triggerEvents = new Set(triggerEvents))
                : (this._triggerEvents = new Set([triggerEvents]));
        }
        else
        {
            this._triggerEvents = new Set(['onPress']);
        }
    }

    /** Returns a list of events that will make a switcher switch to the next view. */
    public get triggerEvents(): ButtonEvent[]
    {
        return Array.from(this._triggerEvents);
    }

    /**
     * Show a view by id, or to next one by order, if no ID provided.
     * @param {number} id - optional id of the view to show.
     * @param {ButtonEvent} event - optional event to use to switch views.
     */
    public switch(id?: number, event?: ButtonEvent): void
    {
        if (!this._triggerEvents.has(event))
        {
            return;
        }

        this.activeView.visible = false;
        this.active = id !== undefined ? id : this.nextActive;

        const newState = this.views[this.active];

        newState.visible = true;

        const res = this.views.length > 2 ? this.active : this.active === 1;

        this.onChange.emit(res);
    }

    /**
     * Switches a view to a given one without triggering the onChange event.
     * @param {number} id
     */
    public forceSwitch(id: number): void
    {
        this.activeView.visible = false;
        this.active = id !== undefined ? id : this.nextActive;

        const newState = this.views[this.active];

        newState.visible = true;
    }

    /** Returns the id of the next view in order. */
    private get nextActive(): number
    {
        return this.active < this.views.length - 1 ? this.active + 1 : 0;
    }

    /** Method called when the Switcher pressed. */
    override down()
    {
        this.switch(this.nextActive, 'onDown');
    }

    /** Method called when the Switcher is up.. */
    override up()
    {
        this.switch(this.nextActive, 'onUp');
    }

    /** Method called when the mouse hovers the Switcher. */
    override hover()
    {
        this.switch(this.nextActive, 'onHover');
    }

    /** Method called when the mouse press down the Switcher. */
    override press()
    {
        this.switch(this.nextActive, 'onPress');
    }

    /** Method called when the mouse leaves the Switcher. */
    override out()
    {
        this.switch(this.nextActive, 'onOut');
    }

    /**
     * Method called when the up event happens outside of the Switcher,
     * after the down event happened inside the Switcher boundaries.
     */
    override upOut()
    {
        this.switch(this.nextActive, 'onUpOut');
    }
}

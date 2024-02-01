import { Container } from 'pixi.js';
import { Signal } from 'typed-signals';
import { getView } from './utils/helpers/view';
import { ButtonEvent } from './utils/HelpTypes';

/**
 * Container based component that switches visibility of a given containers by any of the interaction events.
 *
 * By default it switches on press.
 *
 * Can be used for creating buttons, tabs, radio buttons, checkboxes etc.
 * @example
 * // switch on onPress
 * const switch = new Swich([`switch_off.png`, `switch_on.png`]);
 *
 * // switch on hover
 * const button = new Swich([`button_default.png`, `button_hover.png`], ['onHover', 'onOut']);
 *
 * button.events.onPress.connect(() => console.log('button pressed'));
 */
export class Switcher extends Container
{
    protected _triggerEvents: Set<ButtonEvent> = new Set(['onPress']);

    /** Container that holds all the content of the component. */
    innerView: Container;

    /** The id of the visible(active) view. */
    protected _active: number;

    /** Fired when active view changes. */
    onChange: Signal<(state: number | boolean) => void>;

    /**
     * @param {Array<Container | string>} views - Array of views or textures that will be switching.
     * @param triggerEvents - Button events, to switch views (can be one event or an array of events).
     * @param activeViewID - The id of the view, visible by default.
     */
    constructor(views?: Array<Container | string>, triggerEvents?: ButtonEvent | ButtonEvent[], activeViewID?: number)
    {
        super();

        this.innerView = new Container();
        this.addChild(this.innerView);

        this.onChange = new Signal();

        if (views) this.views = views;
        if (triggerEvents) this.triggerEvents = triggerEvents;
        if (activeViewID && this.views.length > 0) this.active = activeViewID;

        this.setInteractionEvents();
    }

    protected setInteractionEvents()
    {
        this.innerView.eventMode = 'static';

        this.innerView.on('pointerdown', () => this.handleEvents('onDown'));
        this.innerView.on('pointerup', () => this.handleEvents('onUp'));
        this.innerView.on('pointerupoutside', () => this.handleEvents('onUpOut'));
        this.innerView.on('pointerout', () => this.handleEvents('onOut'));
        this.innerView.on('pointertap', () => this.handleEvents('onPress'));
        this.innerView.on('pointerover', () => this.handleEvents('onHover'));
    }

    protected handleEvents(event: ButtonEvent)
    {
        if (this._triggerEvents.has(event))
        {
            this.switch();
        }
    }

    /** Returns the active view. */
    get activeView(): Container | undefined
    {
        if (this.views && this.views[this.active])
        {
            return this.views[this.active] as Container;
        }

        return undefined;
    }

    /** Sets the list of instances for switching. */
    set views(views: Array<Container | string>)
    {
        this.innerView.removeChildren();
        views.forEach((stateView) => this.add(stateView));
    }

    /** Returns all the switchable views */
    get views(): Array<Container>
    {
        return this.innerView.children as Array<Container>;
    }

    /**
     * Adds view instance to a switching list.
     * @param view
     */
    add(view: Container | string): void
    {
        const viewInstance = getView(view);

        this.innerView.addChild(viewInstance);

        viewInstance.visible = false;

        if (this.views.length === 1)
        {
            this.active = 0;
        }
    }

    /**
     * Removes view instance from a switching list by id.
     * @param id - id of the view to remove.
     */
    remove(id: number)
    {
        if (this.views[id])
        {
            this.innerView.removeChild(this.views[id]);
        }
    }

    /**
     * Sets a list of events that will make a switcher switch to the next view.
     * @param {ButtonEvent | ButtonEvent[]} triggerEvents - Button events,
     * to switch views (can be one event or an array of events).
     */
    set triggerEvents(triggerEvents: ButtonEvent | ButtonEvent[])
    {
        this._triggerEvents = new Set(Array.isArray(triggerEvents) ? triggerEvents : [triggerEvents]);
    }

    /** Returns a list of events that will make a switcher switch to the next view. */
    get triggerEvents(): ButtonEvent[]
    {
        return Array.from(this._triggerEvents);
    }

    /**
     * Show a view by id, or to next one by order, if no ID provided.
     * @param {number} id - optional id of the view to show. If not set, will switch to the next view.
     */
    switch(id?: number)
    {
        if (id !== undefined && id === this.active) return;

        const exID = this.active;

        this.forceSwitch(id);

        if (exID !== this.active)
        {
            const res = this.views.length > 2 ? this.active : this.active === 1;

            this.onChange.emit(res);
        }
    }

    /**
     * Switches a view to a given one without triggering the onChange event.
     * @param {number} id - optional id of the view to show. If not set, will switch to the next view.
     */
    forceSwitch(id?: number)
    {
        if (id !== undefined && id === this.active) return;

        if (this.activeView)
        {
            this.activeView.visible = false;
        }

        if (id !== undefined && !this.views[id])
        {
            throw new Error(`View with id ${id} does not exist.`);
        }

        this._active = id !== undefined ? id : this.nextActive;

        if (this._active === undefined)
        {
            return;
        }

        this.views[this.active].visible = true;
    }

    /** Returns the id of the next view in order. Or undefined, if order is empty. */
    protected get nextActive(): number | undefined
    {
        if (this.views.length === 0) return undefined;

        return this.active < this.views.length - 1 ? this.active + 1 : 0;
    }

    /** Sets the id of the visible(active) view and shows to it. */
    set active(id: number)
    {
        this.switch(id);
    }

    /** Gets the id of the visible(active) view. */
    get active(): number
    {
        return this._active;
    }
}

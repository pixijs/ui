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
export class Switcher extends Container
{
    private triggerEvents: Set<ButtonEvent>;

    /** Container that holds all the content of the component. */
    public innerView: Container;

    /** The id of the visible(active) view. */
    public active = 0;

    /** Fired when active view changes. */
    public onChange: Signal<(state: number | boolean) => void>;

    /** Button events used to switch views. */
    public events: Button;

    /**
     * @param {Array<Container | string>} views - Array of views or textures that will be switching.
     * @param triggerEvents - Button events, to switch views (can be one event or an array of events).
     * @param activeViewID - The id of the view, visible by default.
     */
    constructor(views: Array<Container | string>, triggerEvents?: ButtonEvent | ButtonEvent[], activeViewID = 0)
    {
        super();

        this.innerView = new Container();
        this.addChild(this.innerView);

        this.active = activeViewID;

        views.map((stateView, id) =>
        {
            const view = getView(stateView);

            this.innerView.addChild(view);

            view.visible = id === activeViewID;

            return view;
        });

        this.onChange = new Signal();

        if (triggerEvents)
        {
            if (Array.isArray(triggerEvents))
            {
                this.triggerEvents = new Set(triggerEvents);
            }
            else
            {
                this.triggerEvents = new Set([triggerEvents]);
            }
        }
        else
        {
            this.triggerEvents = new Set(['onPress']);
        }

        this.events = new Button(this);

        this.events.onPress.connect(() => this.switch(this.nextActive, 'onPress'));
        this.events.onDown.connect(() => this.switch(this.nextActive, 'onDown'));
        this.events.onUp.connect(() => this.switch(this.nextActive, 'onUp'));
        this.events.onHover.connect(() => this.switch(this.nextActive, 'onHover'));
        this.events.onOut.connect(() => this.switch(this.nextActive, 'onOut'));
        this.events.onUpOut.connect(() => this.switch(this.nextActive, 'onUpOut'));
    }

    /** Returns the active view */
    public get activeView(): Container
    {
        return this.views[this.active] as Container;
    }

    /** Returns all the switchable views */
    get views(): Array<Container>
    {
        return this.innerView.children as Array<Container>;
    }

    /**
     * Show a view by id, or to next one by order, if no ID provided.
     * @param {number} id - optional id of the view to show.
     * @param {ButtonEvent} event - optional event to use to switch views.
     */
    public switch(id?: number, event?: ButtonEvent): void
    {
        if (!this.triggerEvents.has(event))
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
}

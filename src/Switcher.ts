import { Container } from '@pixi/display';
import { Signal } from 'typed-signals';
import { getView } from './utils/helpers/view';
import { Button } from './Button';
import { ButtonEvent } from './utils/HelpTypes';

/**
 * Container based component that switches visibility of containers by any of the button events.
 *
 * By default it switches on press.
 *
 * Can be used for creating tabs, radio buttons, checkboxes etc.
 * @example
 * ```
 * const switch = new Swich([`switch_off.png`, `switch_on.png`]);
 * const button = new Swich([`button_default.png`, `button_hover.png`], ['onHover', 'onOut']);
 * button.events.onPress.connect(() => console.log('button pressed'));
 *
 * ```
 */
export class Switcher extends Container
{
    private triggerEvents: Set<ButtonEvent>;

    /** Container that will hold all the content of the component. */
    public view: Container;

    /** The id of the visible(active) view. */
    public active = 0;

    /** Event that is firing when active view changes (on click). */
    public onChange: Signal<(state: number | boolean) => void>;

    /** Button events that are used to switch views. */
    public events: Button;

    /**
     * @param {Array<Container | string>} views - Array of views that will be switched or textures,
     * that will be used to create views.
     * @param triggerEvents - Button events that will be used to switch views (can be 1 event or array of events).
     * @param activeViewID - The id of the view that will be visible on start.
     */
    constructor(views: Array<Container | string>, triggerEvents?: ButtonEvent | ButtonEvent[], activeViewID = 0)
    {
        super();

        this.view = new Container();
        this.addChild(this.view);

        views.map((stateView, id) =>
        {
            const view = getView(stateView);

            this.view.addChild(view);

            view.visible = id === this.active;

            return view;
        });

        this.active = activeViewID;

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

        this.events = new Button(this.view);

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
        return this.view.children as Array<Container>;
    }

    /**
     * Switches the view to the next one.
     * @param {number} id - optional id of the view that will be switched to.
     * @param {ButtonEvent} event - optional event that will be used to switch views.
     */
    public switch(id?: number, event?: ButtonEvent): void
    {
        if (!this.triggerEvents.has(event))
        {
            return;
        }

        this.activeView.visible = false;
        this.active = id ?? this.nextActive;

        const newState = this.views[this.active];

        newState.visible = true;

        const res = this.views.length > 2 ? this.active : this.active === 1;

        this.onChange.emit(res);
    }

    private get nextActive(): number
    {
        return this.active < this.views.length - 1 ? this.active + 1 : 0;
    }
}

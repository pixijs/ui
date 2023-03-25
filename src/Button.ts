import { Container } from '@pixi/display';
import { ButtonEvents } from './ButtonEvents';
import { Mixin } from 'ts-mixer';

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
export class Button extends ButtonEvents
{
    /** Container, given as a constructor parameter that is a button view. */
    private _view: Container;

    /**
     * Turns a given container-based view into a button by adding all button events.
     * @param {Container} view - instance of container, to be turned into button.
     */
    constructor(view?: Container)
    {
        super();

        if (view) this.init(view);
    }

    /**
     * Creates and connect interaction events.
     * @param {Container} view - instance of container, to be turned into button
     */
    init(view: Container)
    {
        this.view = view;
        this.enabled = true;
    }

    /** Set button view, thar all the interaction events are applied to. */
    set view(view: Container)
    {
        const wasItInitiated = !!this._view;

        if (wasItInitiated) this.disconnectEvents(view);

        this._view = view;
        this.connectEvents(view);

        if (!wasItInitiated) this.enabled = true;
    }

    /** Get button view, thar all the interaction events are applied to. */
    get view(): Container
    {
        return this._view;
    }

    /**
     * Switcher, which prevents all button events from firing if off.
     * @param {boolean} enabled
     */
    set enabled(enabled: boolean)
    {
        if (!this.view)
        {
            console.error('Button view is not set. Please set it before enabling the button.');

            return;
        }

        this.view.eventMode = enabled ? 'static' : 'auto';
        this.view.cursor = enabled ? 'pointer' : 'default';

        if (!enabled && this.isDown)
        {
            this.processUp();
        }
    }

    /** Getter that returns button state. */
    get enabled(): boolean
    {
        return this.view.eventMode === 'static';
    }
}

/** Button based on container. You can use it same {Button} but without `.view` */
export class ButtonContainer extends Mixin(Container, Button) {}

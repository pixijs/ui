import { Container, FederatedPointerEvent } from 'pixi.js';
import { Signal } from 'typed-signals';
import { ButtonEvents } from './ButtonEvents';

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
 * button.onPress.connect(() => console.log('onPress'));
 *
 * container.addChild(button.view);
 * // or container.addChild(container); which is the same
 */
export class Button extends ButtonEvents
{
    /** Container, given as a constructor parameter that is a button view. */
    protected _view: Container;

    /**
     * Turns a given container-based view into a button by adding all button events.
     * @param {Container} view - instance of container, to be turned into button.
     */
    constructor(view?: Container)
    {
        super();

        if (view)
        {
            this.view = view;
            this.enabled = true;
        }
    }

    /** Set button view, that all the interaction events are applied to. */
    set view(view: Container)
    {
        const wasItInitiated = !!this._view;

        if (wasItInitiated) this.disconnectEvents(this._view);

        this._view = view;
        this.connectEvents(this._view);
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

/**
 * Button based on container. You can use it same {@link Button}
 * but without need to pre create a container and interact with it through `.view` accessor.
 * @example
 * const button = new ButtonContainer(
 *      new Graphics()
 *          .beginFill(0xFFFFFF)
 *          .drawRoundedRect(0, 0, 100, 50, 15)
 * );
 *
 * button.onPress.connect(() => console.log('onPress'));
 *
 * container.addChild(button);
 */
export class ButtonContainer extends Container
{
    button: Button;

    onDown: Signal<(btn?: Button, e?: FederatedPointerEvent) => void>;
    onUp: Signal<(btn?: Button, e?: FederatedPointerEvent) => void>;
    onUpOut: Signal<(btn?: Button, e?: FederatedPointerEvent) => void>;
    onOut: Signal<(btn?: Button, e?: FederatedPointerEvent) => void>;
    onPress: Signal<(btn?: Button, e?: FederatedPointerEvent) => void>;
    onHover: Signal<(btn?: Button, e?: FederatedPointerEvent) => void>;

    constructor(view?: Container)
    {
        super();

        this.button = new Button(this);

        this.button.enabled = true;

        if (view)
        {
            this.addChild(view);
        }

        this.onPress = this.button.onPress;
        this.onDown = this.button.onDown;
        this.onUp = this.button.onUp;
        this.onHover = this.button.onHover;
        this.onOut = this.button.onOut;
        this.onUpOut = this.button.onUpOut;
    }

    set enabled(enabled: boolean)
    {
        this.button.enabled = enabled;
    }

    get enabled(): boolean
    {
        return this.button.enabled;
    }
}

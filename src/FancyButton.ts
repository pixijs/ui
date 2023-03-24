import { ObservablePoint, Ticker, Rectangle } from '@pixi/core';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { getView } from './utils/helpers/view';
import { AnyText, getTextView, PixiText } from './utils/helpers/text';
import { Button } from './Button';
import { Signal } from 'typed-signals';
import { FederatedPointerEvent } from '@pixi/events';
import { fitToView } from './utils/helpers/fit';
import { Tween, Group } from 'tweedle.js';

const states = ['default', 'hover', 'pressed', 'disabled'] as const;

type State = typeof states[number];
type Pos = { x?: number; y?: number };
type PosList = { [K in State]?: Pos };

export type Offset = Pos & PosList;

type Views = {
    defaultView?: string | Container;
    hoverView?: string | Container;
    pressedView?: string | Container;
    disabledView?: string | Container;
    text?: AnyText;
    icon?: string | Container;
};

type ButtonViews = {
    default?: Container;
    hover?: Container;
    pressed?: Container;
    disabled?: Container;
    text?: PixiText;
    icon?: Container;
};

type AnimationData = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    scale?: Pos;
};
type Animation = {
    props: AnimationData;
    duration?: number;
};
type StateAnimations = {
    [K in State]?: Animation;
};

export type ButtonOptions = Views & {
    padding?: number;
    scale?: number;
    anchor?: number;
    anchorX?: number;
    anchorY?: number;
    offset?: Offset;
    textOffset?: Offset;
    iconOffset?: Offset;
    animations?: StateAnimations;
};

/**
 * Button component with a lots of tweaks, to create a button fast.
 *
 *  By default text view and icon view are centered in the active view.
 *
 * If views are not the same size, offset property of the constructor
 * can be used to adjust the position of the text, icon and the views.
 * @example
 * const button = new FancyButton({
 *     defaultView: `button.png`,
 *     hoverView: `button_hover.png`,
 *     pressedView: `button_pressed.png`,
 *     text: new Text('Click me!'),
 *     offset: {
 *          default: {
 *              x: 0.9,
 *              y: 0.9,
 *          },
 *          hover: {
 *              x: 0.9,
 *              y: 0.9,
 *          },
 *          pressed: {
 *              x: 0.9,
 *              y: 0.9,
 *          }
 *     },
 *     textOffset: {
 *          x: 0.9,
 *          y: 0.9,
 *     },
 *     iconOffset: {
 *          x: 0.9,
 *          y: 0.9,
 *     },
 *     animations: {
 *          default: {
 *              props: {
 *                  scale: {
 *                      x: 1,
 *                      y: 1,
 *                  }
 *              },
 *              duration: 100,
 *          },
 *          hover: {
 *              props: {
 *                  scale: {
 *                      x: 1.1,
 *                      y: 1.1,
 *                  }
 *              },
 *              duration: 100,
 *          },
 *          pressed: {
 *              props: {
 *                  scale: {
 *                      x: 0.9,
 *                      y: 0.9,
 *                  }
 *              },
 *              duration: 100,
 *          }
 *      }
 * });
 *
 * button.onPress.connect(() => console.log('Button pressed!'));
 */
export class FancyButton extends Container
{
    private events: Button;
    private animations: StateAnimations;
    private originalInnerViewState: AnimationData;
    private defaultDuration = 100;

    /** Padding of the button text view. If button text does not fit active view + padding it will scale down to fit. */
    public padding: number;

    /** Offset of the button state views. If state views have different sizes, this option can help adjust them. */
    public offset: Offset & Pos;

    /** Offset of the text view. Can be set to any state of the button. */
    public textOffset: Offset;

    /** Offset of the icon view. Can be set to any state of the button. */
    public iconOffset: Offset;

    //* View that holds all button inner views */
    public innerView: Container;

    private _views: ButtonViews = {};

    /** State of the button. Possible valuers are: 'default', 'hover', 'pressed', 'disabled' */
    public state: State;

    /** Anchor point of the button. */
    public anchor: ObservablePoint;

    /** Event that is fired when the button is down. */
    public onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /**
     * Event that fired when a down event happened inside the button
     * and up event happened inside or outside of the button
     */
    public onUp: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /**
     * Event that fired when mouse up event happens outside of the button
     * after the down event happened inside the button boundaries.
     */
    public onUpOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that fired when the mouse is out of the view */
    public onOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that is fired when the button is pressed. */
    public onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that is fired when the mouse hovers the button. Fired only if device is not mobile.*/
    public onHover: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /**
     * Turns a given container-based view into a button by adding all button events.
     * @param {object} options - Button options.
     * @param {Container} options.defaultView - Container-based view that is shown when non of the button events are active.
     * @param {Container} options.hoverView - Container-based view that is shown when the mouse hovers over the button.
     * @param {Container} options.pressedView - Container-based view, shown when the mouse press on the component.
     * @param {Container} options.disabledView - Container-based view shown when the button is disabled.
     * @param {Container} options.icon - Container-based view for the button icon.
     * @param {Text} options.text - Text-based view for the button text.
     * @param {number} options.padding - Padding of the button text and icon views.
     * If button text or icon does not fit active view + padding it will scale down to fit.
     * @param {Point} options.offset - Offset of the button state views.
     * @param {Point} options.textOffset - Offset of the text view.
     * @param {Point} options.iconOffset - Offset of the icon view.
     * @param {number} options.scale - Scale of the button. Scale will be applied to a main container,
     * when all animations scales will be applied to the inner view.
     * @param {number} options.anchor - Anchor point of the button.
     * @param {number} options.anchorX - Horizontal anchor point of the button.
     * @param {number} options.anchorY - Vertical anchor point of the button.
     * @param options.animations - Animations that will be played when the button state changes.
     */
    constructor({
        defaultView,
        hoverView,
        pressedView,
        disabledView,
        text,
        padding,
        offset,
        textOffset,
        iconOffset,
        scale,
        anchor,
        anchorX,
        anchorY,
        icon,
        animations
    }: ButtonOptions)
    {
        super();

        this.innerView = new Container();
        this.addChild(this.innerView);

        this.anchor = new ObservablePoint(this.updateAnchor, this);
        this.anchor.set(anchorX ?? anchor ?? 0, anchorY ?? anchor ?? 0);

        this.padding = padding ?? 0;
        this.offset = offset;
        this.textOffset = textOffset;
        this.iconOffset = iconOffset;
        this.scale.set(scale ?? 1);

        if (animations)
        {
            this.animations = animations;
            Ticker.shared.add(() => Group.shared.update());
        }

        this.views = {
            defaultView,
            hoverView,
            pressedView,
            disabledView,
            text,
            icon
        };

        this.setState('default');

        this.addEvents();
    }

    /**
     * Updates the text of the button and updates its scaling basing on the new size.
     * @param {string | number} text
     */
    set text(text: string | number | null)
    {
        if (!text || text === 0)
        {
            this.innerView.removeChild(this._views.text);
            this._views.text = null;

            return;
        }

        if (!this._views.text)
        {
            this.createTextView(text);

            return;
        }

        this._views.text.text = text.toString();
    }

    /** Returns the text string of the button text element. */
    get text(): string | undefined
    {
        return this._views.text?.text;
    }

    /**
     * Setter, that prevents all button events from firing.
     * @param {boolean} enabled
     */
    set enabled(enabled: boolean)
    {
        this.events.enabled = enabled;

        this.setState(enabled ? 'default' : 'disabled');
    }

    /** Getter that returns button state, that controls if button events are firing. */
    get enabled(): boolean
    {
        return this.events.enabled;
    }

    /**
     * Updates button state and shows the according views.
     *
     * Updates positions and offsets of the views.
     *
     * Plays animations if they are set.
     * @param {State} newState
     */
    setState(newState: State)
    {
        if (this.state === newState)
        {
            return;
        }

        const currentView = this.getStateView(this.state);
        const activeView = this.getStateView(newState);

        if (currentView) currentView.visible = false;

        this.state = newState;

        if (activeView)
        {
            this.setOffset(activeView, newState, this.offset);
            activeView.visible = true;
        }

        this.updateAnchor();

        this.playAnimations(newState);
    }

    /**
     *
     * Manage button text view.
     * @param {string | Text} text - can be a string, Text, BitmapText ot HTMLText (Container-based element).
     */
    private createTextView(text: AnyText)
    {
        this._views.text = getTextView(text);
        this._views.text.anchor.set(0);

        if (!this._views.text.parent)
        {
            this.innerView.addChild(this._views.text);
        }

        this.adjustTextView(this.state);
    }

    /**
     * Manages views offsets if it's set.
     * @param view
     * @param state
     * @param offset
     */
    private setOffset(view: Container, state: State, offset: Offset)
    {
        const stateOffset = offset
            ? offset[state]
            : {
                x: 0,
                y: 0
            };

        const defaultStateOffset = offset?.default;

        if (stateOffset)
        {
            view.x += stateOffset.x ?? 0;
            view.y += stateOffset.y ?? 0;
        }
        else if (defaultStateOffset)
        {
            view.x += defaultStateOffset.x ?? 0;
            view.y += defaultStateOffset.y ?? 0;
        }
        else if (offset.x || offset.y)
        {
            view.x += offset.x ?? 0;
            view.y += offset.y ?? 0;
        }
    }

    /**
     * Returns active view for the state.
     * @param state
     */
    private getStateView(state: State): Container | undefined
    {
        const { default: defaultView, hover, pressed, disabled } = this._views;

        switch (state)
        {
            case 'hover':
                return hover ?? defaultView;
            case 'pressed':
                return pressed ?? hover ?? defaultView;
            case 'disabled':
                return disabled ?? defaultView;
            case 'default':
                return defaultView;
            default:
                return undefined;
        }
    }

    /**
     * Adjusts text view position and scale.
     * @param {State} state
     */
    private adjustTextView(state: State)
    {
        if (!this.text) return;

        const activeView = this.getStateView(this.state);

        if (activeView)
        {
            fitToView(activeView, this._views.text, this.padding);

            this._views.text.x = activeView.x + (activeView.width / 2);
            this._views.text.y = activeView.y + (activeView.height / 2);
        }

        this._views.text.anchor.set(0.5);

        this.setOffset(this._views.text, state, this.textOffset);
    }

    /**
     * Adjusts icon view position and scale.
     * @param {State} state
     */
    private adjustIconView(state: State)
    {
        if (!this._views.icon)
        {
            return;
        }

        const activeView = this.getStateView(state);

        fitToView(activeView, this._views.icon, this.padding);

        (this._views.icon as Sprite).anchor?.set(0);

        this._views.icon.x = activeView.x + (activeView.width / 2) - (this._views.icon.width / 2);
        this._views.icon.y = activeView.y + (activeView.height / 2) - (this._views.icon.height / 2);

        this.setOffset(this._views.icon, state, this.iconOffset);
    }

    /**
     * Reset views positions according to the button anchor setting.
     * We have to set the anchor position for each view individually, as each of them
     * can be a different type of view (container without anchor, sprite with anchor, etc)
     * we have to reset all anchors to 0,0 and then set the positions manually.
     */
    private updateAnchor()
    {
        const anchorX = this.anchor.x ?? 0;
        const anchorY = this.anchor.y ?? 0;
        const views = [this._views.default, this._views.hover, this._views.pressed, this._views.disabled];

        views.forEach((view) =>
        {
            if (!view) return;

            (view as Sprite).anchor?.set(0);

            view.x = -view.width * anchorX;
            view.y = -view.height * anchorY;
        });

        if (this._views.default)
        {
            const { x, y, width, height } = this._views.default;

            this.hitArea = new Rectangle(x, y, width, height);
        }

        this.adjustIconView(this.state);
        this.adjustTextView(this.state);
    }

    /**
     * Set button views according to the config.
     * @param {Views} views
     */
    // eslint-disable-next-line accessor-pairs
    set views(views: Views)
    {
        const { defaultView, hoverView, pressedView, disabledView, text, icon } = views;

        if (defaultView)
        {
            this._views.default = getView(defaultView);
            this.setOffset(this._views.default, 'default', this.offset);
            if (!this._views.default.parent)
            {
                this.innerView.addChild(this._views.default);
            }
        }
        else if (defaultView === null && this._views.default)
        {
            this.innerView.removeChild(this._views.default);
            this._views.default = null;
        }

        if (hoverView)
        {
            this._views.hover = getView(hoverView);

            if (!this._views.hover.parent)
            {
                this.innerView.addChild(this._views.hover);
            }

            this._views.hover.visible = false;
        }
        else if (hoverView === null && this._views.hover)
        {
            this.innerView.removeChild(this._views.hover);
            this._views.hover = null;
        }

        if (pressedView)
        {
            this._views.pressed = getView(pressedView);

            if (!this._views.pressed.parent)
            {
                this.innerView.addChild(this._views.pressed);
            }

            this._views.pressed.visible = false;
        }
        else if (pressedView === null && this._views.pressed)
        {
            this.innerView.removeChild(this._views.pressed);
            this._views.pressed = null;
        }

        if (disabledView)
        {
            this._views.disabled = getView(disabledView);

            if (!this._views.disabled.parent)
            {
                this.innerView.addChild(this._views.disabled);
            }

            this._views.disabled.visible = false;
        }
        else if (disabledView === null && this._views.disabled)
        {
            this.innerView.removeChild(this._views.disabled);
            this._views.disabled = null;
        }

        if (icon)
        {
            this._views.icon = getView(icon);

            if (!this._views.icon.parent)
            {
                this.innerView.addChild(this._views.icon);
            }
        }
        else if (icon === null && this._views.icon)
        {
            this.innerView.removeChild(this._views.icon);
            this._views.icon = null;
        }

        if (text)
        {
            this.createTextView(text);
        }
        else if (text === null && this._views.text)
        {
            this.innerView.removeChild(this._views.text);
            this._views.text = null;
        }
    }

    /** Creates all button events */
    private addEvents()
    {
        this.events = new Button(this);

        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onUpOut = new Signal();
        this.onOut = new Signal();
        this.onPress = new Signal();
        this.onHover = new Signal();

        this.events.onDown.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onDown.emit(this, e);
            this.down();
            this.setState('pressed');
        });

        this.events.onUp.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onUp.emit(this, e);
            this.up();
            this.setState('hover');
        });

        this.events.onUpOut.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onUpOut.emit(this, e);
            this.upOut();
            this.setState('default');
        });

        this.events.onOut.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onOut.emit(this, e);
            this.out();

            if (!this.events.isDown)
            {
                this.setState('default');
            }
        });

        this.events.onPress.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onPress.emit(this, e);
            this.press();
            this.setState('hover');
        });

        this.events.onHover.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onHover.emit(this, e);
            this.hover();

            if (!this.events.isDown)
            {
                this.setState('hover');
            }
        });
    }

    /**
     * Starts animation for the current button state if configured.
     * @param {State} state
     */
    private playAnimations(state: State)
    {
        if (!this.animations) return;

        if (state === 'default' && !this.originalInnerViewState)
        {
            this.originalInnerViewState = {
                x: this.innerView.x,
                y: this.innerView.y,
                width: this.innerView.width,
                height: this.innerView.height,
                scale: {
                    x: this.innerView.scale.x,
                    y: this.innerView.scale.y
                }
            };

            // first animation state is default, so we don't need to animate it
            // this part will run only once, during initialization
            const defaultStateAnimation = this.animations?.default;

            if (defaultStateAnimation)
            {
                this.innerView.x = defaultStateAnimation.props.x ?? this.originalInnerViewState.x;
                this.innerView.y = defaultStateAnimation.props.y ?? this.originalInnerViewState.y;
                this.innerView.width = defaultStateAnimation.props.width ?? this.originalInnerViewState.width;
                this.innerView.height = defaultStateAnimation.props.height ?? this.originalInnerViewState.height;
                this.innerView.scale.x = defaultStateAnimation.props.scale.x ?? this.originalInnerViewState.scale.x;
                this.innerView.scale.y = defaultStateAnimation.props.scale.y ?? this.originalInnerViewState.scale.y;

                return;
            }
        }

        const stateAnimation = this.animations[state] ?? this.animations.default;

        if (stateAnimation)
        {
            const data = stateAnimation;

            this.defaultDuration = data.duration;

            new Tween(this.innerView).to(data.props, data.duration).start();

            return;
        }

        // if there is no animation for the current state, animate the button to the default state
        new Tween(this.innerView).to(this.originalInnerViewState, this.defaultDuration).start();
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
     * Method called when the up event happens outside of the button,
     * after the down event happened inside the button boundaries.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    public upOut(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse leaves the button.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    public out(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse press down the button.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    public press(_e?: FederatedPointerEvent)
    {
    // override me!
    }

    /**
     * Method called when the mouse hovers the button.
     * To be overridden.
     * Fired only if device is not mobile.
     * @param {FederatedPointerEvent} _e - event data
     */
    public hover(_e?: FederatedPointerEvent)
    {
    // override me!
    }
}

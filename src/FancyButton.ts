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
    defaultView: string | Container;
    hoverView?: string | Container;
    pressedView?: string | Container;
    disabledView?: string | Container;
    text?: AnyText;
    icon?: string | Container;
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

    /** View that is shown when non of the button events are active. */
    public defaultView: Container;

    /** View that is shown when the mouse hovers over the button. */
    public hoverView!: Container;

    /** View, shown when the mouse press on the component. */
    public pressedView!: Container;

    /** View shown when the button is disabled. */
    public disabledView!: Container;

    /** View for the button text. */
    public textView!: PixiText;

    /** View for the button icon. */
    public iconView!: Container;

    /** State of the button. Possible valuers are: 'default', 'hover', 'pressed', 'disabled' */
    public state: State;

    /** Anchor point of the button. */
    public anchor: ObservablePoint;

    /** Event fired when the button was pressed. */
    public onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event fired when the button is down. */
    public onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event fired when the down event happens inside the button and up event happened inside or outside of the button */
    public onUp: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event fired when a mouse hovers the button. */
    public onHover: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event fired when a mouse leaves the button. */
    public onOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event fired when the up event happens outside of the button, after the down event happened inside the button. */
    public onUpOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

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

        this.createViews({
            defaultView,
            hoverView,
            pressedView,
            disabledView,
            text,
            icon
        });

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

        this.setState('default');

        this.addEvents();
    }

    /**
     * Updates the text of the button and updates its scaling basing on the new size.
     * @param {string | number} text
     */
    set text(text: string | number)
    {
        this.textView.text = text;
        this.adjustTextView(this.state);
    }

    /** Returns the text string of the button text element. */
    get text(): string
    {
        return this.textView?.text;
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

        currentView.visible = false;
        activeView.visible = true;

        this.state = newState;

        this.updateAnchor();
        this.setOffset(activeView, newState, this.offset);

        this.playAnimations(newState);
    }

    /**
     *
     * Manage button text view.
     * @param {string | Text} text - can be a string, Text, BitmapText ot HTMLText (Container-based element).
     */
    private createTextView(text: AnyText)
    {
        this.textView = getTextView(text);
        this.innerView.addChild(this.textView);
        this.textView.anchor.set(0);
        this.adjustTextView(this.state);
    }

    /**
     * Manage button icon view.
     * @param {string | Text} icon - can be a string or a Text (Container-based element).
     */
    private createIconView(icon: string | Container)
    {
        this.iconView = getView(icon);
        this.innerView.addChild(this.iconView);
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
    private getStateView(state: State): Container
    {
        switch (state)
        {
            case 'hover':
                return this.hoverView ?? this.defaultView;
            case 'pressed':
                return this.pressedView ?? this.defaultView;
            case 'disabled':
                return this.disabledView ?? this.defaultView;
            case 'default':
            default:
                return this.defaultView;
        }
    }

    /**
     * Adjusts text view position and scale.
     * @param {State} state
     */
    private adjustTextView(state: State)
    {
        if (!this.textView) return;

        this.textView.visible = this.textView.text !== '';

        if (!this.textView.visible)
        {
            return;
        }

        const activeView = this.getStateView(this.state);

        fitToView(activeView, this.textView, this.padding);

        this.textView.anchor.set(0.5);

        this.textView.x = activeView.x + (activeView.width / 2);
        this.textView.y = activeView.y + (activeView.height / 2);

        this.setOffset(this.textView, state, this.textOffset);
    }

    /**
     * Adjusts icon view position and scale.
     * @param {State} state
     */
    private adjustIconView(state: State)
    {
        if (!this.iconView)
        {
            return;
        }

        const activeView = this.getStateView(state);

        fitToView(activeView, this.iconView, this.padding);

        (this.iconView as Sprite).anchor?.set(0);

        this.iconView.x = activeView.x + (activeView.width / 2) - (this.iconView.width / 2);
        this.iconView.y = activeView.y + (activeView.height / 2) - (this.iconView.height / 2);

        this.setOffset(this.iconView, state, this.iconOffset);
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
        const views = [this.defaultView, this.hoverView, this.pressedView, this.disabledView];

        views.forEach((view) =>
        {
            if (!view) return;

            (view as Sprite).anchor?.set(0);

            view.x = -view.width * anchorX;
            view.y = -view.height * anchorY;
        });

        const { x, y, width, height } = this.defaultView;

        this.hitArea = new Rectangle(x, y, width, height);

        this.adjustIconView(this.state);
        this.adjustTextView(this.state);
    }

    /**
     * Button views manager. Adds or creates all button views according to the config.
     * @param {Views} views
     */
    private createViews(views: Views)
    {
        const { defaultView, hoverView, pressedView, disabledView, text, icon } = views;

        this.innerView = new Container();
        this.addChild(this.innerView);

        this.defaultView = getView(defaultView);
        this.innerView.addChild(this.defaultView);

        if (hoverView)
        {
            this.hoverView = getView(hoverView);
            this.innerView.addChild(this.hoverView);
            this.hoverView.visible = false;
        }

        if (pressedView)
        {
            this.pressedView = getView(pressedView);
            this.innerView.addChild(this.pressedView);
            this.pressedView.visible = false;
        }

        if (disabledView)
        {
            this.disabledView = getView(disabledView);
            this.innerView.addChild(this.disabledView);
            this.disabledView.visible = false;
        }

        if (icon)
        {
            this.createIconView(icon);
        }

        if (text)
        {
            this.createTextView(text);
        }
    }

    /** Creates all button events */
    private addEvents()
    {
        this.events = new Button(this);

        this.onPress = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onHover = new Signal();
        this.onOut = new Signal();
        this.onUpOut = new Signal();

        this.events.onPress.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onPress.emit(this, e);
            this.press();
            this.setState('hover');
        });

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

        this.events.onHover.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onHover.emit(this, e);
            this.hover();
            this.setState('hover');
        });

        this.events.onOut.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onOut.emit(this, e);
            this.out();
            this.setState('default');
        });

        this.events.onUpOut.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onUpOut.emit(this, e);
            this.upOut();
            this.setState('default');
        });
    }

    /**
     * Starts animation for the current button state if configured.
     * @param {State} state
     */
    private playAnimations(state: State)
    {
        if (!this.animations) return;

        if (state === 'default')
        {
            if (!this.originalInnerViewState)
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
            }

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
            const data = this.animations[state];

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
}

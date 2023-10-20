import { ObservablePoint, Ticker, Rectangle, utils } from '@pixi/core';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { getView } from './utils/helpers/view';
import { AnyText, getTextView, PixiText } from './utils/helpers/text';
import { fitToView } from './utils/helpers/fit';
import { Tween, Group } from 'tweedle.js';
import { ButtonContainer } from './Button';

type State = 'default' | 'hover' | 'pressed' | 'disabled';
type Pos = { x?: number; y?: number };
type PosList = { [K in State]?: Pos };

export type Offset = Pos & PosList;

type ButtonViewType = 'defaultView' | 'hoverView' | 'pressedView' | 'disabledView';

type ButtonView = string | Container;

type BasicButtonViews = {
    [K in ButtonViewType]?: Container;
};

type ButtonViews = BasicButtonViews & {
    textView?: PixiText;
    iconView?: Container;
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

type BasicViewsInput = {
    [K in ButtonViewType]?: ButtonView;
};

type ViewsInput = BasicViewsInput & {
    text?: AnyText;
    icon?: ButtonView;
};

export type ButtonOptions = ViewsInput & {
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
 * Button component with a lot of tweaks.
 *
 * All views, text, icon and animations are optional. You can set them via constructor pr update later.
 *
 * By default text view and icon view are centered in the active view.
 *
 * Offset property of the constructor can be used to adjust the position of the text, icon and the views.
 * @example
 * const button = new FancyButton({
 *     defaultView: `button.png`,
 *     hoverView: `button_hover.png`,
 *     pressedView: `button_pressed.png`,
 *     text: 'Click me!',
 *     animations: {
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
export class FancyButton extends ButtonContainer
{
    protected animations: StateAnimations;
    protected originalInnerViewState: AnimationData;
    protected defaultDuration = 100;

    /** Padding of the button text view. If button text does not fit active view + padding it will scale down to fit. */
    _padding: number;

    /** Offset of the button state views. If state views have different sizes, this option can help adjust them. */
    _offset: Offset & Pos;

    /** Offset of the text view. Can be set to any state of the button. */
    _textOffset: Offset;

    /** Offset of the icon view. Can be set to any state of the button. */
    iconOffset: Offset;

    //* View that holds all button inner views */
    innerView = new Container();

    protected _views: ButtonViews = {};

    /** State of the button. Possible valuers are: 'default', 'hover', 'pressed', 'disabled' */
    state: State;

    /** Anchor point of the button. */
    anchor: ObservablePoint;

    /**
     * Creates a button with a lot of tweaks.
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
    constructor(options?: ButtonOptions)
    {
        super();

        const {
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
        } = options ?? {};

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

        this.defaultView = defaultView;
        this.hoverView = hoverView;
        this.pressedView = pressedView;
        this.disabledView = disabledView;
        this.text = text;
        this.iconView = icon;

        this.setState('default');

        this.initStateControl();
    }

    /**
     * Updates the text of the button and updates its scaling basing on the new size.
     * @param {string | number} text
     */
    set text(text: AnyText)
    {
        if (!text || text === 0)
        {
            this.removeView('textView');

            return;
        }

        if (!this._views.textView)
        {
            this.createTextView(text);

            return;
        }

        this._views.textView.text = text.toString();
    }

    /** Returns the text string of the button text element. */
    get text(): string | undefined
    {
        return this._views.textView?.text;
    }

    /**
     * Setter, that prevents all button events from firing.
     * @param {boolean} enabled
     */
    set enabled(enabled: boolean)
    {
        this.button.enabled = enabled;

        this.setState(enabled ? 'default' : 'disabled');
    }

    get enabled(): boolean
    {
        return this.button.enabled;
    }

    /**
     * Updates button state and shows the according views.
     *
     * Updates positions and offsets of the views.
     *
     * Plays animations if they are set.
     * @param {State} newState
     * @param force
     */
    setState(newState: State, force = false)
    {
        if (!force && this.state === newState)
        {
            return;
        }

        const currentView = this.getStateView(this.state);

        if (currentView) currentView.visible = false;

        this.state = newState;

        const activeView = this.getStateView(newState);

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
    protected createTextView(text: AnyText)
    {
        this._views.textView = getTextView(text);
        this._views.textView.anchor.set(0);
        this.innerView.addChild(this._views.textView);

        this.adjustTextView(this.state);
    }

    /**
     * Manages views offsets if it's set.
     * @param view
     * @param state
     * @param offset
     */
    protected setOffset(view: Container, state: State, offset: Offset)
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
    protected getStateView(state: State): Container | undefined
    {
        if (!this._views) return undefined;

        switch (state)
        {
            case 'hover':
                return this._views.hoverView ?? this._views.defaultView ?? undefined;
            case 'pressed':
                return this._views.pressedView ?? this._views.hoverView ?? this._views.defaultView ?? undefined;
            case 'disabled':
                return this._views.disabledView ?? this._views.defaultView ?? undefined;
            case 'default':
                return this._views.defaultView ?? undefined;
            default:
                return undefined;
        }
    }

    /**
     * Adjusts text view position and scale.
     * @param {State} state
     */
    protected adjustTextView(state: State)
    {
        if (!this.text) return;

        const activeView = this.getStateView(this.state);

        if (activeView)
        {
            fitToView(activeView, this._views.textView, this.padding);

            this._views.textView.x = activeView.x + (activeView.width / 2);
            this._views.textView.y = activeView.y + (activeView.height / 2);
        }

        this._views.textView.anchor.set(0.5);

        this.setOffset(this._views.textView, state, this.textOffset);
    }

    /**
     * Adjusts icon view position and scale.
     * @param {State} state
     */
    protected adjustIconView(state: State)
    {
        if (!this._views.iconView)
        {
            return;
        }

        const activeView = this.getStateView(state);

        if (!activeView)
        {
            return;
        }

        fitToView(activeView, this._views.iconView, this.padding);

        (this._views.iconView as Sprite).anchor?.set(0);

        this._views.iconView.x = activeView.x + (activeView.width / 2) - (this._views.iconView.width / 2);
        this._views.iconView.y = activeView.y + (activeView.height / 2) - (this._views.iconView.height / 2);

        this.setOffset(this._views.iconView, state, this.iconOffset);
    }

    /**
     * Reset views positions according to the button anchor setting.
     * We have to set the anchor position for each view individually, as each of them
     * can be a different type of view (container without anchor, sprite with anchor, etc)
     * we have to reset all anchors to 0,0 and then set the positions manually.
     */
    protected updateAnchor()
    {
        if (!this._views) return;

        const anchorX = this.anchor.x ?? 0;
        const anchorY = this.anchor.y ?? 0;
        const views = [this._views.defaultView, this._views.hoverView, this._views.pressedView, this._views.disabledView];

        views.forEach((view) =>
        {
            if (!view) return;

            (view as Sprite).anchor?.set(0);

            view.x = -view.width * anchorX;
            view.y = -view.height * anchorY;
        });

        if (this._views.defaultView)
        {
            const { x, y, width, height } = this._views.defaultView;

            this.hitArea = new Rectangle(x, y, width, height);
        }

        this.adjustIconView(this.state);
        this.adjustTextView(this.state);
    }

    /**
     * Sets the default view of the button.
     * @param { string | Container } view - string (path to the image) or a Container-based view
     */
    set defaultView(view: ButtonView | null)
    {
        this.updateView('defaultView', view);
    }

    /** Returns the default view of the button. */
    get defaultView(): Container | undefined
    {
        return this._views.defaultView;
    }

    /**
     * Sets the hover view of the button.
     * @param { string | Container } view - string (path to the image) or a Container-based view
     */
    set hoverView(view: ButtonView | null)
    {
        this.updateView('hoverView', view);
        if (this._views.hoverView && this.state !== 'hover')
        {
            this._views.hoverView.visible = false;
        }
    }

    /** Returns the hover view of the button. */
    get hoverView(): Container | undefined
    {
        return this._views.hoverView;
    }

    /** Sets the pressed view of the button. */
    set pressedView(view: ButtonView | null)
    {
        this.updateView('pressedView', view);
        if (this._views.pressedView)
        {
            this._views.pressedView.visible = false;
        }
    }

    /** Returns the pressed view of the button. */
    get pressedView(): Container | undefined
    {
        return this._views.pressedView;
    }

    /** Sets the disabled view of the button. */
    set disabledView(view: ButtonView | null)
    {
        this.updateView('disabledView', view);
        if (this._views.disabledView)
        {
            this._views.disabledView.visible = false;
        }
    }

    /** Returns the disabled view of the button. */
    get disabledView(): Container | undefined
    {
        return this._views.disabledView;
    }

    /**
     * Helper method to update or cleanup button views.
     * @param { 'defaultView' | 'hoverView' | 'pressedView' | 'disabledView' } viewType - type of the view to update
     * @param { string | Container | null } view - new view
     */
    protected updateView(viewType: ButtonViewType, view: ButtonView | null)
    {
        if (view === undefined) return;

        this.removeView(viewType);

        if (view === null)
        {
            return;
        }

        this._views[viewType] = getView(view);

        this.setOffset(this._views[viewType], this.state, this.offset);

        if (!this._views[viewType].parent)
        {
            this.innerView.addChild(this._views[viewType]);
        }

        this.updateAnchor();

        if (this._views.iconView)
        {
            // place icon on top of the view
            this.innerView.addChild(this._views.iconView);
        }

        if (this._views.textView)
        {
            // place text on top of the view
            this.innerView.addChild(this._views.textView);
        }

        this.setState(this.state, true);
    }

    /**
     * Removes button view by type
     * @param {'defaultView' | 'hoverView' | 'pressedView' | 'disabledView'} viewType - type of the view to remove
     */
    removeView(viewType: ButtonViewType | 'textView' | 'iconView')
    {
        if (this._views[viewType])
        {
            this.innerView.removeChild(this._views[viewType]);
            this._views[viewType] = null;
        }
    }

    /**
     * Sets the textView of the button.
     * @param { string | number | PixiText | Text | BitmapText | HTMLText } textView - string, text or pixi text instance.
     */
    set textView(textView: AnyText | null)
    {
        if (textView === undefined) return;

        this.removeView('textView');

        if (textView === null)
        {
            return;
        }

        this.createTextView(textView);
    }

    /**
     * Returns the text view of the button.
     * @returns pixi text instance or undefined.
     */
    get textView(): PixiText | undefined
    {
        return this._views.textView;
    }

    /**
     * Sets the iconView of the button.
     * @param { string | Container } view - string (path to the image) or a Container-based view
     */
    set iconView(view: ButtonView | null)
    {
        if (view === undefined) return;
        console.log({
            view
        });

        this.removeView('iconView');

        if (view === null)
        {
            return;
        }

        this._views.iconView = getView(view);

        if (!this._views.iconView.parent)
        {
            this.innerView.addChild(this._views.iconView);
        }

        this.setState(this.state, true);
    }

    /** Returns the icon view of the button. */
    get iconView(): Container | undefined
    {
        return this._views.iconView;
    }

    /**
     * Starts animation for the current button state if configured.
     * @param {State} state
     */
    protected playAnimations(state: State)
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

    protected initStateControl()
    {
        this.onDown.connect(() =>
        {
            this.setState('pressed');
        });

        this.onUp.connect(() =>
        {
            utils.isMobile.any
                ? this.setState('default')
                : this.setState('hover');
        });

        this.onUpOut.connect(() =>
        {
            this.setState('default');
        });

        this.onOut.connect(() =>
        {
            if (!this.button.isDown)
            {
                this.setState('default');
            }
        });

        this.onPress.connect(() =>
        {
            utils.isMobile.any
                ? this.setState('default')
                : this.setState('hover');
        });

        this.onHover.connect(() =>
        {
            if (!this.button.isDown)
            {
                utils.isMobile.any
                    ? this.setState('default')
                    : this.setState('hover');
            }
        });
    }

    /**
     * Sets the button padding.
     * @param {number} padding - padding of the button text and icon views.
     */
    set padding(padding: number)
    {
        this._padding = padding;

        this.adjustTextView(this.state);
        this.adjustIconView(this.state);
    }

    /** Returns the button padding. */
    get padding(): number
    {
        return this._padding;
    }

    /**
     * Sets the button offset.
     * @param { { x?: number; y?: number } } offset - offset of the button.
     * Can be set for each state of the button.
     */
    set offset(offset: Offset)
    {
        this._offset = offset;

        this.updateAnchor();
    }

    /** Returns the button offset. */
    get offset(): Offset
    {
        return this._offset;
    }

    /**
     * Sets the button text offset.
     * @param { { x?: number; y?: number } } textOffset - offsets of the button text view.
     * can be set for each state of the button.
     */
    set textOffset(textOffset: Offset)
    {
        this._textOffset = textOffset;

        this.adjustTextView(this.state);
    }

    /** Returns the button text offset. */
    get textOffset(): Offset
    {
        return this._textOffset;
    }
}

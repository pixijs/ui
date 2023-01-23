import { ObservablePoint } from '@pixi/core';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { Sprite } from '@pixi/sprite';
import { getView } from './utils/helpers/view';
import { getTextView } from './utils/helpers/text';
import { ButtonEvents } from './ButtonEvents';
import { Signal } from 'typed-signals';
import { FederatedPointerEvent } from '@pixi/events';

const states = ['default', 'hover', 'pressed', 'disabled'] as const;

type State = typeof states[number];
type Pos = { x?: number; y?: number };
export type Offset = {
    [K in State]?: Pos;
} &
Pos;

export interface ButtonOptions
{
    defaultView: string | Container;
    hoverView?: string | Container;
    pressedView?: string | Container;
    disabledView?: string | Container;
    text?: string | Text;
    padding?: number;
    anchor?: number;
    anchorX?: number;
    anchorY?: number;
    offset?: Offset;
    textOffset?: Offset;
}

/**
 * Button component with lots of settings, that can be used to create a button fast.
 *
 * Text view by default is centered in the active view.
 * If views are not the same size, offset can be used to adjust the position of the text and the view.
 * @example
 * ```
 * const button = new FancyButton({
 *     defaultView: `button.png`,
 *     hoverView: `button_hover.png`,
 *     pressedView: `button_pressed.png`,
 *     disabledView: `button_disabled.png`,
 *     text: new Text(text, { fill: 0xFFFFFF }),
 *     icon: `icon.png`,
 * });
 *
 * ```
 */
export class Button extends Container
{
    private innerView: Container;
    private events: ButtonEvents;
    private padding: number;
    private offset: Offset & Pos;
    private textOffset: Offset;

    /** View that is shown when non of button events is active. */
    public defaultView: Container;

    /** View that is shown when mouse hovers the component. */
    public hoverView!: Container;

    /** View that is shown when mouse is pressed on the component. */
    public pressedView!: Container;

    /** View that is shown when button is disabled. */
    public disabledView!: Container;

    /** View for the button text. */
    public textView!: Text;

    /** State of the button */
    public state: State = 'default';

    /** Anchor point of the button. */
    public anchor: ObservablePoint;

    /** Event that is fired when button is pressed. */
    public onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /** Event that is fired when button is down. */
    public onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    /**
     * Event that is fired when down event happened inside the button
     * and up event happened inside or outside of the button
     */
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

    constructor({
        defaultView,
        hoverView,
        pressedView,
        disabledView,
        text,
        padding,
        offset,
        textOffset,
        anchor,
        anchorX,
        anchorY
    }: ButtonOptions)
    {
        super();

        this.createViews({
            defaultView,
            hoverView,
            pressedView,
            disabledView,
            text
        });

        this.anchor = new ObservablePoint(this.resetPositions, this, anchorX ?? anchor ?? 0, anchorY ?? anchor ?? 0);
        this.resetPositions();

        this.setState('default');

        this.padding = (padding ?? 0) * 2;
        this.offset = offset;
        this.textOffset = textOffset;

        this.addEvents();
    }

    /**
     * Updates text of the text element of the button and updates text scaling basing one it's new size.
     * @param {string | number} text - text to be set.
     */
    set text(text: string | number)
    {
        if (!this.textView)
        {
            this.createTextView(typeof text === 'number' ? text.toString() : text);
        }

        this.textView.text = text;
        this.setState(this.state);
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

    private createTextView(text: string | Text)
    {
        this.textView = getTextView(text);
        this.textView.anchor.set(0);
    }

    private setOffset(view: Container, state: State, offset: Offset)
    {
        if (!view || offset === undefined)
        {
            return;
        }

        const stateOffset = offset[state];
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

    private hideAllViews()
    {
        if (this.defaultView)
        {
            this.defaultView.visible = false;
        }

        if (this.hoverView)
        {
            this.hoverView.visible = false;
        }

        if (this.pressedView)
        {
            this.pressedView.visible = false;
        }

        if (this.disabledView)
        {
            this.disabledView.visible = false;
        }
    }

    private getActiveView(state: State): Container
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

    private setState(newState: State)
    {
        this.state = newState;

        this.hideAllViews();

        const activeView = this.getActiveView(newState);

        this.adjustTextView(newState);

        activeView.visible = true;

        this.resetPositions();
        this.setOffset(activeView, newState, this.offset);
    }

    private adjustTextView(state: State)
    {
        if (!this.textView)
        {
            return;
        }

        const activeView = this.getActiveView(this.state);
        const maxWidth = activeView.width - this.padding;

        if (Math.round(this.textView.width) > maxWidth)
        {
            const scale = maxWidth / this.textView.width;

            this.textView.scale.set(scale);
        }

        activeView.addChild(this.textView);

        this.textView.x = (activeView.width - this.textView.width) / 2;
        this.textView.y = (activeView.height - this.textView.height) / 2;

        this.setOffset(this.textView, state, this.textOffset);
    }

    private resetPositions()
    {
        const x = this.anchor.x;
        const y = this.anchor.y;

        // we have to set the anchor and position for each view individually as each of them can be different type view
        // (container without anchor, sprite with anchor etc)
        // we have to reset all anchors to 0,0 and then set the position manually
        if (this.defaultView)
        {
            (this.defaultView as Sprite).anchor?.set(0);

            this.defaultView.x = -this.defaultView.width * x;
            this.defaultView.y = -this.defaultView.height * y;
        }

        if (this.hoverView)
        {
            (this.hoverView as Sprite).anchor?.set(0);

            this.hoverView.x = -this.hoverView.width * x;
            this.hoverView.y = -this.hoverView.height * y;
        }

        if (this.pressedView)
        {
            (this.pressedView as Sprite).anchor?.set(0);

            this.pressedView.x = -this.pressedView.width * x;
            this.pressedView.y = -this.pressedView.height * y;
        }

        if (this.disabledView)
        {
            (this.disabledView as Sprite).anchor?.set(0);

            this.disabledView.x = -this.disabledView.width * x;
            this.disabledView.y = -this.disabledView.height * y;
        }
    }

    private createViews({ defaultView, hoverView, pressedView, disabledView, text }: Partial<ButtonOptions>)
    {
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

        if (text)
        {
            this.createTextView(text);
        }
    }

    private addEvents()
    {
        this.events = new ButtonEvents(this);

        this.onPress = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onHover = new Signal();
        this.onOut = new Signal();
        this.onUpOut = new Signal();

        this.events.onPress.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onPress.emit(this, e);
            this.setState('hover');
        });

        this.events.onDown.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onDown.emit(this, e);
            this.setState('pressed');
        });

        this.events.onUp.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onUp.emit(this, e);
            this.setState('hover');
        });

        this.events.onHover.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onHover.emit(this, e);
            this.setState('hover');
        });

        this.events.onOut.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onOut.emit(this, e);
            this.setState('default');
        });

        this.events.onUpOut.connect((_bth, e?: FederatedPointerEvent) =>
        {
            this.onUpOut.emit(this, e);
            this.setState('default');
        });
    }
}

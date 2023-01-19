import { ObservablePoint, utils } from '@pixi/core';
import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Sprite } from '@pixi/sprite';
import { getView } from './utils/helpers/view';
import { getTextView } from './utils/helpers/text';

const states = ['default', 'hover', 'pressed', 'disabled'] as const;

type State = typeof states[number];
type Pos = { x?: number; y?: number };
export type Offset = {
    [K in State]?: Pos
} & Pos;

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
 * Container based component that gives us a starting point for UI buttons.
 * Text view by default is centered in the active view.
 * If views are not the same size, offset can be used to adjust the position of the text and the view.
 * @example
 * ```
 * const button = new Button({
 *     defaultView: `button.png`,
 *     hoverView: `button_hover.png`,
 *     pressedView: `button_pressed.png`,
 *     disabledView: `button_disabled.png`,
 *     text: new Text(text, { fill: 0xFFFFFF }),
 * });
 *
 * ```
 */
export class Button extends Container
{
    /** TODO */
    public defaultView: Container;
    /** TODO */
    public hoverView!: Container;
    /** TODO */
    public pressedView!: Container;
    /** TODO */
    public disabledView!: Container;
    /** TODO */
    public textView: Text;

    /** TODO */
    public onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** TODO */
    public onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** TODO */
    public onUp: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** TODO */
    public onHover: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** TODO */
    public onOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** TODO */
    public onUpOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;

    private _isDown: boolean;
    private _enabled: boolean;
    private _shown: boolean;

    private padding: number;
    public offset: Offset & Pos;
    public textOffset: Offset;

    public state: State = 'default';

    public anchor: ObservablePoint;

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
        anchorY,
    }: ButtonOptions)
    {
        super();

        this.padding = (padding ?? 0) * 2;
        this.offset = offset;
        this.textOffset = textOffset;

        this.defaultView = getView(defaultView);
        this.addChild(this.defaultView);

        if (hoverView)
        {
            this.hoverView = getView(hoverView);
            this.addChild(this.hoverView);
            this.hoverView.visible = false;
        }

        if (pressedView)
        {
            this.pressedView = getView(pressedView);
            this.addChild(this.pressedView);
            this.pressedView.visible = false;
        }

        if (disabledView)
        {
            this.disabledView = getView(disabledView);
            this.addChild(this.disabledView);
            this.disabledView.visible = false;
        }

        this.textView = getTextView(text);
        this.textView.anchor.set(0);

        this.anchor = new ObservablePoint(
            this.setAnchor,
            this,
            anchorX ?? anchor ?? 0,
            anchorY ?? anchor ?? 0,
        );
        this.setAnchor();

        this.setState('default');

        this._enabled = true;
        this._isDown = false;
        this.enabled = true;

        this.onPress = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onHover = new Signal();
        this.onOut = new Signal();
        this.onUpOut = new Signal();

        this.on('pointerdown', (e: FederatedPointerEvent) =>
        {
            this._isDown = true;
            this.onDown.emit(this, e);
        });

        this.on('pointerup', (e: FederatedPointerEvent) =>
        {
            this.setState('default');
            this._processUp(e);
        });

        this.on('pointerupoutside', (e: FederatedPointerEvent) =>
        {
            this.setState('default');
            this._processUpOut(e);
        });

        this.on('pointerout', (e: FederatedPointerEvent) =>
        {
            this.setState('default');
            this._processOut(e);
        });

        this.on('pointertap', (e: FederatedPointerEvent) =>
        {
            this._isDown = false;
            this.onPress.emit(this, e);
        });

        this.on('pointerover', (e: FederatedPointerEvent) =>
        {
            this.onHover.emit(this, e);
        });

        this.onDown.connect((_btn, e) =>
        {
            this.down(e);
            this.setState('pressed');
        });

        this.onUp.connect((_btn, e) =>
        {
            this.up(e);
            this.setState('hover');
        });

        this.onUpOut.connect((_bth, e) =>
        {
            this._upOut(e);
            this.setState('default');
        });

        if (!utils.isMobile.any)
        {
            this.onHover.connect((_bth, e) =>
            {
                this.setState('hover');
                this.hover(e);
            });
        }

        this.onOut.connect((_bth, e) =>
        {
            this.setState('default');
            this._out(e);
        });
    }

    /**
     * TODO
     * @param _e
     */
    public down(_e?: FederatedPointerEvent): void
    {
        // override me!
    }

    /**
     * TODO
     * @param _e
     */
    public up(_e?: FederatedPointerEvent): void
    {
        // override me!
    }

    /**
     * TODO
     * @param _e
     */
    public hover(_e?: FederatedPointerEvent): void
    {
        // override me!
    }

    /** TODO */
    get isDown(): boolean
    {
        return this._isDown;
    }

    /** TODO */
    set enabled(enabled: boolean)
    {
        this._enabled = enabled;
        this.interactive = enabled;
        this.cursor = enabled ? 'pointer' : 'default';

        this.setState(enabled ? 'default' : 'disabled');

        if (!enabled)
        {
            this._processUp();
        }
    }

    /** TODO */
    get enabled(): boolean
    {
        return this._enabled;
    }

    /** TODO */
    set shown(value: boolean)
    {
        this._shown = value;
        this.enabled = value;
        if (this.defaultView)
        {
            this.defaultView.visible = value;
        }
    }

    /** TODO */
    get shown(): boolean
    {
        return this._shown;
    }

    private _processUp(e?: FederatedPointerEvent): void
    {
        if (this._isDown)
        {
            this.onUp.emit(this, e);
        }
        this._isDown = false;
    }

    private _processUpOut(e?: FederatedPointerEvent): void
    {
        if (this._isDown)
        {
            this.onUp.emit(this, e);
            this.onUpOut.emit(this, e);
        }

        this._isDown = false;
    }

    private _processOut(e?: FederatedPointerEvent): void
    {
        this.onOut.emit(this, e);
    }

    private _upOut(e?: FederatedPointerEvent): void
    {
        this.up(e);
    }

    private _out(e?: FederatedPointerEvent): void
    {
        this.up(e);
    }

    private setOffset(view: Container, state: State, offset: Offset)
    {
        if (!view || offset === undefined) { return; }

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
            case 'default':
                return this.defaultView;
            case 'hover':
                return this.hoverView ?? this.defaultView;
            case 'pressed':
                return this.pressedView ?? this.defaultView;
            case 'disabled':
                return this.disabledView ?? this.defaultView;
            default:
                return this.defaultView;
        }
    }

    private setState(newState: State)
    {
        this.state = newState;

        this.hideAllViews();
        this.adjustTextView(newState);

        const activeView = this.getActiveView(newState);

        activeView.visible = true;

        this.setAnchor();
        this.setOffset(activeView, newState, this.offset);
    }

    private adjustTextView(state: State)
    {
        const activeView = this.getActiveView(this.state);
        const maxWidth = activeView.width - this.padding;

        if (Math.round(this.textView.width) > maxWidth)
        {
            const scale = maxWidth / this.textView.width;

            this.textView.scale.set(scale);
        }

        activeView.addChild(this.textView);

        this.textView.x
            = (activeView.width - this.textView.width) / 2;
        this.textView.y
            = (activeView.height - this.textView.height) / 2;

        this.setOffset(this.textView, state, this.textOffset);
    }

    /** TODO */
    protected setAnchor()
    {
        const x = this.anchor.x;
        const y = this.anchor.y;

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

    /** TODO */
    set text(text: string | number)
    {
        this.textView.text = text;
        this.setState(this.state);
    }

    /** TODO */
    get text(): string
    {
        return this.textView.text;
    }
}

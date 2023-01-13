import { utils } from '@pixi/core';
import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Sprite } from '@pixi/sprite';
import { getView } from './utils/helpers/view';
import { getTextView } from './utils/helpers/text';

type Pos = number | { x?: number; y?: number };

const STATE = ['default', 'hover', 'pressed', 'disabled'];

type State = typeof STATE[number];

type Offsets = {
    [key in State]?: Pos;
} & {
    text?: Pos;
};
export interface ButtonOptions
{
    defaultView: string | Container;
    hoverView?: string | Container;
    pressedView?: string | Container;
    disabledView?: string | Container;
    text?: string | Text;
    padding?: number;
    anchor?: Pos;
    offsets?: Offsets;
}

/**
 * Container based component that gives us a starting point for UI buttons.
 * It composes a view rather than extends one, this means we can easily make any pixi container a button!
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

    private padding = 0;
    private _anchor: Pos = 0.5;
    public offsets: Offsets = {};

    public state: State = 'default';

    constructor({
        defaultView,
        hoverView,
        pressedView,
        disabledView,
        text,
        padding,
        offsets,
        anchor,
    }: ButtonOptions)
    {
        super();

        this.padding = (padding ?? 0) * 2;

        this.offsets = offsets ?? {};

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

        this.anchor = anchor ?? 0.5;
        this.setState('default');

        this._enabled = true;

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

        this._isDown = false;

        this.enabled = true;
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

    private getOffset(val: Pos): {x: number, y: number}
    {
        const offsetX = typeof val === 'number' ? val : (val?.x ?? 0);
        const offsetY = typeof val === 'number' ? val : (val?.y ?? 0);

        return {
            x: offsetX,
            y: offsetY,
        };
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

    private setState(state: State)
    {
        this.hideAllViews();

        const exActiveView = this.getActiveView(this.state);

        exActiveView.x -= this.getOffset(this.offsets[`${this.state}View`]).x;
        exActiveView.y -= this.getOffset(this.offsets[`${this.state}View`]).y;

        this.state = state;

        const activeView = this.getActiveView(this.state);

        activeView.x += this.getOffset(this.offsets[`${state}View`]).x;
        activeView.y += this.getOffset(this.offsets[`${state}View`]).y;

        activeView.visible = true;

        activeView.addChild(this.textView);
        this.textView.x = ((activeView.width - this.textView.width) / 2) + this.getOffset(this.offsets.text).x;
        this.textView.y = ((activeView.height - this.textView.height) / 2) + this.getOffset(this.offsets.text).y;

        if (this.textView.width + this.padding > activeView.width)
        {
            const maxWidth = activeView.width;

            this.textView.scale.set(maxWidth / (this.textView.width + this.padding));
        }
    }

    set anchor(anchor: Pos)
    {
        this._anchor = anchor;
        const anchorX = typeof this._anchor === 'number' ? this._anchor : this._anchor.x;
        const anchorY = typeof this._anchor === 'number' ? this._anchor : this._anchor.y;

        if (this.defaultView)
        {
            (this.defaultView as Sprite).anchor?.set(0);

            this.defaultView.x
                = (this.width / 2)
                - (this.defaultView.width * anchorX);
            this.defaultView.y
                = (this.height / 2)
                - (this.defaultView.height * anchorY);
        }

        if (this.hoverView)
        {
            (this.hoverView as Sprite).anchor?.set(0);

            this.hoverView.x
                = (this.width / 2)
                - (this.hoverView.width * anchorX);
            this.hoverView.y
                = (this.height / 2)
                - (this.hoverView.height * anchorY);
        }

        if (this.pressedView)
        {
            (this.pressedView as Sprite).anchor?.set(0);

            this.pressedView.x
                = (this.width / 2)
                - (this.pressedView.width * anchorX);
            this.pressedView.y
                = (this.height / 2)
                - (this.pressedView.height * anchorY);
        }

        if (this.disabledView)
        {
            (this.disabledView as Sprite).anchor?.set(0);

            this.disabledView.x
                = (this.width / 2)
                - (this.disabledView.width * anchorX);
            this.disabledView.y
                = (this.height / 2)
                - (this.disabledView.height * anchorY);
        }
    }

    get anchor(): Pos
    {
        return this._anchor;
    }

    set text(text: string | number)
    {
        this.textView.text = text;
        this.setState(this.state);
    }

    get text(): string
    {
        return this.textView.text;
    }
}

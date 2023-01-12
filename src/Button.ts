import { utils } from '@pixi/core';
import { Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Sprite } from '@pixi/sprite';

type Pos = number | { x?: number; y?: number };

type State = 'default' | 'hover' | 'pressed' | 'disabled';

type Offsets = {
    defaultView?: Pos;
    hoverView?: Pos;
    pressedView?: Pos;
    disabledView?: Pos;
    text?: Pos;
};
export interface ButtonOptions
{
    view: Container;
    hoverView?: Container;
    pressedView?: Container;
    disabledView?: Container;
    textView?: Text;
    padding?: number;
    anchor?: Pos;
    offsets?: Offsets;
}

/**
 * Container based component that gives us a starting point for UI buttons.
 * It composes a view rather than extends one, this means we can easily make any pixi container a button!
 * @example
 * ```
 * const spriteButton = new Button({
 *     view: new Sprite(Texture.from(`button.png`)),
 *     hoverView: new Sprite(Texture.from(`button_hover.png`)),
 *     pressedView: new Sprite(Texture.from(`button_pressed.png`)),
 *     disabledView: new Sprite(Texture.from(`button_disabled.png`)),
 *     textView: new Text(text, { fill: 0xFFFFFF }),
 * });
 *
 * const graphicsButton = new Button({
 *     view: new PixiGraphics().beginFill(color).drawRoundedRect(0, 0, width, height, radius),
 *     hoverView: new PixiGraphics().beginFill(hoverColor).drawRoundedRect(0, 0, width, height, radius),
 *     pressedView: new PixiGraphics().beginFill(pressedColor).drawRoundedRect(0, 0, width, height, radius),
 *     disabledView: new PixiGraphics().beginFill(disabledColor).drawRoundedRect(0, 0, width, height, radius),
 *     textView: new Text(text, { fill: 0xFFFFFF }),
 *     padding: 10,
 *     textOffset: { x: 10, y: 1 },
 * });
 *
 * ```
 */
export class Button extends Container
{
    /** TODO */
    public defaultView: Container;
    /** TODO */
    public hoverView: Container;
    /** TODO */
    public pressedView: Container;
    /** TODO */
    public disabledView: Container;
    /** TODO */
    public text: Text;

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
    private offsets: Offsets = {};

    public state: State = 'default';

    constructor({
        view,
        hoverView,
        pressedView,
        disabledView,
        textView,
        padding,
        offsets,
        anchor,
    }: ButtonOptions)
    {
        super();

        this.padding = (padding ?? 0) * 2;

        this.offsets = offsets ?? {};

        this.defaultView = view;

        this.defaultView.x = this.getOffset(offsets.defaultView).x;
        this.defaultView.y = this.getOffset(offsets.defaultView).y;

        this.addChild(this.defaultView);

        if (hoverView)
        {
            this.hoverView = hoverView;

            this.hoverView.x = this.getOffset(offsets.hoverView).x;
            this.hoverView.y = this.getOffset(offsets.hoverView).y;

            this.addChild(this.hoverView);
            this.hoverView.visible = false;
        }

        if (pressedView)
        {
            this.pressedView = pressedView;

            this.pressedView.x = this.getOffset(offsets.pressedView).x;
            this.pressedView.y = this.getOffset(offsets.pressedView).y;

            this.addChild(this.pressedView);
            this.pressedView.visible = false;
        }

        if (disabledView)
        {
            this.disabledView = disabledView;

            this.disabledView.x = this.getOffset(offsets.disabledView).x;
            this.disabledView.y = this.getOffset(offsets.disabledView).y;

            this.addChild(this.disabledView);
            this.disabledView.visible = false;
        }

        if (textView)
        {
            this.text = textView;
        }

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
            this._processUp(e);
        });

        this.on('pointerupoutside', (e: FederatedPointerEvent) =>
        {
            this._processUpOut(e);
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

        this.on('pointerout', (e: FederatedPointerEvent) =>
        {
            this._processOut(e);
        });

        this.onDown.connect((_btn, e) =>
        {
            this.down(e);
            if (this.pressedView)
            {
                this.setState('pressed');
            }
        });

        this.onUp.connect((_btn, e) =>
        {
            this.up(e);
            if (this.pressedView)
            {
                this.setState('hover');
            }
        });

        this.onUpOut.connect((_bth, e) =>
        {
            this._upOut(e);
            if (this.pressedView)
            {
                this.setState('default');
            }
        });

        if (!utils.isMobile.any)
        {
            this.onHover.connect((_bth, e) =>
            {
                if (this.hoverView)
                {
                    this.setState('hover');
                }
                this.hover(e);
            });
        }

        this.onOut.connect((_bth, e) =>
        {
            if (this.hoverView)
            {
                this.setState('default');
            }
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
    public getText(): string
    {
        return this.text.text;
    }

    /** TODO */
    get isDown(): boolean
    {
        return this._isDown;
    }

    /** TODO */
    set enabled(value: boolean)
    {
        this._enabled = value;
        this.interactive = value;
        this.cursor = value ? 'pointer' : 'default';

        if (this.disabledView)
        {
            this.disabledView.visible = !value;
        }

        if (!value)
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

        if (this.pressedView)
        {
            this.pressedView.visible = false;
        }
        this._isDown = false;
    }

    private _processOut(e?: FederatedPointerEvent): void
    {
        this.onOut.emit(this, e);
        this._isDown = false;
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

    private setState(state: State)
    {
        this.state = state;

        this.defaultView.visible = false;
        this.hoverView.visible = false;
        this.pressedView.visible = false;
        this.disabledView.visible = false;

        const activeView = this[`${state}View`];

        activeView.addChild(this.text);

        this.text.anchor.set(0);
        this.text.x = ((activeView.width - this.text.width) / 2) + this.getOffset(this.offsets.text).x;
        this.text.y = ((activeView.height - this.text.height) / 2) + this.getOffset(this.offsets.text).y;

        if (this.text.width + this.padding > activeView.width)
        {
            const maxWidth = activeView.width;

            this.text.scale.set(maxWidth / (this.text.width + this.padding));
        }

        switch (state)
        {
            case 'default':
                this.defaultView.visible = true;
                break;
            case 'hover':
                this.hoverView.visible = true;
                break;
            case 'pressed':
                this.pressedView.visible = true;
                break;
            case 'disabled':
                this.disabledView.visible = true;
                break;
        }
    }

    set anchor(anchor: Pos)
    {
        this._anchor = anchor;
        const anchorX = typeof this._anchor === 'number' ? this._anchor : this._anchor.x;
        const anchorY = typeof this._anchor === 'number' ? this._anchor : this._anchor.y;

        (this.defaultView as Sprite).anchor?.set(0);
        (this.hoverView as Sprite).anchor?.set(0);
        (this.pressedView as Sprite).anchor?.set(0);
        (this.disabledView as Sprite).anchor?.set(0);

        this.defaultView.x
            = (this.width / 2)
            - (this.defaultView.width * anchorX)
            + this.getOffset(this.offsets.defaultView).x;
        this.defaultView.y
            = (this.height / 2)
            - (this.defaultView.height * anchorY)
            + this.getOffset(this.offsets.defaultView).y;

        this.hoverView.x
            = (this.width / 2)
            - (this.hoverView.width * anchorX)
            + this.getOffset(this.offsets.hoverView).x;
        this.hoverView.y
            = (this.height / 2)
            - (this.hoverView.height * anchorY)
            + this.getOffset(this.offsets.hoverView).y;

        this.pressedView.x
            = (this.width / 2)
            - (this.pressedView.width * anchorX)
            + this.getOffset(this.offsets.pressedView).x;
        this.pressedView.y
            = (this.height / 2)
            - (this.pressedView.height * anchorY)
            + this.getOffset(this.offsets.pressedView).y;

        this.disabledView.x
            = (this.width / 2)
            - (this.disabledView.width * anchorX)
            + this.getOffset(this.offsets.disabledView).x;
        this.disabledView.y
            = (this.height / 2)
            - (this.disabledView.height * anchorY)
            + this.getOffset(this.offsets.disabledView).y;
    }

    get anchor(): Pos
    {
        return this._anchor;
    }
}

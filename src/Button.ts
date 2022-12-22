import { InteractionEvent, utils } from 'pixi.js';
import { Text } from 'pixi.js';
import { Container } from 'pixi.js';
import { Signal } from 'typed-signals';

export interface ButtonOptions {
    view: Container;
    accessible?: boolean;
    accessibleTitle?: string;
    tabIndex?: number;
    hoverView?: Container;
    pressedView?: Container;
    disabledView?: Container;
    textView?: Text;
    padding?: number;
    textOffset?: { x: number; y: number };
}

/**
 * Container based component that gives us a starting point for UI buttons.
 * It composes a view rather than extends one, this means we can easily make any pixi container a button!
 *
 * @example
 * ```
 * const spriteButton = new Button({
 *     view: new PixiSprite(Texture.from(`button.png`)),
 *     hoverView: new PixiSprite(Texture.from(`button_hover.png`)),
 *     pressedView: new PixiSprite(Texture.from(`button_pressed.png`)),
 *     disabledView: new PixiSprite(Texture.from(`button_disabled.png`)),
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
export class Button extends Container {
    public defaultView: Container;
    public hoverView: Container;
    public pressedView: Container;
    public disabledView: Container;
    public text: Text;

    public onPress: Signal<(btn?: this, e?: InteractionEvent) => void>;
    public onDown: Signal<(btn?: this, e?: InteractionEvent) => void>;
    public onUp: Signal<(btn?: this, e?: InteractionEvent) => void>;
    public onHover: Signal<(btn?: this, e?: InteractionEvent) => void>;
    public onOut: Signal<(btn?: this, e?: InteractionEvent) => void>;
    public onUpOut: Signal<(btn?: this, e?: InteractionEvent) => void>;

    private _isDown: boolean;
    private _enabled: boolean;
    private _shown: boolean;

    private padding = 0;

    constructor({
        view,
        hoverView,
        pressedView,
        disabledView,
        accessible,
        accessibleTitle,
        tabIndex,
        textView,
        padding,
        textOffset,
    }: ButtonOptions) {
        super();

        if (padding) {
            this.padding = padding * 2;
        }

        this.defaultView = view;
        this.defaultView.zIndex = 1;
        this.addChild(this.defaultView);

        if (hoverView) {
            this.hoverView = hoverView;
            this.hoverView.zIndex = 2;
            this.addChild(this.hoverView);
            this.hoverView.visible = false;
        }

        if (pressedView) {
            this.pressedView = pressedView;
            this.pressedView.zIndex = 3;
            this.addChild(this.pressedView);
            this.pressedView.visible = false;
        }

        if (disabledView) {
            this.disabledView = disabledView;
            this.disabledView.zIndex = 4;
            this.addChild(this.disabledView);
            this.disabledView.visible = false;
        }

        if (textView) {
            this.text = textView;
            this.text.zIndex = 4;
            textView.anchor.set(0.5);

            textView.x = this.width / 2 + (textOffset?.x ?? 0);
            textView.y = this.height / 2 + (textOffset?.y ?? 0);

            this.addChild(this.text);

            if (textView.width + this.padding > this.defaultView?.width) {
                const maxWidth = this.defaultView?.width;
                textView.scale.set(maxWidth / (textView.width + this.padding));
            }
        }

        this._enabled = true;

        this.onPress = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onHover = new Signal();
        this.onOut = new Signal();
        this.onUpOut = new Signal();

        this.accessible = accessible ?? true;
        this.accessibleTitle = accessibleTitle ?? '';
        this.tabIndex = tabIndex ?? 0;

        this.on('pointerdown', (e: InteractionEvent) => {
            this._isDown = true;
            this.onDown.emit(this, e);
        });

        this.on('pointerup', (e: InteractionEvent) => {
            this._processUp(e);
        });

        this.on('pointerupoutside', (e: InteractionEvent) => {
            this._processUpOut(e);
        });

        this.on('pointertap', (e: InteractionEvent) => {
            this._isDown = false;
            this.onPress.emit(this, e);
        });

        this.on('pointerover', (e: InteractionEvent) => {
            this.onHover.emit(this, e);
        });

        this.on('pointerout', (e: InteractionEvent) => {
            this._processOut(e);
        });

        this.onDown.connect((_btn, e) => {
            this.down(e);
            if (this.pressedView) {
                this.pressedView.visible = true;
            }
        });

        this.onUp.connect((_btn, e) => {
            this.up(e);
            if (this.pressedView) {
                this.pressedView.visible = false;
            }
        });

        this.onUpOut.connect((_bth, e) => {
            this._upOut(e);
            if (this.pressedView) {
                this.pressedView.visible = false;
            }
        });

        if (!utils.isMobile.any) {
            this.onHover.connect((_bth, e) => {
                if (this.hoverView) {
                    this.hoverView.visible = true;
                }
                this.hover(e);
            });
        }

        this.onOut.connect((_bth, e) => {
            if (this.hoverView) {
                this.hoverView.visible = false;
            }
            this._out(e);
        });

        this._isDown = false;

        this.enabled = true;
    }

    public down(_e?: InteractionEvent): void {
        // override me!
    }

    public up(_e?: InteractionEvent): void {
        // override me!
    }

    public hover(_e?: InteractionEvent): void {
        // override me!
    }

    get isDown(): boolean {
        return this._isDown;
    }

    set enabled(value: boolean) {
        this._enabled = value;
        this.interactive = value;
        this.buttonMode = value;
        this.accessible = this.accessible && value;

        if (this.disabledView) {
            this.disabledView.visible = !value;
        }

        if (!value) {
            this._processUp();
        }
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set shown(value: boolean) {
        this._shown = value;
        this.enabled = value;
        if (this.defaultView) {
            this.defaultView.visible = value;
        }
    }

    get shown(): boolean {
        return this._shown;
    }

    private _processUp(e?: InteractionEvent): void {
        if (this._isDown) {
            this.onUp.emit(this, e);
        }
        this._isDown = false;
    }

    private _processUpOut(e?: InteractionEvent): void {
        if (this._isDown) {
            this.onUpOut.emit(this, e);
        }

        if (this.pressedView) {
            this.pressedView.visible = false;
        }
        this._isDown = false;
    }

    private _processOut(e?: InteractionEvent): void {
        this.onOut.emit(this, e);
        this._isDown = false;
    }

    private _upOut(e?: InteractionEvent): void {
        this.up(e);
    }

    private _out(e?: InteractionEvent): void {
        this.up(e);
    }

    public getText(): string {
        return this.text.text;
    }
}

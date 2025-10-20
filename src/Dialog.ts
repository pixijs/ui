import { Container, Graphics, NineSliceSprite, ObservablePoint, Sprite, TextStyleOptions, Texture, Ticker } from 'pixi.js';
import { Group, Tween } from 'tweedle.js';
import { Signal } from 'typed-signals';
import { FancyButton } from './FancyButton';
import { ScrollBox, ScrollBoxOptions } from './ScrollBox';
import { AnyText, getTextView, PixiText } from './utils/helpers/text';
import { getView, type GetViewSettings } from './utils/helpers/view';

export type DialogButton = {
    text: AnyText;
    button?: FancyButton;
};

type Animation = {
    props: Record<string, any>;
    duration?: number;
};

export type DialogOptions = {
    backdrop?: GetViewSettings;
    backdropColor?: number;
    backdropAlpha?: number;
    background: GetViewSettings;
    title?: AnyText;
    content?: AnyText | Container;
    width?: number;
    height?: number;
    padding?: number;
    radius?: number;
    buttons?: DialogButton[];
    scrollBox?: ScrollBoxOptions;
    animations?: {
        open?: Animation;
        close?: Animation;
    };
    closeOnBackdropClick?: boolean;
    nineSliceSprite?: [number, number, number, number];
    buttonWidth?: number;
    buttonHeight?: number;
    buttonColor?: number;
    buttonHoverColor?: number;
    buttonPressedColor?: number;
    buttonTextStyle?: TextStyleOptions;
};

/**
 * Modal dialog component for asking users questions.
 * @example
 * const dialog = new Dialog({
 *     background: new Graphics().roundRect(0, 0, 400, 200, 20).fill(0xFFFFFF),
 *     title: 'Confirm',
 *     content: 'Are you sure?',
 *     buttons: [
 *         { text: 'Cancel' },
 *         { text: 'OK' }
 *     ]
 * });
 * dialog.onSelect.connect((index, text) => {
 *     console.log(`Button ${index} clicked: ${text}`);
 * });
 * dialog.open();
 */
export class Dialog extends Container
{
    protected backdrop: Container;
    protected innerView?: Container | NineSliceSprite;
    protected contentView: Container;
    protected titleText?: PixiText;
    protected contentBody?: Container;
    protected scrollBox?: ScrollBox;
    protected buttonContainer: Container;
    protected buttons: FancyButton[] = [];

    protected readonly options: DialogOptions;

    protected _isOpen: boolean = false;

    /** Signal emitted when a button is selected. */
    onSelect: Signal<(buttonIndex: number, buttonText: string) => void>;

    constructor(options: DialogOptions)
    {
        super();

        this.options = options;
        this.onSelect = new Signal();

        this.backdrop = new Container();
        this.contentView = new Container();
        this.buttonContainer = new Container();

        this.initBackdrop();
        this.initInnerView();
        this.initTitle();
        this.initContent();
        this.initButtons();

        this.visible = false;

        // Setup ticker for tween animations
        Ticker.shared.add(() => Group.shared.update());
    }

    /** Gets the dialog width from options or innerView. */
    protected get dialogWidth(): number
    {
        return this.options.width ?? this.innerView?.width ?? 0;
    }

    /** Gets the dialog height from options or innerView. */
    protected get dialogHeight(): number
    {
        return this.options.height ?? this.innerView?.height ?? 0;
    }

    /** Gets the dialog padding from options. */
    protected get dialogPadding(): number
    {
        return this.options.padding ?? 20;
    }

    /** Gets the open state of the dialog. */
    get isOpen(): boolean
    {
        return this._isOpen;
    }

    /** Initializes the backdrop (semi-transparent background). */
    protected initBackdrop(): void
    {
        if (this.options.backdrop)
        {
            this.backdrop = getView(this.options.backdrop);
        }
        else
        {
            const backdropSprite = new Sprite(Texture.WHITE);

            backdropSprite.tint = this.options.backdropColor ?? 0x000000;
            backdropSprite.alpha = this.options.backdropAlpha ?? 0.5;
            backdropSprite.width = 10000;
            backdropSprite.height = 10000;
            this.backdrop = backdropSprite;
        }

        this.backdrop.eventMode = 'static';
        this.backdrop.x = -5000;
        this.backdrop.y = -5000;

        if (this.options.closeOnBackdropClick)
        {
            this.backdrop.on('pointertap', () => this.close());
        }

        this.addChild(this.backdrop);
    }

    /** Initializes the inner view (background panel). */
    protected initInnerView(): void
    {
        const { background, nineSliceSprite } = this.options;

        if (nineSliceSprite)
        {
            if (typeof background === 'string')
            {
                this.innerView = new NineSliceSprite({
                    texture: Texture.from(background),
                    leftWidth: nineSliceSprite[0],
                    topHeight: nineSliceSprite[1],
                    rightWidth: nineSliceSprite[2],
                    bottomHeight: nineSliceSprite[3],
                });
            }
            else if (background instanceof Texture)
            {
                this.innerView = new NineSliceSprite({
                    texture: background,
                    leftWidth: nineSliceSprite[0],
                    topHeight: nineSliceSprite[1],
                    rightWidth: nineSliceSprite[2],
                    bottomHeight: nineSliceSprite[3],
                });
            }
            else
            {
                console.warn(
                    'NineSliceSprite can not be used with views set as Container. '
                    + 'Pass the texture or texture name as instead of the Container extended instance.',
                );
                this.innerView = getView(background);
            }
        }
        else
        {
            this.innerView = getView(background);
        }

        if (this.options.width && this.options.height)
        {
            if (this.innerView instanceof NineSliceSprite)
            {
                this.innerView.width = this.options.width;
                this.innerView.height = this.options.height;
            }
            else if (this.innerView instanceof Graphics)
            {
                this.innerView.width = this.options.width;
                this.innerView.height = this.options.height;
            }
        }

        if ('anchor' in this.innerView)
        {
            (this.innerView.anchor as ObservablePoint).set(0.5, 0.5);
        }
        else
        {
            this.innerView.pivot.set(this.dialogWidth / 2, this.dialogHeight / 2);
        }

        this.addChild(this.innerView);
        this.innerView.addChild(this.contentView);
    }

    /** Initializes the title text if provided. */
    protected initTitle(): void
    {
        if (!this.options.title) return;

        this.titleText = getTextView(this.options.title);
        if ('anchor' in this.titleText)
        {
            (this.titleText.anchor as ObservablePoint).set(0.5, 0);
        }

        this.titleText.x = this.dialogWidth / 2;
        this.titleText.y = this.dialogPadding;

        this.contentView.addChild(this.titleText);
    }

    /** Initializes the content area, optionally wrapped in ScrollBox. */
    protected initContent(): void
    {
        if (!this.options.content) return;

        let yOffset = this.dialogPadding;

        if (this.titleText)
        {
            yOffset += this.titleText.height;
        }

        if (this.options.scrollBox)
        {
            this.scrollBox = new ScrollBox(this.options.scrollBox);

            if (typeof this.options.content === 'string' || typeof this.options.content === 'number')
            {
                const textView = getTextView(this.options.content);

                this.scrollBox.addItem(textView);
            }
            else
            {
                this.scrollBox.addItem(this.options.content);
            }

            this.scrollBox.x = this.dialogPadding;
            this.scrollBox.y = yOffset;

            this.contentView.addChild(this.scrollBox);
        }
        else
        {
            if (typeof this.options.content === 'string' || typeof this.options.content === 'number')
            {
                this.contentBody = getTextView(this.options.content);
                if ('anchor' in this.contentBody)
                {
                    (this.contentBody.anchor as ObservablePoint).set(0.5, 0);
                }
                this.contentBody.x = this.dialogWidth / 2;
            }
            else
            {
                this.contentBody = this.options.content;
            }

            this.contentBody.y = yOffset;
            this.contentBody.x = this.dialogPadding;
            this.contentView.addChild(this.contentBody);
        }
    }

    /** Initializes the buttons at the bottom of the dialog. */
    protected initButtons(): void
    {
        if (!this.options.buttons || this.options.buttons.length === 0)
        {
            return;
        }

        const buttonConfigs = this.options.buttons;
        const buttonSpacing = 10;
        const defaultButtonWidth = this.options.buttonWidth ?? 100;
        const defaultButtonHeight = this.options.buttonHeight ?? 40;
        const defaultButtonColor = this.options.buttonColor ?? 0xA5E24D;
        const defaultButtonHoverColor = this.options.buttonHoverColor;
        const defaultButtonPressedColor = this.options.buttonPressedColor;

        buttonConfigs.forEach((btnConfig, index) =>
        {
            let button: FancyButton;

            // Use provided button instance or create a new one
            if (btnConfig.button)
            {
                button = btnConfig.button;
            }
            else
            {
                const buttonOptions: any = {
                    defaultView: new Graphics()
                        .roundRect(0, 0, defaultButtonWidth, defaultButtonHeight, this.options.radius ?? 10)
                        .fill(defaultButtonColor),
                    text: btnConfig.text,
                };

                // Add hover view if color is specified
                if (defaultButtonHoverColor)
                {
                    buttonOptions.hoverView = new Graphics()
                        .roundRect(0, 0, defaultButtonWidth, defaultButtonHeight, this.options.radius ?? 10)
                        .fill(defaultButtonHoverColor);
                }

                // Add pressed view if color is specified
                if (defaultButtonPressedColor)
                {
                    buttonOptions.pressedView = new Graphics()
                        .roundRect(0, 0, defaultButtonWidth, defaultButtonHeight, this.options.radius ?? 10)
                        .fill(defaultButtonPressedColor);
                }

                button = new FancyButton(buttonOptions);
            }

            button.anchor.set(0);

            button.onPress.connect(() =>
            {
                const buttonText = typeof btnConfig.text === 'string'
                    ? btnConfig.text
                    : btnConfig.text.toString();

                this.onSelect.emit(index, buttonText);
                this.close();
            });

            this.buttons.push(button);
            this.buttonContainer.addChild(button);
        });

        let totalButtonWidth = 0;

        this.buttons.forEach((btn, i) =>
        {
            totalButtonWidth += btn.width;
            if (i < this.buttons.length - 1)
            {
                totalButtonWidth += buttonSpacing;
            }
        });

        const buttonStartX = (this.dialogWidth - totalButtonWidth) / 2;
        let currentX = 0;

        this.buttons.forEach((btn) =>
        {
            btn.x = currentX;
            currentX += btn.width + buttonSpacing;
        });

        this.buttonContainer.x = buttonStartX;
        this.buttonContainer.y = this.dialogHeight - this.buttons[0].height - this.dialogPadding;

        this.contentView.addChild(this.buttonContainer);
    }

    /** Opens the dialog with animation. */
    open(): void
    {
        if (!this.innerView) return;

        this.visible = true;
        this._isOpen = true;

        const openAnimation = this.options.animations?.open;

        if (!openAnimation)
        {
            // No animation - set immediately
            this.backdrop.alpha = this.options.backdropAlpha ?? 0.5;
            this.innerView.scale.set(1);

            return;
        }

        // Use animation
        this.backdrop.alpha = 0;
        this.innerView.scale.set(0.8);

        const duration = openAnimation.duration ?? 300;

        new Tween(this.backdrop)
            .to({ alpha: this.options.backdropAlpha ?? 0.5 }, duration)
            .start();

        new Tween(this.innerView.scale)
            .to({ x: 1, y: 1 }, duration)
            .start();
    }

    /** Closes the dialog with animation. */
    close(): void
    {
        if (!this.innerView) return;

        const closeAnimation = this.options.animations?.close;

        if (!closeAnimation)
        {
            // No animation - set immediately
            this.visible = false;
            this._isOpen = false;

            return;
        }

        // Use animation
        const duration = closeAnimation.duration ?? 300;

        new Tween(this.backdrop)
            .to({ alpha: 0 }, duration)
            .start();

        new Tween(this.innerView.scale)
            .to({ x: 0.8, y: 0.8 }, duration)
            .onComplete(() =>
            {
                this.visible = false;
                this._isOpen = false;
            })
            .start();
    }

    /** Shows the dialog (alias for open). */
    show(): void
    {
        this.open();
    }

    /** Hides the dialog (alias for close). */
    hide(): void
    {
        this.close();
    }
}

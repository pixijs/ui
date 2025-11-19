import { Container, Graphics, NineSliceSprite, ObservablePoint, Sprite, Texture, Ticker } from 'pixi.js';
import { Group, Tween } from 'tweedle.js';
import { Signal } from 'typed-signals';
import { Button } from './Button';
import { type ButtonOptions, FancyButton } from './FancyButton';
import { List, type ListOptions } from './List';
import { ScrollBox, ScrollBoxOptions } from './ScrollBox';
import { AnyText, getTextView, PixiText } from './utils/helpers/text';
import { getView, type GetViewSettings } from './utils/helpers/view';

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
    content?: AnyText | Container | Container[];
    width?: number;
    height?: number;
    padding?: number;
    buttons?: (ButtonOptions | FancyButton | Button)[];
    buttonList?: ListOptions<Container>;
    scrollBox?: ScrollBoxOptions;
    animations?: {
        open?: Animation;
        close?: Animation;
    };
    closeOnBackdropClick?: boolean;
    nineSliceSprite?: [number, number, number, number];
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
    protected scrollBox: ScrollBox;
    protected buttonContainer: List;

    protected readonly options: DialogOptions;

    protected _isOpen: boolean = false;

    /** Signal emitted when a button is selected. */
    onSelect: Signal<(buttonIndex: number, buttonText: string) => void>;
    /** Signal emitted when the dialog is closed. */
    onClose: Signal<() => void>;

    /**
     * Modal dialog component for asking users questions.
     * @param {DialogOptions} options - Configuration options for the dialog.
     * @param {string | Texture | Container | Sprite | Graphics} options.backdrop - Backdrop view or settings.
     * @param {number} options.backdropColor - Color of the backdrop (if backdrop is not provided).
     * @param {number} options.backdropAlpha - Alpha of the backdrop (if backdrop is not provided).
     * @param {string | Texture | Container | Sprite | Graphics} options.background - Background view or settings for the dialog.
     * @param {string | Texture | Container | Sprite | Graphics} options.title - Title text or settings for the dialog.
     * @param {string | Texture | Container | Sprite | Graphics | Container[]} options.content - Content text, view, or array of views for the dialog.
     * @param {number} options.width - Width of the dialog.
     * @param {number} options.height - Height of the dialog.
     * @param {number} options.padding - Padding around the dialog content.
     * @param {(ButtonOptions | FancyButton | Button)[]} options.buttons - Array of button configurations or instances.
     * @param {ListOptions<Container>} options.buttonList - Configuration options for the button list layout.
     * @param {ScrollBoxOptions} options.scrollBox - Configuration options for the scroll box containing the content.
     * @param {object} options.animations - Animation settings for opening and closing the dialog.
     * @param {Animation} options.animations.open - Animation settings for opening the dialog.
     * @param {Animation} options.animations.close - Animation settings for closing the dialog.
     * @param {boolean} options.closeOnBackdropClick - Whether to close the dialog when clicking on the backdrop.
     * @param {[number, number, number, number]} options.nineSliceSprite - Nine-slice scaling settings for the background.
     */
    constructor(options: DialogOptions)
    {
        super();

        this.options = options;
        this.onSelect = new Signal();
        this.onClose = new Signal();

        this.backdrop = new Container();
        this.contentView = new Container();
        this.buttonContainer = new List({
            type: 'horizontal',
            elementsMargin: 10,
            ...options.buttonList,
        });

        this.initBackdrop();
        this.initInnerView();
        this.initTitle();
        this.initButtons();

        const offset = this.dialogPadding;
        const { width } = this.options;
        let { height } = this.options;

        if (height)
        {
            height = height - (offset * 2) - this.buttonContainer.height;

            if (this.titleText?.height)
            {
                height -= this.titleText.height;
            }
        }

        this.scrollBox = new ScrollBox({
            background: 0x000000,
            elementsMargin: 10,
            radius: 0,
            type: 'bidirectional',
            padding: 10,
            ...this.options.scrollBox,
            width: width ? width - (offset * 2) : 0,
            height,
        });

        this.innerView?.addChild(this.scrollBox);

        this.visible = false;

        this.initContent();

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

        this.innerView.eventMode = 'static';

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

        if (typeof this.options.content === 'string' || typeof this.options.content === 'number')
        {
            const textView = getTextView(this.options.content);

            this.scrollBox.addItem(textView);
        }
        else
            if (Array.isArray(this.options.content))
            {
                this.options.content.forEach((item) => this.scrollBox.addItem(item));
            }
            else
            {
                this.scrollBox.addItem(this.options.content);
            }

        this.scrollBox.x = this.dialogPadding;
        this.scrollBox.y = yOffset;

        this.contentView.addChild(this.scrollBox);
    }

    /** Initializes the buttons at the bottom of the dialog. */
    protected initButtons(): void
    {
        if (!this.options.buttons || this.options.buttons.length === 0)
        {
            return;
        }

        const buttonConfigs = this.options.buttons;

        buttonConfigs.forEach((btn, index) =>
        {
            let button: Button | FancyButton;

            switch (true)
            {
                case btn instanceof Button:
                    btn.onPress.connect(() =>
                    {
                        this.onSelect.emit(index, '');
                    });

                    if (btn.view)
                    {
                        this.buttonContainer.addChild(btn.view);
                    }
                    break;
                case btn instanceof FancyButton:
                    btn.onPress.connect(() =>
                    {
                        this.onSelect.emit(index, (btn as FancyButton).text ?? '');
                    });
                    this.buttonContainer.addChild(btn);
                    break;

                default:
                    button = new FancyButton(btn);

                    button.onPress.connect(() =>
                    {
                        this.onSelect.emit(index, (button as FancyButton).text ?? '');
                    });
                    this.buttonContainer.addChild(button);
                    break;
            }
        });

        this.buttonContainer.x = (this.dialogWidth / 2) - (this.buttonContainer.width / 2);
        this.buttonContainer.y = this.dialogHeight - this.dialogPadding - this.buttonContainer.height;

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
                this.onClose.emit();
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

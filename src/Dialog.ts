import { Container, Graphics, NineSliceSprite, ObservablePoint, Texture, Ticker } from 'pixi.js';
import { Group, Tween } from 'tweedle.js';
import { Signal } from 'typed-signals';
import { FancyButton } from './FancyButton';
import { ScrollBox, ScrollBoxOptions } from './ScrollBox';
import { AnyText, getTextView, PixiText } from './utils/helpers/text';
import { getView, type GetViewSettings } from './utils/helpers/view';

export type DialogButton = {
    text: AnyText;
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
    animationDuration?: number;
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
    /** Signal emitted when a button is selected. */
    onSelect: Signal<(buttonIndex: number, buttonText: string) => void>;

    protected backdrop: Container;
    protected dialogContainer?: Container | NineSliceSprite;
    protected contentContainer: Container;
    protected titleText?: PixiText;
    protected contentView?: Container;
    protected scrollBox?: ScrollBox;
    protected buttonsContainer: Container;
    protected buttons: FancyButton[] = [];
    protected options: DialogOptions;
    protected isOpen: boolean = false;
    protected animationDuration: number = 300;

    constructor(options: DialogOptions)
    {
        super();

        this.options = options;
        this.onSelect = new Signal();
        this.animationDuration = options.animationDuration ?? 300;

        this.backdrop = new Container();
        this.contentContainer = new Container();
        this.buttonsContainer = new Container();

        this.createBackdrop();
        this.createDialogContainer();
        this.createTitle();
        this.createContent();
        this.createButtons();

        this.visible = false;

        Ticker.shared.add(() => Group.shared.update());
    }

    /** Creates the backdrop (semi-transparent background). */
    protected createBackdrop(): void
    {
        if (this.options.backdrop)
        {
            this.backdrop = getView(this.options.backdrop);
        }
        else
        {
            const backdropGraphics = new Graphics();

            backdropGraphics.rect(0, 0, 10000, 10000);
            backdropGraphics.fill({
                color: this.options.backdropColor ?? 0x000000,
                alpha: this.options.backdropAlpha ?? 0.5,
            });
            this.backdrop = backdropGraphics;
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

    /** Creates the dialog container (background panel). */
    protected createDialogContainer(): void
    {
        const { background, nineSliceSprite } = this.options;

        if (nineSliceSprite)
        {
            if (typeof background === 'string')
            {
                this.dialogContainer = new NineSliceSprite({
                    texture: Texture.from(background),
                    leftWidth: nineSliceSprite[0],
                    topHeight: nineSliceSprite[1],
                    rightWidth: nineSliceSprite[2],
                    bottomHeight: nineSliceSprite[3],
                });
            }
            else if (background instanceof Texture)
            {
                this.dialogContainer = new NineSliceSprite({
                    texture: background,
                    leftWidth: nineSliceSprite[0],
                    topHeight: nineSliceSprite[1],
                    rightWidth: nineSliceSprite[2],
                    bottomHeight: nineSliceSprite[3],
                });
            }
            else
            {
                console.warn(`NineSliceSprite can not be used with views set as Container.
                    Pass the texture or texture name instead of the Container extended instance.`);
                this.dialogContainer = getView(background);
            }
        }
        else
        {
            this.dialogContainer = getView(background);
        }

        if (this.options.width && this.options.height)
        {
            if (this.dialogContainer instanceof NineSliceSprite)
            {
                this.dialogContainer.width = this.options.width;
                this.dialogContainer.height = this.options.height;
            }
            else if (this.dialogContainer instanceof Graphics)
            {
                this.dialogContainer.width = this.options.width;
                this.dialogContainer.height = this.options.height;
            }
        }

        const dialogWidth = this.options.width ?? this.dialogContainer.width;
        const dialogHeight = this.options.height ?? this.dialogContainer.height;

        if ('anchor' in this.dialogContainer)
        {
            (this.dialogContainer.anchor as ObservablePoint).set(0.5, 0.5);
        }
        else
        {
            this.dialogContainer.pivot.set(dialogWidth / 2, dialogHeight / 2);
        }

        this.addChild(this.dialogContainer);
        this.dialogContainer.addChild(this.contentContainer);
    }

    /** Creates the title text if provided. */
    protected createTitle(): void
    {
        if (!this.options.title) return;

        const dialogWidth = this.options.width ?? this.dialogContainer?.width ?? 0;
        const padding = this.options.padding ?? 20;

        this.titleText = getTextView(this.options.title);
        if ('anchor' in this.titleText)
        {
            (this.titleText.anchor as ObservablePoint).set(0.5, 0);
        }

        this.titleText.x = dialogWidth / 2;
        this.titleText.y = padding;

        this.contentContainer.addChild(this.titleText);
    }

    /** Creates the content area, optionally wrapped in ScrollBox. */
    protected createContent(): void
    {
        if (!this.options.content) return;

        const padding = this.options.padding ?? 20;
        let yOffset = padding;

        if (this.titleText)
        {
            yOffset += this.titleText.height + padding;
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

            this.scrollBox.x = padding;
            this.scrollBox.y = yOffset;

            this.contentContainer.addChild(this.scrollBox);
        }
        else
        {
            if (typeof this.options.content === 'string' || typeof this.options.content === 'number')
            {
                const dialogWidth = this.options.width ?? this.dialogContainer?.width ?? 0;

                this.contentView = getTextView(this.options.content);
                if ('anchor' in this.contentView)
                {
                    (this.contentView.anchor as ObservablePoint).set(0.5, 0);
                }
                this.contentView.x = dialogWidth / 2;
            }
            else
            {
                this.contentView = this.options.content;
            }

            this.contentView.y = yOffset;
            this.contentContainer.addChild(this.contentView);
        }
    }

    /** Creates the buttons at the bottom of the dialog. */
    protected createButtons(): void
    {
        const buttonConfigs = this.options.buttons ?? [{ text: 'OK' }];
        const padding = this.options.padding ?? 20;
        const buttonSpacing = 10;

        buttonConfigs.forEach((btnConfig, index) =>
        {
            const button = new FancyButton({
                defaultView: new Graphics()
                    .roundRect(0, 0, 100, 40, this.options.radius ?? 10)
                    .fill(0xA5E24D),
                text: btnConfig.text,
            });

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
            this.buttonsContainer.addChild(button);
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

        const dialogWidth = this.options.width ?? this.dialogContainer?.width ?? 0;
        const dialogHeight = this.options.height ?? this.dialogContainer?.height ?? 0;

        let currentX = -(totalButtonWidth / 2);

        // eslint-disable-next-line no-console
        console.log('[Dialog] Button positioning:', {
            dialogWidth,
            dialogHeight,
            totalButtonWidth,
            centerX: dialogWidth / 2,
            buttonStartX: currentX,
            buttonCount: this.buttons.length,
            buttonWidths: this.buttons.map((b) => b.width),
            contentContainerOffset: { x: this.contentContainer.x, y: this.contentContainer.y },
        });

        this.buttons.forEach((btn, i) =>
        {
            btn.x = currentX;
            // eslint-disable-next-line no-console
            console.log(`[Dialog] Button ${i} positioned at x=${btn.x}, width=${btn.width}`);
            currentX += btn.width + buttonSpacing;
        });

        this.buttonsContainer.x = dialogWidth / 2;
        this.buttonsContainer.y = dialogHeight - this.buttons[0].height - padding;
        // eslint-disable-next-line no-console
        console.log('[Dialog] ButtonsContainer positioned at:', { x: this.buttonsContainer.x, y: this.buttonsContainer.y });

        this.contentContainer.addChild(this.buttonsContainer);
    }

    /** Opens the dialog with animation. */
    open(): void
    {
        if (!this.dialogContainer) return;

        this.visible = true;
        this.isOpen = true;

        this.backdrop.alpha = 0;
        this.dialogContainer.scale.set(0.8);

        new Tween(this.backdrop)
            .to({ alpha: this.options.backdropAlpha ?? 0.5 }, this.animationDuration)
            .start();

        new Tween(this.dialogContainer.scale)
            .to({ x: 1, y: 1 }, this.animationDuration)
            .start();
    }

    /** Closes the dialog with animation. */
    close(): void
    {
        if (!this.dialogContainer) return;

        new Tween(this.backdrop)
            .to({ alpha: 0 }, this.animationDuration)
            .start();

        new Tween(this.dialogContainer.scale)
            .to({ x: 0.8, y: 0.8 }, this.animationDuration)
            .onComplete(() =>
            {
                this.visible = false;
                this.isOpen = false;
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

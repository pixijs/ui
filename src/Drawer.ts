import { Container, FederatedPointerEvent, Graphics, NineSliceSprite, Sprite, Texture, Ticker } from 'pixi.js';
import { Group, Tween } from 'tweedle.js';
import { Signal } from 'typed-signals';
import { ScrollBox, ScrollBoxOptions } from './ScrollBox';
import { getView, type GetViewSettings } from './utils/helpers/view';

type Animation = {
    props: Record<string, any>;
    duration?: number;
};

export type DrawerPosition = 'bottom' | 'left' | 'right' | 'top';

export type DrawerOptions = {
    position?: DrawerPosition;
    backdrop?: GetViewSettings;
    backdropColor?: number;
    backdropAlpha?: number;
    background: GetViewSettings;
    content?: Container | Container[];
    width?: number;
    height?: number;
    padding?: number;
    scrollBox?: ScrollBoxOptions;
    animations?: {
        open?: Animation;
        close?: Animation;
    };
    closeOnBackdropClick?: boolean;
    swipeToClose?: boolean;
    nineSliceSprite?: [number, number, number, number];
};

/**
 * Drawer component that slides in from the edge of the screen.
 * @example
 * const drawer = new Drawer({
 *     background: new Graphics().roundRect(0, 0, 400, 300, 20).fill(0xFFFFFF),
 *     content: myContent,
 *     position: 'bottom',
 * });
 * drawer.onClose.connect(() => {
 *     console.log('Drawer closed');
 * });
 * drawer.open();
 */
export class Drawer extends Container
{
    protected backdrop: Container;
    protected innerView?: Container | NineSliceSprite;
    protected contentView: Container;
    protected scrollBox: ScrollBox;

    protected readonly options: DrawerOptions;

    protected _isOpen: boolean = false;
    protected _screenWidth: number = 800;
    protected _screenHeight: number = 600;

    // Swipe tracking
    protected _swipeStartX: number = 0;
    protected _swipeStartY: number = 0;
    protected _isSwiping: boolean = false;

    /** Signal emitted when the drawer is closed. */
    onClose: Signal<() => void>;

    /**
     * Drawer component that slides in from the edge of the screen.
     * @param {DrawerOptions} options - Configuration options for the drawer.
     * @param {DrawerPosition} options.position - Position of the drawer (bottom, left, right, top).
     * @param {string | Texture | Container | Sprite | Graphics} options.backdrop - Backdrop view or settings.
     * @param {number} options.backdropColor - Color of the backdrop (if backdrop is not provided).
     * @param {number} options.backdropAlpha - Alpha of the backdrop (if backdrop is not provided).
     * @param {string | Texture | Container | Sprite | Graphics} options.background -
     * Background view or settings for the drawer.
     * @param {Container | Container[]} options.content -
     * Content view or array of views for the drawer.
     * @param {number} options.width - Width of the drawer.
     * @param {number} options.height - Height of the drawer.
     * @param {number} options.padding - Padding around the drawer content.
     * @param {ScrollBoxOptions} options.scrollBox - Configuration options for the scroll box containing the content.
     * @param {object} options.animations - Animation settings for opening and closing the drawer.
     * @param {Animation} options.animations.open - Animation settings for opening the drawer.
     * @param {Animation} options.animations.close - Animation settings for closing the drawer.
     * @param {boolean} options.closeOnBackdropClick - Whether to close the drawer when clicking on the backdrop.
     * @param {boolean} options.swipeToClose - Whether to enable swipe gesture to close the drawer.
     * @param {[number, number, number, number]} options.nineSliceSprite - Nine-slice scaling settings for the background.
     */
    constructor(options: DrawerOptions)
    {
        super();

        this.options = options;
        this.onClose = new Signal();

        this.backdrop = new Container();
        this.contentView = new Container();

        this.initBackdrop();
        this.initInnerView();

        const offset = this.drawerPadding;
        const { width } = this.options;
        let { height } = this.options;

        if (height)
        {
            height = height - (offset * 2);
        }

        this.scrollBox = new ScrollBox({
            background: 0x000000,
            elementsMargin: 10,
            radius: 0,
            type: 'vertical',
            padding: 10,
            ...this.options.scrollBox,
            width: width ? width - (offset * 2) : 0,
            height,
        });

        this.innerView?.addChild(this.scrollBox);

        this.visible = false;

        this.initContent();
        this.initSwipeGesture();

        // Setup ticker for tween animations
        Ticker.shared.add(() => Group.shared.update());
    }

    /** Gets the drawer position from options. */
    protected get drawerPosition(): DrawerPosition
    {
        return this.options.position ?? 'bottom';
    }

    /** Gets the drawer width from options or innerView. */
    protected get drawerWidth(): number
    {
        return this.options.width ?? this.innerView?.width ?? 0;
    }

    /** Gets the drawer height from options or innerView. */
    protected get drawerHeight(): number
    {
        return this.options.height ?? this.innerView?.height ?? 0;
    }

    /** Gets the drawer padding from options. */
    protected get drawerPadding(): number
    {
        return this.options.padding ?? 20;
    }

    /** Gets the open state of the drawer. */
    get isOpen(): boolean
    {
        return this._isOpen;
    }

    /**
     * Sets the screen dimensions for positioning the drawer.
     * @param {number} width - Screen width.
     * @param {number} height - Screen height.
     */
    setScreenSize(width: number, height: number): void
    {
        this._screenWidth = width;
        this._screenHeight = height;
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

        if (this.options.closeOnBackdropClick !== false)
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

        this.innerView.eventMode = 'static';

        this.addChild(this.innerView);
        this.innerView.addChild(this.contentView);
    }

    /** Initializes the content area. */
    protected initContent(): void
    {
        if (!this.options.content) return;

        if (Array.isArray(this.options.content))
        {
            this.options.content.forEach((item) => this.scrollBox.addItem(item));
        }
        else
        {
            this.scrollBox.addItem(this.options.content);
        }

        this.scrollBox.x = this.drawerPadding;
        this.scrollBox.y = this.drawerPadding;

        this.contentView.addChild(this.scrollBox);
    }

    /** Initializes swipe gesture handling for closing. */
    protected initSwipeGesture(): void
    {
        if (this.options.swipeToClose === false) return;
        if (!this.innerView) return;

        this.innerView.on('pointerdown', (e: FederatedPointerEvent) =>
        {
            this._swipeStartX = e.globalX;
            this._swipeStartY = e.globalY;
            this._isSwiping = true;
        });

        this.innerView.on('pointerup', (e: FederatedPointerEvent) =>
        {
            if (!this._isSwiping) return;

            const deltaX = e.globalX - this._swipeStartX;
            const deltaY = e.globalY - this._swipeStartY;
            const threshold = 50;

            switch (this.drawerPosition)
            {
                case 'bottom':
                    if (deltaY > threshold) this.close();
                    break;
                case 'top':
                    if (deltaY < -threshold) this.close();
                    break;
                case 'left':
                    if (deltaX < -threshold) this.close();
                    break;
                case 'right':
                    if (deltaX > threshold) this.close();
                    break;
            }

            this._isSwiping = false;
        });

        this.innerView.on('pointerupoutside', () =>
        {
            this._isSwiping = false;
        });
    }

    /** Gets the closed position for the drawer based on its position setting. */
    protected getClosedPosition(): { x: number; y: number }
    {
        switch (this.drawerPosition)
        {
            case 'bottom':
                return { x: 0, y: this.drawerHeight };
            case 'top':
                return { x: 0, y: -this.drawerHeight };
            case 'left':
                return { x: -this.drawerWidth, y: 0 };
            case 'right':
                return { x: this.drawerWidth, y: 0 };
            default:
                return { x: 0, y: this.drawerHeight };
        }
    }

    /** Gets the open position for the drawer based on its position setting. */
    protected getOpenPosition(): { x: number; y: number }
    {
        return { x: 0, y: 0 };
    }

    /** Opens the drawer with animation. */
    open(): void
    {
        if (!this.innerView) return;

        this.visible = true;
        this._isOpen = true;

        const openAnimation = this.options.animations?.open;
        const closedPos = this.getClosedPosition();
        const openPos = this.getOpenPosition();

        if (!openAnimation)
        {
            // No animation - set immediately
            this.backdrop.alpha = this.options.backdropAlpha ?? 0.5;
            this.innerView.x = openPos.x;
            this.innerView.y = openPos.y;

            return;
        }

        // Use animation
        this.backdrop.alpha = 0;
        this.innerView.x = closedPos.x;
        this.innerView.y = closedPos.y;

        const duration = openAnimation.duration ?? 300;

        new Tween(this.backdrop)
            .to({ alpha: this.options.backdropAlpha ?? 0.5 }, duration)
            .start();

        new Tween(this.innerView)
            .to({ x: openPos.x, y: openPos.y }, duration)
            .start();
    }

    /** Closes the drawer with animation. */
    close(): void
    {
        if (!this.innerView) return;

        const closeAnimation = this.options.animations?.close;

        if (!closeAnimation)
        {
            // No animation - set immediately
            this.visible = false;
            this._isOpen = false;

            this.onClose.emit();

            return;
        }

        // Use animation
        const duration = closeAnimation.duration ?? 300;
        const closedPos = this.getClosedPosition();

        new Tween(this.backdrop)
            .to({ alpha: 0 }, duration)
            .start();

        new Tween(this.innerView)
            .to({ x: closedPos.x, y: closedPos.y }, duration)
            .onComplete(() =>
            {
                this.visible = false;
                this._isOpen = false;
                this.onClose.emit();
            })
            .start();
    }

    /** Shows the drawer (alias for open). */
    show(): void
    {
        this.open();
    }

    /** Hides the drawer (alias for close). */
    hide(): void
    {
        this.close();
    }
}

import {
    Container,
    ContainerOptions,
    DestroyOptions,
    FederatedPointerEvent,
    Graphics,
    NineSliceSprite,
    Sprite,
    Texture,
    Ticker,
} from 'pixi.js';
import { Group, Tween } from 'tweedle.js';
import { Signal } from 'typed-signals';
import { ScrollBox, ScrollBoxOptions } from './ScrollBox';
import { getView, type GetViewSettings } from './utils/helpers/view';

type Animation = {
    /** Currently unused. The drawer always slides between its closed and open positions. */
    props: Record<string, any>;
    /** Animation duration in milliseconds. Defaults to 300. */
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
} & Omit<ContainerOptions, 'position'>;

/**
 * Modal drawer component: a panel that slides in from an edge of the screen,
 * with an optional backdrop, swipe-to-close and a scrollable content area.
 *
 * The drawer is laid out relative to the screen centre, so add it to a container centred on the screen
 * and tell it the screen size with {@link Drawer.setScreenSize}. The default size is 800x600.
 * @example
 * const drawer = new Drawer({
 *     background: new Graphics().roundRect(0, 0, 400, 300, 20).fill(0xFFFFFF),
 *     content: myContent,
 *     position: 'bottom',
 *     width: 400,
 *     height: 300,
 *     animations: { open: { props: {}, duration: 300 }, close: { props: {}, duration: 300 } },
 * });
 *
 * drawer.setScreenSize(app.screen.width, app.screen.height);
 * drawer.onClose.connect(() => {
 *     console.log('Drawer closed');
 * });
 *
 * view.addChild(drawer);
 * drawer.open();
 */
export class Drawer extends Container
{
    protected backdrop: Container;
    protected innerView: Container;
    protected backgroundView?: Container | NineSliceSprite;
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

    /** Kept as a field so destroy() can detach it from the shared ticker. */
    protected readonly updateAnimations = () => Group.shared.update();

    /** Signal emitted when the drawer is closed. */
    onClose: Signal<() => void>;

    /**
     * Modal drawer component that slides in from the edge of the screen.
     * @param {DrawerOptions} options - Configuration options for the drawer.
     * @param {DrawerPosition} options.position -
     * Screen edge the drawer is attached to (bottom, left, right, top). Defaults to `bottom`.
     * @param {string | Texture | Container | Sprite | Graphics} options.backdrop -
     * Backdrop view or settings. If omitted, a large tinted sprite covering the screen is used.
     * @param {number} options.backdropColor - Color of the backdrop (if backdrop is not provided). Defaults to black.
     * @param {number} options.backdropAlpha - Alpha of the backdrop when the drawer is open. Defaults to 0.5.
     * @param {string | Texture | Container | Sprite | Graphics} options.background -
     * Background view or settings for the drawer.
     * @param {Container | Container[]} options.content -
     * Content view or array of views for the drawer.
     * @param {number} options.width -
     * Width of the drawer panel. For left/right drawers it is the visible width.
     * @param {number} options.height -
     * Height of the drawer panel. For top/bottom drawers it is the visible height.
     * @param {number} options.padding - Padding around the drawer content. Defaults to 20.
     * @param {ScrollBoxOptions} options.scrollBox - Configuration options for the scroll box containing the content.
     * @param {object} options.animations -
     * Animation settings for opening and closing the drawer. Without them the drawer opens and closes instantly.
     * @param {Animation} options.animations.open - Animation settings for opening the drawer.
     * @param {Animation} options.animations.close - Animation settings for closing the drawer.
     * @param {boolean} options.closeOnBackdropClick -
     * Whether to close the drawer when clicking on the backdrop. Defaults to true.
     * @param {boolean} options.swipeToClose - Whether to enable swipe gesture to close the drawer. Defaults to true.
     * @param {[number, number, number, number]} options.nineSliceSprite - Nine-slice scaling settings for the background
     * (left, top, right, bottom). Used when `background` is a texture or texture name.
     * Any other option is treated as a `Container` option and passed to the `Container` constructor
     * (except `position`, which is the drawer edge here; use `x`/`y` to move the drawer).
     */
    constructor(options: DrawerOptions)
    {
        const {
            position: _0,
            backdrop: _1,
            backdropColor: _2,
            backdropAlpha: _3,
            background: _4,
            content: _5,
            width,
            height,
            padding: _6,
            scrollBox: _7,
            animations: _8,
            closeOnBackdropClick: _9,
            swipeToClose: _10,
            nineSliceSprite: _11,
            ...rest
        } = options;

        super(rest);

        this.options = options;
        this.onClose = new Signal();

        this.backdrop = new Container();
        this.innerView = new Container();
        this.contentView = new Container();

        this.initBackdrop();
        this.initInnerView();

        const offset = this.drawerPadding;
        const computedHeight = height ? height - (offset * 2) : height;

        this.scrollBox = new ScrollBox({
            background: 0x000000,
            elementsMargin: 10,
            radius: 0,
            type: 'vertical',
            padding: 10,
            ...this.options.scrollBox,
            width: width ? width - (offset * 2) : 0,
            height: computedHeight,
        });

        this.innerView.addChild(this.scrollBox);

        this.visible = false;

        this.initContent();
        this.initSwipeGesture();

        // Setup ticker for tween animations
        Ticker.shared.add(this.updateAnimations);
    }

    /**
     * Destroys the component, detaching it from the shared ticker.
     * @param {boolean | DestroyOptions} [options] - Options parameter.
     */
    override destroy(options?: DestroyOptions | boolean)
    {
        Ticker.shared.remove(this.updateAnimations);

        // Drawer constructs this ScrollBox itself, and ScrollBox.destroy is what
        // releases its ticker callback and document wheel listener.
        this.scrollBox?.destroy();

        super.destroy(options);
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

    /** Whether the drawer is open. Becomes false only after the close animation has finished. */
    get isOpen(): boolean
    {
        return this._isOpen;
    }

    /**
     * Sets the screen dimensions for positioning the drawer.
     * The drawer automatically spans the full edge:
     * - Bottom/Top drawers: full screen width
     * - Left/Right drawers: full screen height
     * @param {number} width - Screen width.
     * @param {number} height - Screen height.
     */
    setScreenSize(width: number, height: number): void
    {
        this._screenWidth = width;
        this._screenHeight = height;

        // Resize only the background to span full edge (not the content)
        if (this.backgroundView)
        {
            if (this.drawerPosition === 'bottom' || this.drawerPosition === 'top')
            {
                // Full width for top/bottom drawers
                this.backgroundView.width = width;
            }
            else
            {
                // Full height for left/right drawers
                this.backgroundView.height = height;
            }
        }

        // An open drawer is positioned from the screen size, so it has to be
        // re-anchored here; otherwise it stays glued to the previous edge.
        if (this._isOpen)
        {
            const openPos = this.getOpenPosition();

            this.innerView.x = openPos.x;
            this.innerView.y = openPos.y;
        }
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

        if (!background)
        {
            throw new Error('Drawer background is not defined. Please provide options.background.');
        }

        if (nineSliceSprite)
        {
            if (typeof background === 'string')
            {
                this.backgroundView = new NineSliceSprite({
                    texture: Texture.from(background),
                    leftWidth: nineSliceSprite[0],
                    topHeight: nineSliceSprite[1],
                    rightWidth: nineSliceSprite[2],
                    bottomHeight: nineSliceSprite[3],
                });
            }
            else if (background instanceof Texture)
            {
                this.backgroundView = new NineSliceSprite({
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
                this.backgroundView = getView(background);
            }
        }
        else
        {
            this.backgroundView = getView(background);
        }

        if (this.options.width && this.options.height)
        {
            if (this.backgroundView instanceof NineSliceSprite)
            {
                this.backgroundView.width = this.options.width;
                this.backgroundView.height = this.options.height;
            }
            else if (this.backgroundView instanceof Graphics)
            {
                this.backgroundView.width = this.options.width;
                this.backgroundView.height = this.options.height;
            }
        }

        this.innerView.eventMode = 'static';

        // Add background first, then content on top
        this.innerView.addChild(this.backgroundView);
        this.innerView.addChild(this.contentView);
        this.addChild(this.innerView);
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
        const openPos = this.getOpenPosition();

        switch (this.drawerPosition)
        {
            case 'bottom':
                return { x: openPos.x, y: openPos.y + this.drawerHeight };
            case 'top':
                return { x: openPos.x, y: openPos.y - this.drawerHeight };
            case 'left':
                return { x: openPos.x - this.drawerWidth, y: openPos.y };
            case 'right':
                return { x: openPos.x + this.drawerWidth, y: openPos.y };
            default:
                return { x: openPos.x, y: openPos.y + this.drawerHeight };
        }
    }

    /** Gets the open position for the drawer based on its position setting. */
    protected getOpenPosition(): { x: number; y: number }
    {
        // Position the drawer at the correct edge, assuming container is at screen center
        // Screen center is (0,0) relative to the drawer container
        // So top of screen is at -screenHeight/2, bottom at +screenHeight/2
        const halfWidth = this._screenWidth / 2;
        const halfHeight = this._screenHeight / 2;

        switch (this.drawerPosition)
        {
            case 'bottom':
                // Attached to bottom edge of screen, full width
                return { x: -halfWidth, y: halfHeight - this.drawerHeight };
            case 'top':
                // Attached to top edge of screen, full width
                return { x: -halfWidth, y: -halfHeight };
            case 'left':
                // Attached to left edge of screen, full height
                return { x: -halfWidth, y: -halfHeight };
            case 'right':
                // Attached to right edge of screen, full height
                return { x: halfWidth - this.drawerWidth, y: -halfHeight };
            default:
                return { x: -halfWidth, y: halfHeight - this.drawerHeight };
        }
    }

    /** Shows the drawer and slides it in (instantly if no open animation is set). */
    open(): void
    {
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

    /** Slides the drawer out, hides it and emits `onClose` (instantly if no close animation is set). */
    close(): void
    {
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

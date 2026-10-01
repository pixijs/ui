import { Container, FederatedPointerEvent, Graphics, NineSliceSprite, Sprite, Texture } from 'pixi.js';
import { Group } from 'tweedle.js';
import { Drawer, DrawerPosition } from '../../src/Drawer';

const g = (w = 400, h = 300) => new Graphics().rect(0, 0, w, h).fill(0xffffff);
const slice = [2, 2, 2, 2] as [number, number, number, number];
const ptr = (x: number, y: number) => ({ globalX: x, globalY: y }) as unknown as FederatedPointerEvent;

/**
 * A drawer on an 800x600 screen: halfWidth 400, halfHeight 300.
 * @param opts - options merged over the defaults.
 */
const makeDrawer = (opts: Record<string, unknown> = {}) =>
{
    const drawer = new Drawer({ background: g(), width: 400, height: 300, ...opts } as any);

    drawer.setScreenSize(800, 600);

    return drawer;
};

const innerOf = (drawer: Drawer) => (drawer as any).innerView as Container;

describe('Drawer open position', () =>
{
    it.each([
        ['bottom', -400, 0],
        ['top', -400, -300],
        ['left', -400, -300],
        ['right', 0, -300],
    ] as Array<[DrawerPosition, number, number]>)(
        'anchors a %s drawer to its screen edge',
        (position, x, y) =>
        {
            const drawer = makeDrawer({ position });

            drawer.open();

            expect(innerOf(drawer).x).toBe(x);
            expect(innerOf(drawer).y).toBe(y);
        },
    );

    it('defaults to the bottom edge', () =>
    {
        const drawer = makeDrawer();

        drawer.open();

        expect(innerOf(drawer).y).toBe(0);
    });
});

describe('Drawer closed position', () =>
{
    // With an open animation the drawer starts at its closed position.
    it.each([
        ['bottom', -400, 300],
        ['top', -400, -600],
        ['left', -800, -300],
        ['right', 400, -300],
    ] as Array<[DrawerPosition, number, number]>)(
        'parks a %s drawer off the %s edge before animating in',
        (position, x, y) =>
        {
            const drawer = makeDrawer({
                position,
                animations: { open: { props: {}, duration: 300 } },
            });

            drawer.open();

            expect(innerOf(drawer).x).toBe(x);
            expect(innerOf(drawer).y).toBe(y);
        },
    );
});

describe('Drawer setScreenSize', () =>
{
    it.each(['bottom', 'top'] as DrawerPosition[])('spans the full width for a %s drawer', (position) =>
    {
        const drawer = makeDrawer({ position });

        drawer.setScreenSize(1024, 768);

        expect((drawer as any).backgroundView.width).toBe(1024);
    });

    it.each(['left', 'right'] as DrawerPosition[])('spans the full height for a %s drawer', (position) =>
    {
        const drawer = makeDrawer({ position });

        drawer.setScreenSize(1024, 768);

        expect((drawer as any).backgroundView.height).toBe(768);
    });

    it('feeds the new size into the next open', () =>
    {
        const drawer = makeDrawer();

        drawer.setScreenSize(1600, 1200);
        drawer.open();

        expect(innerOf(drawer).x).toBe(-800);
        expect(innerOf(drawer).y).toBe(600 - 300);
    });
});

describe('Drawer open and close', () =>
{
    it('starts hidden and closed', () =>
    {
        const drawer = makeDrawer();

        expect(drawer.visible).toBe(false);
        expect(drawer.isOpen).toBe(false);
    });

    it('opens instantly without an animation', () =>
    {
        const drawer = makeDrawer();

        drawer.open();

        expect(drawer.visible).toBe(true);
        expect(drawer.isOpen).toBe(true);
        expect((drawer as any).backdrop.alpha).toBe(0.5);
    });

    it('honours a custom backdrop alpha on open', () =>
    {
        const drawer = makeDrawer({ backdropAlpha: 0.9 });

        drawer.open();

        expect((drawer as any).backdrop.alpha).toBe(0.9);
    });

    it('closes instantly without an animation and emits onClose', () =>
    {
        const drawer = makeDrawer();
        let closed = 0;

        drawer.onClose.connect(() => { closed++; });
        drawer.open();
        drawer.close();

        expect(drawer.isOpen).toBe(false);
        expect(drawer.visible).toBe(false);
        expect(closed).toBe(1);
    });

    it('stays open until the close animation finishes', () =>
    {
        const drawer = makeDrawer({ animations: { close: { props: {}, duration: 100 } } });
        let closed = 0;

        drawer.onClose.connect(() => { closed++; });
        drawer.open();
        drawer.close();

        expect(drawer.isOpen).toBe(true);
        expect(closed).toBe(0);

        Group.shared.update(500);

        expect(drawer.isOpen).toBe(false);
        expect(drawer.visible).toBe(false);
        expect(closed).toBe(1);
    });

    it('slides into place when the open animation finishes', () =>
    {
        const drawer = makeDrawer({ animations: { open: { props: {}, duration: 100 } } });

        drawer.open();
        expect(innerOf(drawer).y).toBe(300);

        Group.shared.update(500);

        expect(innerOf(drawer).y).toBe(0);
    });

    it('defaults the animation duration when none is given', () =>
    {
        const drawer = makeDrawer({ animations: { open: { props: {} } } });

        expect(() => drawer.open()).not.toThrow();
    });

    it('aliases show and hide', () =>
    {
        const drawer = makeDrawer();

        drawer.show();
        expect(drawer.isOpen).toBe(true);

        drawer.hide();
        expect(drawer.isOpen).toBe(false);
    });
});

describe('Drawer backdrop', () =>
{
    it('builds a tinted sprite by default', () =>
    {
        const drawer = makeDrawer();

        expect((drawer as any).backdrop).toBeInstanceOf(Sprite);
    });

    it('applies a custom backdrop colour', () =>
    {
        const drawer = makeDrawer({ backdropColor: 0xff0000 });

        expect((drawer as any).backdrop.tint).toBe(0xff0000);
    });

    it('accepts a custom backdrop view', () =>
    {
        const backdrop = g(10, 10);
        const drawer = makeDrawer({ backdrop });

        expect((drawer as any).backdrop).toBe(backdrop);
    });

    it('closes on a backdrop tap by default', () =>
    {
        const drawer = makeDrawer();

        drawer.open();
        (drawer as any).backdrop.emit('pointertap', {} as any);

        expect(drawer.isOpen).toBe(false);
    });

    it('ignores a backdrop tap when closeOnBackdropClick is false', () =>
    {
        const drawer = makeDrawer({ closeOnBackdropClick: false });

        drawer.open();
        (drawer as any).backdrop.emit('pointertap', {} as any);

        expect(drawer.isOpen).toBe(true);
    });
});

describe('Drawer swipe to close', () =>
{
    const swipe = (drawer: Drawer, from: [number, number], to: [number, number]) =>
    {
        const inner = innerOf(drawer);

        inner.emit('pointerdown', ptr(...from));
        inner.emit('pointerup', ptr(...to));
    };

    it.each([
        ['bottom', [100, 100], [100, 200]],
        ['top', [100, 200], [100, 100]],
        ['left', [200, 100], [100, 100]],
        ['right', [100, 100], [200, 100]],
    ] as Array<[DrawerPosition, [number, number], [number, number]]>)(
        'closes a %s drawer swiped past the threshold',
        (position, from, to) =>
        {
            const drawer = makeDrawer({ position });

            drawer.open();
            swipe(drawer, from, to);

            expect(drawer.isOpen).toBe(false);
        },
    );

    it.each([
        ['bottom', [100, 100], [100, 110]],
        ['top', [100, 110], [100, 100]],
        ['left', [110, 100], [100, 100]],
        ['right', [100, 100], [110, 100]],
    ] as Array<[DrawerPosition, [number, number], [number, number]]>)(
        'keeps a %s drawer open below the threshold',
        (position, from, to) =>
        {
            const drawer = makeDrawer({ position });

            drawer.open();
            swipe(drawer, from, to);

            expect(drawer.isOpen).toBe(true);
        },
    );

    it('ignores a swipe in the wrong direction', () =>
    {
        const drawer = makeDrawer({ position: 'bottom' });

        drawer.open();
        swipe(drawer, [100, 200], [100, 100]);

        expect(drawer.isOpen).toBe(true);
    });

    it('ignores a pointerup with no preceding pointerdown', () =>
    {
        const drawer = makeDrawer();

        drawer.open();
        innerOf(drawer).emit('pointerup', ptr(100, 500));

        expect(drawer.isOpen).toBe(true);
    });

    it('cancels the gesture on pointerupoutside', () =>
    {
        const drawer = makeDrawer();

        drawer.open();
        innerOf(drawer).emit('pointerdown', ptr(100, 100));
        innerOf(drawer).emit('pointerupoutside', ptr(100, 100));
        innerOf(drawer).emit('pointerup', ptr(100, 300));

        expect(drawer.isOpen).toBe(true);
    });

    it('registers no gesture handlers when swipeToClose is false', () =>
    {
        const drawer = makeDrawer({ swipeToClose: false });

        drawer.open();
        swipe(drawer, [100, 100], [100, 300]);

        expect(drawer.isOpen).toBe(true);
    });
});

describe('Drawer content', () =>
{
    it('accepts a single container', () =>
    {
        const drawer = makeDrawer({ content: g(100, 100) });

        expect((drawer as any).scrollBox.items).toHaveLength(1);
    });

    it('accepts an array of containers', () =>
    {
        const drawer = makeDrawer({ content: [g(100, 50), g(100, 50), g(100, 50)] });

        expect((drawer as any).scrollBox.items).toHaveLength(3);
    });

    it('tolerates no content', () =>
    {
        const drawer = makeDrawer();

        expect((drawer as any).scrollBox.items).toHaveLength(0);
    });

    it('offsets the scroll box by the padding', () =>
    {
        const drawer = makeDrawer({ content: g(100, 100), padding: 30 });

        expect((drawer as any).scrollBox.x).toBe(30);
        expect((drawer as any).scrollBox.y).toBe(30);
    });

    it('defaults the padding to 20', () =>
    {
        const drawer = makeDrawer({ content: g(100, 100) });

        expect((drawer as any).scrollBox.x).toBe(20);
    });

    it('insets the scroll box width by the padding', () =>
    {
        const drawer = makeDrawer({ content: g(100, 100), width: 400, padding: 20 });

        expect((drawer as any).scrollBox.width).toBe(360);
    });

    it('forwards scrollBox options', () =>
    {
        const drawer = makeDrawer({ content: g(100, 100), scrollBox: { type: 'horizontal', elementsMargin: 25 } });

        expect((drawer as any).scrollBox.list.elementsMargin).toBe(25);
    });
});

describe('Drawer background', () =>
{
    it('builds a nine-slice background from a Texture', () =>
    {
        const drawer = makeDrawer({ background: Texture.WHITE, nineSliceSprite: slice });

        expect((drawer as any).backgroundView).toBeInstanceOf(NineSliceSprite);
    });

    it('warns and falls back when a nine-slice background is a Container', () =>
    {
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        const drawer = makeDrawer({ background: g(), nineSliceSprite: slice });

        expect(spy).toHaveBeenCalled();
        expect((drawer as any).backgroundView).toBeInstanceOf(Graphics);
        spy.mockRestore();
    });

    it('sizes a Graphics background to the drawer', () =>
    {
        // Constructed directly: setScreenSize deliberately overrides this to span the edge.
        const drawer = new Drawer({ background: g(), width: 320, height: 240 } as any);

        expect((drawer as any).backgroundView.width).toBe(320);
        expect((drawer as any).backgroundView.height).toBe(240);
    });

    it('lets setScreenSize override the background width afterwards', () =>
    {
        const drawer = new Drawer({ background: g(), width: 320, height: 240 } as any);

        drawer.setScreenSize(800, 600);

        expect((drawer as any).backgroundView.width).toBe(800);
    });

    it('leaves the background unsized when only one dimension is given', () =>
    {
        const drawer = new Drawer({ background: g(400, 300), width: 320 } as any);

        expect((drawer as any).backgroundView.width).toBeCloseTo(400, 0);
    });
});

describe('Drawer container options', () =>
{
    it('forwards unknown options to the Container constructor', () =>
    {
        const drawer = makeDrawer({ x: 15, y: 25, alpha: 0.4, label: 'my-drawer' });

        expect(drawer.x).toBe(15);
        expect(drawer.y).toBe(25);
        expect(drawer.alpha).toBe(0.4);
        expect(drawer.label).toBe('my-drawer');
    });

    it('does not pass position through to the Container', () =>
    {
        const drawer = makeDrawer({ position: 'left' });

        expect(drawer.x).toBe(0);
        expect(drawer.y).toBe(0);
    });

    it('does not pass width and height through to the Container', () =>
    {
        const drawer = new Drawer({ background: g(400, 300), width: 400, height: 300 } as any);

        expect(drawer.scale.x).toBe(1);
        expect(drawer.scale.y).toBe(1);
    });
});

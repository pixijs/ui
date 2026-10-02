/**
 * Drawer regressions.
 *
 * These assert the CORRECT behaviour. They were written against the unfixed
 * component and marked `it.failing`, which passes only while the bug is still
 * present; the fix flipped them to `it` without editing a single assertion.
 *
 * Drawer was developed in parallel with the #265-#270 audit, so it reintroduces
 * two defect shapes that series fixed elsewhere.
 */
import { Graphics, Ticker } from 'pixi.js';
import { Group } from 'tweedle.js';
import { Drawer } from '../../src/Drawer';

const g = (w = 400, h = 300) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

describe('Drawer releases what it acquires', () =>
{
    it('removes its shared-ticker callbacks on destroy', () =>
    {
        const before = Ticker.shared.count;
        const drawer = new Drawer({ background: g() });

        drawer.destroy();

        expect(Ticker.shared.count).toBe(before);
    });
});

describe('Drawer background validation', () =>
{
    it('reports a clear error when constructed without a background', () =>
    {
        expect(() => new Drawer({} as any)).toThrow(/background/i);
    });
});

describe('Drawer setScreenSize while open', () =>
{
    it('re-anchors an open drawer to the new screen edge', () =>
    {
        const drawer = new Drawer({ background: g(), width: 400, height: 300 });

        drawer.setScreenSize(800, 600);
        drawer.open();

        drawer.setScreenSize(1600, 1200);

        // Bottom edge of a 1600x1200 screen: x = -800, y = 600 - 300.
        expect((drawer as any).innerView.x).toBe(-800);
        expect((drawer as any).innerView.y).toBe(300);
    });
});

describe('Drawer animations do not fight each other', () =>
{
    const animated = () => new Drawer({
        background: g(), width: 400, height: 300,
        animations: { open: { props: {}, duration: 300 }, close: { props: {}, duration: 300 } },
    });
    // Runs the shared tween group past every animation in flight.
    const finish = () =>
    {
        for (let i = 0; i < 10; i++) Group.shared.update(100);
    };

    it('re-anchors a drawer whose open animation is still running when the screen size changes', () =>
    {
        const drawer = animated();

        drawer.setScreenSize(800, 600);
        drawer.open();
        Group.shared.update(100);

        drawer.setScreenSize(1600, 1200);
        finish();

        expect((drawer as any).innerView.x).toBe(-800);
        expect((drawer as any).innerView.y).toBe(300);
    });

    it('stays open when opened again while it is still closing', () =>
    {
        const drawer = animated();
        const onClose = jest.fn();

        drawer.onClose.connect(onClose);
        drawer.setScreenSize(800, 600);
        drawer.open();
        finish();

        drawer.close();
        Group.shared.update(100);
        drawer.open();
        finish();

        expect(drawer.isOpen).toBe(true);
        expect(drawer.visible).toBe(true);
        expect((drawer as any).innerView.y).toBe(0);
        expect(onClose).not.toHaveBeenCalled();
    });
});

describe('Drawer swipe to close', () =>
{
    type Release = 'pointerup' | 'pointerupoutside';
    const swipe = (drawer: Drawer, from: [number, number], to: [number, number], release: Release) =>
    {
        const inner = (drawer as any).innerView;

        inner.emit('pointerdown', { globalX: from[0], globalY: from[1] });
        inner.emit(release, { globalX: to[0], globalY: to[1] });
    };

    it('closes on a swipe released over the drawer', () =>
    {
        const drawer = new Drawer({ background: g(), width: 400, height: 300 });

        drawer.open();
        swipe(drawer, [200, 400], [200, 480], 'pointerup');

        expect(drawer.isOpen).toBe(false);
    });

    it('closes on a swipe released past the drawer edge', () =>
    {
        const drawer = new Drawer({ background: g(), width: 400, height: 300 });

        drawer.open();
        // A flick down a bottom drawer usually ends below it, so the release is "outside".
        swipe(drawer, [200, 400], [200, 760], 'pointerupoutside');

        expect(drawer.isOpen).toBe(false);
    });

    it('ignores a short swipe released outside', () =>
    {
        const drawer = new Drawer({ background: g(), width: 400, height: 300 });

        drawer.open();
        swipe(drawer, [200, 400], [230, 410], 'pointerupoutside');

        expect(drawer.isOpen).toBe(true);
    });
});

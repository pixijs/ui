/**
 * Drawer regressions.
 *
 * These assert the CORRECT behaviour. While the defect is present they are
 * marked `it.failing`, which passes only until it is fixed; the fix PR flips
 * them to `it` without editing a single assertion.
 *
 * Drawer was developed in parallel with the #265-#270 audit, so it reintroduces
 * two defect shapes that series fixed elsewhere.
 */
import { Graphics, Ticker } from 'pixi.js';
import { Drawer } from '../../src/Drawer';

const g = (w = 400, h = 300) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

describe('Drawer releases what it acquires', () =>
{
    it.failing('removes its shared-ticker callbacks on destroy', () =>
    {
        const before = Ticker.shared.count;
        const drawer = new Drawer({ background: g() });

        drawer.destroy();

        expect(Ticker.shared.count).toBe(before);
    });
});

describe('Drawer background validation', () =>
{
    it.failing('reports a clear error when constructed without a background', () =>
    {
        expect(() => new Drawer({} as any)).toThrow(/background/i);
    });
});

describe('Drawer setScreenSize while open', () =>
{
    it.failing('re-anchors an open drawer to the new screen edge', () =>
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

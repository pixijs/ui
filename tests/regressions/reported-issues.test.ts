/**
 * Regressions for issues reported against the library.
 *
 * Each of these reproduces the reported symptom and was confirmed to fail on
 * the source as it stood when the issue was filed.
 */
import { Graphics, Sprite, Texture } from 'pixi.js';
import { ProgressBar } from '../../src/ProgressBar';
import { ScrollBox } from '../../src/ScrollBox';

const g = (w = 200, h = 40) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

describe('#227 items stay visible after setSize', () =>
{
    it('keeps every item renderable when the box is enlarged', () =>
    {
        const box = new ScrollBox({ width: 236, height: 180, elementsMargin: 8, padding: 8 });

        for (let i = 0; i < 10; i++) box.addItem(g(220, 40));

        box.setSize({ width: 236, height: 600 });
        (box as any).updateVisibleItems();

        expect(box.items.filter((item) => item.renderable)).toHaveLength(10);
    });

    it('culls against the new size, not the constructor size', () =>
    {
        const box = new ScrollBox({ width: 236, height: 180 });

        box.setSize({ width: 236, height: 600 });

        expect((box as any).options.height).toBe(600);
    });
});

describe('#226 bounds follow a height assigned after construction', () =>
{
    it('keeps every item renderable when the height is raised', () =>
    {
        const box = new ScrollBox({ width: 500, height: 100 });

        for (let i = 0; i < 20; i++) box.addItem(g(480, 40));

        box.height = 800;
        (box as any).updateVisibleItems();

        expect(box.items.filter((item) => item.renderable)).toHaveLength(20);
    });

    it('culls against the new height, not the constructor height', () =>
    {
        const box = new ScrollBox({ width: 500, height: 100 });

        box.height = 800;

        expect((box as any).options.height).toBe(800);
    });

    // The report also mentions the drag limit. That is not asserted here: the
    // limit derives from borderMask.height, which jsdom's canvas mock always
    // reports as 0, so any expectation would pin the mock rather than the
    // component.
});

describe('#252 setFill rejecting a shared Sprite leaves a usable fill', () =>
{
    it('does not throw when progress is set afterwards', () =>
    {
        const shared = new Sprite(Texture.WHITE);
        const bar = new ProgressBar({ bg: shared, fill: g() });

        bar.setFill(shared);

        expect(() => { bar.progress = 50; }).not.toThrow();
    });

    it('keeps the previous fill rather than destroying it', () =>
    {
        const shared = new Sprite(Texture.WHITE);
        const bar = new ProgressBar({ bg: shared, fill: g() });
        const original = (bar as any).fill;

        bar.setFill(shared);

        expect((bar as any).fill).toBe(original);
        expect((bar as any).fill.destroyed).toBe(false);
    });
});

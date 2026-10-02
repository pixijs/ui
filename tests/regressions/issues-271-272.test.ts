/**
 * Regressions for issues #271 and #272.
 *
 * These assert the CORRECT behaviour. They were written against the unfixed
 * source and marked `it.failing`, which passes only while the bug is still
 * present; the fix flipped them to `it` without editing a single assertion.
 */
import { Graphics } from 'pixi.js';
import { FancyButton } from '../../src/FancyButton';
import { ScrollBox } from '../../src/ScrollBox';

const g = (w = 180, h = 40) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

describe('#271 ScrollBox sized by its content', () =>
{
    it('reports the content height, not a running total', () =>
    {
        const box = new ScrollBox({ width: 200 });

        for (let i = 0; i < 5; i++) box.addItem(g(180, 40));

        expect(box.height).toBe((box as any).listHeight);
    });

    it('does not grow when the same content is re-measured', () =>
    {
        const box = new ScrollBox({ width: 200 });

        for (let i = 0; i < 3; i++) box.addItem(g(180, 40));
        const settled = box.height;

        box.resize(true);
        box.resize(true);

        expect(box.height).toBe(settled);
    });

    it('shrinks when content is removed', () =>
    {
        const box = new ScrollBox({ width: 200 });

        for (let i = 0; i < 4; i++) box.addItem(g(180, 40));
        const tall = box.height;

        box.removeItem(0);
        box.removeItem(0);

        expect(box.height).toBeLessThan(tall);
    });

    it('reports the content width for a horizontal content-sized box', () =>
    {
        const box = new ScrollBox({ height: 200, type: 'horizontal' });

        for (let i = 0; i < 4; i++) box.addItem(g(50, 180));

        expect(box.width).toBe((box as any).listWidth);
    });

    it('leaves an explicitly sized box alone', () =>
    {
        const box = new ScrollBox({ width: 200, height: 150 });

        for (let i = 0; i < 5; i++) box.addItem(g(180, 40));

        expect(box.width).toBe(200);
        expect(box.height).toBe(150);
    });
});

describe('#272 FancyButton.text with a zero', () =>
{
    it('renders a numeric zero', () =>
    {
        const button = new FancyButton({ defaultView: g(100, 50), text: 'x' });

        button.text = 0 as any;

        expect(button.text).toBe('0');
        expect(button.textView).toBeDefined();
    });

    it('renders a zero passed to the constructor', () =>
    {
        const button = new FancyButton({ defaultView: g(100, 50), text: 0 as any });

        expect(button.text).toBe('0');
    });

    it('still clears the label for an empty string', () =>
    {
        const button = new FancyButton({ defaultView: g(100, 50), text: 'x' });

        button.text = '';

        expect(button.textView).toBeUndefined();
    });
});

describe('#271 an explicit size beats content sizing', () =>
{
    it('honours a height assigned after construction', () =>
    {
        const box = new ScrollBox({ width: 200 });

        for (let i = 0; i < 3; i++) box.addItem(g(180, 40));
        box.height = 500;

        expect(box.height).toBe(500);
    });

    it('keeps that height when more content arrives', () =>
    {
        const box = new ScrollBox({ width: 200 });

        for (let i = 0; i < 3; i++) box.addItem(g(180, 40));
        box.height = 500;
        box.addItem(g(180, 40));

        expect(box.height).toBe(500);
    });

    it('honours setSize on a content-sized box', () =>
    {
        const box = new ScrollBox({ width: 200 });

        for (let i = 0; i < 3; i++) box.addItem(g(180, 40));
        box.setSize(300, 400);
        box.addItem(g(180, 40));

        expect(box.width).toBe(300);
        expect(box.height).toBe(400);
    });
});

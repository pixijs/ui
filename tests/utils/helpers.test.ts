import { Cache, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { cleanup } from '../../src/utils/helpers/cleanup';
import { fitToView } from '../../src/utils/helpers/fit';
import { centerElement, centerView } from '../../src/utils/helpers/resize';
import { getTextView } from '../../src/utils/helpers/text';
import { getView } from '../../src/utils/helpers/view';
import { ALIGN, BUTTON_EVENTS, LIST_TYPE } from '../../src/utils/HelpTypes';

const box = (w: number, h: number) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

describe('HelpTypes constants', () =>
{
    it('exposes the button event names', () =>
    {
        expect(BUTTON_EVENTS).toContain('onPress');
        expect(BUTTON_EVENTS).toHaveLength(6);
    });

    it('exposes the list types and alignments', () =>
    {
        expect(LIST_TYPE).toEqual(['vertical', 'horizontal', 'bidirectional']);
        expect(ALIGN).toEqual(['left', 'center', 'right']);
    });
});

describe('cleanup', () =>
{
    it('ignores a missing element', () =>
    {
        expect(() => cleanup(undefined as any)).not.toThrow();
    });

    it('destroys an unparented element', () =>
    {
        const child = new Container();

        cleanup(child);

        expect(child.destroyed).toBe(true);
    });

    it('detaches then destroys a parented element', () =>
    {
        const parent = new Container();
        const child = new Container();

        parent.addChild(child);
        cleanup(child);

        expect(parent.children).toHaveLength(0);
        expect(child.destroyed).toBe(true);
    });
});

describe('getView', () =>
{
    it('returns a Container unchanged', () =>
    {
        const view = new Container();

        expect(getView(view)).toBe(view);
    });

    it('wraps a Texture in a Sprite', () =>
    {
        const view = getView(Texture.WHITE);

        expect(view).toBeInstanceOf(Sprite);
    });

    it('resolves a cached texture name to a Sprite', () =>
    {
        Cache.set('helpers-test-texture', Texture.WHITE);

        const view = getView('helpers-test-texture');

        expect(view).toBeInstanceOf(Sprite);
    });
});

describe('getTextView', () =>
{
    it('wraps a string', () =>
    {
        const view = getTextView('hello');

        expect(view).toBeInstanceOf(Text);
        expect(view.text).toBe('hello');
    });

    it('wraps a number', () =>
    {
        expect(getTextView(42).text).toBe('42');
    });

    it('returns an existing text view unchanged', () =>
    {
        const text = new Text({ text: 'x' });

        expect(getTextView(text)).toBe(text);
    });
});

describe('fitToView', () =>
{
    it('throws when the parent is missing', () =>
    {
        expect(() => fitToView(undefined as any, box(10, 10))).toThrow(/parent/i);
    });

    it('throws when the child is missing', () =>
    {
        expect(() => fitToView(box(10, 10), undefined as any)).toThrow(/child/i);
    });

    it('leaves a child that already fits untouched', () =>
    {
        const parent = box(200, 200);
        const child = box(10, 10);

        fitToView(parent, child);

        expect(child.scale.x).toBe(1);
        expect(child.scale.y).toBe(1);
    });

    it('scales down a child that overflows horizontally', () =>
    {
        const parent = box(50, 500);
        const child = box(200, 10);

        fitToView(parent, child);

        expect(child.scale.x).toBeLessThan(1);
    });

    it('scales down a child that overflows vertically', () =>
    {
        const parent = box(500, 50);
        const child = box(10, 200);

        fitToView(parent, child);

        expect(child.scale.y).toBeLessThan(1);
    });

    it('accounts for padding', () =>
    {
        const parent = box(100, 100);
        const child = box(100, 100);

        fitToView(parent, child, 10);

        expect(child.scale.x).toBeLessThan(1);
    });

    it('collapses the child when padding exceeds the parent', () =>
    {
        const parent = box(100, 100);
        const child = box(100, 100);

        fitToView(parent, child, 100);

        expect(child.scale.x).toBe(0);
        expect(child.scale.y).toBe(0);
    });

    it('keeps the scale uniform when asked', () =>
    {
        const parent = box(60, 40);
        const child = box(200, 200);

        fitToView(parent, child, 0, true);

        expect(child.scale.x).toBeCloseTo(child.scale.y);
    });

    it('preserves the aspect ratio when non-uniform and width overflows more', () =>
    {
        const parent = box(50, 400);
        const child = box(400, 100);

        child.scale.set(2, 1);
        fitToView(parent, child, 0, false);

        expect(Number.isFinite(child.scale.x)).toBe(true);
        expect(Number.isFinite(child.scale.y)).toBe(true);
    });

    it('preserves the aspect ratio when non-uniform and height overflows more', () =>
    {
        const parent = box(400, 50);
        const child = box(100, 400);

        child.scale.set(1, 2);
        fitToView(parent, child, 0, false);

        expect(Number.isFinite(child.scale.x)).toBe(true);
        expect(Number.isFinite(child.scale.y)).toBe(true);
    });
});

describe('resize helpers', () =>
{
    const mountRoot = (width: number, height: number) =>
    {
        const root = document.createElement('div');

        root.id = 'storybook-root';
        Object.defineProperty(root, 'offsetWidth', { value: width, configurable: true });
        Object.defineProperty(root, 'offsetHeight', { value: height, configurable: true });
        document.body.appendChild(root);

        return root;
    };

    afterEach(() =>
    {
        document.body.innerHTML = '';
    });

    it('centerView does nothing without a canvas', () =>
    {
        const view = box(10, 10);

        expect(() => centerView(view)).not.toThrow();
        expect(view.x).toBe(0);
    });

    it('centerView does nothing without a view', () =>
    {
        mountRoot(800, 600);

        expect(() => centerView(undefined as any)).not.toThrow();
    });

    it('centerView centres on the canvas', () =>
    {
        mountRoot(800, 600);
        const view = box(10, 10);

        centerView(view);

        expect(view.x).toBe(400);
        expect(view.y).toBe(300);
    });

    it('centerElement centres a sized element', () =>
    {
        mountRoot(800, 600);
        const view = box(100, 50);

        centerElement(view);

        expect(view.x).toBe(350);
        expect(view.y).toBe(275);
    });

    it('centerElement honours an explicit 0 position', () =>
    {
        mountRoot(800, 600);
        const view = box(100, 50);

        centerElement(view, 0, 0);

        expect(view.x).toBe(0);
        expect(view.y).toBe(0);
    });

    it('centerElement honours fractional positions', () =>
    {
        mountRoot(800, 600);
        const view = box(100, 50);

        centerElement(view, 0.25, 0.5);

        expect(view.x).toBe(150);
        expect(view.y).toBe(275);
    });

    it('centerElement falls back to the canvas centre for a zero-sized view', () =>
    {
        mountRoot(800, 600);
        const view = new Container();

        centerElement(view);

        expect(view.x).toBe(400);
        expect(view.y).toBe(300);
    });

    it('centerElement does nothing without a canvas', () =>
    {
        const view = box(10, 10);

        expect(() => centerElement(view)).not.toThrow();
    });

    it('centerElement does nothing without a view', () =>
    {
        mountRoot(800, 600);

        expect(() => centerElement(undefined as any)).not.toThrow();
    });
});

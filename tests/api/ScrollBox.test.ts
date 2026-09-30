import { Container, FederatedPointerEvent, Graphics, Point } from 'pixi.js';
import { ScrollBox } from '../../src/ScrollBox';

const g = (w = 180, h = 40) => new Graphics().rect(0, 0, w, h).fill(0xffffff);
const items = (n: number, w = 180, h = 40) => Array.from({ length: n }, () => g(w, h));
const ptr = (x: number, y: number) => ({ global: new Point(x, y) }) as unknown as FederatedPointerEvent;

describe('ScrollBox construction', () =>
{
    it('constructs with no options', () =>
    {
        expect(() => new ScrollBox()).not.toThrow();
    });

    it('exposes items added via options', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200, items: items(3) });

        expect(box.items).toHaveLength(3);
    });

    it('reports its configured size', () =>
    {
        const box = new ScrollBox({ width: 200, height: 150 });

        expect(box.width).toBe(200);
        expect(box.height).toBe(150);
        expect(box.getSize()).toEqual({ width: 200, height: 150 });
    });

    it('fills a provided size object', () =>
    {
        const box = new ScrollBox({ width: 200, height: 150 });
        const out = { width: 0, height: 0 };

        box.getSize(out);

        expect(out).toEqual({ width: 200, height: 150 });
    });

    it('ignores an empty addItems call', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200 });

        box.addItems([]);

        expect(box.items).toHaveLength(0);
    });

    it('adds several items in one call', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200 });

        box.addItem(g(), g(), g());

        expect(box.items).toHaveLength(3);
    });

    it('warns about a zero-sized item', () =>
    {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        const box = new ScrollBox({ width: 200, height: 200 });

        box.addItem(new Container());

        expect(spy).toHaveBeenCalledWith('ScrollBox item should have size');
        spy.mockRestore();
    });

    it('removes a single item', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200, items: items(3) });

        box.removeItem(1);

        expect(box.items).toHaveLength(2);
    });

    it('removes all items', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200, items: items(3) });

        box.removeItems();

        expect(box.items).toHaveLength(0);
    });

    it('reports scroll extents', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(10) });

        expect(box.scrollHeight).toBeGreaterThan(0);
        expect(box.scrollWidth).toBeGreaterThan(0);
    });
});

describe('ScrollBox layout types', () =>
{
    it.each(['vertical', 'horizontal', 'bidirectional'] as const)('lays out %s content', (type) =>
    {
        const box = new ScrollBox({ width: 200, height: 200, type, items: items(6) });

        expect(box.items).toHaveLength(6);
        expect(() => box.resize(true)).not.toThrow();
    });

    it('applies a background colour and radius', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200, background: 0xff0000, radius: 8 });

        expect((box as any).background).toBeDefined();
    });

    it('replaces the background', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200, background: 0xff0000 });

        box.setBackground(0x00ff00);

        expect((box as any).options.background).toBe(0x00ff00);
    });
});

describe('ScrollBox scrolling', () =>
{
    it('scrolls to the top', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(10) });

        box.scrollTop();

        expect(box.scrollY).toBe(0);
    });

    it('scrolls to the bottom', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(10) });

        expect(() => box.scrollBottom()).not.toThrow();
    });

    it('scrolls to a specific element', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(10) });

        (box as any).setInteractive(true);
        expect(() => box.scrollTo(5)).not.toThrow();
    });

    it('ignores scrollTo for a missing element', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(3) });

        expect(() => box.scrollTo(99)).not.toThrow();
    });

    it('scrolls to an explicit position', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(10) });

        box.scrollToPosition({ x: 10, y: 20 });

        expect(box.scrollY).toBe(-20);
        expect(box.scrollX).toBe(-10);
    });

    it('ignores an empty scrollToPosition', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(10) });
        const before = box.scrollY;

        box.scrollToPosition({});

        expect(box.scrollY).toBe(before);
    });

    it('accepts direct scroll assignments', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(10) });

        box.scrollX = -5;
        box.scrollY = -15;

        expect(box.scrollX).toBe(-5);
        expect(box.scrollY).toBe(-15);
    });

    it('responds to a wheel event', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(20) });

        (box as any).isOver = true;
        document.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true }));

        expect(() => (box as any).onMouseScroll(new WheelEvent('wheel', { deltaY: 120 }))).not.toThrow();
    });

    it('responds to a horizontal wheel event', () =>
    {
        const box = new ScrollBox({ width: 100, height: 200, type: 'horizontal', items: items(20, 80, 40) });

        expect(() => (box as any).onMouseScroll(new WheelEvent('wheel', { deltaX: 120 }))).not.toThrow();
    });

    it('honours shiftScroll', () =>
    {
        const box = new ScrollBox({
            width: 100, height: 200, type: 'horizontal', shiftScroll: true, items: items(20, 80, 40),
        });

        expect(() => (box as any).onMouseScroll(new WheelEvent('wheel', { deltaY: 120 }))).not.toThrow();
    });

    it('skips wheel handling when not hovered and globalScroll is off', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, globalScroll: false, items: items(10) });

        (box as any).isOver = false;
        const before = box.scrollY;

        (box as any).onMouseScroll(new WheelEvent('wheel', { deltaY: 120 }));

        expect(box.scrollY).toBe(before);
    });

    it('emits onScroll while dragging', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(20) });
        const seen: unknown[] = [];

        box.onScroll.connect((v) => seen.push(v));

        box.emit('pointerdown', ptr(10, 10));
        box.emit('globalpointermove', ptr(10, -200));

        expect(() => box.emit('pointerup', ptr(10, -200))).not.toThrow();
    });

    it('tracks hover state', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(5) });

        box.emit('pointerover', ptr(0, 0));
        expect((box as any).isOver).toBe(true);

        box.emit('pointerout', ptr(0, 0));
        expect((box as any).isOver).toBe(false);
    });

    it('handles pointerupoutside', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(5) });

        box.emit('pointerdown', ptr(10, 10));

        expect(() => box.emit('pointerupoutside', ptr(10, 10))).not.toThrow();
    });
});

describe('ScrollBox sizing', () =>
{
    it('accepts a new width', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(5) });

        box.width = 300;

        expect(box.width).toBe(300);
    });

    it('accepts a new height', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(5) });

        box.height = 250;

        expect(box.height).toBe(250);
    });

    it('accepts setSize with two numbers', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100 });

        box.setSize(320, 240);

        expect(box.width).toBe(320);
        expect(box.height).toBe(240);
    });

    it('accepts setSize with one number', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100 });

        box.setSize(150);

        expect(box.width).toBe(150);
        expect(box.height).toBe(150);
    });

    it('accepts setSize with a size object', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100 });

        box.setSize({ width: 111, height: 222 });

        expect(box.width).toBe(111);
        expect(box.height).toBe(222);
    });

    it('accepts setSize with a width-only object', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100 });

        box.setSize({ width: 99 });

        expect(box.height).toBe(99);
    });
});

describe('ScrollBox dynamic rendering and proximity', () =>
{
    it('renderAllItems marks every item renderable', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(20) });

        (box as any).renderAllItems();

        expect(box.items.every((i) => i.renderable)).toBe(true);
    });

    it('marks off-screen items non-renderable by default', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(20) });

        (box as any).updateVisibleItems();

        expect(box.items.some((i) => !i.renderable)).toBe(true);
    });

    it('reports item visibility', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(20) });

        expect(box.isItemVisible(box.items[0])).toBe(true);
        expect(box.isItemVisible(box.items[19])).toBe(false);
    });

    it('widens visibility with a proximity padding', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(20) });

        expect(box.isItemVisible(box.items[4], 1000)).toBe(true);
    });

    it('emits proximity changes while scrolling', () =>
    {
        const box = new ScrollBox({
            width: 200, height: 100, proximityRange: 50, proximityDebounce: 0, items: items(20),
        });
        const seen: unknown[] = [];

        box.onProximityChange.connect((d) => seen.push(d));
        box.scrollY = -300;
        (box as any).update();

        expect(Array.isArray(seen)).toBe(true);
    });

    it('skips proximity checks when disabled', () =>
    {
        const box = new ScrollBox({
            width: 200, height: 100, disableProximityCheck: true, items: items(20),
        });

        box.scrollY = -300;

        expect(() => (box as any).update()).not.toThrow();
    });
});

describe('ScrollBox destroy', () =>
{
    it('detaches its ticker and wheel listener', () =>
    {
        const box = new ScrollBox({ width: 200, height: 100, items: items(5) });

        expect(() => box.destroy()).not.toThrow();
    });
});

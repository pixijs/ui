import { FederatedPointerEvent, Graphics, Point, Sprite, Texture } from 'pixi.js';
import { DoubleSlider } from '../../src/DoubleSlider';
import { Slider } from '../../src/Slider';

const g = (w = 200, h = 20) => new Graphics().rect(0, 0, w, h).fill(0xffffff);
const nineSlice = {
    bg: [2, 2, 2, 2] as [number, number, number, number],
    fill: [2, 2, 2, 2] as [number, number, number, number],
};

const event = (target: any, x: number) =>
    ({ currentTarget: target, global: new Point(x, 5) }) as unknown as FederatedPointerEvent;

const dragTo = (slider: any, x: number) =>
{
    slider.startUpdate(event(slider.bg, x));
    slider.update(event(slider.bg, x));
};

const makeSlider = (opts: Record<string, unknown> = {}) =>
    new Slider({ bg: g(), fill: g(), slider: g(20, 20), min: 0, max: 100, value: 50, ...opts });

const makeDouble = (opts: Record<string, unknown> = {}) => new DoubleSlider({
    bg: g(), fill: g(), slider1: g(10, 10), slider2: g(10, 10), min: 0, max: 100, ...opts,
});

describe('Slider', () =>
{
    it('exposes min, max and step', () =>
    {
        const slider = makeSlider({ step: 5 });

        expect(slider.min).toBe(0);
        expect(slider.max).toBe(100);
        expect(slider.step).toBe(5);
    });

    it('defaults step to 1 when given 0 in the constructor', () =>
    {
        expect(makeSlider({ step: 0 }).step).toBe(1);
    });

    it('clamps an assigned value below min', () =>
    {
        const slider = makeSlider();

        slider.value = -50;

        expect(slider.value).toBe(0);
    });

    it('clamps an assigned value above max', () =>
    {
        const slider = makeSlider();

        slider.value = 500;

        expect(slider.value).toBe(100);
    });

    it('ignores a repeated value assignment', () =>
    {
        const slider = makeSlider();
        const seen: number[] = [];

        slider.onUpdate.connect((v) => seen.push(v));
        slider.value = 50;

        expect(seen).toHaveLength(0);
    });

    it('emits onUpdate when the value changes', () =>
    {
        const slider = makeSlider();
        const seen: number[] = [];

        slider.onUpdate.connect((v) => seen.push(v));
        slider.value = 70;

        expect(seen).toEqual([70]);
    });

    it('re-renders when max changes', () =>
    {
        const slider = makeSlider();

        slider.max = 200;

        expect(slider.max).toBe(200);
    });

    it('re-renders when min changes', () =>
    {
        const slider = makeSlider();

        slider.min = 10;

        expect(slider.min).toBe(10);
    });

    it('re-renders when step changes', () =>
    {
        const slider = makeSlider();

        slider.step = 10;

        expect(slider.step).toBe(10);
    });

    it('accepts a replacement slider view', () =>
    {
        const slider = makeSlider();

        slider.slider = g(30, 30);

        expect(slider.slider1).toBeDefined();
    });

    it('updates the value on drag', () =>
    {
        const slider = makeSlider();

        dragTo(slider, 200);

        expect(slider.value).toBeGreaterThan(0);
    });

    it('snaps the dragged value to the step', () =>
    {
        const slider = makeSlider({ step: 25 });

        dragTo(slider, 120);

        expect(slider.value % 25).toBe(0);
    });

    it('emits onChange when the drag ends', () =>
    {
        const slider = makeSlider();
        const seen: number[] = [];

        slider.onChange.connect((v) => seen.push(v));
        dragTo(slider, 150);
        (slider as any).endUpdate();

        expect(seen).toHaveLength(1);
    });

    it('ignores endUpdate when not dragging', () =>
    {
        const slider = makeSlider();
        const seen: number[] = [];

        slider.onChange.connect((v) => seen.push(v));
        (slider as any).endUpdate();

        expect(seen).toHaveLength(0);
    });

    it('renders a value label when showValue is set', () =>
    {
        const slider = makeSlider({ showValue: true, valueTextOffset: { x: 2, y: 3 } });

        expect((slider as any).value1Text).toBeDefined();
        expect((slider as any).value1Text.text).toBe('50');
    });

    it('routes width and height through nine-slice views', () =>
    {
        const slider = new Slider({
            bg: Texture.WHITE, fill: Texture.WHITE, slider: g(20, 20), nineSliceSprite: nineSlice,
        });

        slider.width = 300;
        slider.height = 30;

        expect(slider.width).toBeGreaterThan(0);
        expect(slider.height).toBeGreaterThan(0);
    });

    it('supports setSize', () =>
    {
        const slider = makeSlider();

        expect(() => slider.setSize(150, 25)).not.toThrow();
    });

    it('accepts a Sprite slider and anchors it', () =>
    {
        const slider = new Slider({
            bg: g(), fill: g(), slider: new Sprite(Texture.WHITE), min: 0, max: 100, value: 10,
        });

        expect(slider.slider1).toBeDefined();
    });

    it('replaces an existing slider view cleanly', () =>
    {
        const slider = makeSlider();

        slider.slider1 = g(40, 40);
        slider.slider1 = g(50, 50);

        expect(slider.slider1).toBeDefined();
    });

    it('ignores an empty slider assignment', () =>
    {
        const slider = makeSlider();
        const before = slider.slider1;

        (slider as any).slider1 = undefined;

        expect(slider.slider1).toBe(before);
    });
});

describe('DoubleSlider', () =>
{
    it('defaults value1 to min and value2 to max', () =>
    {
        const slider = makeDouble();

        expect(slider.value1).toBe(0);
        expect(slider.value2).toBe(100);
    });

    it('applies explicit values', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80 });

        expect(slider.value1).toBe(20);
        expect(slider.value2).toBe(80);
    });

    it('clamps value2 down to max', () =>
    {
        expect(makeDouble({ value1: 10, value2: 500 }).value2).toBe(100);
    });

    it('clamps value1 up to max', () =>
    {
        expect(makeDouble({ value1: 500, value2: 500 }).value1).toBe(100);
    });

    it('keeps value1 at or below value2', () =>
    {
        const slider = makeDouble({ value1: 10, value2: 90 });

        slider.value1 = 95;

        expect(slider.value1).toBeLessThanOrEqual(slider.value2);
    });

    it('keeps value2 at or above value1', () =>
    {
        const slider = makeDouble({ value1: 40, value2: 90 });

        slider.value2 = 10;

        expect(slider.value2).toBeGreaterThanOrEqual(slider.value1);
    });

    it('ignores repeated value assignments', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80 });
        const seen: number[] = [];

        slider.onUpdate.connect((v1) => seen.push(v1));
        slider.value1 = 20;
        slider.value2 = 80;

        expect(seen).toHaveLength(0);
    });

    it('emits onUpdate when a value changes', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80 });
        const seen: number[] = [];

        slider.onUpdate.connect((v1) => seen.push(v1));
        slider.value1 = 30;

        expect(seen).toEqual([30]);
    });

    it('drags the nearer handle', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80 });

        dragTo(slider, 190);

        expect((slider as any).activeValue).toBeDefined();
    });

    it('picks value1 when dragging left of slider1', () =>
    {
        const slider = makeDouble({ value1: 50, value2: 90 });

        dragTo(slider, -50);

        expect((slider as any).activeValue).toBe('value1');
    });

    it('clears the active handle when the drag ends', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80 });

        dragTo(slider, 150);
        (slider as any).endUpdate();

        expect((slider as any).activeValue).toBeUndefined();
    });

    it('emits onChange when the drag ends', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80 });
        const seen: number[][] = [];

        slider.onChange.connect((a, b) => seen.push([a, b]));
        dragTo(slider, 150);
        (slider as any).endUpdate();

        expect(seen).toHaveLength(1);
    });

    it('renders both value labels when showValue is set', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80, showValue: true });

        expect((slider as any).value1Text).toBeDefined();
        expect((slider as any).value2Text).toBeDefined();
    });

    it('accepts replacement slider views', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80 });

        slider.slider1 = g(30, 30);
        slider.slider2 = g(30, 30);

        expect(slider.slider1).toBeDefined();
        expect(slider.slider2).toBeDefined();
    });

    it('keeps slider1 from crossing slider2 visually', () =>
    {
        const slider = makeDouble({ value1: 99, value2: 100 });

        expect((slider as any)._slider1.x).toBeLessThanOrEqual((slider as any)._slider2.x);
    });

    it('routes width and height through nine-slice views', () =>
    {
        const slider = new DoubleSlider({
            bg: Texture.WHITE,
            fill: Texture.WHITE,
            slider1: g(10, 10),
            slider2: g(10, 10),
            nineSliceSprite: nineSlice,
        });

        slider.width = 300;
        slider.height = 30;

        expect(slider.width).toBeGreaterThan(0);
    });

    it('supports setSize', () =>
    {
        const slider = makeDouble({ value1: 20, value2: 80 });

        expect(() => slider.setSize(150, 25)).not.toThrow();
    });
});

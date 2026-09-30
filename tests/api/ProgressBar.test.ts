import { Graphics, NineSliceSprite, Sprite, Texture } from 'pixi.js';
import { ProgressBar } from '../../src/ProgressBar';

const g = (w = 200, h = 20) => new Graphics().rect(0, 0, w, h).fill(0xffffff);
const nineSlice = { bg: [2, 2, 2, 2] as [number, number, number, number], fill: [2, 2, 2, 2] as [number, number, number, number] };

describe('ProgressBar defaults', () =>
{
    it('constructs with no options at all', () =>
    {
        const bar = new ProgressBar();

        expect(bar.progress).toBe(0);
    });

    it('applies an initial progress', () =>
    {
        expect(new ProgressBar({ bg: g(), fill: g(), progress: 40 }).progress).toBe(40);
    });

    it('clamps progress below zero', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g() });

        bar.progress = -20;

        expect(bar.progress).toBe(0);
    });

    it('clamps progress above 100', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g() });

        bar.progress = 180;

        expect(bar.progress).toBe(100);
    });

    it('rounds fractional progress', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g() });

        bar.progress = 33.7;

        expect(bar.progress).toBe(34);
    });

    it('applies fill paddings', () =>
    {
        const bar = new ProgressBar({
            bg: g(), fill: g(), fillPaddings: { left: 5, top: 3, right: 5, bottom: 3 },
        });

        expect((bar as any).fill.x).toBe(5);
        expect((bar as any).fill.y).toBe(3);
    });

    it('warns when bg and fill share a Sprite instance', () =>
    {
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        const shared = new Sprite(Texture.WHITE);

        // eslint-disable-next-line no-new
        new ProgressBar({ bg: shared, fill: shared });

        expect(spy).toHaveBeenCalledWith('Can not use same Sprite instance for bg and fill.');
        spy.mockRestore();
    });
});

describe('ProgressBar with nineSliceSprite', () =>
{
    it('builds a NineSliceSprite bg from a Texture', () =>
    {
        const bar = new ProgressBar({ bg: Texture.WHITE, fill: Texture.WHITE, nineSliceSprite: nineSlice });

        expect((bar as any).bg).toBeInstanceOf(NineSliceSprite);
        expect((bar as any).fill).toBeInstanceOf(NineSliceSprite);
    });

    it('warns and falls back when given a Container bg', () =>
    {
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        const bar = new ProgressBar({ bg: g(), fill: g(), nineSliceSprite: nineSlice });

        expect(spy).toHaveBeenCalled();
        expect((bar as any).bg).toBeInstanceOf(Graphics);
        spy.mockRestore();
    });

    it('routes width through the nine-slice views', () =>
    {
        const bar = new ProgressBar({ bg: Texture.WHITE, fill: Texture.WHITE, nineSliceSprite: nineSlice });

        bar.width = 300;

        expect((bar as any).bg.width).toBe(300);
        expect(bar.width).toBeGreaterThan(0);
    });

    it('routes height through the nine-slice views', () =>
    {
        const bar = new ProgressBar({ bg: Texture.WHITE, fill: Texture.WHITE, nineSliceSprite: nineSlice });

        bar.height = 40;

        expect((bar as any).bg.height).toBe(40);
    });

    it('subtracts fill paddings from the nine-slice fill width', () =>
    {
        const bar = new ProgressBar({
            bg: Texture.WHITE,
            fill: Texture.WHITE,
            nineSliceSprite: nineSlice,
            fillPaddings: { left: 10, right: 10 },
        });

        bar.width = 200;

        expect((bar as any).fill.width).toBe(180);
    });

    it('accepts setSize with a number', () =>
    {
        const bar = new ProgressBar({ bg: Texture.WHITE, fill: Texture.WHITE, nineSliceSprite: nineSlice });

        bar.setSize(120);

        expect((bar as any).bg.width).toBe(120);
    });

    it('accepts setSize with width and height', () =>
    {
        const bar = new ProgressBar({ bg: Texture.WHITE, fill: Texture.WHITE, nineSliceSprite: nineSlice });

        bar.setSize(120, 60);

        expect((bar as any).bg.height).toBe(60);
    });

    it('accepts setSize with a size object', () =>
    {
        const bar = new ProgressBar({ bg: Texture.WHITE, fill: Texture.WHITE, nineSliceSprite: nineSlice });

        bar.setSize({ width: 150, height: 75 });

        expect((bar as any).bg.width).toBe(150);
    });

    it('accepts setSize with a width-only size object', () =>
    {
        const bar = new ProgressBar({ bg: Texture.WHITE, fill: Texture.WHITE, nineSliceSprite: nineSlice });

        bar.setSize({ width: 90 });

        expect((bar as any).bg.width).toBe(90);
    });
});

describe('ProgressBar without nineSliceSprite', () =>
{
    it('falls back to Container sizing for width', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g() });

        bar.width = 300;

        expect(bar.width).toBeCloseTo(300, 0);
    });

    it('falls back to Container sizing for height', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g() });

        bar.height = 60;

        expect(bar.height).toBeCloseTo(60, 0);
    });

    it('falls back to Container sizing for setSize', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g() });

        expect(() => bar.setSize(100, 50)).not.toThrow();
    });
});

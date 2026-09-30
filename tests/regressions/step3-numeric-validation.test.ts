/**
 * Step 3 regressions: numeric inputs that reach arithmetic without a finite
 * check, producing NaN / Infinity in rendered state.
 *
 * Only cases confirmed to be observably broken are listed here. Two related
 * parity issues (DoubleSlider's missing `|| 1` on bg width, List's NaN maxWidth
 * when unparented) are cleaned up in the same PR but are NOT defects — both are
 * already clamped downstream, so they get no regression test.
 */
import { FederatedPointerEvent, Graphics, Point } from 'pixi.js';
import { CircularProgressBar } from '../../src/CircularProgressBar';
import { FancyButton } from '../../src/FancyButton';
import { ProgressBar } from '../../src/ProgressBar';
import { Slider } from '../../src/Slider';

const g = (w = 200, h = 20) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

const makeSlider = (opts: Record<string, unknown> = {}) =>
    new Slider({ bg: g(), fill: g(), slider: g(20, 20), min: 0, max: 100, value: 50, ...opts });

/** Drives the protected drag handler the way a pointer would. */
const drag = (slider: any, x: number) =>
{
    const event = { currentTarget: slider.bg, global: new Point(x, 5) } as unknown as FederatedPointerEvent;

    slider.startUpdate(event);
};

describe('Slider.step', () =>
{
    it('coerces a zero step to 1, as the constructor already does', () =>
    {
        const slider = makeSlider();

        slider.step = 0;

        expect(slider.step).toBe(1);
    });

    it('keeps value finite when dragged after step was set to 0', () =>
    {
        const slider = makeSlider();

        slider.step = 0;
        drag(slider, 100);

        expect(Number.isFinite(slider.value)).toBe(true);
    });

    it('rejects a non-finite step', () =>
    {
        const slider = makeSlider();

        slider.step = NaN;

        expect(Number.isFinite(slider.step)).toBe(true);
    });
});

describe('Slider with a collapsed range (min === max)', () =>
{
    it('keeps progress finite when min, max and value all coincide', () =>
    {
        const slider = makeSlider({ value: 50 });

        slider.max = 50;
        slider.min = 50;

        expect(Number.isNaN(slider.progress)).toBe(false);
    });
});

describe('ProgressBar.progress', () =>
{
    it('clamps a NaN progress instead of storing it', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g(), progress: 50 });

        bar.progress = NaN;

        expect(bar.progress).toBe(0);
    });

    it('clamps an Infinite progress to 100', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g(), progress: 50 });

        bar.progress = Infinity;

        expect(bar.progress).toBe(100);
    });
});

describe('CircularProgressBar.progress', () =>
{
    it('clamps a NaN progress instead of storing it', () =>
    {
        const bar = new CircularProgressBar({ backgroundColor: 0x000000, radius: 50, lineWidth: 5, value: 50 });

        bar.progress = NaN;

        expect(bar.progress).toBe(0);
    });
});

describe('FancyButton contentFittingMode: "fill"', () =>
{
    it('keeps icon scale finite when the icon has no size', () =>
    {
        const button = new FancyButton({
            defaultView: g(100, 100),
            icon: new Graphics(),
            contentFittingMode: 'fill',
        });

        expect(Number.isFinite(button.iconView?.scale.x)).toBe(true);
        expect(Number.isFinite(button.iconView?.scale.y)).toBe(true);
    });
});

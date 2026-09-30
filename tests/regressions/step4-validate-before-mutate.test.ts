/**
 * Step 4 regressions: state is mutated (destroyed, hidden, overwritten) BEFORE
 * the validation that decides whether the mutation was legal.
 *
 * This is the same defect shape PR #255 fixed in fitToView by deferring the
 * scale reads until after the parent/child checks.
 *
 * These change observable behaviour — see the PR description.
 */
import { Graphics, Sprite, Texture } from 'pixi.js';
import { CheckBox } from '../../src/CheckBox';
import { DoubleSlider } from '../../src/DoubleSlider';
import { FancyButton } from '../../src/FancyButton';
import { Input } from '../../src/Input';
import { ProgressBar } from '../../src/ProgressBar';
import { Switcher } from '../../src/Switcher';

const g = (w = 200, h = 20) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

describe('ProgressBar.setBackground', () =>
{
    it.failing('adopts the new background on a second call', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g(), progress: 50 });
        const replacement = g(50, 10);

        bar.setBackground(replacement);

        expect((bar as any).bg).toBe(replacement);
    });

    it.failing('does not re-parent a destroyed background', () =>
    {
        const bar = new ProgressBar({ bg: g(), fill: g(), progress: 50 });

        bar.setBackground(g(50, 10));

        expect((bar as any).bg.destroyed).toBe(false);
    });
});

describe('ProgressBar.setFill', () =>
{
    it.failing('leaves the existing fill intact when rejecting a shared bg instance', () =>
    {
        const shared = new Sprite(Texture.WHITE);
        const bar = new ProgressBar({ bg: shared, fill: g(), progress: 50 });
        const originalFill = (bar as any).fill;

        bar.setFill(shared);

        expect((bar as any).fill).toBe(originalFill);
        expect((bar as any).fill.destroyed).toBe(false);
    });
});

describe('Input.bg setter', () =>
{
    it.failing('adopts the new background on a second assignment', () =>
    {
        const input = new Input({ bg: g() });
        const replacement = g(50, 10);

        input.bg = replacement;

        expect(input.bg).toBe(replacement);
    });

    it.failing('does not re-parent a destroyed background', () =>
    {
        const input = new Input({ bg: g() });

        input.bg = g(50, 10);

        expect((input.bg as any).destroyed).toBe(false);
    });
});

describe('Switcher.forceSwitch', () =>
{
    it.failing('leaves the visible view untouched when the id is invalid', () =>
    {
        const switcher = new Switcher([g(), g()]);

        switcher.forceSwitch(0);
        const before = switcher.views.map((v) => v.visible);

        expect(() => switcher.forceSwitch(99)).toThrow();
        expect(switcher.views.map((v) => v.visible)).toEqual(before);
    });
});

describe('DoubleSlider.validateValues', () =>
{
    const makeDouble = (opts: Record<string, unknown>) => new DoubleSlider({
        bg: g(), fill: g(), slider1: g(10, 10), slider2: g(10, 10), ...opts,
    });

    it.failing('preserves an explicit value1 of 0 when min is negative', () =>
    {
        const slider = makeDouble({ min: -50, max: 100, value1: 0, value2: 50 });

        expect(slider.value1).toBe(0);
    });

    it.failing('preserves an explicit value2 of 0', () =>
    {
        const slider = makeDouble({ min: -50, max: 100, value1: -20, value2: 0 });

        expect(slider.value2).toBe(0);
    });

    it('clamps to min before ordering, so value2 >= value1 >= min', () =>
    {
        const slider = makeDouble({ min: 0, max: 100, value1: -100, value2: -50 });

        expect(slider.value1).toBeGreaterThanOrEqual(0);
        expect(slider.value2).toBeGreaterThanOrEqual(slider.value1);
    });
});

describe('Input.onPaste', () =>
{
    it.failing('truncates pasted text to maxLength', () =>
    {
        const input = new Input({ bg: g(), maxLength: 5 });

        (input as any)._startEditing();
        (input as any).onPaste({
            preventDefault: () => undefined,
            clipboardData: { getData: () => '0123456789' },
        });

        expect(input.value.length).toBeLessThanOrEqual(5);
    });
});

describe('FancyButton default anchors', () =>
{
    it.failing('defaults a missing anchor axis to 0.5, not 1', () =>
    {
        const button = new FancyButton({ defaultView: g(100, 100), text: 'hi' });

        button.defaultTextAnchor = { x: 0.2 };

        expect((button as any)._defaultTextAnchor).toEqual({ x: 0.2, y: 0.5 });
    });
});

describe('CheckBox.textOffset', () =>
{
    it.failing('positions the label even when no text style is supplied', () =>
    {
        const box = new CheckBox({
            style: { checked: g(), unchecked: g(), textOffset: { x: 5, y: 6 } },
            text: 'a',
        });

        expect(box.labelText?.x).toBeGreaterThan(0);
    });
});

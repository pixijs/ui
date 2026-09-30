/**
 * Step 1 regressions: outright crashes and copy/paste errors.
 *
 * These assert the CORRECT behaviour. On the baseline branch they are marked
 * `it.failing`, which passes only while the bug is still present; the fix PR
 * flips them to `it` without editing a single assertion.
 */
import { Graphics } from 'pixi.js';
import { CheckBox } from '../../src/CheckBox';
import { CircularProgressBar } from '../../src/CircularProgressBar';
import { FancyButton } from '../../src/FancyButton';
import { RadioGroup } from '../../src/RadioGroup';
import { Trackpad } from '../../src/utils/trackpad/Trackpad';

const g = () => new Graphics().rect(0, 0, 100, 50).fill(0xffffff);

const makeCheckBox = (text: string) =>
    new CheckBox({ style: { checked: g(), unchecked: g() }, text });

describe('FancyButton: base scale/anchor getters must not recurse', () =>
{
    it.failing('defaultTextScale returns the configured scale', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'hi', defaultTextScale: 0.5 });

        expect(button.defaultTextScale).toEqual({ x: 0.5, y: 0.5 });
    });

    it.failing('defaultIconScale returns the configured scale', () =>
    {
        const button = new FancyButton({ defaultView: g(), icon: g(), defaultIconScale: 0.25 });

        expect(button.defaultIconScale).toEqual({ x: 0.25, y: 0.25 });
    });

    it.failing('defaultTextAnchor returns the configured anchor', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'hi', defaultTextAnchor: 0.25 });

        expect(button.defaultTextAnchor).toEqual({ x: 0.25, y: 0.25 });
    });

    it.failing('defaultIconAnchor returns the configured anchor', () =>
    {
        const button = new FancyButton({ defaultView: g(), icon: g(), defaultIconAnchor: 0.25 });

        expect(button.defaultIconAnchor).toEqual({ x: 0.25, y: 0.25 });
    });
});

describe('Trackpad: update() must set both axes, min and max', () =>
{
    it.failing('maps bounds and frame onto xAxis/yAxis min and max', () =>
    {
        const trackpad = new Trackpad({});

        trackpad.setBounds(0, 500, 0, 800);
        trackpad.resize(200, 300);
        trackpad.update();

        expect(trackpad.xAxis.min).toBe(0);
        expect(trackpad.xAxis.max).toBe(300);
        expect(trackpad.yAxis.min).toBe(0);
        expect(trackpad.yAxis.max).toBe(500);
    });
});

describe('RadioGroup: removeItems must not shift indices mid-iteration', () =>
{
    it.failing('removing ids [0, 1] leaves the third item', () =>
    {
        const items = [makeCheckBox('A'), makeCheckBox('B'), makeCheckBox('C')];
        const group = new RadioGroup({ items, type: 'vertical', elementsMargin: 0 });

        group.removeItems([0, 1]);

        const remaining = (group as any).items.map((i: CheckBox) => i.labelText?.text);

        expect(remaining).toEqual(['C']);
    });
});

describe('CircularProgressBar: omitting backgroundColor must not throw', () =>
{
    it.failing('constructs with no backgroundColor (invisible background)', () =>
    {
        expect(() => new CircularProgressBar({ radius: 50, lineWidth: 5 })).not.toThrow();
    });

    it.failing('constructs with no options at all', () =>
    {
        expect(() => new CircularProgressBar()).not.toThrow();
    });
});

/**
 * Step 5 regressions: resources acquired in a constructor with no matching
 * release in destroy(), and re-entrant init() that stacks listeners/children.
 *
 * ScrollBox.destroy already removes its ticker callback and wheel listener —
 * that is the pattern the other components should follow.
 */
import { Graphics, Ticker } from 'pixi.js';
import { CheckBox } from '../../src/CheckBox';
import { Dialog } from '../../src/Dialog';
import { FancyButton } from '../../src/FancyButton';
import { Input } from '../../src/Input';
import { RadioGroup } from '../../src/RadioGroup';
import { ScrollBox } from '../../src/ScrollBox';

const g = (w = 200, h = 20) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

describe('Ticker callbacks are released on destroy', () =>
{
    it('Dialog removes its shared-ticker callback', () =>
    {
        const before = Ticker.shared.count;
        const dialog = new Dialog({ background: g(300, 200), title: 'T' });

        dialog.destroy();

        expect(Ticker.shared.count).toBe(before);
    });

    it('FancyButton with animations removes its shared-ticker callback', () =>
    {
        const before = Ticker.shared.count;
        const button = new FancyButton({
            defaultView: g(100, 50),
            text: 'hi',
            animations: { hover: { props: { scale: { x: 1.1, y: 1.1 } }, duration: 100 } },
        });

        button.destroy();

        expect(Ticker.shared.count).toBe(before);
    });

    it('Input removes its shared-ticker callback', () =>
    {
        const before = Ticker.shared.count;
        const input = new Input({ bg: g() });

        input.destroy();

        expect(Ticker.shared.count).toBe(before);
    });
});

describe('Input DOM cleanup', () =>
{
    it('removes the hidden input element when destroyed mid-edit', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        expect(document.querySelectorAll('input').length).toBeGreaterThan(0);

        input.destroy();

        expect(document.querySelectorAll('input').length).toBe(0);
    });
});

describe('ScrollBox cleanup', () =>
{
    it('stays safe when its pending render timeout fires after destroy', () =>
    {
        jest.useFakeTimers();

        try
        {
            const box = new ScrollBox({ width: 200, height: 200, items: [g(), g()] });

            (box as any).stopRenderHiddenItems();
            box.destroy();

            expect(() => jest.advanceTimersByTime(5000)).not.toThrow();
        }
        finally
        {
            jest.useRealTimers();
        }
    });

    it('does not stack pointer listeners when init() is called twice', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200 });
        const after1 = box.listenerCount('pointerdown');

        box.init({ width: 200, height: 200 });

        expect(box.listenerCount('pointerdown')).toBe(after1);
    });
});

describe('RadioGroup re-initialisation', () =>
{
    it('does not duplicate items when init() is called twice', () =>
    {
        const items = [
            new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'A' }),
            new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'B' }),
        ];
        const options = { items, type: 'vertical' as const, elementsMargin: 0 };
        const group = new RadioGroup(options);

        group.init(options);

        expect((group as any).items.length).toBe(2);
    });
});

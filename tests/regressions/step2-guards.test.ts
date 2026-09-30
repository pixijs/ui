/**
 * Step 2 regressions: public API entry points that dereference their argument
 * (or their own uninitialised state) without a guard.
 *
 * In every case the same file already guards the equivalent path somewhere else
 * — the constructor, or a sibling setter — so these are inconsistencies, not
 * missing features.
 */
import { Graphics, Sprite, Texture } from 'pixi.js';
import { Button } from '../../src/Button';
import { Dialog } from '../../src/Dialog';
import { CheckBox } from '../../src/CheckBox';
import { Input } from '../../src/Input';
import { RadioGroup } from '../../src/RadioGroup';
import { ScrollBox } from '../../src/ScrollBox';
import { Select } from '../../src/Select';
import { Switcher } from '../../src/Switcher';
import { Trackpad } from '../../src/utils/trackpad/Trackpad';

const g = () => new Graphics().rect(0, 0, 100, 50).fill(0xffffff);

describe('Button.view setter', () =>
{
    it.failing('ignores an undefined view instead of throwing', () =>
    {
        const view = new Sprite(Texture.WHITE);
        const button = new Button(view);

        expect(() => { (button as any).view = undefined; }).not.toThrow();
        expect(button.view).toBe(view);
    });
});

describe('Switcher', () =>
{
    it.failing('ignores an undefined views array instead of throwing', () =>
    {
        const switcher = new Switcher([g(), g()]);

        expect(() => { (switcher as any).views = undefined; }).not.toThrow();
    });

    it.failing('ignores an undefined view passed to add() instead of throwing', () =>
    {
        const switcher = new Switcher([g()]);

        expect(() => switcher.add(undefined as any)).not.toThrow();
    });
});

describe('RadioGroup.selectItem', () =>
{
    it.failing('ignores an out-of-range id instead of throwing', () =>
    {
        const items = [
            new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'A' }),
            new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'B' }),
        ];
        const group = new RadioGroup({ items, type: 'vertical', elementsMargin: 0 });

        expect(() => group.selectItem(99)).not.toThrow();
        expect(group.selected).toBe(0);
    });
});

describe('ScrollBox.addItem', () =>
{
    it.failing('tolerates being called with no arguments', () =>
    {
        const box = new ScrollBox({ width: 200, height: 200 });

        expect(() => box.addItem()).not.toThrow();
    });
});

describe('Select', () =>
{
    it.failing('reports a clear error when toggled before init', () =>
    {
        const select = new Select();

        expect(() => select.toggle()).toThrow(/has not been initiated/i);
    });

    it.failing('reports a clear error when opened before init', () =>
    {
        const select = new Select();

        expect(() => select.open()).toThrow(/has not been initiated/i);
    });
});

describe('Dialog', () =>
{
    it.failing('reports a clear error when constructed without a background', () =>
    {
        expect(() => new Dialog({} as any)).toThrow(/background/i);
    });
});

describe('Input.value setter', () =>
{
    it.failing('treats an undefined value as an empty string instead of throwing', () =>
    {
        const input = new Input({ bg: g() });

        expect(() => { (input as any).value = undefined; }).not.toThrow();
        expect(input.value).toBe('');
    });
});

describe('Trackpad', () =>
{
    it.failing('can be constructed with no options, like Spring and SlidingNumber', () =>
    {
        expect(() => new Trackpad(undefined as any)).not.toThrow();
    });
});

describe('ScrollBox.disableDynamicRendering', () =>
{
    it.failing('is honoured by updateVisibleItems, as it already is by renderAllItems', () =>
    {
        const box = new ScrollBox({
            width: 200,
            height: 100,
            disableDynamicRendering: true,
            items: Array.from({ length: 20 }, () => g()),
        });

        (box as any).updateVisibleItems();

        expect(box.items.every((item) => item.renderable)).toBe(true);
    });
});

describe('RadioGroup with no options', () =>
{
    it.failing('constructs without items instead of throwing', () =>
    {
        expect(() => new RadioGroup()).not.toThrow();
    });
});

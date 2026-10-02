import { Container, Graphics, isMobile, Sprite, Texture } from 'pixi.js';
import { Button } from '../../src/Button';
import { CheckBox } from '../../src/CheckBox';
import { CircularProgressBar } from '../../src/CircularProgressBar';
import { List } from '../../src/List';
import { MaskedFrame } from '../../src/MaskedFrame';
import { RadioGroup } from '../../src/RadioGroup';

const g = (w = 100, h = 50) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

describe('ButtonEvents mobile teardown', () =>
{
    it('disconnects mobile listeners when the view is replaced', () =>
    {
        const original = isMobile.any;

        (isMobile as any).any = true;
        try
        {
            const first = new Container();
            const second = new Container();
            const button = new Button(first);
            const seen: string[] = [];

            button.onDown.connect(() => seen.push('down'));
            button.view = second;

            first.emit('pointerdown', {} as any);
            expect(seen).toHaveLength(0);

            second.emit('pointerdown', {} as any);
            expect(seen).toEqual(['down']);
        }
        finally { (isMobile as any).any = original; }
    });
});

describe('List initialisation guards', () =>
{
    it.each([
        'elementsMargin', 'padding', 'vertPadding', 'horPadding',
        'leftPadding', 'rightPadding', 'topPadding', 'bottomPadding',
    ] as const)('throws when %s is set before init', (prop) =>
    {
        const list = new List();

        expect(() => { (list as any)[prop] = 5; }).toThrow(/has not been initiated/i);
    });

    it('reports zero padding before init', () =>
    {
        const list = new List();

        expect(list.padding).toBe(0);
        expect(list.elementsMargin).toBe(0);
    });

    it('cascades padding to every edge', () =>
    {
        const list = new List({ type: 'vertical' });

        list.padding = 10;

        expect([list.topPadding, list.rightPadding, list.bottomPadding, list.leftPadding])
            .toEqual([10, 10, 10, 10]);
    });

    it('cascades vertical and horizontal padding', () =>
    {
        const list = new List({ type: 'vertical' });

        list.vertPadding = 4;
        list.horPadding = 6;

        expect([list.topPadding, list.bottomPadding]).toEqual([4, 4]);
        expect([list.leftPadding, list.rightPadding]).toEqual([6, 6]);
    });

    it('accepts per-edge padding', () =>
    {
        const list = new List({ type: 'vertical' });

        list.topPadding = 1;
        list.rightPadding = 2;
        list.bottomPadding = 3;
        list.leftPadding = 4;

        expect([list.topPadding, list.rightPadding, list.bottomPadding, list.leftPadding])
            .toEqual([1, 2, 3, 4]);
    });

    it('seeds children from options', () =>
    {
        const list = new List({ type: 'vertical', children: [g(), g()] });

        expect(list.children).toHaveLength(2);
    });

    it('seeds items from options', () =>
    {
        const list = new List({ type: 'vertical', items: [g(), g(), g()] });

        expect(list.children).toHaveLength(3);
    });

    it('honours maxWidth', () =>
    {
        const list = new List({ maxWidth: 250 });

        expect(list.maxWidth).toBe(250);

        list.maxWidth = 400;
        expect(list.maxWidth).toBe(400);
    });

    it('removes an item by id', () =>
    {
        const list = new List({ type: 'vertical', items: [g(), g()] });

        list.removeItem(0);

        expect(list.children).toHaveLength(1);
    });

    it('ignores removal of a missing id', () =>
    {
        const list = new List({ type: 'vertical', items: [g()] });

        list.removeItem(99);

        expect(list.children).toHaveLength(1);
    });

    it('defaults to bidirectional', () =>
    {
        expect(new List().type).toBe('bidirectional');
    });
});

describe('MaskedFrame', () =>
{
    it('constructs empty', () =>
    {
        expect(() => new MaskedFrame()).not.toThrow();
    });

    it('accepts a target', () =>
    {
        const frame = new MaskedFrame({ target: g() });

        expect(frame.target).toBeDefined();
    });

    it('applies a mask', () =>
    {
        const frame = new MaskedFrame({ target: g(), mask: g(80, 40) });

        expect((frame as any)._targetMask).toBeDefined();
        expect(frame.target?.mask).toBeDefined();
    });

    it('draws a border', () =>
    {
        const frame = new MaskedFrame({ target: g(), borderWidth: 5, borderColor: 0xff0000 });

        expect(frame.target?.x).toBe(5);
        expect(frame.target?.y).toBe(5);
    });

    it('defaults the border colour', () =>
    {
        const frame = new MaskedFrame({ target: g(), borderWidth: 3 });

        expect((frame as any).borderColor).toBe(0x000000);
    });

    it('grows a Graphics mask to cover the border', () =>
    {
        const frame = new MaskedFrame({ target: g(), mask: g(80, 40), borderWidth: 4 });

        expect(frame.mask).toBeDefined();
    });

    it('hides the border', () =>
    {
        const frame = new MaskedFrame({ target: g(), borderWidth: 5 });

        expect(() => frame.hideBorder()).not.toThrow();
    });

    it('ignores showBorder without a target', () =>
    {
        const frame = new MaskedFrame();

        expect(() => frame.showBorder()).not.toThrow();
    });

    it('replaces the target on re-init', () =>
    {
        const frame = new MaskedFrame({ target: g() });
        const replacement = g(60, 60);

        frame.init({ target: replacement });

        expect(frame.target).toBe(replacement);
    });

    it('accepts a Sprite mask', () =>
    {
        const frame = new MaskedFrame({ target: g() });

        frame.applyMask(new Graphics().circle(0, 0, 20).fill(0xffffff));

        expect((frame as any)._targetMask).toBeDefined();
    });
});

describe('CheckBox', () =>
{
    it('starts unchecked by default', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() } });

        expect(box.checked).toBe(false);
    });

    it('honours an initial checked state', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() }, checked: true });

        expect(box.checked).toBe(true);
    });

    it('emits onCheck when toggled', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() } });
        const seen: boolean[] = [];

        box.onCheck.connect((s) => seen.push(s));
        box.checked = true;

        expect(seen).toEqual([true]);
    });

    it('does not emit on forceCheck', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() } });
        const seen: boolean[] = [];

        box.onCheck.connect((s) => seen.push(s));
        box.forceCheck(true);

        expect(seen).toHaveLength(0);
        expect(box.checked).toBe(true);
    });

    it('renders a label', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'Accept' });

        expect(box.text).toBe('Accept');
    });

    it('updates an existing label', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'a' });

        box.text = 'b';

        expect(box.text).toBe('b');
    });

    it('removes the label when cleared', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'a' });

        box.text = '';

        expect(box.labelText).toBeUndefined();
        expect(box.text).toBe('');
    });

    it('toggles when the label is tapped', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'a' });

        box.labelText?.emit('pointertap', {} as any);

        expect(box.checked).toBe(true);
    });

    it('preserves the checked state across a style change', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() }, checked: true });

        box.style = { checked: g(), unchecked: g() };

        expect(box.checked).toBe(true);
    });

    it('restyles an existing label', () =>
    {
        const box = new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'a' });

        box.style = { checked: g(), unchecked: g(), text: { fill: 0xff0000 } };

        expect(box.style?.text).toEqual({ fill: 0xff0000 });
    });

    it('accepts a Sprite style view', () =>
    {
        const box = new CheckBox({
            style: { checked: new Sprite(Texture.WHITE), unchecked: new Sprite(Texture.WHITE) },
        });

        expect(box.views).toHaveLength(2);
    });
});

describe('CircularProgressBar', () =>
{
    it('applies an explicit background alpha', () =>
    {
        const bar = new CircularProgressBar({ backgroundColor: 0x000000, backgroundAlpha: 0.4, radius: 40 });

        expect(bar.progress).toBe(0);
    });

    it('clamps progress to the 0-100 range', () =>
    {
        const bar = new CircularProgressBar({ backgroundColor: 0x000000, radius: 40 });

        bar.progress = 150;
        expect(bar.progress).toBe(100);

        bar.progress = -20;
        expect(bar.progress).toBe(0);
    });

    it('clears the arc for a zero value with zero fill alpha', () =>
    {
        const bar = new CircularProgressBar({
            backgroundColor: 0x000000, fillAlpha: 0, radius: 40, value: 50,
        });

        bar.progress = 0;

        expect(bar.progress).toBe(0);
    });

    it('honours a line cap', () =>
    {
        const bar = new CircularProgressBar({ backgroundColor: 0x000000, radius: 40, cap: 'round', value: 25 });

        expect(bar.progress).toBe(25);
    });
});

describe('RadioGroup', () =>
{
    const boxes = () => [
        new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'A' }),
        new CheckBox({ style: { checked: g(), unchecked: g() }, text: 'B' }),
    ];

    it('selects the first item by default', () =>
    {
        const group = new RadioGroup({ items: boxes(), type: 'vertical', elementsMargin: 0 });

        expect(group.selected).toBe(0);
        expect(group.value).toBe('A');
    });

    it('honours a preselected item', () =>
    {
        const group = new RadioGroup({ items: boxes(), type: 'vertical', elementsMargin: 0, selectedItem: 1 });

        expect(group.selected).toBe(1);
    });

    it('emits onChange when the selection moves', () =>
    {
        const group = new RadioGroup({ items: boxes(), type: 'vertical', elementsMargin: 0 });
        const seen: Array<[number, string]> = [];

        group.onChange.connect((id, val) => seen.push([id, val]));
        group.selectItem(1);

        expect(seen).toEqual([[1, 'B']]);
    });

    it('ignores reselecting the current item', () =>
    {
        const group = new RadioGroup({ items: boxes(), type: 'vertical', elementsMargin: 0 });
        const seen: unknown[] = [];

        group.onChange.connect((id) => seen.push(id));
        group.selectItem(0);

        expect(seen).toHaveLength(0);
    });

    it('selects when a checkbox is toggled', () =>
    {
        const items = boxes();
        const group = new RadioGroup({ items, type: 'vertical', elementsMargin: 0 });

        items[1].checked = true;

        expect(group.selected).toBe(1);
    });

    it('ignores removal of a missing id', () =>
    {
        const group = new RadioGroup({ items: boxes(), type: 'vertical', elementsMargin: 0 });

        group.removeItems([99]);

        expect((group as any).items).toHaveLength(2);
    });
});

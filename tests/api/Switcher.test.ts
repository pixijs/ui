import { Graphics, Sprite, Texture } from 'pixi.js';
import { Switcher } from '../../src/Switcher';

const g = () => new Graphics().rect(0, 0, 50, 50).fill(0xffffff);

describe('Switcher construction', () =>
{
    it('constructs with no arguments', () =>
    {
        const switcher = new Switcher();

        expect(switcher.views).toHaveLength(0);
        expect(switcher.active).toBeUndefined();
    });

    it('activates the first view automatically', () =>
    {
        const switcher = new Switcher([g()]);

        expect(switcher.active).toBe(0);
    });

    it('honours an explicit active view id', () =>
    {
        const switcher = new Switcher([g(), g(), g()], 'onPress', 2);

        expect(switcher.active).toBe(2);
    });

    it('accepts a single trigger event', () =>
    {
        const switcher = new Switcher([g(), g()], 'onHover');

        expect(switcher.triggerEvents).toEqual(['onHover']);
    });

    it('accepts multiple trigger events', () =>
    {
        const switcher = new Switcher([g(), g()], ['onDown', 'onUp']);

        expect(switcher.triggerEvents).toEqual(['onDown', 'onUp']);
    });

    it('defaults to switching on press', () =>
    {
        expect(new Switcher([g(), g()]).triggerEvents).toEqual(['onPress']);
    });
});

describe('Switcher views', () =>
{
    it('replaces the view list', () =>
    {
        const switcher = new Switcher([g(), g()]);

        switcher.views = [g(), g(), g()];

        expect(switcher.views).toHaveLength(3);
    });

    it('appends a view', () =>
    {
        const switcher = new Switcher([g()]);

        switcher.add(g());

        expect(switcher.views).toHaveLength(2);
    });

    it('accepts a Sprite view', () =>
    {
        const switcher = new Switcher();

        switcher.add(new Sprite(Texture.WHITE));

        expect(switcher.views).toHaveLength(1);
    });

    it('removes a view by id', () =>
    {
        const switcher = new Switcher([g(), g()]);

        switcher.remove(0);

        expect(switcher.views).toHaveLength(1);
    });

    it('ignores removal of a missing id', () =>
    {
        const switcher = new Switcher([g()]);

        switcher.remove(99);

        expect(switcher.views).toHaveLength(1);
    });

    it('exposes the active view', () =>
    {
        const switcher = new Switcher([g(), g()]);

        expect(switcher.activeView).toBe(switcher.views[0]);
    });

    it('reports no active view when empty', () =>
    {
        expect(new Switcher().activeView).toBeUndefined();
    });
});

describe('Switcher switching', () =>
{
    it('advances to the next view', () =>
    {
        const switcher = new Switcher([g(), g(), g()]);

        switcher.switch();

        expect(switcher.active).toBe(1);
    });

    it('wraps around at the end', () =>
    {
        const switcher = new Switcher([g(), g()]);

        switcher.switch(1);
        switcher.switch();

        expect(switcher.active).toBe(0);
    });

    it('jumps to a given id', () =>
    {
        const switcher = new Switcher([g(), g(), g()]);

        switcher.switch(2);

        expect(switcher.active).toBe(2);
    });

    it('ignores a switch to the current view', () =>
    {
        const switcher = new Switcher([g(), g()]);
        const seen: unknown[] = [];

        switcher.onChange.connect((s) => seen.push(s));
        switcher.switch(0);

        expect(seen).toHaveLength(0);
    });

    it('emits a boolean for two views', () =>
    {
        const switcher = new Switcher([g(), g()]);
        const seen: unknown[] = [];

        switcher.onChange.connect((s) => seen.push(s));
        switcher.switch(1);

        expect(seen).toEqual([true]);
    });

    it('emits an index for more than two views', () =>
    {
        const switcher = new Switcher([g(), g(), g()]);
        const seen: unknown[] = [];

        switcher.onChange.connect((s) => seen.push(s));
        switcher.switch(2);

        expect(seen).toEqual([2]);
    });

    it('forceSwitch does not emit onChange', () =>
    {
        const switcher = new Switcher([g(), g()]);
        const seen: unknown[] = [];

        switcher.onChange.connect((s) => seen.push(s));
        switcher.forceSwitch(1);

        expect(seen).toHaveLength(0);
        expect(switcher.active).toBe(1);
    });

    it('ignores a forceSwitch to the current view', () =>
    {
        const switcher = new Switcher([g(), g()]);

        switcher.forceSwitch(0);

        expect(switcher.active).toBe(0);
    });

    it('does nothing when switching an empty switcher', () =>
    {
        const switcher = new Switcher();

        switcher.switch();

        expect(switcher.active).toBeUndefined();
    });

    it('shows only the active view', () =>
    {
        const switcher = new Switcher([g(), g(), g()]);

        switcher.switch(1);

        expect(switcher.views.map((v) => v.visible)).toEqual([false, true, false]);
    });

    it('switches via the active setter', () =>
    {
        const switcher = new Switcher([g(), g()]);

        switcher.active = 1;

        expect(switcher.active).toBe(1);
    });

    it('switches on a configured trigger event', () =>
    {
        const switcher = new Switcher([g(), g()], 'onPress');

        (switcher as any).innerView.emit('pointertap', {} as any);

        expect(switcher.active).toBe(1);
    });

    it('ignores an unconfigured trigger event', () =>
    {
        const switcher = new Switcher([g(), g()], 'onPress');

        (switcher as any).innerView.emit('pointerover', {} as any);

        expect(switcher.active).toBe(0);
    });

    it.each([
        ['pointerdown', 'onDown'],
        ['pointerup', 'onUp'],
        ['pointerupoutside', 'onUpOut'],
        ['pointerout', 'onOut'],
        ['pointerover', 'onHover'],
    ] as const)('switches on %s when configured', (dom, trigger) =>
    {
        const switcher = new Switcher([g(), g()], trigger);

        (switcher as any).innerView.emit(dom, {} as any);

        expect(switcher.active).toBe(1);
    });
});

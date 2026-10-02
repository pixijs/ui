import { Graphics } from 'pixi.js';
import { Select } from '../../src/Select';

const g = (w = 200, h = 40) => new Graphics().rect(0, 0, w, h).fill(0xffffff);

const options = (overrides: Record<string, unknown> = {}) => ({
    closedBG: g(),
    openBG: g(200, 300),
    textStyle: { fill: 0xffffff, fontSize: 16 },
    items: {
        items: ['one', 'two', 'three'],
        backgroundColor: 0x000000,
        hoverColor: 0x333333,
        width: 200,
        height: 40,
        radius: 4,
    },
    ...overrides,
});

describe('Select', () =>
{
    it('constructs without options', () =>
    {
        expect(() => new Select()).not.toThrow();
    });

    it('constructs with options', () =>
    {
        const select = new Select(options() as any);

        expect(select.value).toBe(-1);
    });

    it('populates the dropdown', () =>
    {
        const select = new Select(options() as any);

        expect((select as any).scrollBox.items.length).toBe(3);
    });

    it('opens and closes', () =>
    {
        const select = new Select(options() as any);

        select.open();
        expect((select as any).view.visible).toBe(true);

        select.close();
        expect((select as any).view.visible).toBe(false);
    });

    it('toggles', () =>
    {
        const select = new Select(options() as any);

        select.toggle();
        expect((select as any).view.visible).toBe(true);

        select.toggle();
        expect((select as any).view.visible).toBe(false);
    });

    it('emits onSelect when an item is pressed', () =>
    {
        const select = new Select(options() as any);
        const seen: Array<[number, string]> = [];

        select.onSelect.connect((id, text) => seen.push([id, text]));
        (select as any).scrollBox.items[1].onPress.emit();

        expect(seen).toEqual([[1, 'two']]);
        expect(select.value).toBe(1);
    });

    it('closes after a selection', () =>
    {
        const select = new Select(options() as any);

        select.open();
        (select as any).scrollBox.items[0].onPress.emit();

        expect((select as any).view.visible).toBe(false);
    });

    it('honours a preselected item', () =>
    {
        const select = new Select(options({ selected: 2 }) as any);

        expect((select as any).openButton.text).toBe('three');
    });

    it('removes an item', () =>
    {
        const select = new Select(options() as any);

        select.removeItem(0);

        expect((select as any).scrollBox.items.length).toBe(2);
    });

    it('ignores removeItem before init', () =>
    {
        const select = new Select();

        expect(() => select.removeItem(0)).not.toThrow();
    });

    it('honours visibleItems', () =>
    {
        const select = new Select(options({ visibleItems: 2 }) as any);

        expect((select as any).scrollBox.height).toBeGreaterThan(0);
    });

    it('honours a scrollBox offset', () =>
    {
        const select = new Select(options({ scrollBox: { offset: { x: 5, y: 10 } } }) as any);

        expect((select as any).scrollBox.x).toBe(5);
    });

    it('honours a selected text offset', () =>
    {
        const select = new Select(options({ selectedTextOffset: { x: 3, y: 4 } }) as any);

        expect((select as any).openButton.textOffset).toEqual({ x: 3, y: 4 });
    });

    it('rebuilds cleanly on a second init', () =>
    {
        const select = new Select(options() as any);

        const items = {
            items: ['alpha', 'beta'],
            backgroundColor: 0x111111,
            width: 200,
            height: 40,
        };

        select.init(options({ items }) as any);

        expect((select as any).scrollBox.items.length).toBe(2);
        expect((select as any).openButton.text).toBe('alpha');
    });

    it('reuses the open view when the background is unchanged', () =>
    {
        const shared = g(200, 300);
        const select = new Select(options({ openBG: shared }) as any);
        const firstOpenView = (select as any).openView;

        select.init(options({ openBG: shared }) as any);

        expect((select as any).openView).toBe(firstOpenView);
    });
});

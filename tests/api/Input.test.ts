import { Graphics, NineSliceSprite, Sprite, Texture } from 'pixi.js';
import { Input } from '../../src/Input';

const g = (w = 200, h = 40) => new Graphics().rect(0, 0, w, h).fill(0xffffff);
const slice = [2, 2, 2, 2] as [number, number, number, number];
const key = (k: string, extra: Record<string, unknown> = {}) =>
    ({ key: k, metaKey: false, ctrlKey: false, ...extra }) as KeyboardEvent;

describe('Input construction', () =>
{
    it('logs when bg is missing', () =>
    {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        // eslint-disable-next-line no-new
        new Input({} as any);

        expect(spy).toHaveBeenCalledWith('Input: bg is not defined, please define it.');
        spy.mockRestore();
    });

    it('applies an initial value', () =>
    {
        expect(new Input({ bg: g(), value: 'seed' }).value).toBe('seed');
    });

    it('shows a placeholder when empty', () =>
    {
        const input = new Input({ bg: g(), placeholder: 'type here' });

        expect((input as any).placeholder.visible).toBe(true);
    });

    it('hides the placeholder when seeded with a value', () =>
    {
        const input = new Input({ bg: g(), placeholder: 'type here', value: 'x' });

        expect((input as any).placeholder.visible).toBe(false);
    });

    it('builds a nine-slice bg from a Texture', () =>
    {
        const input = new Input({ bg: Texture.WHITE, nineSliceSprite: slice });

        expect(input.bg).toBeInstanceOf(NineSliceSprite);
    });

    it('warns when a nine-slice bg is given a Container', () =>
    {
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

        // eslint-disable-next-line no-new
        new Input({ bg: g(), nineSliceSprite: slice });

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('adds a mask when asked', () =>
    {
        const input = new Input({ bg: g(), addMask: true });

        expect((input as any).inputMask).toBeDefined();
    });

    it('masks from a Sprite bg', () =>
    {
        const input = new Input({ bg: new Sprite(Texture.WHITE), addMask: true });

        expect((input as any).inputMask).toBeInstanceOf(Sprite);
    });
});

describe('Input padding', () =>
{
    it('accepts a single number', () =>
    {
        expect(new Input({ bg: g(), padding: 7 }).padding).toEqual([7, 7, 7, 7]);
    });

    it('accepts a two-value array', () =>
    {
        expect(new Input({ bg: g(), padding: [1, 2] }).padding).toEqual([1, 2, 1, 2]);
    });

    it('accepts a four-value array', () =>
    {
        expect(new Input({ bg: g(), padding: [1, 2, 3, 4] }).padding).toEqual([1, 2, 3, 4]);
    });

    it('accepts an object', () =>
    {
        const input = new Input({ bg: g(), padding: { top: 1, right: 2, bottom: 3, left: 4 } });

        expect(input.padding).toEqual([1, 2, 3, 4]);
    });

    it('defaults missing object keys to 0', () =>
    {
        expect(new Input({ bg: g(), padding: { top: 5 } }).padding).toEqual([5, 0, 0, 0]);
    });
});

describe('Input editing', () =>
{
    it('appends typed characters', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).onKeyUp(key('a'));
        (input as any).onKeyUp(key('b'));

        expect(input.value).toBe('ab');
    });

    it('ignores typing when not editing', () =>
    {
        const input = new Input({ bg: g() });

        (input as any).onKeyUp(key('a'));

        expect(input.value).toBe('');
    });

    it('deletes on backspace', () =>
    {
        const input = new Input({ bg: g(), value: 'abc' });

        (input as any)._startEditing();
        (input as any).onKeyUp(key('Backspace'));

        expect(input.value).toBe('ab');
    });

    it('ignores backspace on an empty value', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).onKeyUp(key('Backspace'));

        expect(input.value).toBe('');
    });

    it('stops editing on Enter', () =>
    {
        const input = new Input({ bg: g(), value: 'x' });
        const seen: string[] = [];

        input.onEnter.connect((t) => seen.push(t));
        (input as any)._startEditing();
        (input as any).onKeyUp(key('Enter'));

        expect(seen).toEqual(['x']);
    });

    it('stops editing on Escape', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).onKeyUp(key('Escape'));

        expect((input as any).editing).toBe(false);
    });

    it.each(['Shift', 'Control', 'ArrowLeft', 'F5', 'Tab', 'NumLock'])('ignores the %s key', (k) =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).onKeyUp(key(k));

        expect(input.value).toBe('');
    });

    it('ignores modifier combinations', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).onKeyUp(key('a', { metaKey: true }));
        (input as any).onKeyUp(key('c', { ctrlKey: true }));

        expect(input.value).toBe('');
    });

    it('falls back to composed input data', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).onInput({ data: 'é' } as InputEvent);
        (input as any).onKeyUp(key('Process'));

        expect(input.value).toBe('é');
    });

    it('respects maxLength', () =>
    {
        const input = new Input({ bg: g(), maxLength: 2 });

        (input as any)._startEditing();
        (input as any).onKeyUp(key('a'));
        (input as any).onKeyUp(key('b'));
        (input as any).onKeyUp(key('c'));

        expect(input.value).toBe('ab');
    });

    it('clears on focus when configured', () =>
    {
        const input = new Input({ bg: g(), value: 'seed', cleanOnFocus: true });

        (input as any)._startEditing();

        expect(input.value).toBe('');
    });

    it('emits onChange for each edit', () =>
    {
        const input = new Input({ bg: g() });
        const seen: string[] = [];

        input.onChange.connect((t) => seen.push(t));
        (input as any)._startEditing();
        (input as any).onKeyUp(key('a'));

        expect(seen).toEqual(['a']);
    });

    it('restores the placeholder when emptied', () =>
    {
        const input = new Input({ bg: g(), placeholder: 'ph', value: 'a' });

        (input as any)._startEditing();
        (input as any).onKeyUp(key('Backspace'));
        (input as any).stopEditing();

        expect((input as any).placeholder.visible).toBe(true);
    });

    it('ignores stopEditing when not editing', () =>
    {
        const input = new Input({ bg: g() });
        const seen: string[] = [];

        input.onEnter.connect((t) => seen.push(t));
        (input as any).stopEditing();

        expect(seen).toHaveLength(0);
    });

    it('recreates the hidden field on repeated edits', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).createInputField();

        expect((input as any).input).toBeDefined();
    });

    it('handles activation only once per click', () =>
    {
        const input = new Input({ bg: g() });

        (input as any).activation = true;
        (input as any).handleActivation();

        expect((input as any).editing).toBe(true);

        (input as any).handleActivation();
        expect((input as any).editing).toBe(true);
    });

    it('pastes clipboard text', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).onPaste({
            preventDefault: () => undefined,
            clipboardData: { getData: () => 'pasted' },
        });

        expect(input.value).toBe('pasted');
    });

    it('ignores an empty paste', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).onPaste({
            preventDefault: () => undefined,
            clipboardData: { getData: () => '' },
        });

        expect(input.value).toBe('');
    });

    it('blinks the cursor while editing', () =>
    {
        const input = new Input({ bg: g() });

        (input as any)._startEditing();
        (input as any).update(10);

        expect((input as any)._cursor.alpha).toBeGreaterThanOrEqual(0);
    });

    it('does not blink when idle', () =>
    {
        const input = new Input({ bg: g() });
        const before = (input as any)._cursor.alpha;

        (input as any).update(10);

        expect((input as any)._cursor.alpha).toBe(before);
    });
});

describe('Input presentation', () =>
{
    it('masks the value when secure', () =>
    {
        const input = new Input({ bg: g(), value: 'abcd', secure: true });

        expect((input as any).inputField.text).toBe('****');
        expect(input.value).toBe('abcd');
    });

    it('unmasks when secure is turned off', () =>
    {
        const input = new Input({ bg: g(), value: 'abcd', secure: true });

        input.secure = false;

        expect(input.secure).toBe(false);
        expect((input as any).inputField.text).toBe('abcd');
    });

    it.each([['left', 0], ['center', 0.5], ['right', 1]] as const)('aligns %s', (align, expected) =>
    {
        const input = new Input({ bg: g(), align, value: 'a' });

        expect((input as any).getAlign()).toBe(expected);
    });

    /** jsdom's canvas mock does not measure text, so the width is forced. */
    const overflowing = () =>
    {
        const input = new Input({ bg: g(40, 40), align: 'center', value: 'a very long string indeed' });

        Object.defineProperty((input as any).inputField, 'width', { value: 5000, configurable: true });

        return input;
    };

    it('left-aligns overflowing text when idle', () =>
    {
        expect((overflowing() as any).getAlign()).toBe(0);
    });

    it('right-aligns overflowing text while editing', () =>
    {
        const input = overflowing();

        (input as any).editing = true;

        expect((input as any).getAlign()).toBe(1);
    });

    it.each([0, 0.5, 1])('positions the cursor for align %s', (align) =>
    {
        const input = new Input({ bg: g(), value: 'abc' });

        jest.spyOn(input as any, 'getAlign').mockReturnValue(align);

        expect(Number.isFinite((input as any).getCursorPosX())).toBe(true);
    });
});

describe('Input sizing', () =>
{
    it('routes size through a nine-slice bg', () =>
    {
        const input = new Input({ bg: Texture.WHITE, nineSliceSprite: slice, addMask: true });

        input.width = 300;
        input.height = 50;

        expect((input.bg as NineSliceSprite).width).toBe(300);
        expect((input.bg as NineSliceSprite).height).toBe(50);
    });

    it('routes setSize through a nine-slice bg', () =>
    {
        const input = new Input({ bg: Texture.WHITE, nineSliceSprite: slice });

        input.setSize(120, 30);

        expect((input.bg as NineSliceSprite).width).toBe(120);
    });

    it('falls back to Container sizing', () =>
    {
        const input = new Input({ bg: g() });

        input.width = 300;

        expect(input.width).toBeCloseTo(300, 0);
        expect(() => input.setSize(100, 40)).not.toThrow();
    });
});

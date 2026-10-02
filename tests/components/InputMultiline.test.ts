import { Input } from '../../src/input';
import { cleanup, createTestGraphics } from '../utils/components';

describe('Input multiline', () =>
{
    // jsdom's canvas mock does not measure text: every character is 10 wide and every line 20 high.
    beforeEach(() =>
    {
        jest.spyOn(Input.prototype as any, 'measureText')
            .mockImplementation((text: unknown) => (text as string).length * 10);
        jest.spyOn(Input.prototype as any, 'textProbe').mockReturnValue({ unit: 1, pitch: 20 });
    });

    afterEach(() =>
    {
        jest.restoreAllMocks();
        cleanup();
    });

    const create = (value = '', options: Record<string, unknown> = {}) =>
        new Input({ bg: createTestGraphics(100, 60), multiline: true, value, ...options });

    const start = (input: Input) =>
    {
        (input as any)._startEditing();

        return (input as any).input as HTMLTextAreaElement;
    };

    const lines = (input: Input) => (input as any).layoutLines().lines.map((l: any) => [l.start, l.end]);
    const key = (native: HTMLElement, name: string, init: KeyboardEventInit = {}) =>
    {
        const event = new KeyboardEvent('keydown', { key: name, cancelable: true, ...init });

        native.dispatchEvent(event);

        return event;
    };

    it('uses a textarea as the hidden field', () =>
    {
        const native = start(create('a'));

        expect(native.tagName).toBe('TEXTAREA');
        expect(start(new Input({ bg: createTestGraphics(100, 30) })).tagName).toBe('INPUT');
    });

    it('breaks lines at line breaks and draws them one under another', () =>
    {
        const input = create('ab\n\ncd');

        expect(lines(input)).toEqual([[0, 2], [3, 3], [4, 6]]);
        expect((input as any).inputField.text).toBe('ab\n\ncd');
    });

    it('wraps long lines after a space, or inside a word that does not fit', () =>
    {
        // 100 wide with no padding: ten characters per line.
        expect(lines(create('hello world again'))).toEqual([[0, 6], [6, 12], [12, 17]]);
        expect(lines(create('abcdefghijklmnopqrstuvwxyz'))).toEqual([[0, 10], [10, 20], [20, 26]]);
    });

    it('normalises line endings set from code', () =>
    {
        expect(create('a\r\nb\rc').value).toBe('a\nb\nc');
    });

    it('keeps Enter for a line break and ends the session on Escape', () =>
    {
        const input = create('a');
        const native = start(input);

        expect(key(native, 'Enter').defaultPrevented).toBe(false);
        expect((input as any).editing).toBe(true);

        key(native, 'Escape');
        expect((input as any).editing).toBe(false);
    });

    it('still ends a single-line session on Enter', () =>
    {
        const input = new Input({ bg: createTestGraphics(100, 30), value: 'a' });
        const native = start(input);

        key(native, 'Enter');
        expect((input as any).editing).toBe(false);
    });

    it('mirrors typed line breaks', () =>
    {
        const input = create('ab');
        const native = start(input);
        const changes: string[] = [];

        input.onChange.connect((text) => changes.push(text));
        native.value = 'ab\ncd';
        native.dispatchEvent(new InputEvent('input', { inputType: 'insertLineBreak' }));

        expect(input.value).toBe('ab\ncd');
        expect(changes).toEqual(['ab\ncd']);
        expect(lines(input)).toEqual([[0, 2], [3, 5]]);
    });

    it('puts the caret on its line', () =>
    {
        const input = create('ab\ncd');
        const native = start(input);

        native.setSelectionRange(4, 4);
        (input as any).update(1);

        expect((input as any)._cursor.x).toBe((input as any).textLeft + 10);
        expect((input as any)._cursor.y).toBe((input as any).inputField.y + 30);
    });

    it('maps a point to the line and character under it', () =>
    {
        const input = create('ab\ncd');

        expect(input.value).toBe('ab\ncd');
        expect((input as any).indexAtLocalX(14, 5)).toBe(1);
        expect((input as any).indexAtLocalX(14, 25)).toBe(4);
        expect((input as any).indexAtLocalX(500, 25)).toBe(5);
        expect((input as any).indexAtLocalX(0, 500)).toBe(3);
    });

    it('moves the caret by visual lines with Up and Down, keeping its column', () =>
    {
        const input = create('abcd\nx\nabcd');
        const native = start(input);
        const caret = () => [native.selectionStart, native.selectionEnd];

        native.setSelectionRange(3, 3);
        (input as any).update(1);

        expect(key(native, 'ArrowDown').defaultPrevented).toBe(true);
        expect(caret()).toEqual([6, 6]);

        key(native, 'ArrowDown');
        expect(caret()).toEqual([10, 10]);

        // On the last line Down goes to the end, and Up from there remembers the column it left.
        key(native, 'ArrowDown');
        expect(caret()).toEqual([11, 11]);

        key(native, 'ArrowUp');
        key(native, 'ArrowUp');
        expect(caret()).toEqual([3, 3]);
    });

    it('extends the selection with Shift, and goes to line ends with Home and End', () =>
    {
        const input = create('abcd\nefgh');
        const native = start(input);

        native.setSelectionRange(2, 2);
        (input as any).update(1);

        key(native, 'ArrowDown', { shiftKey: true });
        expect([native.selectionStart, native.selectionEnd, native.selectionDirection]).toEqual([2, 7, 'forward']);

        key(native, 'Home');
        expect(native.selectionStart).toBe(5);

        key(native, 'End');
        expect(native.selectionStart).toBe(9);
    });

    it('leaves the line keys to the browser outside multiline mode', () =>
    {
        const native = start(new Input({ bg: createTestGraphics(100, 30), value: 'abc' }));

        expect(key(native, 'ArrowUp').defaultPrevented).toBe(false);
        expect(key(native, 'Home').defaultPrevented).toBe(false);
    });

    it('stays on a wrapped line when End is pressed, and starts it with Home', () =>
    {
        const input = create('hello world again');
        const native = start(input);

        native.setSelectionRange(2, 2);
        (input as any).update(1);

        key(native, 'End');
        expect(native.selectionStart).toBe(5);

        key(native, 'Home');
        expect(native.selectionStart).toBe(0);
    });

    it('draws a selection spanning lines as one rectangle per line', () =>
    {
        const input = create('abcd\nefgh');
        const native = start(input);
        const rect = jest.spyOn((input as any)._selection, 'rect');

        native.setSelectionRange(2, 7);
        (input as any).update(1);

        expect(rect).toHaveBeenCalledTimes(2);
    });

    it('scrolls to keep the caret line visible and clips the text', () =>
    {
        // 60 high: three lines of 20 fit.
        const input = create('1\n2\n3\n4\n5');
        const native = start(input);

        expect(input.children).toContain((input as any).inputMask);
        expect((input as any).scrollY).toBe(100 - 60);

        native.setSelectionRange(0, 0);
        (input as any).update(1);
        expect((input as any).scrollY).toBe(0);

        native.setSelectionRange(6, 6);
        (input as any).update(1);
        expect((input as any).scrollY).toBe(20);
    });

    it('masks every character but the line breaks when secure', () =>
    {
        const input = create('ab\ncd', { secure: true });

        expect((input as any).inputField.text).toBe('**\n**');
        expect(input.value).toBe('ab\ncd');
    });
});

import { createHiddenField } from '../../src/input/hiddenField';

describe('createHiddenField', () =>
{
    const base = { x: 12, y: 34, width: 200, height: 50, value: 'abc', secure: false, takesPointer: false };

    afterEach(() =>
    {
        document.querySelectorAll('input').forEach((el) => el.remove());
    });

    it('adds an invisible field over the component, holding the value', () =>
    {
        const input = createHiddenField(base);

        expect(input.isConnected).toBe(true);
        expect(input.style.position).toBe('fixed');
        expect([input.style.left, input.style.top]).toEqual(['12px', '34px']);
        expect([input.style.width, input.style.height]).toEqual(['200px', '50px']);
        expect(Number(input.style.opacity)).toBeLessThan(0.001);
        expect(input.value).toBe('abc');
        expect(input.type).toBe('text');
    });

    it('uses a 16px font, so iOS does not zoom in on focus', () =>
    {
        expect(createHiddenField(base).style.fontSize).toBe('16px');
    });

    it('lets presses through to the canvas, unless it is the press target', () =>
    {
        const passive = createHiddenField(base);

        expect(passive.style.pointerEvents).toBe('none');

        const target = createHiddenField({ ...base, takesPointer: true });

        expect(target.style.pointerEvents).not.toBe('none');
        expect(target.style.touchAction).toBe('none');
    });

    it('is a password field when secure', () =>
    {
        expect(createHiddenField({ ...base, secure: true }).type).toBe('password');
    });

    it('applies maxLength only when one is given', () =>
    {
        expect(createHiddenField({ ...base, maxLength: 5 }).maxLength).toBe(5);
        expect(createHiddenField(base).getAttribute('maxlength')).toBeNull();
    });

    it('turns keyboard rewriting off by default and merges given attributes over it', () =>
    {
        const input = createHiddenField({ ...base, attributes: { autocapitalize: 'words', inputmode: 'numeric' } });

        expect(input.getAttribute('autocorrect')).toBe('off');
        expect(input.getAttribute('spellcheck')).toBe('false');
        expect(input.getAttribute('data-1p-ignore')).toBe('true');
        expect(input.getAttribute('autocapitalize')).toBe('words');
        expect(input.getAttribute('inputmode')).toBe('numeric');
    });
});

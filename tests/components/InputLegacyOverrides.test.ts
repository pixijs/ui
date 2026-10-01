import { Input } from '../../src/input';
import { cleanup, createTestGraphics } from '../utils/components';

/* eslint-disable @typescript-eslint/no-unused-vars, jsdoc/require-param */

describe('Input legacy override warnings', () =>
{
    let warn: jest.SpyInstance;

    const start = (input: Input) =>
    {
        (input as any)._startEditing();

        return (input as any).input as HTMLInputElement;
    };
    const stop = (input: Input) => (input as any).stopEditing();
    const make = <T extends Input>(Ctor: new (o: any) => T) => new Ctor({ bg: createTestGraphics(200, 50) });

    beforeEach(() =>
    {
        warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() =>
    {
        warn.mockRestore();
        cleanup();
    });

    it('stays quiet for Input itself', () =>
    {
        start(make(Input));

        expect(warn).not.toHaveBeenCalled();
    });

    it('warns once per class when a subclass overrides onKeyUp, the #257 workaround', () =>
    {
        class WithKeyUp extends Input
        {
            protected onKeyUp(_e: KeyboardEvent): void { /* the old workaround */ }
        }

        const a = make(WithKeyUp);
        const b = make(WithKeyUp);

        start(a);
        stop(a);
        start(a);
        start(b);

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain('WithKeyUp');
        expect(warn.mock.calls[0][0]).toContain('onKeyUp()');
        expect(warn.mock.calls[0][0]).toContain('releases/tag/v2.4.0');
    });

    it('names every legacy override of a class in one warning', () =>
    {
        class Filtering extends Input
        {
            protected override _add(key: string): void { super._add(key.replace(/\d/g, '')); }
            protected onPaste(_e: ClipboardEvent): void { /* nothing */ }
        }

        start(make(Filtering));

        expect(warn).toHaveBeenCalledTimes(1);

        const message = warn.mock.calls[0][0] as string;

        expect(message).toContain('_add()');
        expect(message).toContain('onPaste()');
        expect(message).not.toContain('onKeyUp()');
    });

    it('sees overrides declared as class fields', () =>
    {
        class FieldOverride extends Input
        {
            protected onKeyUp = (_e: KeyboardEvent) => undefined;
        }

        start(make(FieldOverride));

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain('onKeyUp()');
    });

    it('warns about an onInput() override that still expects the event, but not about one that does not', () =>
    {
        class OldOnInput extends Input
        {
            protected override onInput(..._args: unknown[]): void { super.onInput(); }
        }
        // `length` counts declared parameters before any rest or default, so declare one plainly.
        Object.defineProperty((OldOnInput.prototype as any).onInput, 'length', { value: 1 });

        class NewOnInput extends Input
        {
            protected override onInput(): void { super.onInput(); }
        }

        start(make(NewOnInput));
        expect(warn).not.toHaveBeenCalled();

        start(make(OldOnInput));
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain('onInput() no longer receives the InputEvent');
    });

    it('reports an override inherited from an intermediate subclass', () =>
    {
        class Middle extends Input
        {
            protected override _delete(): void { super._delete(); }
        }
        class Leaf extends Middle {}

        start(make(Leaf));

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain('Leaf');
        expect(warn.mock.calls[0][0]).toContain('_delete()');
    });

    it('gives advice that works: filtering in onInput() keeps digits out', () =>
    {
        class NoDigits extends Input
        {
            protected override onInput(): void
            {
                if (this.input) this.input.value = this.input.value.replace(/\d/g, '');
                super.onInput();
            }
        }

        const input = make(NoDigits);
        const native = start(input);

        native.value = 'a1b2';
        native.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: '2' }));

        expect(input.value).toBe('ab');
        expect(warn).not.toHaveBeenCalled();
    });
});

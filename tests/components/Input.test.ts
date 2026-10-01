import { Graphics, Point, Texture } from 'pixi.js';
import { Input } from '../../src/Input';
import { cleanup, createTestGraphics, testStateChange } from '../utils/components';

import type { InputAlign } from '../../src/Input';

describe('Input Component', () =>
{
    afterEach(() =>
    {
        cleanup();
    });

    describe('Input Creation and Basic Properties', () =>
    {
        const defaultOptions = {
            bg: createTestGraphics(320, 70, 0xF1D583),
            textStyle: {
                fill: '#000000',
                fontSize: 16,
            },
            maxLength: 20,
            placeholder: 'Enter text',
            secure: false,
            value: '',
            padding: 7,
        };

        it('should create Input without errors', () =>
        {
            // Test basic Input creation
            expect(() =>
            {
                const input = new Input(defaultOptions);

                expect(input.value).toBe('');
                expect(input.secure).toBe(false);
            }).not.toThrow();
        });

        it('should create Input with minimal options', () =>
        {
            // Test Input with only background
            const minimalOptions = {
                bg: Texture.WHITE,
            };

            expect(() =>
            {
                const input = new Input(minimalOptions);

                expect(input.value).toBe('');
            }).not.toThrow();
        });

        it('should create Input with minimal required options', () =>
        {
            // Test Input with minimal required options
            const minimalOptions = {
                bg: Texture.WHITE,
                padding: 0,
            };

            expect(() =>
            {
                const input = new Input(minimalOptions);

                expect(input.value).toBe('');
                expect(input.secure).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Input Value Management', () =>
    {
        let input: Input;
        const testOptions = {
            bg: createTestGraphics(250, 50, 0xEEEEEE),
            placeholder: 'Test Input',
        };

        beforeEach(() =>
        {
            input = new Input(testOptions);
        });

        it('should handle value changes', () =>
        {
            // Test value property getter/setter
            testStateChange(input, 'value', '', 'Hello World');
            testStateChange(input, 'value', 'Hello World', 'New Value');
        });

        it('should maintain value consistency', () =>
        {
            // Test value persistence
            input.value = 'Test String';
            expect(input.value).toBe('Test String');

            input.value = 'Another Value';
            expect(input.value).toBe('Another Value');
        });

        it('should handle empty and whitespace values', () =>
        {
            // Test edge cases for values
            const testValues = ['', ' ', '   ', '\t', '\n', 'normal text'];

            testValues.forEach((value) =>
            {
                input.value = value;
                expect(input.value).toBe(value);
            });
        });

        it('should handle special characters', () =>
        {
            // Test special characters in input
            const specialValues = [
                '!@#$%^&*()',
                'Hello\nWorld',
                'Tab\tSeparated',
                'Unicode: 🚀🎉✨',
                '   spaces   ',
            ];

            specialValues.forEach((value) =>
            {
                input.value = value;
                expect(input.value).toBe(value);
            });
        });
    });

    describe('Input Secure Mode', () =>
    {
        let input: Input;
        const testOptions = {
            bg: createTestGraphics(300, 50, 0xFFFFFF),
            secure: false,
        };

        beforeEach(() =>
        {
            input = new Input(testOptions);
        });

        it('should handle secure mode toggle', () =>
        {
            // Test secure property getter/setter
            testStateChange(input, 'secure', false, true);
            testStateChange(input, 'secure', true, false);
        });

        it('should maintain secure state correctly', () =>
        {
            // Test secure state persistence
            expect(input.secure).toBe(false);

            input.secure = true;
            expect(input.secure).toBe(true);

            input.secure = false;
            expect(input.secure).toBe(false);
        });

        it('should handle secure mode with value changes', () =>
        {
            // Test that value is maintained when secure mode changes
            const testValue = 'secret123';

            input.value = testValue;
            expect(input.value).toBe(testValue);

            input.secure = true;
            expect(input.value).toBe(testValue); // Value should be preserved

            input.secure = false;
            expect(input.value).toBe(testValue); // Value should still be preserved
        });

        it('should create Input with secure mode enabled initially', () =>
        {
            // Test Input created with secure mode on
            const secureOptions = {
                bg: createTestGraphics(200, 40, 0xFFFFFF),
                secure: true,
                value: 'password',
            };

            const secureInput = new Input(secureOptions);

            expect(secureInput.secure).toBe(true);
            expect(secureInput.value).toBe('password');
        });
    });

    describe('Input Event System', () =>
    {
        let input: Input;
        let mockAction: jest.Mock;

        const testOptions = {
            bg: createTestGraphics(250, 40, 0xF0F0F0),
            placeholder: 'Event Test',
        };

        beforeEach(() =>
        {
            input = new Input(testOptions);
            mockAction = jest.fn();
        });

        it('should connect onEnter handler without errors', () =>
        {
            // Test onEnter event connection
            expect(() =>
            {
                input.onEnter.connect((val) => mockAction(`Input value: ${val}`));
            }).not.toThrow();
        });

        it('should handle onEnter event firing', () =>
        {
            // Test onEnter event emission
            input.onEnter.connect(mockAction);
            input.value = 'test value';

            // Simulate Enter event
            input.onEnter.emit('test value');

            expect(mockAction).toHaveBeenCalledWith('test value');
            expect(mockAction).toHaveBeenCalledTimes(1);
        });

        it('should handle multiple onEnter listeners', () =>
        {
            // Test multiple event listeners
            const mockAction2 = jest.fn();

            input.onEnter.connect(mockAction);
            input.onEnter.connect(mockAction2);

            input.onEnter.emit('shared value');

            expect(mockAction).toHaveBeenCalledWith('shared value');
            expect(mockAction2).toHaveBeenCalledWith('shared value');
            expect(mockAction).toHaveBeenCalledTimes(1);
            expect(mockAction2).toHaveBeenCalledTimes(1);
        });

        it('should disconnect event listeners properly', () =>
        {
            // Test event listener disconnection
            input.onEnter.connect(mockAction);

            input.onEnter.emit('test');
            expect(mockAction).toHaveBeenCalledTimes(1);

            input.onEnter.disconnectAll();
            input.onEnter.emit('test2');
            expect(mockAction).toHaveBeenCalledTimes(1); // Should not increase
        });
    });

    describe('Input Configuration Options', () =>
    {
        it('should handle different placeholder values', () =>
        {
            // Test various placeholder configurations
            const placeholders = ['Enter text', 'Type here...', '', 'Long placeholder text here'];

            placeholders.forEach((placeholder) =>
            {
                const options = {
                    bg: Texture.WHITE,
                    placeholder,
                };

                expect(() =>
                {
                    new Input(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });

        it('should handle different initial values', () =>
        {
            // Test various initial value configurations
            const initialValues = ['', 'Default text', '12345', 'Special chars: @#$'];

            initialValues.forEach((value) =>
            {
                const options = {
                    bg: Texture.WHITE,
                    value,
                };

                expect(() =>
                {
                    const input = new Input(options);

                    expect(input.value).toBe(value);
                }).not.toThrow();
            });
        });

        it('should handle different alignment values', () =>
        {
            // Test text alignment options
            const alignments: Array<'center' | 'left' | 'right'> = ['center', 'left', 'right'];

            alignments.forEach((alignment) =>
            {
                const options = {
                    bg: createTestGraphics(200, 40, 0xFFFFFF),
                    align: alignment,
                    placeholder: 'Aligned text',
                };

                expect(() =>
                {
                    new Input(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });

        it('should handle different maxLength values', () =>
        {
            // Test maxLength configurations
            const maxLengths = [0, 5, 10, 50, 100];

            maxLengths.forEach((maxLength) =>
            {
                const options = {
                    bg: createTestGraphics(200, 40, 0xFFFFFF),
                    maxLength,
                };

                expect(() =>
                {
                    new Input(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });

        it('should handle different padding configurations', () =>
        {
            // Test padding options
            const paddingConfigurations = [5, 10, 15, 20];

            paddingConfigurations.forEach((padding) =>
            {
                const options = {
                    bg: createTestGraphics(200, 40, 0xFFFFFF),
                    padding,
                };

                expect(() =>
                {
                    new Input(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });

        it('should handle different text styles', () =>
        {
            // Test text style configurations
            const textStyles = [
                { fill: '#000000', fontSize: 16 },
                { fill: '#FF0000', fontSize: 20 },
                { fill: '#0000FF', fontSize: 14 },
                { fill: '#00FF00', fontSize: 18 },
            ];

            textStyles.forEach((textStyle) =>
            {
                const options = {
                    bg: createTestGraphics(250, 50, 0xFFFFFF),
                    textStyle,
                };

                expect(() =>
                {
                    new Input(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });
    });

    describe('Input Advanced Features', () =>
    {
        it('should handle complex background graphics', () =>
        {
            // Test Input with complex background
            const complexBg = new Graphics()
                .roundRect(0, 0, 300, 60, 15)
                .fill('#DDDDDD')
                .roundRect(2, 2, 296, 56, 13)
                .fill('#FFFFFF')
                .roundRect(10, 10, 280, 40, 5)
                .stroke({ color: '#CCCCCC', width: 1 });

            const options = {
                bg: complexBg,
                placeholder: 'Complex Input',
                textStyle: { fill: '#333333', fontSize: 16 },
            };

            expect(() =>
            {
                const input = new Input(options);

                expect(input.value).toBe('');
            }).not.toThrow();
        });

        it('should handle edge case configurations', () =>
        {
            // Test edge cases
            const edgeCases = [
                { bg: createTestGraphics(1, 1, 0xFFFFFF) }, // Very small
                { bg: createTestGraphics(1000, 100, 0xFFFFFF) }, // Very wide
                { bg: Texture.WHITE, secure: true, value: '', placeholder: '' }, // Secure with empty values
                { bg: Texture.WHITE, maxLength: 0, value: 'test' }, // Zero max length
            ];

            edgeCases.forEach((options, index) =>
            {
                expect(() =>
                {
                    const input = new Input(options);

                    expect(input).toBeInstanceOf(Input);
                }).not.toThrow(`Edge case ${index} should not throw`);
            });
        });

        it('should handle input mask functionality', () =>
        {
            // Test input with mask
            const options = {
                bg: createTestGraphics(200, 40, 0xFFFFFF),
                addMask: true,
                placeholder: 'Masked Input',
            };

            expect(() =>
            {
                new Input(options); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle clean on focus option', () =>
        {
            // Test cleanOnFocus option
            const options = {
                bg: createTestGraphics(200, 40, 0xFFFFFF),
                cleanOnFocus: true,
                value: 'Initial Value',
            };

            expect(() =>
            {
                const input = new Input(options);

                expect(input.value).toBe('Initial Value');
            }).not.toThrow();
        });

        it('should handle size changes correctly', () =>
        {
            // Test input resizing
            const input = new Input({
                bg: createTestGraphics(200, 40, 0xFFFFFF),
            });

            expect(() =>
            {
                input.width = 300;
                input.height = 60;
                expect(input.width).toBe(300);
                expect(input.height).toBe(60);
            }).not.toThrow();
        });

        it('should handle comprehensive option combinations', () =>
        {
            // Test complex option combinations
            const comprehensiveOptions = {
                bg: createTestGraphics(350, 80, 0xF5F5F5),
                placeholder: 'Comprehensive Test Input',
                value: 'Initial Text',
                maxLength: 50,
                align: 'left' as InputAlign,
                secure: false,
                textStyle: {
                    fill: '#2C3E50',
                    fontSize: 18,
                },
                padding: 10,
                cleanOnFocus: false,
                addMask: true,
            };

            expect(() =>
            {
                const input = new Input(comprehensiveOptions);

                expect(input.value).toBe('Initial Text');
                expect(input.secure).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Input Native Event Handling', () =>
    {
        // Regression tests for #257, #253 and #219. Text used to be reconstructed from
        // `keydown`, which on-screen keyboards do not populate: they report `Unidentified`
        // and only send the real character on the following `input` event. The component
        // fell back to the previously captured `input` data, so every key press inserted
        // the character before it.
        const startEditing = (input: Input) =>
        {
            (input as any)._startEditing();

            return (input as any).input as HTMLInputElement;
        };

        // Mirrors how a browser reports typing: the field updates, then `input` fires.
        const type = (native: HTMLInputElement, text: string, inputType = 'insertText') =>
        {
            native.value += text;
            native.dispatchEvent(new InputEvent('input', { data: text, inputType }));
        };

        it('should insert a character as soon as the input event fires', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50) });
            const native = startEditing(input);

            type(native, 'H');

            expect(input.value).toBe('H');
        });

        it('should not lag behind when keydown reports no usable key', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50) });
            const native = startEditing(input);

            // The Android sequence: keydown carries no character, `input` carries it.
            for (const char of 'Hello')
            {
                native.dispatchEvent(new KeyboardEvent('keydown', { key: 'Unidentified' }));
                type(native, char);
            }

            expect(input.value).toBe('Hello');
        });

        it('should not insert anything on keydown alone', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50) });
            const native = startEditing(input);

            native.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

            expect(input.value).toBe('');
        });

        it('should follow deletions made in the native field', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50) });
            const native = startEditing(input);

            type(native, 'Hi');
            expect(input.value).toBe('Hi');

            native.value = 'H';
            native.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward' }));

            expect(input.value).toBe('H');
        });

        it('should apply a keyboard suggestion as a replacement, not an append', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50) });
            const native = startEditing(input);

            type(native, 'Hel');

            // Picking a suggestion replaces the word being typed.
            native.value = 'Hello';
            native.dispatchEvent(new InputEvent('input', {
                data: 'Hello',
                inputType: 'insertReplacementText',
            }));

            expect(input.value).toBe('Hello');
        });

        it('should seed the native field with the current value', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'existing' });
            const native = startEditing(input);

            expect(native.value).toBe('existing');
        });

        it('should keep editing an existing value instead of restarting it', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'ab' });
            const native = startEditing(input);

            type(native, 'c');

            expect(input.value).toBe('abc');
        });

        it('should respect maxLength', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), maxLength: 3 });
            const native = startEditing(input);

            expect(native.maxLength).toBe(3);

            // Bypass the native limit the way a paste or suggestion can.
            native.value = 'abcdef';
            native.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }));

            expect(input.value).toBe('abc');
        });

        it('should emit onChange once per change', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50) });
            const native = startEditing(input);
            const changes: string[] = [];

            input.onChange.connect((value) => changes.push(value));

            type(native, 'a');
            type(native, 'b');

            expect(changes).toEqual(['a', 'ab']);
        });

        it('should stop editing on Enter and Escape', () =>
        {
            for (const key of ['Enter', 'Escape'])
            {
                const input = new Input({ bg: createTestGraphics(200, 50) });
                const native = startEditing(input);

                native.dispatchEvent(new KeyboardEvent('keydown', { key }));

                expect((input as any).editing).toBe(false);
            }
        });
    });

    describe('Input Selection', () =>
    {
        // The hidden field owns the caret and selection; the component mirrors them and draws
        // the caret and a highlight from `selectionStart`/`selectionEnd`. Pointer presses on
        // the canvas are mapped back onto the field with setSelectionRange.
        const startEditing = (input: Input, value?: string) =>
        {
            if (value !== undefined) input.value = value;
            (input as any)._startEditing();

            return (input as any).input as HTMLInputElement;
        };

        // What a browser does for arrows, Home/End and Shift-selection: it moves the field's
        // selection, and the component picks it up on its next tick.
        const moveSelection = (input: Input, start: number, end = start, direction = 'none') =>
        {
            ((input as any).input as HTMLInputElement).setSelectionRange(start, end, direction as any);
            (input as any).update(1);
        };

        // A pointer event at a fraction of the drawn text's width.
        const pointerAt = (input: Input, fraction: number, extra: Record<string, unknown> = {}) =>
        {
            const field = (input as any).inputField;
            const x = (input as any).textLeft + (field.width * fraction);
            const global = input.toGlobal(new Point(x, field.y));

            return { global, detail: 1, shiftKey: false, nativeEvent: { preventDefault: jest.fn() }, ...extra } as any;
        };

        const caretX = (input: Input) => (input as any)._cursor.x as number;
        const selection = (input: Input) => [(input as any).selectionStart, (input as any).selectionEnd];

        it('should start with the caret at the end of the value', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello' });

            startEditing(input);

            expect(selection(input)).toEqual([5, 5]);
        });

        it('should move the drawn caret with the native caret', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello' });

            startEditing(input);

            const atEnd = caretX(input);

            moveSelection(input, 0);
            const atStart = caretX(input);

            moveSelection(input, 2);
            const inside = caretX(input);

            expect(atStart).toBeLessThan(inside);
            expect(inside).toBeLessThan(atEnd);
            expect(atStart).toBeCloseTo((input as any).textLeft);
        });

        it('should keep the caret at the left edge of the text for every alignment', () =>
        {
            for (const align of ['left', 'center', 'right'] as const)
            {
                const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello', align });

                startEditing(input);
                moveSelection(input, 0);

                expect(caretX(input)).toBeCloseTo((input as any).textLeft);
            }
        });

        it('should mirror a Shift-extended selection and draw a highlight', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello world' });

            startEditing(input);
            moveSelection(input, 6, 11, 'forward');

            expect(selection(input)).toEqual([6, 11]);

            const bounds = (input as any)._selection.getLocalBounds();

            expect(bounds.width).toBeGreaterThan(0);
            expect(bounds.x).toBeCloseTo((input as any).textLeft + (input as any).offsetAt(6));
        });

        it('should put the caret at the focus end of a backward selection', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello' });

            startEditing(input);
            moveSelection(input, 1, 4, 'backward');

            expect(caretX(input)).toBeCloseTo((input as any).textLeft + (input as any).offsetAt(1));
        });

        it('should hide the blinking caret while a range is selected', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello' });

            startEditing(input);
            moveSelection(input, 0, 5);
            (input as any).update(1);

            expect((input as any)._cursor.alpha).toBe(0);

            moveSelection(input, 5, 5);
            (input as any).update(1);

            expect((input as any)._cursor.alpha).toBe(1);
        });

        it('should clear the highlight when editing stops', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello' });

            startEditing(input);
            moveSelection(input, 0, 5);
            (input as any).stopEditing();

            expect((input as any)._selection.getLocalBounds().width).toBe(0);
            expect(selection(input)).toEqual([5, 5]);
        });

        it('should place the caret where the pointer is pressed', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

            startEditing(input);
            (input as any).onPointerDown(pointerAt(input, 0.5));

            expect(selection(input)).toEqual([4, 4]);

            (input as any).onPointerDown(pointerAt(input, 0));
            expect(selection(input)).toEqual([0, 0]);

            (input as any).onPointerDown(pointerAt(input, 1));
            expect(selection(input)).toEqual([8, 8]);
        });

        it('should keep focus in the hidden field when pressed while editing', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const native = startEditing(input);
            const event = pointerAt(input, 0.5);

            (input as any).onPointerDown(event);

            expect(event.nativeEvent.preventDefault).toHaveBeenCalled();
            expect((input as any).input).toBe(native);
            expect((input as any).editing).toBe(true);
        });

        it('should select by dragging', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

            startEditing(input);
            (input as any).onPointerDown(pointerAt(input, 0.25));
            (input as any).onPointerMove(pointerAt(input, 0.75));

            expect(selection(input)).toEqual([2, 6]);
            expect((input as any).selectionDirection).toBe('forward');

            // Dragging back past the anchor flips the direction.
            (input as any).onPointerMove(pointerAt(input, 0));

            expect(selection(input)).toEqual([0, 2]);
            expect((input as any).selectionDirection).toBe('backward');

            (input as any).onPointerUp();
            (input as any).onPointerMove(pointerAt(input, 1));

            expect(selection(input)).toEqual([0, 2]);
        });

        it('should extend the selection on Shift+click', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

            startEditing(input);
            (input as any).onPointerDown(pointerAt(input, 0.25));
            (input as any).onPointerDown(pointerAt(input, 1, { shiftKey: true }));

            expect(selection(input)).toEqual([2, 8]);
        });

        it('should select a word on double click', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'one two three' });

            startEditing(input);
            // 'two' spans indices 4-7 of a 13-character string.
            (input as any).onPointerTap(pointerAt(input, 5.5 / 13, { detail: 2 }));

            expect(selection(input)).toEqual([4, 7]);
            expect(input.value.substring(4, 7)).toBe('two');
        });

        it('should select the word before the caret when double clicking just past it', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'one two' });

            startEditing(input);
            (input as any).selectWordAt(3);

            expect(selection(input)).toEqual([0, 3]);
        });

        it('should treat punctuation as its own run when selecting a word', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello... world' });

            startEditing(input);
            (input as any).selectWordAt(6);

            expect(selection(input)).toEqual([5, 8]);

            (input as any).selectWordAt(2);

            expect(selection(input)).toEqual([0, 5]);
        });

        it('should select everything on triple click', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'one two' });

            startEditing(input);
            (input as any).onPointerTap(pointerAt(input, 0.1, { detail: 3 }));

            expect(selection(input)).toEqual([0, 7]);
        });

        it('should expose selectAll', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abc' });

            startEditing(input);
            input.selectAll();

            expect(selection(input)).toEqual([0, 3]);
        });

        it('should place the caret where an idle input was pressed once editing starts', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

            (input as any).onPointerDown(pointerAt(input, 0.5));

            expect((input as any).pendingSelection).toEqual([4, 4]);

            startEditing(input);

            expect(selection(input)).toEqual([4, 4]);
            expect((input as any).pendingSelection).toBeUndefined();
        });

        it('should snap pointer positions to grapheme boundaries', () =>
        {
            // Each flag is a surrogate pair: four code units, two graphemes.
            const input = new Input({ bg: createTestGraphics(200, 50), value: '😀😀' });

            startEditing(input);

            for (const fraction of [0, 0.3, 0.5, 0.7, 1])
            {
                (input as any).onPointerDown(pointerAt(input, fraction));

                expect([0, 2, 4]).toContain((input as any).selectionStart);
            }
        });

        it('should keep the selection inside the text after a maxLength truncation', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), maxLength: 3 });
            const native = startEditing(input);

            native.value = 'abcdef';
            native.setSelectionRange(6, 6);
            native.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }));

            expect(input.value).toBe('abc');
            expect(native.selectionStart).toBe(3);
            expect(selection(input)).toEqual([3, 3]);
        });

        it('should clamp the mirrored selection when the value is set programmatically', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdef' });

            startEditing(input);
            moveSelection(input, 2, 6);
            input.value = 'ab';

            expect(selection(input)).toEqual([2, 2]);
        });

        it('should write programmatic edits back into the hidden field', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'ab' });
            const native = startEditing(input);

            (input as any)._add('c');

            expect(native.value).toBe('abc');
            expect(native.selectionStart).toBe(3);

            (input as any)._delete();

            expect(native.value).toBe('ab');
            expect(native.selectionStart).toBe(2);
        });

        it('should use a password field when secure', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), secure: true });
            const native = startEditing(input);

            expect(native.type).toBe('password');

            input.secure = false;
            expect(native.type).toBe('text');

            input.secure = true;
            expect(native.type).toBe('password');
        });

        it('should position the caret over the mask characters when secure', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd', secure: true });

            startEditing(input);
            moveSelection(input, 2);

            expect(caretX(input)).toBeCloseTo((input as any).textLeft + ((input as any).inputField.width / 2));
        });

        it('should scroll overflowing text so the caret stays visible', () =>
        {
            // jsdom's canvas mock does not measure text, so the drawn width is forced.
            const input = new Input({ bg: createTestGraphics(100, 40), padding: [0, 10, 0, 10], value: 'abcdefghij' });

            Object.defineProperty((input as any).inputField, 'width', { value: 1000, configurable: true });

            // Idle: the start of the text is shown.
            (input as any).align();
            expect((input as any).textLeft).toBe(10);
            expect((input as any).scrollX).toBe(0);

            // Editing starts with the caret at the end, which is scrolled into view at the right edge.
            startEditing(input);
            expect((input as any).scrollX).toBe(1000 - 80);
            expect(caretX(input)).toBe(90);

            // Home: the caret and the text start come back into view.
            moveSelection(input, 0);
            expect((input as any).scrollX).toBe(0);
            expect(caretX(input)).toBe(10);

            // A caret that is already in view does not scroll.
            moveSelection(input, 0);
            const before = (input as any).scrollX;

            moveSelection(input, 0);
            expect((input as any).scrollX).toBe(before);

            // Past the right edge: scroll only as far as needed to show the caret.
            const atFive = (input as any).offsetAt(5);

            moveSelection(input, 5);
            expect(caretX(input)).toBe(90);
            expect((input as any).scrollX).toBe(atFive - 80);

            // Left of the view now: scroll back only until the caret is at the left edge.
            moveSelection(input, 3);
            expect((input as any).scrollX).toBe((input as any).offsetAt(3));
            expect(caretX(input)).toBe(10);

            // Ending the session shows the start again.
            (input as any).stopEditing();
            expect((input as any).scrollX).toBe(0);
            expect((input as any).textLeft).toBe(10);
        });

        it('should not scroll text that fits', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), align: 'center', value: 'abc' });

            startEditing(input);
            moveSelection(input, 0);
            moveSelection(input, 3);

            expect((input as any).scrollX).toBe(0);
            expect((input as any).inputField.anchor.x).toBe(0.5);
        });

        it('should not re-activate from a tap made during the session', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abc' });

            startEditing(input);
            // A click inside the field while editing, then a click elsewhere on the page.
            input.emit('pointertap', pointerAt(input, 0.5));
            (input as any).stopEditing();
            (input as any).handleActivation();

            expect((input as any).editing).toBe(false);
        });

        it('should mask the highlight along with the text', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), addMask: true });

            expect((input as any)._selection.mask).toBe((input as any).inputMask);
        });
    });

    describe('Input Platform Edge Cases', () =>
    {
        // Behaviour that differs between desktop and touch browsers, or between keyboards.
        // Touch browsers move focus on the tap gesture, after the pointer was released; they
        // issue a new pointer id per touch, so Pixi's click count stays at 1; and IMEs and
        // Android keyboards compose text, which a write to the field would abort.
        const startEditing = (input: Input, value?: string) =>
        {
            if (value !== undefined) input.value = value;
            (input as any)._startEditing();

            return (input as any).input as HTMLInputElement;
        };

        const pointerAt = (input: Input, fraction: number, extra: Record<string, unknown> = {}) =>
        {
            const field = (input as any).inputField;
            const x = (input as any).textLeft + (field.width * fraction);
            const global = input.toGlobal(new Point(x, field.y));

            return { global, detail: 1, shiftKey: false, nativeEvent: { preventDefault: jest.fn() }, ...extra } as any;
        };

        const selection = (input: Input) => [(input as any).selectionStart, (input as any).selectionEnd];

        let now: jest.SpyInstance<number, []>;

        beforeEach(() =>
        {
            now = jest.spyOn(performance, 'now').mockReturnValue(1000);
        });

        afterEach(() =>
        {
            now.mockRestore();
        });

        it('should keep editing when the field blurs shortly after the press was released', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const native = startEditing(input);
            const onEnter = jest.fn();

            input.onEnter.connect(onEnter);

            // Touch order: pointerdown, pointerup, then the tap gesture moves focus.
            (input as any).onPointerDown(pointerAt(input, 0.5));
            (input as any).onPointerUp();
            now.mockReturnValue(1200);
            native.dispatchEvent(new Event('blur'));

            expect((input as any).editing).toBe(true);
            expect((input as any).input).toBe(native);
            expect(document.activeElement).toBe(native);
            expect(selection(input)).toEqual([2, 2]);
            expect(onEnter).not.toHaveBeenCalled();
        });

        it('should end editing when the field blurs long after the last press', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const native = startEditing(input);

            (input as any).onPointerDown(pointerAt(input, 0.5));
            (input as any).onPointerUp();
            now.mockReturnValue(2000);
            native.dispatchEvent(new Event('blur'));

            expect((input as any).editing).toBe(false);
            expect((input as any).input).toBeUndefined();
        });

        it('should not trap focus after a press that never reported a release', () =>
        {
            // A cancelled pointer (long-press menu, palm, incoming call) gets no pointerup.
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const native = startEditing(input);

            (input as any).onPointerDown(pointerAt(input, 0.5));
            now.mockReturnValue(5000);
            native.dispatchEvent(new Event('blur'));

            expect((input as any).editing).toBe(false);
        });

        it('should end editing when a press elsewhere follows its own press, however quickly', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const native = startEditing(input);

            (input as any).onPointerDown(pointerAt(input, 0.5));
            (input as any).onPointerUp();

            // A press on anything else on the page; the blur it causes is not the component's.
            now.mockReturnValue(1100);
            window.dispatchEvent(new Event('pointerdown'));
            native.dispatchEvent(new Event('blur'));

            expect((input as any).editing).toBe(false);
        });

        it('should end editing on a press elsewhere even when the browser never blurs the field', () =>
        {
            // iOS Safari keeps a field focused when non-interactive content is tapped.
            jest.useFakeTimers();

            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const onEnter = jest.fn();

            input.onEnter.connect(onEnter);
            startEditing(input);

            window.dispatchEvent(new Event('pointerdown'));
            jest.runAllTimers();

            expect((input as any).editing).toBe(false);
            expect(onEnter).toHaveBeenCalledTimes(1);

            jest.useRealTimers();
        });

        it('should keep editing on a press that lands on the component or on the hidden field', () =>
        {
            jest.useFakeTimers();

            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const native = startEditing(input);

            // On the canvas: the window listener runs first, then the component marks the press.
            window.dispatchEvent(new Event('pointerdown'));
            (input as any).onPointerDown(pointerAt(input, 0.5));
            jest.runAllTimers();

            expect((input as any).editing).toBe(true);

            // On the hidden field itself, which takes presses on touch devices.
            native.dispatchEvent(new Event('pointerdown', { bubbles: true }));
            jest.runAllTimers();

            expect((input as any).editing).toBe(true);

            // A second finger anywhere is not a press elsewhere.
            const second = new Event('pointerdown');

            Object.defineProperty(second, 'isPrimary', { value: false });
            window.dispatchEvent(second);
            jest.runAllTimers();

            expect((input as any).editing).toBe(true);

            jest.useRealTimers();
        });

        it('should still recognise its own press after a press elsewhere', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const native = startEditing(input);

            window.dispatchEvent(new Event('pointerdown'));
            // The capture listener runs first, then the component's own handler marks the press.
            (input as any).onPointerDown(pointerAt(input, 0.5));
            now.mockReturnValue(1100);
            native.dispatchEvent(new Event('blur'));

            expect((input as any).editing).toBe(true);
        });

        it('should count quick taps itself so a touch double tap selects a word', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello world' });

            startEditing(input);

            // Touch browsers give every tap a new pointer id, so Pixi reports detail 1 each time.
            input.emit('pointertap', pointerAt(input, 0.2));
            now.mockReturnValue(1150);
            input.emit('pointertap', pointerAt(input, 0.2));

            expect(selection(input)).toEqual([0, 5]);
        });

        it('should select everything on a touch triple tap', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello world' });

            startEditing(input);

            input.emit('pointertap', pointerAt(input, 0.2));
            now.mockReturnValue(1150);
            input.emit('pointertap', pointerAt(input, 0.2));
            now.mockReturnValue(1300);
            input.emit('pointertap', pointerAt(input, 0.2));

            expect(selection(input)).toEqual([0, 11]);
        });

        it('should start a new tap sequence when taps are far apart in time or place', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello world' });

            startEditing(input);
            (input as any).setSelection(3, 3);

            input.emit('pointertap', pointerAt(input, 0.2));
            now.mockReturnValue(2000);
            input.emit('pointertap', pointerAt(input, 0.2));

            expect(selection(input)).toEqual([3, 3]);

            // jsdom measures text as a few pixels wide, so place the far tap explicitly.
            now.mockReturnValue(2100);
            input.emit('pointertap', pointerAt(input, 0.9, { global: new Point(500, 25) }));

            expect(selection(input)).toEqual([3, 3]);
        });

        it('should ignore Enter and Escape while a composition is in progress', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50) });
            const native = startEditing(input);

            // Firefox and Safari report the real key with isComposing; Chrome reports keyCode 229.
            native.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }));
            expect((input as any).editing).toBe(true);

            native.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', isComposing: true }));
            expect((input as any).editing).toBe(true);

            native.dispatchEvent(new KeyboardEvent('keydown', { key: 'Process', keyCode: 229 } as any));
            expect((input as any).editing).toBe(true);

            native.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            expect((input as any).editing).toBe(false);
        });

        it('should wait for the composition to end before cutting to maxLength', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), maxLength: 3 });
            const native = startEditing(input);
            const onChange = jest.fn();

            input.onChange.connect(onChange);

            native.dispatchEvent(new CompositionEvent('compositionstart'));
            native.value = 'ab';
            native.dispatchEvent(new InputEvent('input', { inputType: 'insertCompositionText' }));

            expect(onChange).toHaveBeenLastCalledWith('ab');

            // Writing the field here would abort the composition, so the over-long text is only mirrored.
            native.value = 'abcd';
            native.dispatchEvent(new InputEvent('input', { inputType: 'insertCompositionText' }));

            expect(native.value).toBe('abcd');
            expect(input.value).toBe('abcd');
            expect(onChange).toHaveBeenCalledTimes(1);

            native.dispatchEvent(new CompositionEvent('compositionend'));

            expect(native.value).toBe('abc');
            expect(input.value).toBe('abc');
            expect(onChange).toHaveBeenLastCalledWith('abc');
            expect(onChange).toHaveBeenCalledTimes(2);
        });

        it('should not split a surrogate pair when cutting to maxLength', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), maxLength: 3 });
            const native = startEditing(input);

            native.value = 'ab😀';
            native.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }));

            expect(input.value).toBe('ab');
            expect(native.value).toBe('ab');
        });

        it('should turn off keyboard rewriting and password-manager interest on the field, overridably', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50) });
            const native = startEditing(input);

            expect(native.getAttribute('autocomplete')).toBe('off');
            expect(native.getAttribute('autocapitalize')).toBe('off');
            expect(native.getAttribute('autocorrect')).toBe('off');
            expect(native.getAttribute('spellcheck')).toBe('false');
            expect(native.getAttribute('data-1p-ignore')).toBe('true');
            // Anything smaller makes iOS Safari zoom the page in on focus, moving the field from under the finger.
            expect(native.style.fontSize).toBe('16px');

            const custom = new Input({
                bg: createTestGraphics(200, 50),
                inputAttributes: { autocapitalize: 'words', inputmode: 'numeric', enterkeyhint: 'done' },
            });
            const customNative = startEditing(custom);

            expect(customNative.getAttribute('autocapitalize')).toBe('words');
            expect(customNative.getAttribute('inputmode')).toBe('numeric');
            expect(customNative.getAttribute('enterkeyhint')).toBe('done');
            expect(customNative.getAttribute('autocorrect')).toBe('off');
        });

        it('should empty the field before removing it, so nothing is offered for saving', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hunter2', secure: true });
            const native = startEditing(input);

            (input as any).stopEditing();

            expect(native.value).toBe('');
            expect(native.isConnected).toBe(false);
            expect(input.value).toBe('hunter2');
        });

        it('should keep the selection when secure is toggled while editing', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdef' });
            const native = startEditing(input);

            (input as any).setSelection(1, 3);
            input.secure = true;

            expect(native.type).toBe('password');
            expect([native.selectionStart, native.selectionEnd]).toEqual([1, 3]);
            expect(selection(input)).toEqual([1, 3]);
        });

        it('should ignore a second finger', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

            startEditing(input);
            (input as any).setSelection(2, 2);
            (input as any).onPointerDown(pointerAt(input, 0.75, { isPrimary: false }));

            expect(selection(input)).toEqual([2, 2]);
            expect((input as any).dragAnchor).toBeUndefined();
        });

        it('should keep a selection on a right click inside it and place the caret outside it', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

            startEditing(input);
            (input as any).setSelection(2, 6);

            const inside = pointerAt(input, 0.5, { button: 2 });

            (input as any).onPointerDown(inside);

            expect(selection(input)).toEqual([2, 6]);
            expect((input as any).dragAnchor).toBeUndefined();
            // Focus still moves on a right press, so it is still cancelled and still marks the press.
            expect(inside.nativeEvent.preventDefault).toHaveBeenCalled();

            (input as any).onPointerDown(pointerAt(input, 0.1, { button: 2 }));

            expect(selection(input)).toEqual([1, 1]);
        });

        it('should put the selection back after the context menu request collapses it', () =>
        {
            jest.useFakeTimers();

            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });
            const native = startEditing(input);

            (input as any).setSelection(2, 6);
            (input as any).onPointerDown(pointerAt(input, 0.5, { button: 2 }));

            // Chromium adjusts the document selection while showing the menu, after the press.
            window.dispatchEvent(new Event('contextmenu'));
            native.setSelectionRange(0, 0);
            (input as any).update(1);
            expect(selection(input)).toEqual([0, 0]);

            jest.runAllTimers();

            expect(selection(input)).toEqual([2, 6]);
            expect([native.selectionStart, native.selectionEnd]).toEqual([2, 6]);

            // A menu request with no press of the component's own leaves the selection alone.
            native.setSelectionRange(1, 1);
            window.dispatchEvent(new Event('contextmenu'));
            jest.runAllTimers();
            (input as any).update(1);

            expect(selection(input)).toEqual([1, 1]);

            jest.useRealTimers();
        });

        it('should not count a right click as a multi-click', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello world' });

            startEditing(input);
            (input as any).setSelection(3, 3);

            input.emit('pointertap', pointerAt(input, 0.2, { button: 2 }));
            now.mockReturnValue(1100);
            input.emit('pointertap', pointerAt(input, 0.2, { button: 2 }));

            expect(selection(input)).toEqual([3, 3]);
        });

        it('should measure the text once per change rather than on every pointer move', () =>
        {
            // Setting the value draws the caret, which measures the text and fills the cache.
            const measure = jest.spyOn(Input.prototype as any, 'measureText');
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

            startEditing(input);
            expect(measure).toHaveBeenCalled();

            measure.mockClear();
            (input as any).indexAtLocalX(20);
            (input as any).indexAtLocalX(30);
            (input as any).offsetAt(3);
            expect(measure).not.toHaveBeenCalled();

            input.value = 'abc';
            (input as any).indexAtLocalX(10);
            expect(measure).toHaveBeenCalled();

            measure.mockRestore();
        });

        it('should never wrap the text, whatever the style asks', () =>
        {
            const input = new Input({
                bg: createTestGraphics(200, 50),
                textStyle: { wordWrap: true, wordWrapWidth: 10 },
                value: 'a long value that would wrap',
            });

            expect((input as any).inputField.style.wordWrap).toBe(false);
        });

        it('should not take two quick clicks at different places for a double click', () =>
        {
            // Pixi reports detail 2 for any two quick clicks on the component, wherever they land.
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello world' });

            startEditing(input);
            (input as any).setSelection(3, 3);

            input.emit('pointertap', pointerAt(input, 0.1, { detail: 1 }));
            now.mockReturnValue(1100);
            input.emit('pointertap', pointerAt(input, 0.9, { detail: 2, global: new Point(500, 25) }));

            expect(selection(input)).toEqual([3, 3]);
        });

        it('should count a mouse double click within the OS double-click window, but not a slow double tap', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello world' });

            startEditing(input);

            input.emit('pointertap', pointerAt(input, 0.2, { pointerType: 'mouse' }));
            now.mockReturnValue(1450);
            input.emit('pointertap', pointerAt(input, 0.2, { pointerType: 'mouse' }));

            expect(selection(input)).toEqual([0, 5]);

            (input as any).setSelection(3, 3);
            now.mockReturnValue(5000);
            input.emit('pointertap', pointerAt(input, 0.2, { pointerType: 'touch' }));
            now.mockReturnValue(5450);
            input.emit('pointertap', pointerAt(input, 0.2, { pointerType: 'touch' }));

            expect(selection(input)).toEqual([3, 3]);
        });

        it('should keep a drag-selection moving while it is held past an edge of overflowing text', () =>
        {
            // jsdom's canvas mock does not measure text, so the drawn width is forced.
            const input = new Input({ bg: createTestGraphics(100, 40), padding: [0, 10, 0, 10], value: 'abcdefghij' });

            Object.defineProperty((input as any).inputField, 'width', { value: 1000, configurable: true });
            startEditing(input);

            const field = (input as any).inputField;
            const at = (localX: number) => ({
                global: input.toGlobal(new Point(localX, field.y)),
                detail: 1,
                shiftKey: false,
                button: 0,
                nativeEvent: { preventDefault: jest.fn() },
            }) as any;

            // Press inside the view, near the right edge, then drag far past the left one.
            (input as any).onPointerDown(at(85));
            const anchor = (input as any).dragAnchor;

            (input as any).onPointerMove(at(-500));

            // The move selects up to the edge rather than jumping into the hidden text...
            const first = (input as any).selectionStart;

            expect(first).toBeGreaterThan(0);
            expect((input as any).selectionDirection).toBe('backward');

            // ...and holding it there keeps extending, with the text following, until the start.
            const scrolls: number[] = [];

            for (let frame = 0; frame < 3 * 12; frame++)
            {
                (input as any).update(1);
                scrolls.push((input as any).scrollX);
            }

            expect((input as any).selectionStart).toBe(0);
            expect((input as any).selectionEnd).toBe(anchor);
            expect((input as any).scrollX).toBe(0);
            expect(scrolls[0]).toBeGreaterThanOrEqual(scrolls[scrolls.length - 1]);

            // Releasing stops it.
            (input as any).onPointerUp();
            (input as any).setSelection(5, 5);
            for (let frame = 0; frame < 9; frame++) (input as any).update(1);

            expect(selection(input)).toEqual([5, 5]);
        });

        it('should not auto-scroll a drag over text that fits', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

            startEditing(input);
            (input as any).onPointerDown(pointerAt(input, 0.5));
            (input as any).onPointerMove({ ...pointerAt(input, 0), global: new Point(-500, 25) });

            const before = selection(input);

            for (let frame = 0; frame < 9; frame++) (input as any).update(1);

            expect(selection(input)).toEqual(before);
        });

        it('should push a value set during a session into the hidden field, so typing keeps it', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'the quick brown' });
            const native = startEditing(input);

            native.setSelectionRange(4, 15);
            (input as any).update(1);

            input.value = 'abc';

            expect(native.value).toBe('abc');
            expect([native.selectionStart, native.selectionEnd]).toEqual([3, 3]);
            expect(selection(input)).toEqual([3, 3]);

            // The next keystroke edits the new value, not the one the field used to hold.
            native.value = 'abcx';
            native.setSelectionRange(4, 4);
            native.dispatchEvent(new InputEvent('input', { data: 'x', inputType: 'insertText' }));

            expect(input.value).toBe('abcx');
        });

        it('should collapse a selected range when the value is replaced during a session', () =>
        {
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'hello world' });
            const native = startEditing(input);

            native.setSelectionRange(0, 5);
            (input as any).update(1);
            input.value = 'abc';

            expect([native.selectionStart, native.selectionEnd]).toEqual([3, 3]);
            expect(selection(input)).toEqual([3, 3]);
        });

        it('should leave the hidden field alone when the value set is what it already holds', () =>
        {
            // That is the field reporting its own edit, which may be mid-composition.
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'abcd' });
            const native = startEditing(input);

            native.setSelectionRange(1, 2);
            input.value = 'abcd';

            expect([native.selectionStart, native.selectionEnd]).toEqual([1, 2]);
        });

        it('should snap presses to the characters of a masked value, not to the mask', () =>
        {
            // The mask is one character per code unit, so an emoji draws as two; the caret must
            // still never land between them.
            const input = new Input({ bg: createTestGraphics(200, 50), value: 'a\u{1F600}b', secure: true });

            startEditing(input);

            for (const fraction of [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1])
            {
                (input as any).onPointerDown(pointerAt(input, fraction));
                (input as any).onPointerUp();

                expect([0, 1, 3, 4]).toContain((input as any).selectionStart);
            }

            // Two masked values of one length draw the same but have different boundaries.
            input.value = 'abcd';
            expect((input as any).textMetrics().boundaries).toEqual([0, 1, 2, 3, 4]);
            input.value = 'a\u{1F600}b';
            expect((input as any).textMetrics().boundaries).toEqual([0, 1, 3, 4]);
        });

        describe('on touch devices', () =>
        {
            // The field keeps pointer events there, since its long-press callout is the only
            // paste path on iOS; a tap on it is mapped onto the drawn text from the click.
            class TouchInput extends Input
            {
                protected override get fieldTakesPointer(): boolean
                {
                    return true;
                }
            }

            const clickAt = (input: Input, native: HTMLInputElement, fraction: number) =>
            {
                const field = (input as any).inputField;
                const x = (input as any).textLeft + (field.width * fraction);
                const { x: clientX, y: clientY } = input.toGlobal(new Point(x, field.y));

                native.getBoundingClientRect = () => ({ left: 0, top: 0 } as DOMRect);
                native.dispatchEvent(new MouseEvent('click', { clientX, clientY }));
            };

            it('should leave the field clickable', () =>
            {
                const input = new TouchInput({ bg: createTestGraphics(200, 50) });
                const native = startEditing(input);

                expect(native.style.pointerEvents).not.toBe('none');
            });

            it('should place the caret where a tap landed on the drawn text', () =>
            {
                const input = new TouchInput({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });
                const native = startEditing(input);

                clickAt(input, native, 0.5);

                expect(selection(input)).toEqual([4, 4]);
                expect(native.selectionStart).toBe(4);
            });

            const pointAt = (input: Input, fraction: number) =>
            {
                const field = (input as any).inputField;
                const x = (input as any).textLeft + (field.width * fraction);
                const { x: clientX, y: clientY } = input.toGlobal(new Point(x, field.y));

                return { clientX, clientY };
            };

            const press = (native: HTMLInputElement, type: string, at: { clientX: number; clientY: number }) =>
            {
                native.getBoundingClientRect = () => ({ left: 0, top: 0 } as DOMRect);
                native.dispatchEvent(new MouseEvent(type, at));
            };

            it('should select a word on a double tap on the field', () =>
            {
                const input = new TouchInput({ bg: createTestGraphics(200, 50), value: 'hello world' });
                const native = startEditing(input);

                clickAt(input, native, 0.2);
                now.mockReturnValue(1150);
                clickAt(input, native, 0.2);

                expect(selection(input)).toEqual([0, 5]);
            });

            it('should select everything on a triple tap on the field', () =>
            {
                const input = new TouchInput({ bg: createTestGraphics(200, 50), value: 'hello world' });
                const native = startEditing(input);

                clickAt(input, native, 0.2);
                now.mockReturnValue(1150);
                clickAt(input, native, 0.2);
                now.mockReturnValue(1300);
                clickAt(input, native, 0.2);

                expect(selection(input)).toEqual([0, 11]);
            });

            it('should select by dragging across the field', () =>
            {
                const input = new TouchInput({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });

                // jsdom measures text as a few pixels wide; scale up so the drag clears the threshold.
                input.scale.set(20);

                const native = startEditing(input);

                press(native, 'pointerdown', pointAt(input, 0.25));
                press(native, 'pointermove', pointAt(input, 0.75));

                expect(selection(input)).toEqual([2, 6]);
                expect((input as any).selectionDirection).toBe('forward');

                // Dragging back past the anchor flips the direction.
                press(native, 'pointermove', pointAt(input, 0));

                expect(selection(input)).toEqual([0, 2]);
                expect((input as any).selectionDirection).toBe('backward');

                // The click that ends the press is not a tap; the drag's selection stays.
                press(native, 'pointerup', pointAt(input, 0));
                press(native, 'click', pointAt(input, 0));

                expect(selection(input)).toEqual([0, 2]);

                // A later tap is a tap again.
                now.mockReturnValue(5000);
                press(native, 'click', pointAt(input, 0.5));

                expect(selection(input)).toEqual([4, 4]);
            });

            it('should not take a press that barely moves for a drag', () =>
            {
                const input = new TouchInput({ bg: createTestGraphics(200, 50), value: 'abcdefgh' });
                const native = startEditing(input);
                const at = pointAt(input, 0.5);

                press(native, 'pointerdown', at);
                press(native, 'pointermove', { clientX: at.clientX + 2, clientY: at.clientY + 1 });
                press(native, 'pointerup', at);
                press(native, 'click', at);

                expect(selection(input)).toEqual([4, 4]);
            });

            it('should let a drag reach the field rather than scroll the page', () =>
            {
                const input = new TouchInput({ bg: createTestGraphics(200, 50) });
                const native = startEditing(input);

                expect(native.style.touchAction).toBe('none');
            });
        });
    });
});

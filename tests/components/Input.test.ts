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
});

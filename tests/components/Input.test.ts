import { Graphics, Texture } from 'pixi.js';
import { Input } from '../../src/Input';
import { cleanup, createTestGraphics, testStateChange } from '../utils/components';

type AlignType = 'left' | 'center' | 'right';

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
                align: 'left' as AlignType,
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
});

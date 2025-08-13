import { Graphics } from 'pixi.js';
import { CheckBox } from '../../src/CheckBox';
import { defaultTextStyle } from '../../src/utils/helpers/styles';
import { cleanup, createTestGraphics, testStateChange } from '../utils/components';

describe('CheckBox Component', () =>
{
    afterEach(() =>
    {
        cleanup();
    });

    describe('CheckBox Creation and Basic Properties', () =>
    {
        const defaultCheckBoxOptions = {
            text: 'Checkbox',
            checked: false,
            style: {
                unchecked: createTestGraphics(50, 50, 0xF1D583),
                checked: new Graphics()
                    .roundRect(-2, -2, 54, 54, 11)
                    .fill(0xDCB000)
                    .roundRect(0, 0, 50, 50, 11)
                    .fill(0xF1D583)
                    .roundRect(3, 3, 44, 44, 11)
                    .fill(0xFFFFFF)
                    .roundRect(5, 5, 40, 40, 11)
                    .fill(0xA5E24D),
                text: {
                    ...defaultTextStyle,
                    fontSize: 22,
                    fill: '#FFFFFF',
                },
            },
        };

        it('should create CheckBox with default properties', () =>
        {
            // Test basic CheckBox creation
            const checkBox = new CheckBox(defaultCheckBoxOptions);

            expect(checkBox.checked).toBe(false);
            expect(checkBox.text).toBe('Checkbox');
            expect(checkBox.onCheck).toBeDefined();
            expect(checkBox.style).toBeDefined();
        });

        it('should create CheckBox with minimal style options', () =>
        {
            // Test CheckBox with minimal style configuration
            const minimalOptions = {
                style: {
                    unchecked: createTestGraphics(30, 30, 0xFFFFFF),
                    checked: createTestGraphics(30, 30, 0x00FF00),
                },
            };

            const checkBox = new CheckBox(minimalOptions);

            expect(checkBox.checked).toBe(false); // Default unchecked
            expect(checkBox.text).toBe(''); // No text provided
            expect(checkBox.style.unchecked).toBeDefined();
            expect(checkBox.style.checked).toBeDefined();
        });

        it('should create CheckBox with checked state initially', () =>
        {
            // Test CheckBox created in checked state
            const checkedOptions = {
                ...defaultCheckBoxOptions,
                checked: true,
            };

            const checkBox = new CheckBox(checkedOptions);

            expect(checkBox.checked).toBe(true);
            expect(checkBox.text).toBe('Checkbox');
            expect(checkBox.onCheck).toBeDefined();
        });
    });

    describe('CheckBox State Management', () =>
    {
        let checkBox: CheckBox;
        const testOptions = {
            text: 'Test CheckBox',
            checked: false,
            style: {
                unchecked: createTestGraphics(40, 40, 0xEEEEEE),
                checked: createTestGraphics(40, 40, 0x4CAF50),
                text: {
                    fontSize: 16,
                    fill: '#333333',
                },
            },
        };

        beforeEach(() =>
        {
            checkBox = new CheckBox(testOptions);
        });

        it('should handle checked state transitions', () =>
        {
            // Test state transitions
            testStateChange(checkBox, 'checked', false, true);
            testStateChange(checkBox, 'checked', true, false);
        });

        it('should maintain state consistency', () =>
        {
            // Test that state changes are properly maintained
            checkBox.checked = true;
            expect(checkBox.checked).toBe(true);

            checkBox.checked = false;
            expect(checkBox.checked).toBe(false);
        });

        it('should handle multiple state toggles', () =>
        {
            // Test rapid state changes
            const initialState = checkBox.checked;

            checkBox.checked = !initialState;
            expect(checkBox.checked).toBe(!initialState);

            checkBox.checked = initialState;
            expect(checkBox.checked).toBe(initialState);

            checkBox.checked = !initialState;
            expect(checkBox.checked).toBe(!initialState);
        });

        it('should handle forceCheck without triggering events', () =>
        {
            // Test forceCheck method (silent state change)
            checkBox.forceCheck(true);
            expect(checkBox.checked).toBe(true);

            checkBox.forceCheck(false);
            expect(checkBox.checked).toBe(false);
        });
    });

    describe('CheckBox Event System', () =>
    {
        let checkBox: CheckBox;
        let mockAction: jest.Mock;

        const testOptions = {
            text: 'Event Test CheckBox',
            checked: false,
            style: {
                unchecked: createTestGraphics(35, 35, 0xF0F0F0),
                checked: createTestGraphics(35, 35, 0x2196F3),
            },
        };

        beforeEach(() =>
        {
            checkBox = new CheckBox(testOptions);
            mockAction = jest.fn();
        });

        it('should connect onCheck handler successfully', () =>
        {
            // Test onCheck event connection
            const connection = checkBox.onCheck.connect((checked) => mockAction(`checked: ${checked}`));

            expect(connection).toBeDefined();
            expect(typeof connection.disconnect).toBe('function');
        });

        it('should handle onCheck event firing', () =>
        {
            // Test onCheck event emission
            checkBox.onCheck.connect(mockAction);

            checkBox.checked = true;

            expect(mockAction).toHaveBeenCalledWith(true);
            expect(mockAction).toHaveBeenCalledTimes(1);
        });

        it('should handle multiple onCheck listeners', () =>
        {
            // Test multiple event listeners
            const mockAction2 = jest.fn();

            checkBox.onCheck.connect(mockAction);
            checkBox.onCheck.connect(mockAction2);

            checkBox.checked = true;

            expect(mockAction).toHaveBeenCalledWith(true);
            expect(mockAction2).toHaveBeenCalledWith(true);
            expect(mockAction).toHaveBeenCalledTimes(1);
            expect(mockAction2).toHaveBeenCalledTimes(1);
        });

        it('should not fire onCheck event with forceCheck', () =>
        {
            // Test that forceCheck doesn't emit events
            checkBox.onCheck.connect(mockAction);

            checkBox.forceCheck(true);

            expect(mockAction).not.toHaveBeenCalled();
        });

        it('should disconnect event listeners properly', () =>
        {
            // Test event listener disconnection
            checkBox.onCheck.connect(mockAction);

            checkBox.checked = true;
            expect(mockAction).toHaveBeenCalledTimes(1);

            checkBox.onCheck.disconnectAll();
            checkBox.checked = false;
            expect(mockAction).toHaveBeenCalledTimes(1); // Should not increase
        });
    });

    describe('CheckBox Text Management', () =>
    {
        let checkBox: CheckBox;
        const testOptions = {
            text: 'Initial Text',
            style: {
                unchecked: createTestGraphics(30, 30, 0xDDDDDD),
                checked: createTestGraphics(30, 30, 0x009688),
                text: {
                    fontSize: 14,
                    fill: '#666666',
                },
            },
        };

        beforeEach(() =>
        {
            checkBox = new CheckBox(testOptions);
        });

        it('should handle text changes', () =>
        {
            // Test text property getter/setter
            testStateChange(checkBox, 'text', 'Initial Text', 'Updated Text');
            testStateChange(checkBox, 'text', 'Updated Text', 'Final Text');
        });

        it('should handle empty and whitespace text', () =>
        {
            // Test edge cases for text values
            const testTexts = ['', ' ', '   ', 'Normal Text', '\t\n'];

            testTexts.forEach((text) =>
            {
                checkBox.text = text;
                expect(checkBox.text).toBe(text);
            });
        });

        it('should handle special characters in text', () =>
        {
            // Test special characters in text
            const specialTexts = [
                'Text with @#$%^&*()',
                'Multi\nLine Text',
                'Unicode: 🎉✨🚀',
                'Quotes: "Hello World"',
                'Apostrophes: \'Test\'',
            ];

            specialTexts.forEach((text) =>
            {
                checkBox.text = text;
                expect(checkBox.text).toBe(text);
            });
        });

        it('should handle text removal', () =>
        {
            // Test removing text
            expect(checkBox.text).toBe('Initial Text');

            checkBox.text = '';
            expect(checkBox.text).toBe('');

            // Re-adding text should work
            checkBox.text = 'Restored Text';
            expect(checkBox.text).toBe('Restored Text');
        });
    });

    describe('CheckBox Style Management', () =>
    {
        it('should handle style changes', () =>
        {
            // Test style property getter/setter
            const checkBox = new CheckBox({
                style: {
                    unchecked: createTestGraphics(25, 25, 0xEEEEEE),
                    checked: createTestGraphics(25, 25, 0xFF5722),
                },
            });

            const newStyle = {
                unchecked: createTestGraphics(35, 35, 0xF0F0F0),
                checked: createTestGraphics(35, 35, 0x8BC34A),
                text: {
                    fontSize: 18,
                    fill: '#444444',
                },
            };

            checkBox.style = newStyle;
            expect(checkBox.style).toBe(newStyle);
            expect(checkBox.style.text).toBeDefined();
            expect(checkBox.style.text.fontSize).toBe(18);
        });

        it('should handle different text styles', () =>
        {
            // Test various text style configurations
            const textStyles = [
                { fontSize: 12, fill: '#000000' },
                { fontSize: 20, fill: '#FF0000', fontWeight: 'bold' },
                { fontSize: 16, fill: '#0000FF', fontStyle: 'italic' },
                { fontSize: 18, fill: '#00FF00', fontFamily: 'Arial' },
            ];

            textStyles.forEach((textStyle, _index) =>
            {
                const options = {
                    text: 'Styled CheckBox',
                    style: {
                        unchecked: createTestGraphics(30, 30, 0xFFFFFF),
                        checked: createTestGraphics(30, 30, 0x4CAF50),
                        text: textStyle,
                    },
                };

                const checkBox = new CheckBox(options);

                expect(checkBox.text).toBe('Styled CheckBox');
                expect(checkBox.style.text).toEqual(textStyle);
            });
        });

        it('should handle text offset configuration', () =>
        {
            // Test textOffset option in style
            const options = {
                text: 'Offset CheckBox',
                style: {
                    unchecked: createTestGraphics(40, 40, 0xFFFFFF),
                    checked: createTestGraphics(40, 40, 0x607D8B),
                    textOffset: {
                        x: 15,
                        y: -5,
                    },
                    text: {
                        fontSize: 16,
                        fill: '#333333',
                    },
                },
            };

            const checkBox = new CheckBox(options);

            expect(checkBox.text).toBe('Offset CheckBox');
            expect(checkBox.style.textOffset).toBeDefined();
            expect(checkBox.style.textOffset.x).toBe(15);
            expect(checkBox.style.textOffset.y).toBe(-5);
        });

        it('should preserve checked state when changing styles', () =>
        {
            // Test that checked state is preserved during style changes
            const checkBox = new CheckBox({
                checked: true,
                style: {
                    unchecked: createTestGraphics(30, 30, 0xEEEEEE),
                    checked: createTestGraphics(30, 30, 0x3F51B5),
                },
            });

            expect(checkBox.checked).toBe(true);

            const newStyle = {
                unchecked: createTestGraphics(25, 25, 0xF0F0F0),
                checked: createTestGraphics(25, 25, 0xE91E63),
            };

            checkBox.style = newStyle;
            expect(checkBox.checked).toBe(true); // Should remain checked
        });
    });

    describe('CheckBox Configuration Options', () =>
    {
        it('should handle different checkbox sizes', () =>
        {
            // Test various checkbox sizes
            const sizes = [
                { width: 15, height: 15 },
                { width: 30, height: 30 },
                { width: 50, height: 50 },
                { width: 80, height: 80 },
            ];

            sizes.forEach(({ width, height }) =>
            {
                const options = {
                    text: `${width}x${height} CheckBox`,
                    style: {
                        unchecked: createTestGraphics(width, height, 0xFFFFFF),
                        checked: createTestGraphics(width, height, 0x00BCD4),
                    },
                };

                const checkBox = new CheckBox(options);

                expect(checkBox.text).toBe(`${width}x${height} CheckBox`);
                expect(checkBox.style.unchecked).toBeDefined();
                expect(checkBox.style.checked).toBeDefined();
            });
        });

        it('should handle different visual states', () =>
        {
            // Test various visual style combinations
            const visualConfigurations = [
                {
                    unchecked: createTestGraphics(40, 40, 0xE0E0E0),
                    checked: createTestGraphics(40, 40, 0x4CAF50),
                },
                {
                    unchecked: new Graphics().circle(0, 0, 20).fill(0xFFFFFF).stroke({ color: 0x999999, width: 2 }),
                    checked: new Graphics().circle(0, 0, 20).fill(0xFF5722).stroke({ color: 0x999999, width: 2 }),
                },
                {
                    unchecked: new Graphics().roundRect(0, 0, 35, 35, 8).fill(0xFAFAFA),
                    checked: new Graphics().roundRect(0, 0, 35, 35, 8).fill(0x9C27B0),
                },
            ];

            visualConfigurations.forEach((style, _index) =>
            {
                const options = {
                    text: 'Visual Test',
                    style,
                };

                const checkBox = new CheckBox(options);

                expect(checkBox.text).toBe('Visual Test');
                expect(checkBox.style).toBe(style);
                expect(checkBox.checked).toBe(false); // Default state
            });
        });
    });

    describe('CheckBox Advanced Features', () =>
    {
        it('should handle custom TextClass', () =>
        {
            // Test custom TextClass option
            const options = {
                TextClass: Text, // Explicitly provide TextClass
                style: {
                    unchecked: createTestGraphics(35, 35, 0xFFFFFF),
                    checked: createTestGraphics(35, 35, 0x673AB7),
                },
            };

            const checkBox = new CheckBox(options);

            expect(checkBox.text).toBe(''); // No text provided
            expect(checkBox.style.unchecked).toBeDefined();
            expect(checkBox.style.checked).toBeDefined();
        });

        it('should handle complex graphics configurations', () =>
        {
            // Test CheckBox with complex graphic styles
            const complexUnchecked = new Graphics()
                .roundRect(-2, -2, 44, 44, 8)
                .fill(0xCCCCCC)
                .roundRect(0, 0, 40, 40, 6)
                .fill(0xFFFFFF)
                .stroke({ color: 0x999999, width: 1 });

            const complexChecked = new Graphics()
                .roundRect(-2, -2, 44, 44, 8)
                .fill(0x388E3C)
                .roundRect(0, 0, 40, 40, 6)
                .fill(0x4CAF50)
                .roundRect(5, 5, 30, 30, 4)
                .fill(0xFFFFFF)
                .moveTo(12, 20)
                .lineTo(18, 26)
                .lineTo(28, 14)
                .stroke({ color: 0x4CAF50, width: 3 });

            const options = {
                text: 'Complex CheckBox',
                style: {
                    unchecked: complexUnchecked,
                    checked: complexChecked,
                    text: {
                        fontSize: 16,
                        fill: '#2E7D32',
                    },
                },
            };

            const checkBox = new CheckBox(options);

            expect(checkBox.text).toBe('Complex CheckBox');
            expect(checkBox.style.unchecked).toBe(complexUnchecked);
            expect(checkBox.style.checked).toBe(complexChecked);
            expect(checkBox.style.text.fontSize).toBe(16);
        });

        it('should handle edge case configurations', () =>
        {
            // Test edge cases
            const edgeCases = [
                {
                    text: '', // Empty text
                    style: {
                        unchecked: createTestGraphics(1, 1, 0xFFFFFF), // Very small
                        checked: createTestGraphics(1, 1, 0x00FF00),
                    },
                },
                {
                    text: 'A'.repeat(100), // Very long text
                    style: {
                        unchecked: createTestGraphics(20, 20, 0xFFFFFF),
                        checked: createTestGraphics(20, 20, 0xFF0000),
                    },
                },
                {
                    checked: true, // No text, initially checked
                    style: {
                        unchecked: createTestGraphics(30, 30, 0xEEEEEE),
                        checked: createTestGraphics(30, 30, 0x795548),
                    },
                },
            ];

            edgeCases.forEach((options, _index) =>
            {
                const checkBox = new CheckBox(options);

                expect(checkBox).toBeInstanceOf(CheckBox);
                expect(checkBox.style.unchecked).toBeDefined();
                expect(checkBox.style.checked).toBeDefined();
                expect(typeof checkBox.checked).toBe('boolean');
            });
        });

        it('should handle comprehensive option combinations', () =>
        {
            // Test complex option combinations
            const comprehensiveOptions = {
                text: 'Comprehensive CheckBox Test',
                checked: false,
                style: {
                    unchecked: new Graphics()
                        .roundRect(-3, -3, 46, 46, 12)
                        .fill(0xE0E0E0)
                        .roundRect(0, 0, 40, 40, 8)
                        .fill(0xFAFAFA)
                        .stroke({ color: 0xBBBBBB, width: 1 }),
                    checked: new Graphics()
                        .roundRect(-3, -3, 46, 46, 12)
                        .fill(0x1976D2)
                        .roundRect(0, 0, 40, 40, 8)
                        .fill(0x2196F3)
                        .roundRect(3, 3, 34, 34, 6)
                        .fill(0xFFFFFF)
                        .roundRect(8, 8, 24, 24, 4)
                        .fill(0x1976D2),
                    text: {
                        fontSize: 18,
                        fill: '#1976D2',
                        fontWeight: 'bold',
                        fontFamily: 'Arial',
                    },
                    textOffset: {
                        x: 8,
                        y: 2,
                    },
                },
            };

            const checkBox = new CheckBox(comprehensiveOptions);

            expect(checkBox.text).toBe('Comprehensive CheckBox Test');
            expect(checkBox.checked).toBe(false);
            expect(checkBox.onCheck).toBeDefined();
            expect(checkBox.style.textOffset).toBeDefined();
            expect(checkBox.style.textOffset.x).toBe(8);
            expect(checkBox.style.textOffset.y).toBe(2);
        });
    });
});

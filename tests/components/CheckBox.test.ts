import { Graphics } from 'pixi.js';
import { CheckBox } from '../../src/CheckBox';
import { defaultTextStyle } from '../../src/utils/helpers/styles';

describe('CheckBox Component', () => {
    describe('CheckBox with Graphics', () => {
        const defaultCheckBoxOptions = {
            text: 'Checkbox',
            checked: false,
            style: {
                unchecked: new Graphics()
                    .roundRect(-2, -2, 54, 54, 11)
                    .fill('#DCB000')
                    .roundRect(0, 0, 50, 50, 11)
                    .fill('#F1D583'),
                checked: new Graphics()
                    .roundRect(-2, -2, 54, 54, 11)
                    .fill('#DCB000')
                    .roundRect(0, 0, 50, 50, 11)
                    .fill('#F1D583')
                    .roundRect(3, 3, 44, 44, 11)
                    .fill('#FFFFFF')
                    .roundRect(5, 5, 40, 40, 11)
                    .fill('#A5E24D'),
                text: {
                    ...defaultTextStyle,
                    fontSize: 22,
                    fill: '#FFFFFF',
                },
            },
        };

        it('should create CheckBox without errors', () => {
            expect(() => {
                new CheckBox(defaultCheckBoxOptions);
            }).not.toThrow();
        });

        it('should handle checked state', () => {
            const checkBox = new CheckBox({ ...defaultCheckBoxOptions, checked: true });
            expect(checkBox.checked).toBe(true);
        });

        it('should handle unchecked state', () => {
            const checkBox = new CheckBox({ ...defaultCheckBoxOptions, checked: false });
            expect(checkBox.checked).toBe(false);
        });

        it('should connect onCheck handler without errors', () => {
            const checkBox = new CheckBox(defaultCheckBoxOptions);
            const mockAction = jest.fn();

            expect(() => {
                checkBox.onCheck.connect((checked) => mockAction(`checked: ${checked}`));
            }).not.toThrow();
        });

        it('should handle different text values', () => {
            const options = { ...defaultCheckBoxOptions, text: 'Different Text' };
            expect(() => {
                new CheckBox(options);
            }).not.toThrow();
        });
    });

    describe('CheckBox with Alternative Graphics', () => {
        const altStyle = {
            unchecked: new Graphics()
                .roundRect(-1, -1, 32, 32, 6)
                .fill('#999999')
                .roundRect(0, 0, 30, 30, 6)
                .fill('#CCCCCC'),
            checked: new Graphics()
                .roundRect(-1, -1, 32, 32, 6)
                .fill('#999999')
                .roundRect(0, 0, 30, 30, 6)
                .fill('#CCCCCC')
                .roundRect(2, 2, 26, 26, 6)
                .fill('#FFFFFF')
                .roundRect(4, 4, 22, 22, 6)
                .fill('#00FF00'),
            text: {
                ...defaultTextStyle,
                fontSize: 18,
                fill: '#000000',
            },
        };

        const defaultOptions = {
            text: 'Alternative CheckBox',
            checked: false,
            style: altStyle,
        };

        it('should create CheckBox without errors', () => {
            expect(() => {
                new CheckBox(defaultOptions);
            }).not.toThrow();
        });

        it('should handle checked state', () => {
            const checkBox = new CheckBox({ ...defaultOptions, checked: true });
            expect(checkBox.checked).toBe(true);
        });

        it('should handle unchecked state', () => {
            const checkBox = new CheckBox({ ...defaultOptions, checked: false });
            expect(checkBox.checked).toBe(false);
        });

        it('should handle different text values', () => {
            const options = { ...defaultOptions, text: 'Different CheckBox Text' };
            expect(() => {
                new CheckBox(options);
            }).not.toThrow();
        });
    });
});
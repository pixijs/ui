import { Graphics } from 'pixi.js';
import { CheckBox } from '../../src/CheckBox';
import { RadioGroup } from '../../src/RadioGroup';

describe('RadioGroup Component', () =>
{
    const createCheckBoxItem = (label: string) => new CheckBox({
        text: label,
        style: {
            checked: new Graphics().circle(0, 0, 10).fill('#4CAF50'),
            unchecked: new Graphics().circle(0, 0, 10).fill('#CCCCCC'),
        }
    });

    const defaultOptions = {
        items: [
            createCheckBoxItem('Option 1'),
            createCheckBoxItem('Option 2'),
            createCheckBoxItem('Option 3'),
        ],
        selectedItem: 0,
        type: 'vertical' as const,
        elementsMargin: 5,
    };

    it('should create RadioGroup without errors', () =>
    {
        expect(() =>
        {
            new RadioGroup(defaultOptions);
        }).not.toThrow();
    });

    it('should handle different selected item', () =>
    {
        const options = { ...defaultOptions, selectedItem: 1 };

        expect(() =>
        {
            new RadioGroup(options);
        }).not.toThrow();
    });

    it('should handle single item', () =>
    {
        const options = {
            items: [createCheckBoxItem('Single Option')],
            selectedItem: 0,
        };

        expect(() =>
        {
            new RadioGroup(options);
        }).not.toThrow();
    });

    it('should handle multiple items', () =>
    {
        const options = {
            items: [
                createCheckBoxItem('First'),
                createCheckBoxItem('Second'),
                createCheckBoxItem('Third'),
                createCheckBoxItem('Fourth'),
            ],
            selectedItem: 2,
        };

        expect(() =>
        {
            new RadioGroup(options);
        }).not.toThrow();
    });

    it('should connect onChange handler without errors', () =>
    {
        const mockOnChange = jest.fn();
        const radioGroup = new RadioGroup(defaultOptions);

        expect(() =>
        {
            radioGroup.onChange.connect(mockOnChange);
        }).not.toThrow();
    });

    it('should handle different element margins', () =>
    {
        const options = {
            ...defaultOptions,
            elementsMargin: 15,
        };

        expect(() =>
        {
            new RadioGroup(options);
        }).not.toThrow();
    });
});

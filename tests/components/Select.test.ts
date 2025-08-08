import { Graphics } from 'pixi.js';
import { Select } from '../../src/Select';

describe('Select Component', () =>
{
    const createSelectItems = (count: number) =>
        Array.from({ length: count }, (_, i) => `Option ${i + 1}`);

    const defaultOptions = {
        closedBG: new Graphics().roundRect(0, 0, 200, 40, 5).fill('#FFFFFF'),
        openBG: new Graphics().roundRect(0, 0, 200, 120, 5).fill('#EEEEEE'),
        textStyle: {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#000000',
        },
        items: {
            items: createSelectItems(3),
            backgroundColor: '#FFFFFF',
            width: 200,
            height: 40,
        },
        selectedItem: 0,
        scrollBox: {
            width: 200,
            height: 120,
            radius: 5,
        },
    };

    it('should create Select without errors', () =>
    {
        expect(() =>
        {
            new Select(defaultOptions);
        }).not.toThrow();
    });

    it('should handle different items', () =>
    {
        const options = {
            ...defaultOptions,
            items: {
                items: createSelectItems(5),
                backgroundColor: '#FFFFFF',
                width: 200,
                height: 40,
            },
            selectedItem: 1,
        };

        expect(() =>
        {
            new Select(options);
        }).not.toThrow();
    });

    it('should handle single item', () =>
    {
        const options = {
            ...defaultOptions,
            items: {
                items: ['Only Option'],
                backgroundColor: '#FFFFFF',
                width: 200,
                height: 40,
            },
            selectedItem: 0,
        };

        expect(() =>
        {
            new Select(options);
        }).not.toThrow();
    });

    it('should handle different selected item', () =>
    {
        const options = {
            ...defaultOptions,
            selectedItem: 2,
        };

        expect(() =>
        {
            new Select(options);
        }).not.toThrow();
    });

    it('should handle different background graphics', () =>
    {
        const options = {
            ...defaultOptions,
            closedBG: new Graphics().roundRect(0, 0, 250, 45, 8).fill('#F5F5F5'),
        };

        expect(() =>
        {
            new Select(options);
        }).not.toThrow();
    });

    it('should connect onSelect handler without errors', () =>
    {
        const mockOnSelect = jest.fn();
        const select = new Select(defaultOptions);

        expect(() =>
        {
            select.onSelect.connect(mockOnSelect);
        }).not.toThrow();
    });
});

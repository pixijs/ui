import { Container, Graphics } from 'pixi.js';
import { ScrollBox } from '../../src/ScrollBox';

describe('ScrollBox Component', () =>
{
    const createItems = (count: number): Container[] =>
        Array.from({ length: count }, (_, _i) =>
        {
            const container = new Container();
            const bg = new Graphics().roundRect(0, 0, 200, 40, 5).fill('#F0F0F0');

            container.addChild(bg);

            return container;
        });

    const defaultOptions = {
        width: 300,
        height: 200,
        elementsMargin: 5,
        items: createItems(10),
    };

    it('should create ScrollBox without errors', () =>
    {
        expect(() =>
        {
            new ScrollBox(defaultOptions); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle different dimensions', () =>
    {
        const options = {
            ...defaultOptions,
            width: 400,
            height: 300,
        };

        expect(() =>
        {
            new ScrollBox(options); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle different margins', () =>
    {
        const options = {
            ...defaultOptions,
            elementsMargin: 10,
        };

        expect(() =>
        {
            new ScrollBox(options); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle empty items list', () =>
    {
        const options = {
            ...defaultOptions,
            items: [],
        };

        expect(() =>
        {
            new ScrollBox(options); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle single item', () =>
    {
        const options = {
            ...defaultOptions,
            items: createItems(1),
        };

        expect(() =>
        {
            new ScrollBox(options); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle many items', () =>
    {
        const options = {
            ...defaultOptions,
            items: createItems(50),
        };

        expect(() =>
        {
            new ScrollBox(options); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle scroll positioning after creation', () =>
    {
        const scrollBox = new ScrollBox(defaultOptions);

        expect(() =>
        {
            // Test basic scroll properties exist and can be accessed
            scrollBox.scrollLeft = 0;
            scrollBox.scrollTop = 0;
        }).not.toThrow();
    });
});

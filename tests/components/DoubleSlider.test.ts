import { Graphics } from 'pixi.js';
import { DoubleSlider } from '../../src/DoubleSlider';

describe('DoubleSlider Component', () =>
{
    const defaultOptions = {
        bg: new Graphics().roundRect(0, 0, 250, 15, 25).fill('#CCCCCC'),
        fill: new Graphics().roundRect(0, 0, 250, 15, 25).fill('#00AA00'),
        slider1: new Graphics().circle(0, 0, 20).fill('#FFFFFF'),
        slider2: new Graphics().circle(0, 0, 20).fill('#FFFFFF'),
        min: 0,
        max: 100,
        value1: 25,
        value2: 75,
    };

    it('should create DoubleSlider without errors', () =>
    {
        expect(() =>
        {
            new DoubleSlider(defaultOptions); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle different value ranges', () =>
    {
        const options = { ...defaultOptions, min: 10, max: 90, value1: 20, value2: 80 };

        expect(() =>
        {
            new DoubleSlider(options); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle minimum values', () =>
    {
        const options = { ...defaultOptions, value1: 0, value2: 50 };

        expect(() =>
        {
            new DoubleSlider(options); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle maximum values', () =>
    {
        const options = { ...defaultOptions, value1: 50, value2: 100 };

        expect(() =>
        {
            new DoubleSlider(options); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should connect onChange handler without errors', () =>
    {
        const slider = new DoubleSlider(defaultOptions);
        const mockAction = jest.fn();

        expect(() =>
        {
            slider.onUpdate.connect((value1, value2) =>
            {
                mockAction(`Slider values: ${value1}, ${value2}`);
            });
        }).not.toThrow();
    });

    it('should handle value updates', () =>
    {
        const slider = new DoubleSlider(defaultOptions);

        expect(() =>
        {
            slider.value1 = 30;
            slider.value2 = 70;
        }).not.toThrow();
        expect(slider.value1).toBe(30);
        expect(slider.value2).toBe(70);
    });

    it('should handle crossing values', () =>
    {
        const options = { ...defaultOptions, value1: 60, value2: 40 };

        expect(() =>
        {
            new DoubleSlider(options); // eslint-disable-line no-new
        }).not.toThrow();
    });
});

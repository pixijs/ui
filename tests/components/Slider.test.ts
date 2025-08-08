import { Graphics } from 'pixi.js';
import { Slider } from '../../src/Slider';

describe('Slider Component', () => {
    const defaultOptions = {
        bg: new Graphics().roundRect(0, 0, 250, 15, 25).fill('#CCCCCC'),
        fill: new Graphics().roundRect(0, 0, 250, 15, 25).fill('#00AA00'),
        slider: new Graphics().circle(0, 0, 20).fill('#FFFFFF'),
        min: 0,
        max: 100,
        value: 50,
    };

    it('should create Slider without errors', () => {
        expect(() => {
            new Slider(defaultOptions);
        }).not.toThrow();
    });

    it('should handle different value ranges', () => {
        const options = { ...defaultOptions, min: 10, max: 90, value: 30 };
        expect(() => {
            new Slider(options);
        }).not.toThrow();
    });

    it('should handle minimum value', () => {
        const options = { ...defaultOptions, value: 0 };
        expect(() => {
            new Slider(options);
        }).not.toThrow();
    });

    it('should handle maximum value', () => {
        const options = { ...defaultOptions, value: 100 };
        expect(() => {
            new Slider(options);
        }).not.toThrow();
    });

    it('should connect onChange handler without errors', () => {
        const slider = new Slider(defaultOptions);
        const mockAction = jest.fn();

        expect(() => {
            slider.onChange.connect((value) => mockAction(`Slider value: ${value}`));
        }).not.toThrow();
    });

    it('should handle value updates', () => {
        const slider = new Slider(defaultOptions);
        expect(() => {
            slider.value = 75;
        }).not.toThrow();
        expect(slider.value).toBe(75);
    });
});
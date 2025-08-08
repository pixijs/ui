import { Graphics } from 'pixi.js';
import { ProgressBar } from '../../src/ProgressBar';

describe('ProgressBar Component', () => {
    const defaultOptions = {
        bg: new Graphics().roundRect(0, 0, 250, 15, 25).fill('#CCCCCC'),
        fill: new Graphics().roundRect(0, 0, 250, 15, 25).fill('#00AA00'),
        progress: 0.5,
    };

    it('should create ProgressBar without errors', () => {
        expect(() => {
            new ProgressBar(defaultOptions);
        }).not.toThrow();
    });

    it('should handle different progress values', () => {
        const options = { ...defaultOptions, progress: 0.75 };
        expect(() => {
            new ProgressBar(options);
        }).not.toThrow();
    });

    it('should handle zero progress', () => {
        const options = { ...defaultOptions, progress: 0 };
        expect(() => {
            new ProgressBar(options);
        }).not.toThrow();
    });

    it('should handle full progress', () => {
        const options = { ...defaultOptions, progress: 1 };
        expect(() => {
            new ProgressBar(options);
        }).not.toThrow();
    });

    it('should handle progress updates', () => {
        const progressBar = new ProgressBar(defaultOptions);
        expect(() => {
            progressBar.progress = 0.8;
        }).not.toThrow();
        // Note: Actual value might be normalized/clamped by the component
    });
});
import { CircularProgressBar } from '../../src/CircularProgressBar';

describe('CircularProgressBar Component', () =>
{
    const defaultOptions = {
        backgroundColor: '#CCCCCC',
        fillColor: '#4CAF50',
        radius: 50,
        lineWidth: 10,
        value: 50,
    };

    it('should create CircularProgressBar without errors', () =>
    {
        expect(() =>
        {
            new CircularProgressBar(defaultOptions);
        }).not.toThrow();
    });

    it('should handle different progress values', () =>
    {
        const options = { ...defaultOptions, value: 75 };

        expect(() =>
        {
            new CircularProgressBar(options);
        }).not.toThrow();
    });

    it('should handle zero progress', () =>
    {
        const options = { ...defaultOptions, value: 0 };

        expect(() =>
        {
            new CircularProgressBar(options);
        }).not.toThrow();
    });

    it('should handle full progress', () =>
    {
        const options = { ...defaultOptions, value: 100 };

        expect(() =>
        {
            new CircularProgressBar(options);
        }).not.toThrow();
    });

    it('should handle different colors and dimensions', () =>
    {
        const options = {
            ...defaultOptions,
            backgroundColor: '#DDDDDD',
            fillColor: '#FF5722',
            radius: 60,
            lineWidth: 15,
            value: 30,
        };

        expect(() =>
        {
            new CircularProgressBar(options);
        }).not.toThrow();
    });

    it('should handle different line width', () =>
    {
        const options = { ...defaultOptions, lineWidth: 20 };

        expect(() =>
        {
            new CircularProgressBar(options);
        }).not.toThrow();
    });
});

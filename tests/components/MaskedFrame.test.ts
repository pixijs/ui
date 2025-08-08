import { Graphics, Sprite } from 'pixi.js';
import { MaskedFrame } from '../../src/MaskedFrame';

describe('MaskedFrame Component', () =>
{
    const defaultOptions = {
        target: new Sprite(),
        mask: new Graphics().rect(0, 0, 200, 200).fill('#FFFFFF'),
        borderWidth: 5,
        borderColor: 0x000000,
    };

    it('should create MaskedFrame without errors', () =>
    {
        expect(() =>
        {
            new MaskedFrame(defaultOptions);
        }).not.toThrow();
    });

    it('should handle different border configurations', () =>
    {
        const options = {
            ...defaultOptions,
            borderWidth: 10,
            borderColor: 0xFF0000
        };

        expect(() =>
        {
            new MaskedFrame(options);
        }).not.toThrow();
    });

    it('should handle no border', () =>
    {
        const options = { ...defaultOptions, borderWidth: 0 };

        expect(() =>
        {
            new MaskedFrame(options);
        }).not.toThrow();
    });

    it('should handle different mask shapes', () =>
    {
        const circularMask = new Graphics().circle(100, 100, 50).fill('#FFFFFF');
        const options = { ...defaultOptions, mask: circularMask };

        expect(() =>
        {
            new MaskedFrame(options);
        }).not.toThrow();
    });
});

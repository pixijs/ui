import { Sprite, Texture } from 'pixi.js';
import { Switcher } from '../../src/Switcher';

describe('Switcher Component', () =>
{
    const mockAssets = [new Sprite(Texture.WHITE), new Sprite(Texture.WHITE), new Sprite(Texture.WHITE)];
    const mockTriggerEvents: Array<'onPress' | 'onHover' | 'onDown' | 'onUp' | 'onOut' | 'onUpOut'> = [
        'onPress', 'onHover', 'onOut'
    ];

    it('should create Switcher without errors', () =>
    {
        expect(() =>
        {
            new Switcher(mockAssets, mockTriggerEvents); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle different asset arrays', () =>
    {
        const differentAssets = [new Sprite(Texture.WHITE), new Sprite(Texture.WHITE)];

        expect(() =>
        {
            new Switcher(differentAssets, mockTriggerEvents); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle different trigger events', () =>
    {
        const differentEvents: Array<'onPress' | 'onHover' | 'onDown' | 'onUp' | 'onOut' | 'onUpOut'> = ['onDown', 'onUp'];

        expect(() =>
        {
            new Switcher(mockAssets, differentEvents); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should connect onChange handler without errors', () =>
    {
        const switcher = new Switcher(mockAssets, mockTriggerEvents);
        const mockAction = jest.fn();

        expect(() =>
        {
            switcher.onChange.connect((state) => mockAction(`state: ${state}`));
        }).not.toThrow();
    });

    it('should handle single asset', () =>
    {
        const singleAsset = [new Sprite(Texture.WHITE)];

        const singleEvent: Array<'onPress' | 'onHover' | 'onDown' | 'onUp' | 'onOut' | 'onUpOut'> = ['onPress'];

        expect(() =>
        {
            new Switcher(singleAsset, singleEvent); // eslint-disable-line no-new
        }).not.toThrow();
    });
});

import { Switcher } from '../../src/Switcher';

describe('Switcher Component', () =>
{
    const mockAssets = ['asset1.png', 'asset2.png', 'asset3.png'];
    const mockTriggerEvents = ['onPress', 'onHover', 'onOut'];

    it('should create Switcher without errors', () =>
    {
        expect(() =>
        {
            new Switcher(mockAssets, mockTriggerEvents); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle different asset arrays', () =>
    {
        const differentAssets = ['avatar-01.png', 'avatar-02.png'];

        expect(() =>
        {
            new Switcher(differentAssets, mockTriggerEvents); // eslint-disable-line no-new
        }).not.toThrow();
    });

    it('should handle different trigger events', () =>
    {
        const differentEvents = ['onDown', 'onUp'];

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
        const singleAsset = ['single-asset.png'];

        expect(() =>
        {
            new Switcher(singleAsset, ['onPress']); // eslint-disable-line no-new
        }).not.toThrow();
    });
});

import { SpriteButton } from './ButtonSprite.stories';

describe('ButtonSprite Component', () => {
    const defaultProps = {
        text: 'Click me!',
        textColor: '#FFFFFF',
        disabled: false,
        action: jest.fn(),
    };

    it('should create SpriteButton without errors', () => {
        expect(() => {
            new SpriteButton(defaultProps);
        }).not.toThrow();
    });

    it('should handle different text values', () => {
        const props = { ...defaultProps, text: 'Different Text' };
        expect(() => {
            new SpriteButton(props);
        }).not.toThrow();
    });

    it('should handle disabled state', () => {
        const props = { ...defaultProps, disabled: true };
        expect(() => {
            const button = new SpriteButton(props);
            expect(button.enabled).toBe(false);
        }).not.toThrow();
    });

    it('should call action when methods are invoked', () => {
        const mockAction = jest.fn();
        const props = { ...defaultProps, action: mockAction };
        
        const button = new SpriteButton(props);
        
        button.press();
        expect(mockAction).toHaveBeenCalledWith('onPress');
        
        button.hover();
        expect(mockAction).toHaveBeenCalledWith('hover');
    });
});
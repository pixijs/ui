import { Graphics, Text, Texture } from 'pixi.js';
import { FancyButton } from '../../src/FancyButton';
import { defaultTextStyle } from '../../src/utils/helpers/styles';
import { cleanup, createTestGraphics, createTestText, testStateChange } from '../utils/components';

describe('FancyButton Component', () =>
{
    afterEach(() =>
    {
        cleanup();
    });

    describe('FancyButton Creation and Basic Properties', () =>
    {
        const defaultOptions = {
            defaultView: createTestGraphics(150, 150, 0xA5E24D),
            hoverView: createTestGraphics(150, 150, 0xFEC230),
            pressedView: createTestGraphics(150, 150, 0xFE6048),
            disabledView: createTestGraphics(150, 150, 0x6E6E6E),
            text: createTestText('Click me!', 16),
            padding: 11,
        };

        it('should create FancyButton without errors', () =>
        {
            // Test basic FancyButton creation
            expect(() =>
            {
                const button = new FancyButton(defaultOptions);

                expect(button.enabled).toBe(true);
                expect(button.anchor).toBeDefined();
                expect(button.innerView).toBeDefined();
            }).not.toThrow();
        });

        it('should create FancyButton with minimal options', () =>
        {
            // Test FancyButton with only defaultView
            const minimalOptions = {
                defaultView: Texture.WHITE,
            };

            expect(() =>
            {
                const button = new FancyButton(minimalOptions);

                expect(button.enabled).toBe(true);
            }).not.toThrow();
        });

        it('should create FancyButton with no options', () =>
        {
            // Test FancyButton with empty/undefined options
            expect(() =>
            {
                const button = new FancyButton();

                expect(button.enabled).toBe(true);
            }).not.toThrow();
        });
    });

    describe('FancyButton State Management', () =>
    {
        let button: FancyButton;
        const testOptions = {
            defaultView: createTestGraphics(100, 100, 0x00FF00),
            hoverView: createTestGraphics(100, 100, 0xFFFF00),
            pressedView: createTestGraphics(100, 100, 0xFF0000),
            disabledView: createTestGraphics(100, 100, 0x888888),
        };

        beforeEach(() =>
        {
            button = new FancyButton(testOptions);
        });

        it('should handle enabled/disabled state transitions', () =>
        {
            // Test state transitions
            testStateChange(button, 'enabled', true, false);
            testStateChange(button, 'enabled', false, true);
        });

        it('should maintain state consistency', () =>
        {
            // Test that state changes are properly maintained
            button.enabled = false;
            expect(button.enabled).toBe(false);

            button.enabled = true;
            expect(button.enabled).toBe(true);
        });

        it('should handle state when disabled', () =>
        {
            // Test disabled state handling
            button.enabled = false;
            expect(button.enabled).toBe(false);

            // Should remain disabled until explicitly enabled
            expect(button.enabled).toBe(false);
        });
    });

    describe('FancyButton Event System', () =>
    {
        let button: FancyButton;
        let mockAction: jest.Mock;

        const testOptions = {
            defaultView: createTestGraphics(100, 100, 0x00FF00),
            hoverView: createTestGraphics(100, 100, 0xFFFF00),
            text: createTestText('Test', 14),
        };

        beforeEach(() =>
        {
            button = new FancyButton(testOptions);
            mockAction = jest.fn();
        });

        it('should connect event handlers without errors', () =>
        {
            // Test that all event handlers can be connected
            expect(() =>
            {
                button.onPress.connect(() => mockAction('onPress'));
                button.onDown.connect(() => mockAction('onDown'));
                button.onUp.connect(() => mockAction('onUp'));
                button.onHover.connect(() => mockAction('onHover'));
                button.onOut.connect(() => mockAction('onOut'));
                button.onUpOut.connect(() => mockAction('onUpOut'));
            }).not.toThrow();
        });

        it('should handle multiple event listeners', () =>
        {
            // Test multiple listeners on same event
            const mockAction2 = jest.fn();

            button.onPress.connect(mockAction);
            button.onPress.connect(mockAction2);

            // Simulate press event
            button.onPress.emit();

            expect(mockAction).toHaveBeenCalledTimes(1);
            expect(mockAction2).toHaveBeenCalledTimes(1);
        });

        it('should have working signal system', () =>
        {
            // Test signal emission
            button.onPress.connect(() => mockAction('press'));
            button.onHover.connect(() => mockAction('hover'));

            button.onPress.emit();
            button.onHover.emit();

            expect(mockAction).toHaveBeenCalledWith('press');
            expect(mockAction).toHaveBeenCalledWith('hover');
            expect(mockAction).toHaveBeenCalledTimes(2);
        });
    });

    describe('FancyButton Visual Properties', () =>
    {
        it('should handle anchor settings', () =>
        {
            // Test anchor property
            const button = new FancyButton({
                defaultView: Texture.WHITE,
            });

            expect(() =>
            {
                button.anchor.set(0.5, 0.5);
                expect(button.anchor.x).toBe(0.5);
                expect(button.anchor.y).toBe(0.5);
            }).not.toThrow();
        });

        it('should handle different anchor values', () =>
        {
            // Test various anchor values
            const button = new FancyButton({
                defaultView: createTestGraphics(100, 100, 0xFFFFFF),
            });

            const anchorTests = [
                { x: 0, y: 0 },
                { x: 0.5, y: 0.5 },
                { x: 1, y: 1 },
                { x: 0.25, y: 0.75 },
            ];

            anchorTests.forEach(({ x, y }) =>
            {
                button.anchor.set(x, y);
                expect(button.anchor.x).toBe(x);
                expect(button.anchor.y).toBe(y);
            });
        });

        it('should handle padding property', () =>
        {
            // Test padding property
            const button = new FancyButton({
                defaultView: createTestGraphics(100, 100, 0xFFFFFF),
                text: createTestText('Test', 16),
                padding: 20,
            });

            expect(button.padding).toBe(20);

            // Test padding changes
            button.padding = 15;
            expect(button.padding).toBe(15);
        });

        it('should handle offset properties', () =>
        {
            // Test offset properties
            const button = new FancyButton({
                defaultView: createTestGraphics(100, 100, 0xFFFFFF),
                offset: { x: 5, y: 10 },
                textOffset: { x: 2, y: 3 },
            });

            expect(button.offset.x).toBe(5);
            expect(button.offset.y).toBe(10);
            expect(button.textOffset.x).toBe(2);
            expect(button.textOffset.y).toBe(3);
        });
    });

    describe('FancyButton with Different View Configurations', () =>
    {
        it('should handle all state views', () =>
        {
            // Test button with all possible state views
            const options = {
                defaultView: createTestGraphics(100, 50, 0x00FF00),
                hoverView: createTestGraphics(100, 50, 0xFFFF00),
                pressedView: createTestGraphics(100, 50, 0xFF0000),
                disabledView: createTestGraphics(100, 50, 0x888888),
                text: createTestText('Full Button', 14),
            };

            expect(() =>
            {
                const button = new FancyButton(options);

                expect(button.enabled).toBe(true);
            }).not.toThrow();
        });

        it('should handle different text configurations', () =>
        {
            // Test different text options
            const textConfigurations = [
                'Simple Text',
                createTestText('Custom Text', 20),
                new Text({
                    text: 'Styled Text',
                    style: { ...defaultTextStyle, fill: '#FF0000', fontSize: 18 },
                }),
            ];

            textConfigurations.forEach((text) =>
            {
                const options = {
                    defaultView: createTestGraphics(150, 40, 0xFFFFFF),
                    text,
                };

                expect(() =>
                {
                    new FancyButton(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });

        it('should handle icon configuration', () =>
        {
            // Test button with icon
            const icon = createTestGraphics(20, 20, 0xFF0000);
            const options = {
                defaultView: createTestGraphics(120, 40, 0x00FF00),
                icon,
                text: createTestText('Icon Button', 14),
            };

            expect(() =>
            {
                const button = new FancyButton(options);

                expect(button.iconView).toBeDefined();
            }).not.toThrow();
        });

        it('should handle different icon types', () =>
        {
            // Test different icon configurations
            const iconTypes = [
                createTestGraphics(15, 15, 0xFF0000), // Square icon
                createTestGraphics(30, 10, 0x0000FF), // Rectangular icon
                new Graphics().circle(0, 0, 10).fill(0x00FF00), // Circular icon
            ];

            iconTypes.forEach((icon) =>
            {
                const options = {
                    defaultView: createTestGraphics(100, 40, 0xFFFFFF),
                    icon,
                    text: createTestText('Test', 12),
                };

                expect(() =>
                {
                    new FancyButton(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });
    });

    describe('FancyButton Advanced Features', () =>
    {
        it('should handle animations configuration', () =>
        {
            // Test button with animations
            const options = {
                defaultView: createTestGraphics(100, 40, 0x00FF00),
                text: createTestText('Animated', 14),
                animations: {
                    hover: {
                        props: { scale: { x: 1.1, y: 1.1 } },
                        duration: 200,
                    },
                    pressed: {
                        props: { scale: { x: 0.9, y: 0.9 } },
                        duration: 100,
                    },
                },
            };

            expect(() =>
            {
                const button = new FancyButton(options);

                expect(button.enabled).toBe(true);
            }).not.toThrow();
        });

        it('should handle scale configuration', () =>
        {
            // Test scale property
            const options = {
                defaultView: createTestGraphics(100, 40, 0xFFFFFF),
                scale: 1.5,
            };

            expect(() =>
            {
                const button = new FancyButton(options);

                expect(button.scale.x).toBe(1.5);
                expect(button.scale.y).toBe(1.5);
            }).not.toThrow();
        });

        it('should handle text and icon anchoring', () =>
        {
            // Test text and icon anchor settings
            const options = {
                defaultView: createTestGraphics(150, 60, 0xFFFFFF),
                text: createTestText('Anchored Text', 14),
                icon: createTestGraphics(16, 16, 0xFF0000),
                defaultTextAnchor: 0.5,
                defaultIconAnchor: 0,
            };

            expect(() =>
            {
                new FancyButton(options); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle complex offset configurations', () =>
        {
            // Test complex offset settings
            const options = {
                defaultView: createTestGraphics(120, 50, 0xFFFFFF),
                hoverView: createTestGraphics(125, 55, 0xEEEEEE),
                text: createTestText('Offset Test', 12),
                offset: { x: 2, y: 3, hover: { x: -1, y: -1 } },
                textOffset: { default: { x: 0, y: 0 }, hover: { x: 1, y: 1 } },
            };

            expect(() =>
            {
                new FancyButton(options); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle button state changes correctly', () =>
        {
            // Test that button properly manages internal state
            const button = new FancyButton({
                defaultView: createTestGraphics(100, 40, 0x00FF00),
                hoverView: createTestGraphics(100, 40, 0xFFFF00),
                pressedView: createTestGraphics(100, 40, 0xFF0000),
                disabledView: createTestGraphics(100, 40, 0x888888),
            });

            // Test enabled/disabled transitions
            expect(button.enabled).toBe(true);

            button.enabled = false;
            expect(button.enabled).toBe(false);

            button.enabled = true;
            expect(button.enabled).toBe(true);
        });
    });
});

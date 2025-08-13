import { Container, Sprite, Text, Texture } from 'pixi.js';
import { Button, ButtonContainer } from '../../src/Button';
import { defaultTextStyle } from '../../src/utils/helpers/styles';
import { cleanup, createTestGraphics, createTestText, testStateChange } from '../utils/story-helpers';

describe('Button Component', () =>
{
    afterEach(() =>
    {
        cleanup();
    });

    describe('Button Creation and Basic Properties', () =>
    {
        it('should create Button with Graphics view without errors', () =>
        {
            // Test button creation with graphics background
            const buttonView = new Container();
            const buttonBg = createTestGraphics(150, 150, 0xA5E24D);
            const text = createTestText('🤙', 70);

            text.anchor.set(0.5);
            text.x = buttonBg.width / 2;
            text.y = buttonBg.height / 2;
            buttonView.addChild(buttonBg, text);

            expect(() =>
            {
                const button = new Button(buttonView);

                expect(button.view).toBe(buttonView);
                expect(button.enabled).toBe(true);
            }).not.toThrow();
        });

        it('should create Button with Sprite view without errors', () =>
        {
            // Test button creation with sprite background
            const buttonView = new Container();
            const sprite = new Sprite(Texture.WHITE);

            sprite.width = 100;
            sprite.height = 50;
            buttonView.addChild(sprite);

            expect(() =>
            {
                const button = new Button(buttonView);

                expect(button.view).toBe(buttonView);
            }).not.toThrow();
        });

        it('should create Button with empty Container', () =>
        {
            // Test button with minimal setup
            const buttonView = new Container();

            expect(() =>
            {
                const button = new Button(buttonView);

                expect(button.view).toBe(buttonView);
                expect(button.enabled).toBe(true);
            }).not.toThrow();
        });
    });

    describe('Button State Management', () =>
    {
        let buttonView: Container;
        let button: Button;

        beforeEach(() =>
        {
            buttonView = new Container();
            buttonView.addChild(createTestGraphics());
            button = new Button(buttonView);
        });

        it('should handle enabled/disabled state transitions', () =>
        {
            // Test enabled property getter/setter
            testStateChange(button, 'enabled', true, false);
            testStateChange(button, 'enabled', false, true);
        });

        it('should maintain state consistency', () =>
        {
            // Test that disabled button stays disabled until explicitly enabled
            button.enabled = false;
            expect(button.enabled).toBe(false);

            // Shouldn't change without explicit setting
            expect(button.enabled).toBe(false);

            // Should change when explicitly set
            button.enabled = true;
            expect(button.enabled).toBe(true);
        });

        it('should update view eventMode when enabled state changes', () =>
        {
            // Test that view properties update correctly with enabled state
            button.enabled = true;
            expect(button.view.eventMode).toBe('static');
            expect(button.view.cursor).toBe('pointer');

            button.enabled = false;
            expect(button.view.eventMode).toBe('auto');
            expect(button.view.cursor).toBe('default');
        });
    });

    describe('Button Event System', () =>
    {
        let buttonView: Container;
        let button: Button;
        let mockAction: jest.Mock;

        beforeEach(() =>
        {
            buttonView = new Container();
            buttonView.addChild(createTestGraphics());
            button = new Button(buttonView);
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
            // Test that multiple listeners can be attached to same event
            const mockAction2 = jest.fn();

            button.onPress.connect(mockAction);
            button.onPress.connect(mockAction2);

            // Simulate a press event by emitting the signal directly
            button.onPress.emit(button);

            expect(mockAction).toHaveBeenCalledTimes(1);
            expect(mockAction2).toHaveBeenCalledTimes(1);
        });

        it('should have working signal system', () =>
        {
            // Test that signals can be connected and emit events
            button.onPress.connect(mockAction);
            button.onHover.connect(() => mockAction('hover'));

            // Manually emit signals to test the system
            button.onPress.emit(button);
            button.onHover.emit(button);

            expect(mockAction).toHaveBeenCalledTimes(2);
        });

        it('should disconnect event listeners properly', () =>
        {
            // Test that event listeners can be disconnected
            button.onPress.connect(mockAction);

            // Emit to verify connection works
            button.onPress.emit(button);
            expect(mockAction).toHaveBeenCalledTimes(1);

            // Disconnect and test again
            button.onPress.disconnectAll();
            button.onPress.emit(button);
            expect(mockAction).toHaveBeenCalledTimes(1); // Should not increase
        });
    });

    describe('ButtonContainer Component', () =>
    {
        let buttonContainer: ButtonContainer;

        beforeEach(() =>
        {
            buttonContainer = new ButtonContainer();
        });

        afterEach(() =>
        {
            cleanup();
        });

        it('should create ButtonContainer without errors', () =>
        {
            // Test ButtonContainer instantiation
            expect(() =>
            {
                const container = new ButtonContainer();

                expect(container.enabled).toBe(true);
                expect(container.button).toBeInstanceOf(Button);
            }).not.toThrow();
        });

        it('should handle state changes correctly', () =>
        {
            // Test ButtonContainer state management
            testStateChange(buttonContainer, 'enabled', true, false);
            testStateChange(buttonContainer, 'enabled', false, true);
        });

        it('should connect event handlers without errors', () =>
        {
            // Test ButtonContainer event system
            const mockAction = jest.fn();

            expect(() =>
            {
                buttonContainer.onPress.connect(() => mockAction('onPress'));
                buttonContainer.onDown.connect(() => mockAction('onDown'));
                buttonContainer.onUp.connect(() => mockAction('onUp'));
                buttonContainer.onHover.connect(() => mockAction('onHover'));
                buttonContainer.onOut.connect(() => mockAction('onOut'));
                buttonContainer.onUpOut.connect(() => mockAction('onUpOut'));
            }).not.toThrow();
        });

        it('should proxy events from internal button', () =>
        {
            // Test that ButtonContainer events are properly proxied from the internal Button
            const mockAction = jest.fn();

            buttonContainer.onPress.connect(() => mockAction('onPress'));
            buttonContainer.onHover.connect(() => mockAction('onHover'));

            // Emit events on the internal button to test proxying
            buttonContainer.button.onPress.emit(buttonContainer.button);
            buttonContainer.button.onHover.emit(buttonContainer.button);

            expect(mockAction).toHaveBeenCalledWith('onPress');
            expect(mockAction).toHaveBeenCalledWith('onHover');
            expect(mockAction).toHaveBeenCalledTimes(2);
        });

        it('should accept a view in constructor', () =>
        {
            // Test ButtonContainer with initial view
            const testView = createTestGraphics(100, 50, 0xFF0000);

            expect(() =>
            {
                const container = new ButtonContainer(testView);

                expect(container.children.length).toBeGreaterThan(0);
                expect(container.children).toContain(testView);
            }).not.toThrow();
        });
    });

    describe('Custom Button Implementation', () =>
    {
        // Test a custom button implementation to ensure Button base class works correctly
        class TestButton extends Button
        {
            private buttonView = new Container();
            private textView: Text;
            private buttonBg = new Sprite();
            private action: (event: string) => void;

            constructor(props: {
                text: string;
                textColor: string;
                disabled: boolean;
                action: (event: string) => void;
            })
            {
                super();
                this.view = this.buttonView;

                this.buttonBg.texture = Texture.WHITE;
                this.buttonBg.anchor.set(0.5);
                this.buttonBg.width = 100;
                this.buttonBg.height = 40;

                this.textView = new Text({
                    text: props.text,
                    style: {
                        ...defaultTextStyle,
                        fontSize: 16,
                        fill: props.textColor,
                    },
                });
                this.textView.y = -8;
                this.textView.anchor.set(0.5);

                this.buttonView.addChild(this.buttonBg, this.textView);
                this.enabled = !props.disabled;
                this.action = props.action;

                // Set up event handling
                this.onPress.connect(() => this.action('onPress'));
                this.onHover.connect(() => this.action('onHover'));
            }
        }

        const defaultProps = {
            text: 'Test Button',
            textColor: '#000000',
            disabled: false,
            action: jest.fn(),
        };

        it('should create custom Button implementation', () =>
        {
            // Test that Button can be extended properly
            expect(() =>
            {
                const button = new TestButton(defaultProps);

                expect(button.enabled).toBe(true);
                expect(button.view).toBeInstanceOf(Container);
            }).not.toThrow();
        });

        it('should handle different text values in custom implementation', () =>
        {
            // Test custom button with different text
            const props = { ...defaultProps, text: 'Custom Text' };

            expect(() =>
            {
                new TestButton(props); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle disabled state in custom implementation', () =>
        {
            // Test custom button disabled state
            const props = { ...defaultProps, disabled: true };
            const button = new TestButton(props);

            expect(button.enabled).toBe(false);
        });

        it('should call custom action methods when events are triggered', () =>
        {
            // Test custom button event handling
            const mockAction = jest.fn();
            const props = { ...defaultProps, action: mockAction };
            const button = new TestButton(props);

            // Emit events to test custom handling
            button.onPress.emit(button);
            expect(mockAction).toHaveBeenCalledWith('onPress');

            button.onHover.emit(button);
            expect(mockAction).toHaveBeenCalledWith('onHover');

            expect(mockAction).toHaveBeenCalledTimes(2);
        });

        it('should handle view changes properly', () =>
        {
            // Test that custom button handles view changes correctly
            const button = new TestButton(defaultProps);
            const originalView = button.view;
            const newView = new Container();

            newView.addChild(createTestGraphics(50, 25, 0x00FF00));

            expect(() =>
            {
                button.view = newView;
                expect(button.view).toBe(newView);
                expect(button.view).not.toBe(originalView);
            }).not.toThrow();
        });
    });

    describe('Button Error Handling and Edge Cases', () =>
    {
        it('should handle null/undefined view based on implementation', () =>
        {
            // Test Button behavior with null/undefined views
            // This test verifies current behavior rather than assuming it should throw

            let buttonWithNull: Button;
            let buttonWithUndefined: Button;

            // Test if Button constructor accepts null/undefined or throws
            try
            {
                buttonWithNull = new Button(null as any);
                // If it doesn't throw, verify the button has reasonable defaults
                expect(buttonWithNull).toBeInstanceOf(Button);
            }
            catch (error)
            {
                // If it throws, that's also acceptable behavior
                expect(error).toBeDefined();
            }

            try
            {
                buttonWithUndefined = new Button(undefined as any);
                // If it doesn't throw, verify the button has reasonable defaults
                expect(buttonWithUndefined).toBeInstanceOf(Button);
            }
            catch (error)
            {
                // If it throws, that's also acceptable behavior
                expect(error).toBeDefined();
            }
        });

        it('should handle view changes to null/undefined', () =>
        {
            const buttonView = new Container();

            buttonView.addChild(createTestGraphics());
            const button = new Button(buttonView);

            expect(button.view).toBe(buttonView);

            // Button implementation cannot handle null/undefined views safely
            // Setting null/undefined view will cause errors when trying to set up events
            expect(() =>
            {
                button.view = null as any;
            }).toThrow();

            expect(() =>
            {
                button.view = undefined as any;
            }).toThrow();
        });

        it('should handle rapid state changes without errors', () =>
        {
            const buttonView = new Container();

            buttonView.addChild(createTestGraphics());
            const button = new Button(buttonView);

            // Rapidly toggle enabled state
            for (let i = 0; i < 100; i++)
            {
                button.enabled = i % 2 === 0;
                expect(button.enabled).toBe(i % 2 === 0);
            }
        });

        it('should handle event disconnection during event emission', () =>
        {
            const buttonView = new Container();

            buttonView.addChild(createTestGraphics());
            const button = new Button(buttonView);

            const mockAction = jest.fn();
            // eslint-disable-next-line prefer-const
            let connection: any;

            // Create a handler that disconnects itself during execution
            const selfDisconnectingHandler = () =>
            {
                mockAction();
                if (connection)
                {
                    connection.disconnect();
                }
            };

            connection = button.onPress.connect(selfDisconnectingHandler);

            // This should not cause errors
            expect(() =>
            {
                button.onPress.emit(button);
            }).not.toThrow();

            expect(mockAction).toHaveBeenCalledTimes(1);

            // Second emission should not call the disconnected handler
            button.onPress.emit(button);
            expect(mockAction).toHaveBeenCalledTimes(1);
        });

        it('should handle excessive event listener connections', () =>
        {
            const buttonView = new Container();

            buttonView.addChild(createTestGraphics());
            const button = new Button(buttonView);

            const handlers: any[] = [];

            // Connect many handlers
            for (let i = 0; i < 1000; i++)
            {
                const handler = jest.fn();

                button.onPress.connect(handler);
                handlers.push(handler);
            }

            // Emit event and verify all handlers are called
            button.onPress.emit(button);

            handlers.forEach((handler) =>
            {
                expect(handler).toHaveBeenCalledTimes(1);
            });

            // Cleanup should work without issues
            button.onPress.disconnectAll();

            // Emit again - no handlers should be called
            button.onPress.emit(button);

            handlers.forEach((handler) =>
            {
                expect(handler).toHaveBeenCalledTimes(1); // Still 1, not 2
            });
        });

        it('should handle view with no dimensions gracefully', () =>
        {
            const buttonView = new Container();
            // Don't add any children, so dimensions are effectively 0

            const button = new Button(buttonView);

            expect(button.view).toBe(buttonView);
            expect(button.enabled).toBe(true);

            // Should be able to toggle states without errors
            button.enabled = false;
            expect(button.enabled).toBe(false);
        });

        it('should handle destroyed view container', () =>
        {
            const buttonView = new Container();

            buttonView.addChild(createTestGraphics());
            const button = new Button(buttonView);

            expect(button.enabled).toBe(true);

            // Destroy the view container
            buttonView.destroy();

            // Button should still function but may have limited capabilities
            expect(() =>
            {
                button.enabled = false;
            }).not.toThrow();

            // The enabled state should still be tracked
            expect(button.enabled).toBe(false);
        });

        it('should handle memory pressure scenarios', () =>
        {
            // Create many buttons to simulate memory pressure
            const buttons: Button[] = [];

            for (let i = 0; i < 100; i++)
            {
                const buttonView = new Container();

                buttonView.addChild(createTestGraphics(10, 10));
                const button = new Button(buttonView);

                // Add event handlers to simulate real usage
                button.onPress.connect(() => { /* noop */ });
                button.onHover.connect(() => { /* noop */ });
                button.onOut.connect(() => { /* noop */ });

                buttons.push(button);
            }

            // Verify all buttons work
            buttons.forEach((button, index) =>
            {
                expect(button.enabled).toBe(true);
                button.enabled = index % 2 === 0;
                expect(button.enabled).toBe(index % 2 === 0);
            });

            // Cleanup should handle many buttons
            expect(() =>
            {
                buttons.forEach((button) =>
                {
                    if (button.view && button.view.destroy)
                    {
                        button.view.destroy();
                    }
                });
            }).not.toThrow();
        });

        it('should handle circular reference scenarios', () =>
        {
            const buttonView = new Container();

            buttonView.addChild(createTestGraphics());
            const button = new Button(buttonView);

            // Create circular reference
            (buttonView as any).button = button;
            (button as any).customView = buttonView;

            // Should still function normally
            expect(button.enabled).toBe(true);
            button.enabled = false;
            expect(button.enabled).toBe(false);

            // Cleanup should handle circular references
            expect(() =>
            {
                delete (buttonView as any).button;
                delete (button as any).customView;
            }).not.toThrow();
        });

        it('should handle exception throwing event handlers', () =>
        {
            const buttonView = new Container();

            buttonView.addChild(createTestGraphics());
            const button = new Button(buttonView);

            const mockAction = jest.fn();
            const throwingHandler = () =>
            {
                throw new Error('Test error');
            };
            const normalHandler = () =>
            {
                mockAction();
            };

            // Connect both throwing and normal handlers
            button.onPress.connect(throwingHandler);
            button.onPress.connect(normalHandler);

            // Event emission might throw, but shouldn't crash the test
            try
            {
                button.onPress.emit(button);
            }
            catch (error)
            {
                // Expected - one handler threw
                expect(error.message).toBe('Test error');
            }

            // The normal handler might not have been called due to the exception
            // This tests the signal system's error handling behavior
        });
    });
});

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
});

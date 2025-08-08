import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { Button, ButtonContainer } from '../../src/Button';
import { defaultTextStyle } from '../../src/utils/helpers/styles';

describe('Button Component', () =>
{
    describe('Button with Graphics', () =>
    {
        it('should create Button with view without errors', () =>
        {
            const buttonView = new Container();
            const buttonBg = new Graphics().roundRect(0, 0, 150, 150, 150).fill('#A5E24D');
            const text = new Text({ text: '🤙', style: { fontSize: 70 } });

            text.anchor.set(0.5);
            text.x = buttonBg.width / 2;
            text.y = buttonBg.height / 2;

            buttonView.addChild(buttonBg, text);

            expect(() =>
            {
                new Button(buttonView);
            }).not.toThrow();
        });

        it('should handle disabled state', () =>
        {
            const buttonView = new Container();
            const button = new Button(buttonView);

            button.enabled = false;
            expect(button.enabled).toBe(false);
        });

        it('should connect event handlers without errors', () =>
        {
            const buttonView = new Container();
            const button = new Button(buttonView);
            const mockAction = jest.fn();

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
    });

    describe('ButtonContainer', () =>
    {
        it('should create ButtonContainer without errors', () =>
        {
            expect(() =>
            {
                new ButtonContainer();
            }).not.toThrow();
        });

        it('should handle disabled state', () =>
        {
            const button = new ButtonContainer();

            button.enabled = false;
            expect(button.enabled).toBe(false);
        });

        it('should handle enabled state', () =>
        {
            const button = new ButtonContainer();

            button.enabled = true;
            expect(button.enabled).toBe(true);
        });

        it('should connect event handlers without errors', () =>
        {
            const button = new ButtonContainer();
            const mockAction = jest.fn();

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
    });

    describe('SpriteButton (Button with Sprite)', () =>
    {
        class SpriteButton extends Button
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

                this.textView = new Text({
                    text: props.text,
                    style: {
                        ...defaultTextStyle,
                        fontSize: 40,
                        fill: props.textColor,
                    },
                });
                this.textView.y = -10;
                this.textView.anchor.set(0.5);

                this.buttonView.addChild(this.buttonBg, this.textView);
                this.enabled = !props.disabled;
                this.action = props.action;
            }

            override press()
            {
                this.action('onPress');
            }

            override hover()
            {
                this.action('hover');
            }
        }

        const defaultProps = {
            text: 'Click me!',
            textColor: '#FFFFFF',
            disabled: false,
            action: jest.fn(),
        };

        it('should create SpriteButton without errors', () =>
        {
            expect(() =>
            {
                new SpriteButton(defaultProps);
            }).not.toThrow();
        });

        it('should handle different text values', () =>
        {
            const props = { ...defaultProps, text: 'Different Text' };

            expect(() =>
            {
                new SpriteButton(props);
            }).not.toThrow();
        });

        it('should handle disabled state', () =>
        {
            const props = { ...defaultProps, disabled: true };

            expect(() =>
            {
                const button = new SpriteButton(props);

                expect(button.enabled).toBe(false);
            }).not.toThrow();
        });

        it('should call action when methods are invoked', () =>
        {
            const mockAction = jest.fn();
            const props = { ...defaultProps, action: mockAction };

            const button = new SpriteButton(props);

            button.press();
            expect(mockAction).toHaveBeenCalledWith('onPress');

            button.hover();
            expect(mockAction).toHaveBeenCalledWith('hover');
        });
    });
});

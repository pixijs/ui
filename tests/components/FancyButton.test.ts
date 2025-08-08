import { Graphics, Text } from 'pixi.js';
import { FancyButton } from '../../src/FancyButton';
import { defaultTextStyle } from '../../src/utils/helpers/styles';

describe('FancyButton Component', () =>
{
    describe('FancyButton with Graphics', () =>
    {
        const defaultOptions = {
            defaultView: new Graphics().roundRect(0, 0, 350, 350, 50).fill('#A5E24D'),
            hoverView: new Graphics().roundRect(0, 0, 350, 350, 50).fill('#FEC230'),
            pressedView: new Graphics().roundRect(0, 0, 350, 350, 50).fill('#FE6048'),
            disabledView: new Graphics().roundRect(0, 0, 350, 350, 50).fill('#6E6E6E'),
            text: new Text({
                text: 'Click me!',
                style: {
                    ...defaultTextStyle,
                    fill: '#FFFFFF',
                },
            }),
            padding: 11,
        };

        it('should create FancyButton without errors', () =>
        {
            expect(() =>
            {
                new FancyButton(defaultOptions);
            }).not.toThrow();
        });

        it('should handle disabled state', () =>
        {
            const button = new FancyButton(defaultOptions);

            button.enabled = false;
            expect(button.enabled).toBe(false);
        });

        it('should handle enabled state', () =>
        {
            const button = new FancyButton(defaultOptions);

            button.enabled = true;
            expect(button.enabled).toBe(true);
        });

        it('should connect event handlers without errors', () =>
        {
            const button = new FancyButton(defaultOptions);
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

        it('should handle anchor settings', () =>
        {
            const button = new FancyButton(defaultOptions);

            expect(() =>
            {
                button.anchor.set(0.5, 0.5);
            }).not.toThrow();
        });

        it('should handle different text values', () =>
        {
            const options = {
                ...defaultOptions,
                text: new Text({
                    text: 'Different Text',
                    style: { ...defaultTextStyle, fill: '#FFFFFF' },
                }),
            };

            expect(() =>
            {
                new FancyButton(options);
            }).not.toThrow();
        });
    });

    describe('FancyButton with Icon', () =>
    {
        const mockIcon = new Graphics().circle(0, 0, 20).fill('#FF0000');

        const defaultOptions = {
            defaultView: new Graphics().roundRect(0, 0, 150, 150, 20).fill('#A5E24D'),
            hoverView: new Graphics().roundRect(0, 0, 150, 150, 20).fill('#FEC230'),
            pressedView: new Graphics().roundRect(0, 0, 150, 150, 20).fill('#FE6048'),
            disabledView: new Graphics().roundRect(0, 0, 150, 150, 20).fill('#6E6E6E'),
            icon: mockIcon,
            text: new Text({
                text: 'Click me!',
                style: {
                    ...defaultTextStyle,
                    fill: '#FFFFFF',
                },
            }),
        };

        it('should create FancyButton without errors', () =>
        {
            expect(() =>
            {
                new FancyButton(defaultOptions);
            }).not.toThrow();
        });

        it('should handle different icon graphics', () =>
        {
            const differentIcon = new Graphics().roundRect(0, 0, 30, 30, 5).fill('#0000FF');
            const options = { ...defaultOptions, icon: differentIcon };

            expect(() =>
            {
                new FancyButton(options);
            }).not.toThrow();
        });

        it('should handle anchor settings', () =>
        {
            const button = new FancyButton(defaultOptions);

            expect(() =>
            {
                button.anchor.set(0.5, 0.5);
            }).not.toThrow();
        });
    });
});

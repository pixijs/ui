import { Graphics } from 'pixi.js';
import { Input } from '../../src/Input';

describe('Input Component', () =>
{
    describe('Input with Graphics', () =>
    {
        const defaultOptions = {
            bg: new Graphics()
                .roundRect(0, 0, 320, 70, 16)
                .fill('#DCB000')
                .roundRect(5, 5, 310, 60, 11)
                .fill('#F1D583'),
            textStyle: {
                fill: '#000000',
                fontSize: 24,
                fontWeight: 'bold',
            },
            maxLength: 20,
            align: 'center' as const,
            placeholder: 'Enter text',
            secure: false,
            value: '',
            padding: [0, 7, 0, 7],
            cleanOnFocus: true,
            addMask: false,
        };

        it('should create Input without errors', () =>
        {
            expect(() =>
            {
                new Input(defaultOptions); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle different placeholder values', () =>
        {
            const options = { ...defaultOptions, placeholder: 'Different placeholder' };

            expect(() =>
            {
                new Input(options); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle secure mode', () =>
        {
            const options = { ...defaultOptions, secure: true };

            expect(() =>
            {
                new Input(options); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle different text values', () =>
        {
            const options = { ...defaultOptions, value: 'Initial text' };

            expect(() =>
            {
                new Input(options); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should connect onEnter handler without errors', () =>
        {
            const input = new Input(defaultOptions);
            const mockAction = jest.fn();

            expect(() =>
            {
                input.onEnter.connect((val) => mockAction(`Input value: ${val}`));
            }).not.toThrow();
        });

        it('should handle different alignment values', () =>
        {
            const alignments: Array<'center' | 'left' | 'right'> = ['center', 'left', 'right'];

            alignments.forEach((alignment) =>
            {
                const options = { ...defaultOptions, align: alignment };

                expect(() =>
                {
                    new Input(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });
    });

    describe('Input with Texture Background', () =>
    {
        const defaultOptions = {
            bg: new Graphics()
                .roundRect(0, 0, 320, 70, 16)
                .fill('#DCB000')
                .roundRect(5, 5, 310, 60, 11)
                .fill('#F1D583'),
            textStyle: {
                fill: '#000000',
                fontSize: 24,
                fontWeight: 'bold',
            },
            maxLength: 15,
            placeholder: 'Different Input',
            value: '',
        };

        it('should create Input without errors', () =>
        {
            expect(() =>
            {
                new Input(defaultOptions); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle different placeholder values', () =>
        {
            const options = { ...defaultOptions, placeholder: 'Different placeholder' };

            expect(() =>
            {
                new Input(options); // eslint-disable-line no-new
            }).not.toThrow();
        });

        it('should handle different text values', () =>
        {
            const options = { ...defaultOptions, value: 'Different text' };

            expect(() =>
            {
                new Input(options); // eslint-disable-line no-new
            }).not.toThrow();
        });
    });
});

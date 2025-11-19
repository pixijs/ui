import { Texture } from 'pixi.js';
import { Dialog } from '../../src/Dialog';
import { cleanup, createTestGraphics, createTestText } from '../utils/components';

describe('Dialog Component', () =>
{
    afterEach(() =>
    {
        cleanup();
    });

    describe('Dialog Creation and Basic Properties', () =>
    {
        it('should create Dialog without errors', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    title: 'Test Dialog',
                    content: 'This is a test',
                });

                expect(dialog.onSelect).toBeDefined();
                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Dialog with minimal options', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: Texture.WHITE,
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Dialog with custom buttons', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    buttons: [
                        { text: 'Cancel' },
                        { text: 'OK' },
                    ],
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Dialog with default button', () =>
        {
            const dialog = new Dialog({
                background: createTestGraphics(400, 300, 0xFFFFFF),
            });

            expect(dialog.visible).toBe(false);
        });
    });

    describe('Dialog Open/Close', () =>
    {
        let dialog: Dialog;

        beforeEach(() =>
        {
            dialog = new Dialog({
                background: createTestGraphics(400, 300, 0xFFFFFF),
                title: 'Test',
                content: 'Content',
            });
        });

        it('should open dialog', () =>
        {
            dialog.open();
            expect(dialog.visible).toBe(true);
        });

        it('should close dialog', () =>
        {
            dialog.open();
            dialog.close();

            setTimeout(() =>
            {
                expect(dialog.visible).toBe(false);
            }, 400);
        });

        it('should use show alias for open', () =>
        {
            dialog.show();
            expect(dialog.visible).toBe(true);
        });

        it('should use hide alias for close', () =>
        {
            dialog.show();
            dialog.hide();

            setTimeout(() =>
            {
                expect(dialog.visible).toBe(false);
            }, 400);
        });
    });

    describe('Dialog Signals', () =>
    {
        let dialog: Dialog;
        let mockAction: jest.Mock;

        beforeEach(() =>
        {
            dialog = new Dialog({
                background: createTestGraphics(400, 300, 0xFFFFFF),
                buttons: [
                    { text: 'Cancel' },
                    { text: 'OK' },
                ],
            });
            mockAction = jest.fn();
        });

        it('should connect onSelect handler without errors', () =>
        {
            expect(() =>
            {
                dialog.onSelect.connect(mockAction);
            }).not.toThrow();
        });

        it('should emit onSelect with button index and text', () =>
        {
            dialog.onSelect.connect(mockAction);
            dialog.onSelect.emit(0, 'Cancel');

            expect(mockAction).toHaveBeenCalledWith(0, 'Cancel');
            expect(mockAction).toHaveBeenCalledTimes(1);
        });

        it('should emit correct indices for multiple buttons', () =>
        {
            dialog.onSelect.connect(mockAction);

            dialog.onSelect.emit(0, 'Cancel');
            dialog.onSelect.emit(1, 'OK');

            expect(mockAction).toHaveBeenNthCalledWith(1, 0, 'Cancel');
            expect(mockAction).toHaveBeenNthCalledWith(2, 1, 'OK');
            expect(mockAction).toHaveBeenCalledTimes(2);
        });
    });

    describe('Dialog Backdrop', () =>
    {
        it('should handle backdrop with default Graphics', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle custom backdrop', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    backdrop: createTestGraphics(1000, 1000, 0x000000),
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle closeOnBackdropClick option', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    closeOnBackdropClick: true,
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle backdrop without closeOnBackdropClick', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    closeOnBackdropClick: false,
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Dialog with ScrollBox', () =>
    {
        it('should create dialog with scrollBox option', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 500, 0xFFFFFF),
                    content: createTestText('Long content here', 16),
                    scrollBox: {
                        width: 360,
                        height: 300,
                        type: 'vertical',
                    },
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create dialog without scrollBox option', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    content: createTestText('Short content', 16),
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Dialog Layout', () =>
    {
        it('should handle title', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    title: 'Test Title',
                    content: 'Content',
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle content without title', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    content: 'Just content, no title',
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle padding option', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    title: 'Title',
                    content: 'Content',
                    padding: 30,
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Dialog NineSliceSprite', () =>
    {
        it('should handle nineSliceSprite with Texture', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: Texture.WHITE,
                    nineSliceSprite: [20, 20, 20, 20],
                    width: 400,
                    height: 300,
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle nineSliceSprite with Texture instance', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: Texture.WHITE,
                    nineSliceSprite: [15, 15, 15, 15],
                    width: 400,
                    height: 300,
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle nineSliceSprite with Container (shows warning)', () =>
        {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            const dialog = new Dialog({
                background: createTestGraphics(400, 300, 0xFFFFFF),
                nineSliceSprite: [20, 20, 20, 20],
            });

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('NineSliceSprite can not be used'));
            expect(dialog.visible).toBe(false);

            consoleSpy.mockRestore();
        });

        it('should handle normal background without nineSliceSprite', () =>
        {
            expect(() =>
            {
                const dialog = new Dialog({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                });

                expect(dialog.visible).toBe(false);
            }).not.toThrow();
        });
    });
});

import { Texture } from 'pixi.js';
import { Drawer } from '../../src/Drawer';
import { cleanup, createTestGraphics } from '../utils/components';

describe('Drawer Component', () =>
{
    afterEach(() =>
    {
        cleanup();
    });

    describe('Drawer Creation and Basic Properties', () =>
    {
        it('should create Drawer without errors', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                });

                expect(drawer.onClose).toBeDefined();
                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Drawer with minimal options', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: Texture.WHITE,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Drawer with content', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    content: createTestGraphics(100, 100, 0xFF0000),
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Drawer with array of content', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    content: [
                        createTestGraphics(100, 100, 0xFF0000),
                        createTestGraphics(100, 100, 0x00FF00),
                    ],
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Drawer Positions', () =>
    {
        it('should create Drawer with bottom position (default)', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Drawer with top position', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    position: 'top',
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Drawer with left position', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    position: 'left',
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create Drawer with right position', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    position: 'right',
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Drawer Open/Close', () =>
    {
        let drawer: Drawer;

        beforeEach(() =>
        {
            drawer = new Drawer({
                background: createTestGraphics(400, 300, 0xFFFFFF),
                content: createTestGraphics(100, 100, 0xFF0000),
            });
        });

        it('should open drawer', () =>
        {
            drawer.open();
            expect(drawer.visible).toBe(true);
            expect(drawer.isOpen).toBe(true);
        });

        it('should close drawer', () =>
        {
            drawer.open();
            drawer.close();

            setTimeout(() =>
            {
                expect(drawer.visible).toBe(false);
                expect(drawer.isOpen).toBe(false);
            }, 400);
        });

        it('should use show alias for open', () =>
        {
            drawer.show();
            expect(drawer.visible).toBe(true);
        });

        it('should use hide alias for close', () =>
        {
            drawer.show();
            drawer.hide();

            setTimeout(() =>
            {
                expect(drawer.visible).toBe(false);
            }, 400);
        });
    });

    describe('Drawer Signals', () =>
    {
        let drawer: Drawer;
        let mockAction: jest.Mock;

        beforeEach(() =>
        {
            drawer = new Drawer({
                background: createTestGraphics(400, 300, 0xFFFFFF),
            });
            mockAction = jest.fn();
        });

        it('should connect onClose handler without errors', () =>
        {
            expect(() =>
            {
                drawer.onClose.connect(mockAction);
            }).not.toThrow();
        });

        it('should emit onClose when drawer closes', () =>
        {
            drawer.onClose.connect(mockAction);
            drawer.open();
            drawer.close();

            // No animation, so immediate
            expect(mockAction).toHaveBeenCalledTimes(1);
        });
    });

    describe('Drawer Backdrop', () =>
    {
        it('should handle backdrop with default Graphics', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle custom backdrop', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    backdrop: createTestGraphics(1000, 1000, 0x000000),
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle closeOnBackdropClick option', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    closeOnBackdropClick: true,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle backdrop without closeOnBackdropClick', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    closeOnBackdropClick: false,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Drawer with ScrollBox', () =>
    {
        it('should create drawer with scrollBox option', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 500, 0xFFFFFF),
                    content: createTestGraphics(100, 100, 0xFF0000),
                    scrollBox: {
                        width: 360,
                        height: 300,
                        type: 'vertical',
                    },
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should create drawer without scrollBox option', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    content: createTestGraphics(100, 100, 0xFF0000),
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Drawer Layout', () =>
    {
        it('should handle padding option', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    content: createTestGraphics(100, 100, 0xFF0000),
                    padding: 30,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle width and height options', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    width: 500,
                    height: 400,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should set screen size', () =>
        {
            const drawer = new Drawer({
                background: createTestGraphics(400, 300, 0xFFFFFF),
            });

            expect(() =>
            {
                drawer.setScreenSize(1920, 1080);
            }).not.toThrow();
        });
    });

    describe('Drawer NineSliceSprite', () =>
    {
        it('should handle nineSliceSprite with Texture', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: Texture.WHITE,
                    nineSliceSprite: [20, 20, 20, 20],
                    width: 400,
                    height: 300,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle nineSliceSprite with Texture instance', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: Texture.WHITE,
                    nineSliceSprite: [15, 15, 15, 15],
                    width: 400,
                    height: 300,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle nineSliceSprite with Container (shows warning)', () =>
        {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            const drawer = new Drawer({
                background: createTestGraphics(400, 300, 0xFFFFFF),
                nineSliceSprite: [20, 20, 20, 20],
            });

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('NineSliceSprite can not be used'));
            expect(drawer.visible).toBe(false);

            consoleSpy.mockRestore();
        });

        it('should handle normal background without nineSliceSprite', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Drawer Swipe Gesture', () =>
    {
        it('should handle swipeToClose option enabled', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    swipeToClose: true,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle swipeToClose option disabled', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    swipeToClose: false,
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });
    });

    describe('Drawer Animations', () =>
    {
        it('should handle animations option', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });

        it('should handle drawer without animations', () =>
        {
            expect(() =>
            {
                const drawer = new Drawer({
                    background: createTestGraphics(400, 300, 0xFFFFFF),
                });

                expect(drawer.visible).toBe(false);
            }).not.toThrow();
        });
    });
});

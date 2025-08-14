// Simplified test setup using jest-canvas-mock
import 'jest-canvas-mock';
import { jest } from '@jest/globals';

// Mock PointerEvent for PixiJS interaction events
global.PointerEvent = class extends Event
{
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;

    constructor(type: string, options: any = {})
    {
        super(type, options);
        this.pointerId = options.pointerId || 0;
        this.pointerType = options.pointerType || 'mouse';
        this.isPrimary = options.isPrimary || false;
    }
} as any;

// Mock ResizeObserver for PixiJS components
global.ResizeObserver = class
{
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
};

// Mock additional browser APIs that PixiJS needs
global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) =>
{
    setTimeout(cb, 16);

    return 1;
});

global.cancelAnimationFrame = jest.fn();

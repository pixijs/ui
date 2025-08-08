// Minimal PixiJS environment setup for Jest testing
import { jest } from '@jest/globals';

// Mock canvas context for PixiJS (basic 2D context mock)
const mockContext = {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(4) })),
    putImageData: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    // Add basic properties PixiJS might check
    canvas: { width: 800, height: 600 },
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn(() => mockContext),
    writable: true,
});

// Mock basic browser APIs
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

// Mock Image constructor for texture loading
global.Image = class
{
    onload?: () => void;
    onerror?: () => void;
    src?: string;
    width = 1;
    height = 1;

    constructor()
    {
        setTimeout(() =>
        {
            if (this.onload)
            {
                this.onload();
            }
        }, 0);
    }
} as any;

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
    value: jest.fn(() => 'mock-object-url'),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock PointerEvent for better event handling
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

// Extend Jest matchers if needed
expect.extend({
    // Custom matchers can be added here if needed
});

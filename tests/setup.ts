// Mock PixiJS environment for Jest testing
import { jest } from '@jest/globals';

// Mock canvas and WebGL context for PixiJS
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn(() => ({
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        getImageData: jest.fn(() => ({ data: new Array(4) })),
        putImageData: jest.fn(),
        createImageData: jest.fn(() => []),
        setTransform: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        fillText: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        stroke: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        measureText: jest.fn(() => ({ width: 0 })),
        transform: jest.fn(),
        rect: jest.fn(),
        clip: jest.fn(),
    })),
    writable: true,
});

// Mock WebGL context
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn((contextType) => {
        if (contextType === '2d') {
            return {
                fillRect: jest.fn(),
                clearRect: jest.fn(),
                getImageData: jest.fn(() => ({ data: new Array(4) })),
                putImageData: jest.fn(),
                createImageData: jest.fn(() => []),
                setTransform: jest.fn(),
                drawImage: jest.fn(),
                save: jest.fn(),
                fillText: jest.fn(),
                restore: jest.fn(),
                beginPath: jest.fn(),
                moveTo: jest.fn(),
                lineTo: jest.fn(),
                closePath: jest.fn(),
                stroke: jest.fn(),
                translate: jest.fn(),
                scale: jest.fn(),
                rotate: jest.fn(),
                arc: jest.fn(),
                fill: jest.fn(),
                measureText: jest.fn(() => ({ width: 0 })),
                transform: jest.fn(),
                rect: jest.fn(),
                clip: jest.fn(),
            };
        }
        return null;
    }),
    writable: true,
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

// Mock Image constructor for texture loading
global.Image = class {
    onload?: () => void;
    onerror?: () => void;
    src?: string;
    width = 1;
    height = 1;

    constructor() {
        setTimeout(() => {
            if (this.onload) {
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
global.PointerEvent = class extends Event {
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;

    constructor(type: string, options: any = {}) {
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
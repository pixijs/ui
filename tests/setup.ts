// Minimal PixiJS environment setup for Jest testing
import { jest } from '@jest/globals';

// Enhanced canvas context mock for better PixiJS compatibility
const mockContext = {
    // Drawing methods
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    strokeRect: jest.fn(),
    rect: jest.fn(),
    arc: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    bezierCurveTo: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    clip: jest.fn(),

    // Image methods
    getImageData: jest.fn(() => ({ data: new Array(4), width: 1, height: 1 })),
    putImageData: jest.fn(),
    drawImage: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Array(4), width: 1, height: 1 })),

    // State methods
    save: jest.fn(),
    restore: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    translate: jest.fn(),
    transform: jest.fn(),
    setTransform: jest.fn(),
    resetTransform: jest.fn(),

    // Text methods
    measureText: jest.fn((text) => ({ width: text ? text.length * 8 : 0, height: 16 })),
    fillText: jest.fn(),
    strokeText: jest.fn(),

    // Style properties
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',

    // Shadow properties
    shadowBlur: 0,
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffsetX: 0,
    shadowOffsetY: 0,

    // Canvas reference
    canvas: { width: 800, height: 600 },
};

// Mock additional canvas/WebGL extensions that PixiJS might query
/* eslint-disable camelcase */
const mockExtensions = {
    WEBGL_debug_renderer_info: {
        UNMASKED_VENDOR_WEBGL: 37445,
        UNMASKED_RENDERER_WEBGL: 37446,
    },
    OES_texture_float: {},
    OES_texture_half_float: {},
    WEBGL_lose_context: {
        loseContext: jest.fn(),
        restoreContext: jest.fn(),
    },
    ANGLE_instanced_arrays: {
        drawArraysInstancedANGLE: jest.fn(),
        drawElementsInstancedANGLE: jest.fn(),
        vertexAttribDivisorANGLE: jest.fn(),
    },
};
/* eslint-enable camelcase */

// Mock WebGL context for PixiJS renderer compatibility
const mockWebGLContext = {
    // WebGL constants
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    ARRAY_BUFFER: 34962,
    STATIC_DRAW: 35044,
    COLOR_BUFFER_BIT: 16384,
    TRIANGLES: 4,
    TEXTURE_2D: 3553,
    RGBA: 6408,
    UNSIGNED_BYTE: 5121,

    // WebGL methods that PixiJS commonly uses
    createShader: jest.fn(() => ({})),
    createProgram: jest.fn(() => ({})),
    createBuffer: jest.fn(() => ({})),
    createTexture: jest.fn(() => ({})),
    createFramebuffer: jest.fn(() => ({})),
    getShaderParameter: jest.fn(() => true),
    getProgramParameter: jest.fn(() => true),
    getShaderInfoLog: jest.fn(() => ''),
    getProgramInfoLog: jest.fn(() => ''),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    useProgram: jest.fn(),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    drawArrays: jest.fn(),
    drawElements: jest.fn(),
    clear: jest.fn(),
    clearColor: jest.fn(),
    viewport: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    getExtension: jest.fn((name: string) => mockExtensions[name]),
    getParameter: jest.fn((param) =>
    {
        // Return reasonable defaults for common parameters
        if (param === 34921) return 16; // MAX_TEXTURE_SIZE
        if (param === 3379) return 16384; // MAX_VIEWPORT_DIMS

        return null;
    }),
    bindTexture: jest.fn(),
    texImage2D: jest.fn(),
    texParameteri: jest.fn(),
    activeTexture: jest.fn(),
    generateMipmap: jest.fn(),
    getUniformLocation: jest.fn(() => ({})),
    getAttribLocation: jest.fn(() => 0),
    uniform1f: jest.fn(),
    uniform2f: jest.fn(),
    uniform3f: jest.fn(),
    uniform4f: jest.fn(),
    uniformMatrix4fv: jest.fn(),
    canvas: { width: 800, height: 600 },
};

// Enhanced HTMLCanvasElement methods
Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
    value: jest.fn(() => new DOMRect(0, 0, 800, 600)),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
    value: jest.fn(() => 'data:image/png;base64,mock-data'),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: jest.fn((callback) =>
    {
        setTimeout(() => callback(new Blob(['mock-blob'], { type: 'image/png' })), 0);
    }),
});

// Override getContext to return appropriate mock contexts
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn((contextType: string, ..._args) =>
    {
        if (contextType === '2d')
        {
            return mockContext;
        }
        else if (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl')
        {
            return mockWebGLContext;
        }

        return null;
    }),
    writable: true,
});

// Enhanced browser API mocks
let animationFrameId = 1;

global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) =>
{
    const id = animationFrameId++;

    setTimeout(() => cb(performance.now()), 16);

    return id;
});
global.cancelAnimationFrame = jest.fn();

// Mock performance API
if (!global.performance)
{
    global.performance = {
        now: jest.fn(() => Date.now()),
    } as any;
}

// Mock DOMRect for getBoundingClientRect
global.DOMRect = class DOMRect
{
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;

    constructor(x = 0, y = 0, width = 0, height = 0)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = y;
        this.left = x;
        this.bottom = y + height;
        this.right = x + width;
    }

    toJSON()
    {
        return JSON.stringify(this);
    }
} as any;

// Enhanced Image constructor mock for better texture loading simulation
global.Image = class
{
    onload?: () => void;
    onerror?: () => void;
    onabort?: () => void;
    src?: string;
    width = 1;
    height = 1;
    complete = false;
    naturalWidth = 1;
    naturalHeight = 1;
    crossOrigin: string | null = null;

    constructor(width?: number, height?: number)
    {
        if (width !== undefined) this.width = width;
        if (height !== undefined) this.height = height;
        this.naturalWidth = this.width;
        this.naturalHeight = this.height;

        // Simulate async image loading
        setTimeout(() =>
        {
            this.complete = true;
            if (this.onload)
            {
                this.onload();
            }
        }, 0);
    }

    decode(): Promise<void>
    {
        return Promise.resolve();
    }
} as any;

// Enhanced URL API mocking
Object.defineProperty(URL, 'createObjectURL', {
    value: jest.fn((_obj) => `mock-object-url-${Math.random().toString(36).substr(2, 9)}`),
});

Object.defineProperty(URL, 'revokeObjectURL', {
    value: jest.fn(),
});

// Enhanced ResizeObserver mock
global.ResizeObserver = class
{
    private callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback)
    {
        this.callback = callback;
    }

    observe = jest.fn((target: Element) =>
    {
        // Simulate initial resize observation
        setTimeout(() =>
        {
            this.callback([
                {
                    target,
                    contentRect: new DOMRect(0, 0, 100, 100),
                    borderBoxSize: [{ blockSize: 100, inlineSize: 100 }],
                    contentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
                    devicePixelContentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
                } as ResizeObserverEntry,
            ], this as ResizeObserver);
        }, 0);
    });

    unobserve = jest.fn();
    disconnect = jest.fn();
};

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

// Mock additional browser APIs that PixiJS might use
// Mock IntersectionObserver
global.IntersectionObserver = class
{
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) { /* noop */ }
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    root = null;
    rootMargin = '';
    thresholds = [];
};

// Mock MutationObserver
global.MutationObserver = class
{
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_callback: MutationCallback) { /* noop */ }
    observe = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn(() => []);
};

// Mock Blob if not available
if (!global.Blob)
{
    global.Blob = class
    {
        size = 0;
        type = '';
        // eslint-disable-next-line @typescript-eslint/no-useless-constructor
        constructor(_parts: any[] = [], options: any = {})
        {
            this.type = options.type || '';
        }
        slice() { return new Blob(); }
        stream() { return new ReadableStream(); }
        text() { return Promise.resolve(''); }
        arrayBuffer() { return Promise.resolve(new ArrayBuffer(0)); }
    } as any;
}

// Mock File API if needed
if (!global.File)
{
    global.File = class extends Blob
    {
        name = '';
        lastModified = Date.now();
        // eslint-disable-next-line @typescript-eslint/no-useless-constructor
        constructor(bits: any[], name: string, options: any = {})
        {
            super(bits, options);
            this.name = name;
            this.lastModified = options.lastModified || Date.now();
        }
    } as any;
}

// Extend Jest matchers if needed
expect.extend({
    // Custom matchers can be added here if needed
});

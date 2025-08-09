import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { jest } from '@jest/globals';

/**
 * Creates a mock event with specified type and properties
 * @param type Event type (e.g., 'pointerdown', 'pointerup')
 * @param properties Additional properties for the event
 * @returns Mock event object
 */
export const createMockEvent = (type: string, properties: any = {}) => ({
    type,
    target: null,
    currentTarget: null,
    stopPropagation: jest.fn(),
    preventDefault: jest.fn(),
    ...properties,
});

/**
 * Creates a basic graphics object for testing
 * @param width Width of the graphics
 * @param height Height of the graphics
 * @param color Fill color
 * @returns Graphics object
 */
export const createTestGraphics = (width = 100, height = 100, color = 0xFFFFFF) =>
    new Graphics().roundRect(0, 0, width, height, 5).fill(color);

/**
 * Creates a basic text object for testing
 * @param text Text content
 * @param fontSize Font size
 * @returns Text object
 */
export const createTestText = (text = 'Test Text', fontSize = 16) =>
    new Text({
        text,
        style: { fontSize, fill: '#000000' },
    });

/**
 * Creates a basic sprite for testing
 * @returns Sprite object with white texture
 */
export const createTestSprite = () =>
{
    const sprite = new Sprite();

    sprite.texture = Texture.WHITE;
    sprite.width = 100;
    sprite.height = 100;

    return sprite;
};

/**
 * Creates a container with test children for testing lists/scrollboxes
 * @param count Number of child items to create
 * @param itemHeight Height of each item
 * @returns Container with child items
 */
export const createTestItems = (count: number, itemHeight = 40) =>
    Array.from({ length: count }, (_, i) =>
    {
        const container = new Container();
        const bg = new Graphics().roundRect(0, 0, 200, itemHeight, 5).fill(0xF0F0F0 + (i * 0x111));

        container.addChild(bg);

        return container;
    });

/**
 * Helper to test component event firing
 * @param component Component with signal/event
 * @param eventName Name of the event/signal property
 * @param triggerAction Function that should trigger the event
 * @returns Promise that resolves when event is fired
 */
export const testEventFiring = (component: any, eventName: string, triggerAction: () => void): Promise<any> =>
    new Promise((resolve) =>
    {
        const mockCallback = jest.fn((...args) =>
        {
            resolve(args);
        });

        // Connect to the event/signal
        if (component[eventName] && typeof component[eventName].connect === 'function')
        {
            component[eventName].connect(mockCallback);
        }
        else
        {
            throw new Error(`Component does not have event ${eventName} or it's not connectable`);
        }

        // Trigger the action that should fire the event
        triggerAction();
    });

/**
 * Helper to test component state changes
 * @param component Component to test
 * @param property Property name to test
 * @param initialValue Initial value to set
 * @param newValue New value to set
 */
export const testStateChange = (component: any, property: string, initialValue: any, newValue: any) =>
{
    // Set initial value
    component[property] = initialValue;
    expect(component[property]).toBe(initialValue);

    // Change to new value
    component[property] = newValue;
    expect(component[property]).toBe(newValue);
};

/**
 * Helper to test component property validation
 * @param createComponent Function that creates the component
 * @param property Property name to test
 * @param validValues Array of valid values
 * @param invalidValues Array of invalid values
 */
export const testPropertyValidation = (
    createComponent: () => any,
    property: string,
    validValues: any[],
    invalidValues: any[] = []
) =>
{
    const component = createComponent();

    // Test valid values
    validValues.forEach((value) =>
    {
        expect(() =>
        {
            component[property] = value;
        }).not.toThrow();
    });

    // Test invalid values (if provided)
    invalidValues.forEach((value) =>
    {
        expect(() =>
        {
            component[property] = value;
        }).toThrow();
    });
};

/** Basic cleanup helper - clears DOM and resets test state */
export const cleanup = () =>
{
    // Clean up DOM elements created during tests
    document.body.innerHTML = '';

    // Clear any jest timers
    jest.clearAllTimers();

    // Reset all mocks
    jest.clearAllMocks();
};

/**
 * Helper to wait for next tick/frame
 * @param ms Milliseconds to wait (default 0 for next tick)
 * @returns Promise that resolves after delay
 */
export const nextTick = (ms = 0): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a comprehensive set of default options for testing components
 * @param overrides Specific overrides for default options
 * @returns Default test options object
 */
export const createDefaultTestOptions = (overrides: any = {}) => ({
    width: 200,
    height: 100,
    background: createTestGraphics(200, 100, 0xFFFFFF),
    text: createTestText(),
    padding: 10,
    margin: 5,
    enabled: true,
    visible: true,
    ...overrides,
});

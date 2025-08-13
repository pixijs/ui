import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { jest } from '@jest/globals';

// Track components and containers for cleanup
const createdComponents: any[] = [];
const createdContainers: any[] = [];
const activeEventListeners: Array<{ target: any; event: string; handler: any }> = [];

/**
 * Register a container for automatic cleanup
 * @param container Container to track for cleanup
 */
export const trackContainer = <T>(container: T): T =>
{
    if (container)
    {
        createdContainers.push(container);
    }

    return container;
};

/**
 * Register a component for automatic cleanup
 * @param component Component to track for cleanup
 */
export const trackComponent = <T>(component: T): T =>
{
    if (component)
    {
        createdComponents.push(component);
    }

    return component;
};

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
 * @param track Whether to automatically track for cleanup (default: false)
 * @returns Graphics object
 */
export const createTestGraphics = (width = 100, height = 100, color = 0xFFFFFF, track = false) =>
{
    const graphics = new Graphics().roundRect(0, 0, width, height, 5).fill(color);

    return track ? trackContainer(graphics) : graphics;
};

/**
 * Creates a basic text object for testing
 * @param text Text content
 * @param fontSize Font size
 * @param track Whether to automatically track for cleanup (default: false)
 * @returns Text object
 */
export const createTestText = (text = 'Test Text', fontSize = 16, track = false) =>
{
    const textObj = new Text({
        text,
        style: { fontSize, fill: '#000000' },
    });

    return track ? trackContainer(textObj) : textObj;
};

/**
 * Creates a basic sprite for testing
 * @param track Whether to automatically track for cleanup (default: false)
 * @returns Sprite object with white texture
 */
export const createTestSprite = (track = false) =>
{
    const sprite = new Sprite();

    sprite.texture = Texture.WHITE;
    sprite.width = 100;
    sprite.height = 100;

    return track ? trackContainer(sprite) : sprite;
};

/**
 * Creates a container with test children for testing lists/scrollboxes
 * @param count Number of child items to create
 * @param itemHeight Height of each item
 * @param track Whether to automatically track for cleanup (default: false)
 * @returns Array of containers with child items
 */
export const createTestItems = (count: number, itemHeight = 40, track = false) =>
    Array.from({ length: count }, (_, i) =>
    {
        const container = new Container();
        const bg = new Graphics().roundRect(0, 0, 200, itemHeight, 5).fill(0xF0F0F0 + (i * 0x111));

        container.addChild(bg);

        return track ? trackContainer(container) : container;
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

/** Enhanced cleanup helper - provides thorough cleanup and isolation */
export const cleanup = () =>
{
    // Clean up tracked PixiJS components
    createdComponents.forEach((component) =>
    {
        try
        {
            if (component && typeof component.destroy === 'function')
            {
                component.destroy({ children: true, texture: false, baseTexture: false });
            }
            if (component && typeof component.removeFromParent === 'function')
            {
                component.removeFromParent();
            }
        }
        catch (error)
        {
            // Ignore cleanup errors to prevent test failures
            console.warn('Component cleanup warning:', error);
        }
    });
    createdComponents.length = 0;

    // Clean up tracked containers
    createdContainers.forEach((container) =>
    {
        try
        {
            if (container && typeof container.removeChildren === 'function')
            {
                container.removeChildren();
            }
            if (container && typeof container.destroy === 'function')
            {
                container.destroy({ children: true });
            }
        }
        catch (error)
        {
            console.warn('Container cleanup warning:', error);
        }
    });
    createdContainers.length = 0;

    // Clean up tracked event listeners
    activeEventListeners.forEach(({ target, event, handler }) =>
    {
        try
        {
            if (target && typeof target.removeEventListener === 'function')
            {
                target.removeEventListener(event, handler);
            }
            else if (target && target.off && typeof target.off === 'function')
            {
                target.off(event, handler);
            }
            else if (target && target.disconnectAll && typeof target.disconnectAll === 'function')
            {
                target.disconnectAll();
            }
        }
        catch (error)
        {
            console.warn('Event listener cleanup warning:', error);
        }
    });
    activeEventListeners.length = 0;

    // Clean up DOM elements created during tests
    document.body.innerHTML = '';

    // Clear any jest timers
    jest.clearAllTimers();

    // Reset all mocks
    jest.clearAllMocks();

    // Force garbage collection if available (for Node.js environments)
    if (global.gc)
    {
        global.gc();
    }
};

/**
 * Register an event listener for automatic cleanup
 * @param target Event target
 * @param event Event name
 * @param handler Event handler
 */
export const trackEventListener = (target: any, event: string, handler: any): void =>
{
    if (target && event && handler)
    {
        activeEventListeners.push({ target, event, handler });
    }
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

/**
 * Creates an isolated test environment for component testing
 * Automatically tracks all created components and cleans them up
 */
export const createTestEnvironment = () =>
{
    const environment = {
        components: [],
        containers: [],

        // Helper to create and track a component
        createComponent: <T>(factory: () => T): T =>
        {
            const component = factory();

            environment.components.push(component);
            trackComponent(component);

            return component;
        },

        // Helper to create and track a container
        createContainer: <T>(factory: () => T): T =>
        {
            const container = factory();

            environment.containers.push(container);
            trackContainer(container);

            return container;
        },

        // Cleanup just this environment's components
        cleanup: () =>
        {
            environment.components.forEach((component) =>
            {
                try
                {
                    if (component && typeof component.destroy === 'function')
                    {
                        component.destroy({ children: true, texture: false, baseTexture: false });
                    }
                }
                catch (error)
                {
                    console.warn('Environment component cleanup warning:', error);
                }
            });

            environment.containers.forEach((container) =>
            {
                try
                {
                    if (container && typeof container.destroy === 'function')
                    {
                        container.destroy({ children: true });
                    }
                }
                catch (error)
                {
                    console.warn('Environment container cleanup warning:', error);
                }
            });

            environment.components.length = 0;
            environment.containers.length = 0;
        }
    };

    return environment;
};

/**
 * Safely executes a test function with automatic cleanup
 * @param testFn Test function to execute
 * @returns Promise that resolves when test is complete and cleanup is done
 */
export const withTestIsolation = async (testFn: () => void | Promise<void>): Promise<void> =>
{
    const originalConsoleWarn = console.warn;
    const warnings: string[] = [];

    // Capture warnings during test execution
    console.warn = (message: string, ...args: any[]) =>
    {
        warnings.push(message);
        originalConsoleWarn(message, ...args);
    };

    try
    {
        await testFn();
    }
    finally
    {
        // Always cleanup, even if test fails
        cleanup();
        console.warn = originalConsoleWarn;

        // Report excessive warnings (may indicate memory leaks)
        if (warnings.length > 5)
        {
            // eslint-disable-next-line no-console
            console.info(`Test generated ${warnings.length} cleanup warnings - possible memory leak`);
        }
    }
};

/**
 * Validates that a component has expected properties and methods
 * @param component Component to validate
 * @param expectedProperties Array of property names that should exist
 * @param expectedMethods Array of method names that should exist
 */
export const validateComponentInterface = (
    component: any,
    expectedProperties: string[] = [],
    expectedMethods: string[] = []
) =>
{
    expectedProperties.forEach((prop) =>
    {
        expect(component).toHaveProperty(prop);
    });

    expectedMethods.forEach((method) =>
    {
        expect(component).toHaveProperty(method);
        expect(typeof component[method]).toBe('function');
    });
};

/**
 * Measures the performance of a test operation
 * @param operation Operation to measure
 * @param iterations Number of iterations to run (default: 1)
 * @returns Object with timing information
 */
export const measurePerformance = async (
    operation: () => void | Promise<void>,
    iterations = 1
): Promise<{ totalTime: number; averageTime: number; iterations: number }> =>
{
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++)
    {
        await operation();
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    return {
        totalTime,
        averageTime: totalTime / iterations,
        iterations,
    };
};

/**
 * Creates a spy on a component's method and tracks calls
 * @param component Component to spy on
 * @param methodName Name of method to spy on
 * @returns Jest spy function
 */
export const spyOnComponent = (component: any, methodName: string) =>
{
    if (!component || typeof component[methodName] !== 'function')
    {
        throw new Error(`Component does not have method: ${methodName}`);
    }

    return jest.spyOn(component, methodName);
};

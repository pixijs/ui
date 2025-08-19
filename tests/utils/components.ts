import { Container, Graphics, Text } from 'pixi.js';
import { jest } from '@jest/globals';

// Creates a basic graphics object for testing
export const createTestGraphics = (width = 100, height = 100, color = 0xFFFFFF) =>
    new Graphics().roundRect(0, 0, width, height, 5).fill(color);

// Creates a basic text object for testing
export const createTestText = (text = 'Test Text', fontSize = 16) => new Text({
    text,
    style: { fontSize, fill: '#000000' },
});

// Creates test items for lists/scrollboxes
export const createTestItems = (count: number, itemHeight = 40) =>
    Array.from({ length: count }, (_, i) =>
    {
        const container = new Container();
        const bg = new Graphics().roundRect(0, 0, 200, itemHeight, 5).fill(0xF0F0F0 + (i * 0x111));

        container.addChild(bg);

        return container;
    });

// Helper to test component state changes
export const testStateChange = (component: any, property: string, initialValue: any, newValue: any) =>
{
    component[property] = initialValue;
    expect(component[property]).toBe(initialValue);

    component[property] = newValue;
    expect(component[property]).toBe(newValue);
};

// Basic cleanup helper
export const cleanup = () =>
{
    document.body.innerHTML = '';
    jest.clearAllTimers();
    jest.clearAllMocks();
};

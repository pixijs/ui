import { PixiStory } from '@pixi/storybook-renderer';

// Mock Storybook context for testing
export const createMockContext = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    return {
        canvasElement: canvas,
        args: {},
        parameters: {},
        globals: {},
        viewMode: 'story' as const,
        loaded: {},
        // Add properties that PixiStory might expect
        appReady: Promise.resolve(),
    };
};

// Helper to test story instantiation without throwing
export const testStoryInstantiation = (story: any, args: any = {}) => {
    const context = createMockContext();
    
    expect(() => {
        const pixiStory = story(args, context);
        expect(pixiStory).toBeInstanceOf(PixiStory);
    }).not.toThrow();
};

// Helper to test story with default args
export const testStoryWithDefaults = (story: any, defaultArgs: any) => {
    const context = createMockContext();
    
    expect(() => {
        const pixiStory = story(defaultArgs, context);
        expect(pixiStory).toBeInstanceOf(PixiStory);
    }).not.toThrow();
};

// Basic cleanup helper
export const cleanup = () => {
    // Clean up DOM elements created during tests
    document.body.innerHTML = '';
};
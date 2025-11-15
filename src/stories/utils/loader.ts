import { Assets } from 'pixi.js';

/**
 * Preloads an array of asset paths using PixiJS Assets loader
 * @param assets - Array of asset paths to preload
 * @returns Promise that resolves when all assets are loaded
 */
export async function preload(assets: string[]): Promise<void>
{
    await Assets.load(assets);
}

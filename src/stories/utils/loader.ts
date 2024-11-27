import { Assets } from 'pixi.js';

export async function preload(assets: string[]): Promise<void> {
    await Assets.load(assets);
}

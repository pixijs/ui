import { Assets } from '@pixi/assets';

export async function preloadAssets(assets: string[]): Promise<void>
{
    await Assets.load(assets);
}

import { Assets } from '@pixi/assets';

export async function preload(assets: string[]): Promise<void>
{
    await Assets.load(assets);
}

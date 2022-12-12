import { Loader } from 'pixi.js';

export function preloadAssets(assets: string[]): Promise<void> {
    return new Promise((resolve) => {
        const loader = Loader.shared;

        assets.forEach((asset) => {
            !loader.resources[asset] && loader.add(asset);
        });

        loader.load(() => {
            resolve();
        });
    });
}

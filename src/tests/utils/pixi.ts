import { Application, ApplicationOptions } from 'pixi.js';

export async function initPixi(options?: Partial<ApplicationOptions>): Promise<Application>
{
    const app = new Application();

    await app.init({
        resizeTo: window,
        background: 0x000000,
        antialias: true,
        ...options
    });

    document.body.appendChild(app.canvas as any);

    // #v-ifdef MODE=production
    // Pixi inspector
    (globalThis as any).__PIXI_APP__ = app;
    // #v-endif

    return app;
}

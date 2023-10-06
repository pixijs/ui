import { Container, Text } from 'pixi.js';
import { initPixi } from './utils/pixi';

// eslint-disable-next-line no-new
new class App
{
    private view: Container;

    constructor()
    {
        this.init();
    }

    private async init()
    {
        const pixiApp = await initPixi();

        this.view = new Container();

        pixiApp.stage.addChild(this.view);

        this.createElements();

        this.addSubscriptions();
    }

    private addSubscriptions()
    {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('deviceorientation', () => this.resize());
        this.resize();
    }

    private createElements()
    {
        const text = new Text({ text: 'Pixi 8' });

        text.anchor.set(0.5);
        text.style = {
            fontSize: 100,
            fill: 0xffffff
        };

        this.view.addChild(text);
    }

    private resize(width = window.innerWidth, height = window.innerHeight)
    {
        this.view.x = width / 2;
        this.view.y = height / 2;
    }
}();


/* eslint-disable no-console */
import { Container, Graphics, Text } from 'pixi.js';
import { initPixi } from './utils/pixi';
import { Button } from '../Button';

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
        window.addEventListener('deviceorientation', () => this.resize(), true);
        this.resize();
    }

    private createElements()
    {
        this.createButton();
    }

    private createButton()
    {
        const text = new Text({ text: 'Pixi 8' });

        text.anchor.set(0.5);
        text.style = {
            fontSize: 20,
            fill: 0xffffff
        };

        const graphics = new Graphics()
            .roundRect(0, 0, text.width + 100, text.height + 20, 25)
            .fill(0xde3249);

        graphics.x = -graphics.width / 2;
        graphics.y = -graphics.height / 2;

        const buttonContainer = new Container();

        buttonContainer.addChild(graphics, text);

        this.view.addChild(buttonContainer);

        new Button(this.view)
            .onPress.connect(() => console.log('onPress'));
    }

    private resize(width = window.innerWidth, height = window.innerHeight)
    {
        this.view.x = width / 2;
        this.view.y = height / 2;
    }
}();


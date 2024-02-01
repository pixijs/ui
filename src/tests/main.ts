/* eslint-disable no-console */
import { Container } from 'pixi.js';
import { initPixi } from './utils/pixi';
import { Pane } from 'tweakpane';
import { circular as CircularProgressBarStory } from '../stories/progressBar/ProgressBarCircular.stories';
import { UseGraphics as CheckBoxStory } from '../stories/checkbox/CheckBoxGraphics.stories';

import { ButtonContainerSprite as ButtonStory } from '../stories/button/ButtonContainerSprite.stories';

// eslint-disable-next-line no-new
new class App
{
    private view: Container;
    private controller: Pane;
    private activeComponent: any;

    constructor()
    {
        this.init();
    }

    private async init()
    {
        const pixiApp = await initPixi();

        this.view = new Container();

        pixiApp.stage.addChild(this.view);

        this.createController();

        // this.createElements();

        this.addSubscriptions();
    }

    private createController()
    {
        this.controller = new Pane({
            title: 'Components',
            expanded: true,
        });

        this.addComponent('Button', ButtonStory);
        this.addComponent('CheckBox', CheckBoxStory);
        this.addComponent('CircularProgressBar', CircularProgressBarStory);
    }

    private addComponent(name: string, story: any)
    {
        this.controller
            .addButton({ title: name })
            .on('click', () => this.switchComponent(story));
    }

    private switchComponent(creatorFunction: any)
    {
        this.view.removeChildren();

        if (this.activeComponent && this.activeComponent.destroy)
        {
            this.activeComponent.destroy();
        }

        this.activeComponent = creatorFunction({
            backgroundColor: '#3d3d3d',
            fillColor: '#00b1dd',
            radius: 50,
            lineWidth: 15,
            value: 50,
            backgroundAlpha: 0.5,
            fillAlpha: 0.8,
            animate: true,
            cap: ['round', 'butt', 'square']
        });

        console.log(this.activeComponent);

        this.view.addChild(this.activeComponent.view);
    }

    private addSubscriptions()
    {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('deviceorientation', () => this.resize(), true);
        this.resize();
    }

    private resize(width = window.innerWidth, height = window.innerHeight)
    {
        this.view.x = width / 2;
        this.view.y = height / 2;
    }
}();


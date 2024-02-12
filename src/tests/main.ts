/* eslint-disable no-console */
import { Container } from 'pixi.js';
import { initPixi } from './utils/pixi';
import { Pane } from 'tweakpane';
import CheckBoxStoryOptions, { UseGraphics as CheckBoxStory } from '../stories/checkbox/CheckBoxGraphics.stories';
import ButtonStoryOptions, { ButtonContainerSprite as ButtonStory } from '../stories/button/ButtonContainerSprite.stories';
import CircularProgressBarOptions,
{ circular as CircularProgressBarStory } from '../stories/progressBar/ProgressBarCircular.stories';

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

        this.addComponent('Button', ButtonStory, ButtonStoryOptions);
        this.addComponent('CheckBox', CheckBoxStory, CheckBoxStoryOptions);
        this.addComponent('CircularProgressBar', CircularProgressBarStory, CircularProgressBarOptions);

        this.switchComponent(ButtonStory, ButtonStoryOptions);
    }

    private addComponent(name: string, story: any, options: StoryOptions)
    {
        const folder = (this.controller as any).addFolder({ title: name });

        for (const key in options.args)
        {
            if (typeof options.args[key] !== 'function')
            {
                folder.addBinding(options.args, key);
            }
        }

        folder.on('change', () => this.switchComponent(story, options));
    }

    private switchComponent(creatorFunction: any, options: StoryOptions)
    {
        this.view.removeChildren();

        if (this.activeComponent && this.activeComponent.destroy)
        {
            this.activeComponent.destroy();
        }

        this.activeComponent = creatorFunction(options.args);

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

type StoryOptions = {
    title: string;
    argTypes: any;
    args: any;
};

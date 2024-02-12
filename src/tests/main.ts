/* eslint-disable no-console */
import { Container } from 'pixi.js';
import { initPixi } from './utils/pixi';
import { Pane } from 'tweakpane';
import ButtonContainerSpriteOpts, { ButtonContainerSprite } from '../stories/button/ButtonContainerSprite.stories';
import UseGraphicsOpts, { UseGraphics } from '../stories/button/ButtonGraphics.stories';
import UseSpriteOpts, { UseSprite } from '../stories/button/ButtonSprite.stories';

// eslint-disable-next-line no-new
new class App
{
    private view: Container;
    private options: any;
    private componentsList: any;
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

        this.createComponentsList();

        this.addSubscriptions();
    }

    private createComponentsList()
    {
        this.componentsList = new Pane({
            title: 'Components',
            expanded: true,
        });

        document.getElementById('componentsList')?.appendChild(this.componentsList.element);

        this.addComponentSection('Button', [
            {
                name: ButtonContainerSpriteOpts.title,
                cb: () => this.addComponent(
                    ButtonContainerSprite,
                    ButtonContainerSpriteOpts
                )
            },
            {
                name: UseGraphicsOpts.title,
                cb: () => this.addComponent(
                    UseGraphics,
                    UseGraphicsOpts,
                )
            },
            {
                name: UseSpriteOpts.title,
                cb: () => this.addComponent(
                    UseSprite,
                    UseSpriteOpts,
                )
            }
        ]);

        this.addComponent(
            UseSprite,
            UseSpriteOpts,
        );
    }

    private addComponentSection(sectionName: string, components: {
        name: string;
        cb: () => void;
    }[])
    {
        const buttonFolder = this.componentsList.addFolder({
            title: sectionName,
            // expanded: false
        });

        components.forEach((component) =>
        {
            buttonFolder.addButton({ title: this.getTitle(component.name) }).on('click', () => component.cb());
        });
    }

    private addComponent(story: any, options: StoryOptions)
    {
        this.options?.dispose();

        this.options = new Pane({
            title: 'Settings',
            expanded: true,
        });

        for (const key in options.args)
        {
            if (key !== 'action')
            {
                this.options.addBinding(options.args, key);
            }
        }

        this.options.on('change', () => this.switchComponent(story, options));

        this.switchComponent(story, options);
    }

    private switchComponent(creatorFunction: any, options: StoryOptions)
    {
        this.view.removeChildren();

        if (this.activeComponent && this.activeComponent.destroy)
        {
            this.activeComponent.destroy();
        }

        if (options.args.action)
        {
            options.args.action = (message: string) => console.log(message);
        }

        this.activeComponent = creatorFunction(options.args);
        this.view.addChild(this.activeComponent.view);

        this.resize();
    }

    private addSubscriptions()
    {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('deviceorientation', () => this.resize(), true);
        this.resize();
    }

    private resize(width = window.innerWidth, height = window.innerHeight)
    {
        this.view.x = (width / 2) - (this.view.width / 2);
        this.view.y = (height / 2) - (this.view.height / 2);
    }

    private getTitle(title: string): string
    {
        const split =  title.split('/');

        return split[split.length - 1];
    }
}();

type StoryOptions = {
    title: string;
    argTypes: any;
    args: any;
};

/* eslint-disable no-console */
import { Container } from 'pixi.js';
import { initPixi } from './utils/pixi';
import { Pane } from 'tweakpane';
import { getTitle } from './utils/getTitle';

import SwitcherOpts, { Sprites as SwitcherStory } from '../stories/Switcher/Switcher.stories';

import ButtonContainerOpts,
{ ButtonContainerSprite as ButtonContainerStory } from '../stories/button/ButtonContainerSprite.stories';
import ButtonUseGraphicsOpts, { UseGraphics as ButtonUseGraphicsStory } from '../stories/button/ButtonGraphics.stories';
import ButtonUseSpriteOpts, { UseSprite as ButtonUseSpriteStory } from '../stories/button/ButtonSprite.stories';

import CheckboxGraphicsOpts, { UseGraphics as CheckboxGraphicsStory } from '../stories/checkbox/CheckBoxGraphics.stories';
import CheckboxSpriteOpts, { UseSprite as CheckboxSpriteStory } from '../stories/checkbox/CheckBoxSprite.stories';

// Migration guide:
// https://github.com/pixijs/pixijs/releases/tag/v8.0.0-beta.0

// eslint-disable-next-line no-new
new class App
{
    private view: Container;
    private options: any;
    private componentsList: any;
    private activeComponent: any;

    async init()
    {
        const pixiApp = await initPixi();

        this.view = new Container();

        pixiApp.stage.addChild(this.view);

        this.createComponentsList();
        this.addComponents();

        this.addSubscriptions();
    }

    private createComponentsList()
    {
        this.componentsList = new Pane({
            title: 'Components',
            expanded: true,
        });

        document.getElementById('componentsList')?.appendChild(this.componentsList.element);
    }

    private addComponents()
    {
        const componentsSettings: ComponentsSettings = {
            Switcher: [
                {
                    name: 'Switcher',
                    cb: () => this.addComponent(
                        SwitcherStory,
                        SwitcherOpts,
                        'https://github.com/pixijs/ui/blob/main/src/stories/Switcher/Switcher.stories.ts'
                    )
                }
            ],
            Button: [
                {
                    name: ButtonContainerOpts.title,
                    cb: () => this.addComponent(
                        ButtonContainerStory,
                        ButtonContainerOpts,
                        'https://github.com/pixijs/ui/blob/main/src/stories/button/ButtonContainerSprite.stories.ts'
                    )
                },
                {
                    name: ButtonUseGraphicsOpts.title,
                    cb: () => this.addComponent(
                        ButtonUseGraphicsStory,
                        ButtonUseGraphicsOpts,
                        'https://github.com/pixijs/ui/blob/main/src/stories/button/ButtonGraphics.stories.ts'
                    )
                },
                {
                    name: ButtonUseSpriteOpts.title,
                    cb: () => this.addComponent(
                        ButtonUseSpriteStory,
                        ButtonUseSpriteOpts,
                        'https://github.com/pixijs/ui/blob/main/src/stories/button/ButtonSprite.stories.ts'
                    )
                }
            ],
            CheckBox: [
                {
                    name: CheckboxGraphicsOpts.title,
                    cb: () => this.addComponent(
                        CheckboxGraphicsStory,
                        CheckboxGraphicsOpts,
                        'https://github.com/pixijs/ui/blob/main/src/stories/checkbox/CheckBoxGraphics.stories.ts'
                    )
                },
                {
                    name: CheckboxSpriteOpts.title,
                    cb: () => this.addComponent(
                        CheckboxSpriteStory,
                        CheckboxSpriteOpts,
                        'https://github.com/pixijs/ui/blob/main/src/stories/checkbox/CheckBoxSprite.stories.ts'
                    )
                }
            ]
        };

        for (const section in componentsSettings)
        {
            this.addComponentSection(section, componentsSettings[section]);

            if (!this.activeComponent)
            {
                componentsSettings[section][0].cb();
            }
        }
    }

    private addComponentSection(sectionName: string, components: Components)
    {
        const buttonFolder = this.componentsList.addFolder({
            title: sectionName,
            // expanded: false
        });

        components.forEach((component) =>
        {
            buttonFolder.addButton({ title: getTitle(component.name) }).on('click', () => component.cb());
        });
    }

    private addComponent(story: any, options: StoryOptions, link: string)
    {
        this.options?.dispose();

        this.options = new Pane({
            title: 'Settings',
            expanded: true,
        });

        document.getElementById('componentSettings')?.appendChild(this.options.element);

        // console.log(options.argTypes, options.args);

        for (const key in options.args)
        {
            // console.log(key, options.args[key], options.argTypes[key]);

            if (key === 'action' || typeof options.args[key] === 'function')
            {
                continue;
            }

            if (!options.argTypes[key])
            {
                this.options.addBinding(options.args, key);
                this.options.on('change', () => this.switchComponent(story, options));

                continue;
            }

            switch (options.argTypes[key].control?.type)
            {
                case 'select':
                    this.options.addBlade({
                        view: 'list',
                        label: key,
                        options: options.argTypes[key].options.map((option: string) => ({ text: option, value: option })),
                        value: options.args[key],
                    }).on('change', ({ value }: {value: string}) =>
                    {
                        options.args[key] = value;
                        this.switchComponent(story, options);
                    });

                    break;
                case 'range':
                    this.options.addBinding(options.args, key, {
                        step: options.argTypes[key].control?.step || 1,
                        min: options.argTypes[key].control?.min || 0,
                        max: options.argTypes[key].control?.max || 100,
                    });
                    this.options.on('change', () => this.switchComponent(story, options));

                    break;
                default:
                    this.options.addBinding(options.args, key);
                    this.options.on('change', () => this.switchComponent(story, options));

                    break;
            }
        }

        this.options
            .addButton({ title: 'Open code example' })
            .on('click', () => window.open(link, '_blank'));

        this.switchComponent(story, options);
    }

    private switchComponent(creatorFunction: any, options: StoryOptions)
    {
        this.view.removeChildren();

        if (this.activeComponent && this.activeComponent.destroy)
        {
            this.activeComponent.destroy();
        }

        for (const key in options.args)
        {
            if (typeof options.args[key] === 'function')
            {
                options.args[key] = (message: string) => console.log(message);
            }
        }

        console.log(`switchComponent`, options);

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
        this.activeComponent?.resize(width, height);
    }
}().init();

type StoryOptions = {
    title: string;
    argTypes: any;
    args: any;
};

type Component = {
    name: string;
    cb: () => void;
};

type Components = Component[];

type ComponentsSettings = {
    [key: string]: Components;
};

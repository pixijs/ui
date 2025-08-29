import { Container, isMobile, Sprite, Text, Texture } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { Button } from '../../Button';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: '👉 Click me 👈',
    textColor: colors.textColor,
    disabled: false,
    action: action('Button'),
};

type Args = typeof args;

class SpriteButton extends Button
{
    private buttonView = new Container();
    private textView: Text;
    private buttonBg = new Sprite();
    private action: (event: string) => void;

    constructor(private props: {
        text: string;
        textColor: string;
        disabled: boolean;
        action: (event: string) => void;
    })
    {
        super(/* we can set a view for button later */);
        this.view = this.buttonView;
        this.action = props.action;
        this.enabled = !props.disabled;

        this.textView = new Text({
            text: this.props.text,
            style: { ...defaultTextStyle, fill: this.props.textColor },
        });
        this.textView.y = -5;
        this.textView.x = -4;
        this.textView.anchor.set(0.5);

        this.buttonBg.addChild(this.textView);

        this.init();
    }

    private async init()
    {
        await preload([`button.png`, `button_hover.png`, `button_pressed.png`, `button_disabled.png`]);

        this.buttonBg.texture = Texture.from(this.props.disabled ? 'button_disabled.png' : 'button.png');

        this.buttonBg.anchor.set(0.5);

        this.buttonView.addChild(this.buttonBg);
    }

    override down()
    {
        this.buttonBg.texture = Texture.from('button_pressed.png');
        this.textView.x = 0;
        this.textView.y = 0;
        this.action('down');
    }

    override up()
    {
        this.buttonBg.texture = isMobile.any
            ? Texture.from('button.png')
            : Texture.from('button_hover.png');

        this.textView.y = -5;
        this.textView.x = -4;
        this.action('up');
    }

    override upOut()
    {
        this.buttonBg.texture = Texture.from('button.png');
        this.action('upOut');
    }

    override out()
    {
        if (!this.isDown)
        {
            this.buttonBg.texture = Texture.from('button.png');
        }
        this.action('out');
    }

    override press()
    {
        this.action('onPress');
    }

    override hover()
    {
        if (!this.isDown)
        {
            this.buttonBg.texture = Texture.from('button_hover.png');
        }
        this.action('hover');
    }
}

export const UseSprite = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const { text, textColor, disabled, action } = args;
                const buttonView = new SpriteButton({ text, textColor, disabled, action });

                if (buttonView.view)
                {
                    view.addChild(buttonView.view);
                }
            },
            resize: centerView,
        }),
};

export default {
    title: 'Components/Button/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

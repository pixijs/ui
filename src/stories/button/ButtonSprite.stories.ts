import { isMobile, Sprite, Text, Texture } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { Button } from '../../Button';
import { centerView } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    disabled: false,
    action: action('Button')
};

export class SpriteButton extends Button
{
    private textView: Text;
    private buttonView = new Sprite();
    private action: (event: string) => void;

    constructor(props: {
        text: string,
        textColor: string,
        disabled: boolean,
        action: (event: string) => void})
    {
        super(/* we can set a view for button later */);

        this.view = this.buttonView;

        preload([`button.png`, `button_hover.png`, `button_pressed.png`]).then(() =>
        {
            this.buttonView.texture = Texture.from('button.png');

            this.buttonView.anchor.set(0.5);

            this.textView = new Text({
                text: props.text, style: {
                    ...defaultTextStyle,
                    fontSize: 40,
                    fill: props.textColor
                }
            });
            this.textView.y = -10;
            this.textView.anchor.set(0.5);

            this.buttonView.addChild(this.textView);

            this.enabled = !props.disabled;
        });

        this.action = props.action;
    }

    override down()
    {
        this.buttonView.texture = Texture.from('button_pressed.png');
        this.action('down');
    }

    override up()
    {
        this.buttonView.texture = isMobile.any
            ? Texture.from('button.png')
            : Texture.from('button_hover.png');

        this.action('up');
    }

    override upOut()
    {
        this.buttonView.texture = Texture.from('button.png');
        this.action('upOut');
    }

    override out()
    {
        if (!this.isDown)
        {
            this.buttonView.texture = Texture.from('button.png');
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
            this.buttonView.texture = Texture.from('button_hover.png');
        }
        this.action('hover');
    }
}

export const UseSprite: StoryFn<typeof args> = (params, context) => new PixiStory({
    context, init: (view) =>
    {
        const buttonView = new SpriteButton(params);

        view.addChild(buttonView.view);

        centerView(view);
    },
    resize: centerView
});

export default {
    title: 'Components/Button/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

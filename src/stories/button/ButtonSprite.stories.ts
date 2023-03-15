import { Text } from '@pixi/text';
import { Button } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { centerElement } from '../../utils/helpers/resize';
import { preload } from '../utils/loader';
import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    disabled: false,
    action: action('Button')
};

export class SpriteButton extends Button
{
    private buttonView: Sprite;
    private textView: Text;
    private action: (event: string) => void;

    constructor(props: {
        text: string,
        textColor: string | number,
        disabled: boolean,
        action: (event: string) => void})
    {
        const sprite = new Sprite();

        super(sprite);

        this.buttonView = sprite;
        this.view.addChild(this.buttonView);

        this.textView = new Text(props.text, { fontSize: 40, fill: props.textColor });
        this.view.addChild(this.textView);

        preload([`button.png`]).then(() =>
        {
            const texture = Texture.from('button.png');

            this.buttonView.texture = texture;

            this.textView.anchor.set(0.5);
            this.textView.x = texture.width / 2;
            this.textView.y = (texture.height / 2) - 12;

            this.resize();
        });

        this.enabled = !props.disabled;

        this.action = props.action;
    }

    override press()
    {
        this.action('onPress');
    }

    override down()
    {
        this.action('down');
    }

    override up()
    {
        this.action('up');
    }

    override hover()
    {
        this.action('hover');
    }

    override out()
    {
        this.action('out');
    }

    override upOut()
    {
        this.action('upOut');
    }

    resize()
    {
        centerElement(this.view);
    }
}

export const UseSprite = (params: any) => new SpriteButton(params);

export default {
    title: 'Components/Button/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

import { Text } from '@pixi/text';
import { Button } from '../../Button';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { centerView } from '../../utils/helpers/resize';
import { preload } from '../utils/loader';
import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { defaultTextStyle } from '../../utils/helpers/styles';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    disabled: false,
    action: action('Button')
};

export class SpriteButton extends Button
{
    private textView: Text;
    private action: (event: string) => void;

    constructor(props: {
        text: string,
        textColor: string | number,
        disabled: boolean,
        action: (event: string) => void})
    {
        super(/* we can set a view for button later */);

        this.view = new Container();

        preload([`button.png`]).then(() =>
        {
            const buttonView = Sprite.from('button.png');

            buttonView.anchor.set(0.5);

            this.view.addChild(buttonView);

            this.textView = new Text(props.text, { ...defaultTextStyle, fontSize: 40 });
            this.textView.y = -10;
            this.textView.anchor.set(0.5);

            buttonView.addChild(this.textView);

            this.enabled = !props.disabled;

            this.resize();
        });

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
        centerView(this.view);
    }
}

export const UseSprite = (params: any) => new SpriteButton(params);

export default {
    title: 'Components/Button/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

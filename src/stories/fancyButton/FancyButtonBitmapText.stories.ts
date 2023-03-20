import { FancyButton } from '../../FancyButton';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { centerView } from '../../utils/helpers/resize';
import { Container } from '@pixi/display';
import { BitmapFont, BitmapText } from '@pixi/text-bitmap';
import { defaultTextStyle } from '../../utils/helpers/styles';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    padding: 11,
    textOffsetX: 0,
    textOffsetY: -7,
    anchorX: 0.5,
    anchorY: 0.5,
    animationDuration: 100,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)')
};

export const UsingSpriteAndBitmapText = ({
    text,
    textColor,
    disabled,
    onPress,
    padding,
    textOffsetX,
    textOffsetY,
    anchorX,
    anchorY,
    animationDuration
}: any) =>
{
    const view = new Container();

    const assets = [`button.png`, `button_hover.png`, `button_pressed.png`, `button_disabled.png`];

    preload(assets).then(() =>
    {
        BitmapFont.from('TitleFont', {
            ...defaultTextStyle,
            fill: textColor || defaultTextStyle.fill
        });

        const title = new BitmapText(text, { fontName: 'TitleFont' });

        // Component usage !!!
        const button = new FancyButton({
            defaultView: `button.png`,
            hoverView: `button_hover.png`,
            pressedView: `button_pressed.png`,
            disabledView: `button_disabled.png`,
            text: title,
            padding,
            textOffset: { x: textOffsetX, y: textOffsetY },
            animations: {
                hover: {
                    props: {
                        scale: { x: 1.03, y: 1.03 },
                        y: 0
                    },
                    duration: animationDuration
                },
                pressed: {
                    props: {
                        scale: { x: 0.9, y: 0.9 },
                        y: 10
                    },
                    duration: animationDuration
                }
            }
        });

        button.anchor.set(anchorX, anchorY);

        if (disabled)
        {
            button.enabled = false;
        }

        button.onPress.connect(onPress);

        centerView(view);

        view.addChild(button);
    });

    return { view, resize: () => centerView(view) };
};

export default {
    title: 'Components/FancyButton/Using Sprite And  BitmapText',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

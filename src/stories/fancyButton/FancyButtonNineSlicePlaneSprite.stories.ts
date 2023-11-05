import { Text } from '@pixi/text';
import { FancyButton } from '../../FancyButton';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { preload } from '../utils/loader';
import { centerView } from '../../utils/helpers/resize';
import { Container } from '@pixi/display';
import { MaskedFrame } from '../../MaskedFrame';

const args = {
    text: 'Click me!',
    textColor: '#FFFFFF',
    padding: 11,
    width: 300,
    height: 137,
    anchorX: 0.5,
    anchorY: 0.5,
    animationDuration: 100,
    disabled: false,
    onPress: action('button was pressed! (tap or click!)')
};

export const UseNineSlicePlane = ({
    text,
    textColor,
    disabled,
    onPress,
    padding,
    anchorX,
    anchorY,
    animationDuration,
    width,
    height
}: any) =>
{
    const view = new Container();

    const assets = [
        `button.png`,
        `button_hover.png`,
        `button_pressed.png`,
        `button_disabled.png`,
        `avatar-01.png`,
        `avatar_mask.png`
    ];

    preload(assets).then(() =>
    {
    // Component usage !!!
        const button = new FancyButton({
            defaultView: `button.png`,
            hoverView: `button_hover.png`,
            pressedView: `button_pressed.png`,
            disabledView: `button_disabled.png`,
            nineSlicePlane: [
                150, 66, 150, 66
            ],
            text: new Text(text, {
                ...defaultTextStyle,
                fill: textColor || defaultTextStyle.fill
            }),
            padding,
            textOffset: { x: 30, y: -5 },
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
            },
        });

        button.iconView = new MaskedFrame({
            target: `avatar-01.png`,
            mask: `avatar_mask.png`,
            borderWidth: 10,
            borderColor: 0xFFFFFF
        });
        button.iconView.scale.set(0.2);
        button.iconOffset = { x: -100, y: -7 };

        button.anchor.set(anchorX, anchorY);

        if (disabled)
        {
            button.enabled = false;
        }

        const sizes: {w: number, h: number}[] = [
            { w: width, h: height },
            { w: 300, h: 300 },
            { w: 600, h: 137 },
            { w: 600, h: 300 }
        ];

        button.width = sizes[0].w;
        button.height = sizes[0].h;

        let currentSizeID = 0;

        button.onPress.connect(() =>
        {
            currentSizeID++;

            if (currentSizeID >= sizes.length)
            {
                currentSizeID = 0;
            }

            const size = sizes[currentSizeID];

            button.width = size.w;
            button.height = size.h;
        });

        button.onPress.connect(onPress);

        centerView(view);

        view.addChild(button);
    });

    return { view, resize: () => centerView(view) };
};

export default {
    title: 'Components/FancyButton/Use NineSlicePlane',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

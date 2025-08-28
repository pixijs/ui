import { ColorSource, Container, Graphics, Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    fontColor: colors.textColor,
    bgColor: colors.pannelColor,
    bgBorderColor: colors.pannelBorderColor,
    windowWidth: 400,
    windowHeight: 400,
    radius: 20,
    elementsMargin: 6,
    itemsAmount: 100,
    disableEasing: false,
    type: ['vertical', 'horizontal', 'bidirectional'],
    onPress: action('Button pressed'),
    globalScroll: true,
    shiftScroll: false,
};

type Args = typeof args & {
    type: 'vertical' | 'horizontal' | 'bidirectional';
};

export const UseSprite = {
    render: (args: Args, ctx: StoryContext) =>
    {
        const {
            fontColor,
            elementsMargin,
            bgColor,
            windowWidth,
            windowHeight,
            radius,
            itemsAmount,
            bgBorderColor,
            disableEasing,
            type,
            onPress,
            globalScroll,
            shiftScroll,
        } = args;

        return new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const assets = [
                    `button.png`,
                    `button_hover.png`,
                    `button_pressed.png`,
                ];

                await preload(assets);

                const window = new Graphics()
                    .roundRect(0, 0, windowWidth, windowHeight, radius)
                    .fill(bgColor)
                    .stroke({
                        color: bgBorderColor,
                        width: 1,
                    });

                const width = window.width - 40;
                const height = window.height - 40;

                const items: Container[] = createItems(
                    width * 2,
                    itemsAmount,
                    fontColor,
                    onPress);

                // Component usage !!!
                const scrollBox = new ScrollBox({
                    elementsMargin,
                    width,
                    height,
                    vertPadding: 0,
                    radius: 5,
                    disableEasing,
                    type,
                    globalScroll,
                    shiftScroll,
                });

                if (type === 'bidirectional' && scrollBox.list)
                {
                    scrollBox.list.width = window.width - 40;
                    scrollBox.list.height = window.height - 40;
                }

                scrollBox.addItems(items);

                scrollBox.x = 20;
                scrollBox.y = 20;

                window.addChild(scrollBox);

                view.addChild(window);

                centerElement(view);
            },

            resize: centerElement,
        });
    },
};

function createItems(
    width: number,
    itemsAmount: number,
    fontColor: ColorSource,
    onPress: (buttonID: number) => void,
): FancyButton[]
{
    const items = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: `button.png`,
            hoverView: `button_hover.png`,
            pressedView: `button_pressed.png`,
            nineSliceSprite: [25, 20, 25, 20],
            text: new Text({
                text: i + 1,
                style: {
                    ...defaultTextStyle,
                    fontSize: 68,
                    fill: fontColor,
                },
            }),
            textOffset: {
                x: 0,
                y: -7,
            },
        });

        button.width = width;
        button.height = 100;

        button.anchor.set(0);
        button.scale.set(0.5);

        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    return items;
}

export default {
    title: 'Components/ScrollBox/Use Sprite',
    argTypes: argTypes(args),
    args: { ...getDefaultArgs(args), type: 'vertical' },
};

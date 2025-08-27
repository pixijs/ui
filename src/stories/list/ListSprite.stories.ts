import { Container, Graphics, Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { List, ListType } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    type: 'vertical' as ListType,
    width: 430,
    height: 330,
    radius: 20,
    bgColor: colors.pannelColor,
    bgBorderColor: colors.pannelBorderColor,
    fontColor: colors.textColor,
    elementsMargin: 29,
    topPadding: 20,
    leftPadding: 20,
    rightPadding: 20,
    itemsAmount: 16,
    onPress: action('Button pressed'),
};

type Args = typeof args;

export const UseSprite = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: async (view) =>
            {
                const {
                    fontColor,
                    width,
                    height,
                    radius,
                    bgColor,
                    bgBorderColor,
                    elementsMargin,
                    topPadding,
                    leftPadding,
                    rightPadding,
                    itemsAmount,
                    type,
                    onPress,
                } = args;
                const assets = [
                    `button.png`,
                    `button_hover.png`,
                    `button_pressed.png`,
                ];

                await preload(assets);

                const viewGraphics = new Graphics()
                    .roundRect(0, 0, width, height, radius)
                    .fill(bgColor)
                    .stroke({
                        color: bgBorderColor,
                        width: 1,
                    });

                const items: Container[] = createItems(itemsAmount, getColor(fontColor) ?? 0x000000, onPress);

                // Component usage !!!
                const list = new List({
                    elementsMargin,
                    topPadding,
                    leftPadding,
                    rightPadding,
                    type,
                });

                viewGraphics.addChild(list);
                view.addChild(viewGraphics);
                items.forEach((item) => list.addChild(item));

                centerElement(view);
            },
            resize: centerElement,
        }),
};

function createItems(
    itemsAmount: number,
    fontColor: number,
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

        button.width = 150;
        button.height = 100;

        button.scale.set(0.5);

        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    return items;
}

export default {
    title: 'Components/List/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

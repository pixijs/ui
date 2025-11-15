import { Graphics, Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { LIST_TYPE } from '../../utils/HelpTypes';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    fontColor: colors.textColor,
    backgroundColor: colors.pannelBorderColor,
    bgBorderColor: colors.pannelBorderColor,
    buttonColor: colors.color,
    hoverButtonColor: colors.hoverColor,
    pressedButtonColor: colors.pressedColor,
    width: 490,
    height: 420,
    radius: 20,
    elementsMargin: 10,
    elementsPadding: 10,
    elementsWidth: 150,
    elementsHeight: 80,
    itemsAmount: 100,
    disableEasing: false,
    globalScroll: true,
    shiftScroll: false,
    type: [null, ...LIST_TYPE],
    innerListWidth: 1000,
    onPress: action('Button pressed'),
};

type Args = typeof args & {
    type: 'vertical' | 'horizontal' | 'bidirectional';
};

export const UseGraphics = {
    args: {
        type: null,
    },
    render: (args: Args, ctx: StoryContext) =>
    {
        const {
            fontColor,
            elementsMargin,
            elementsPadding,
            elementsWidth,
            elementsHeight,
            width,
            height,
            radius,
            itemsAmount,
            backgroundColor,
            disableEasing,
            type,
            onPress,
            globalScroll,
            shiftScroll,
            innerListWidth,
            buttonColor,
            hoverButtonColor,
            pressedButtonColor,
        } = args;

        return new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const items = [];

                for (let i = 0; i < itemsAmount; i++)
                {
                    const button = new FancyButton({
                        defaultView: new Graphics()
                            .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                            .fill(buttonColor),
                        hoverView: new Graphics()
                            .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                            .fill(hoverButtonColor),
                        pressedView: new Graphics()
                            .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                            .fill(pressedButtonColor),
                        text: new Text({
                            text: `Item ${i + 1}`,
                            style: {
                                ...defaultTextStyle,
                                fill: fontColor,
                            },
                        }),
                    });

                    button.anchor.set(0);
                    button.onPress.connect(() => onPress(i + 1));

                    items.push(button);
                }

                // Component usage !!!
                const scrollBox = new ScrollBox({
                    background: backgroundColor,
                    elementsMargin,
                    width,
                    height,
                    radius,
                    padding: elementsPadding,
                    disableEasing,
                    type,
                    globalScroll,
                    shiftScroll,
                });

                if (type === 'bidirectional' && scrollBox.list)
                {
                    scrollBox.list.maxWidth = innerListWidth;
                }

                scrollBox.addItems(items);

                view.addChild(scrollBox);
            },
            resize: (view) => centerElement(view.children[0]),
        });
    },
};

export default {
    title: 'Components/ScrollBox/Use Graphics',
    argTypes: argTypes(args),
    args: { ...getDefaultArgs(args), type: 'vertical' },
};

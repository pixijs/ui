import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { List, ListType } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { LIST_TYPE } from '../../utils/HelpTypes';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

const args = {
    type: [null, ...LIST_TYPE],
    fontColor: colors.textColor,
    bgColor: colors.pannelColor,
    bgBorderColor: colors.pannelBorderColor,
    buttonColor: colors.color,
    hoverButtonColor: colors.hoverColor,
    pressedButtonColor: colors.pressedColor,
    width: 290,
    height: 290,
    radius: 20,
    elementsMargin: 10,
    topPadding: 20,
    leftPadding: 20,
    rightPadding: 20,
    elementsWidth: 70,
    elementsHeight: 70,
    itemsAmount: 9,
    onPress: action('Button pressed'),
};

export const UseGraphics: StoryFn<typeof args & { type: ListType }> = (
    {
        type,
        fontColor,
        bgColor,
        bgBorderColor,
        buttonColor,
        hoverButtonColor,
        pressedButtonColor,
        width,
        height,
        elementsMargin,
        topPadding,
        leftPadding,
        rightPadding,
        elementsWidth,
        elementsHeight,
        radius,
        itemsAmount,
        onPress,
    },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const viewGraphics = new Graphics()
                .roundRect(0, 0, width, height, radius)
                .fill(bgColor)
                .stroke({
                    color: bgBorderColor,
                    width: 1,
                });

            const items = [];

            for (let i = 0; i < itemsAmount; i++)
            {
                const text = new Text({
                    text: i + 1,
                    style: {
                        ...defaultTextStyle,
                        fill: fontColor,
                    },
                });

                const button = new FancyButton({
                    defaultView: new Graphics()
                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                        .fill(buttonColor)
                        .roundRect(8, 8, elementsWidth - 3, elementsHeight - 3, radius)
                        .stroke({
                            color: buttonColor,
                            width: 2,
                        }),
                    hoverView: new Graphics()
                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                        .fill(hoverButtonColor)
                        .roundRect(8, 8, elementsWidth - 3, elementsHeight - 3, radius)
                        .stroke({
                            color: hoverButtonColor,
                            width: 2,
                        }),
                    pressedView: new Graphics()
                        .roundRect(4, 4, elementsWidth, elementsHeight, radius)
                        .fill(pressedButtonColor)
                        .roundRect(8, 8, elementsWidth - 1, elementsHeight - 1, radius)
                        .stroke({
                            color: pressedButtonColor,
                            width: 2,
                        }),
                    text,
                });

                button.onDown.connect(() =>
                {
                    text.x += 4;
                    text.y += 4;
                });

                button.onUp.connect(() =>
                {
                    text.x -= 4;
                    text.y -= 4;
                });
                button.onUpOut.connect(() =>
                {
                    text.x -= 4;
                    text.y -= 4;
                });

                button.anchor.set(0);
                button.onPress.connect(() => onPress(i + 1));

                items.push(button);
            }

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
        },
        resize: (view) => centerElement(view.children[0]),
    });

export default {
    title: 'Components/List/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

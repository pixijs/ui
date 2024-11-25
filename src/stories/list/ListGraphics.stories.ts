import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

const args = {
    type: [null, 'horizontal', 'vertical'],
    fontColor: '#000000',
    bgColor: '#f5e3a9',
    width: 271,
    height: 270,
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

export const UseGraphics: StoryFn<
  typeof args & { type: 'horizontal' | 'vertical' }
> = (
    {
        type,
        fontColor,
        bgColor,
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
                .fill(bgColor);

            const items = [];

            for (let i = 0; i < itemsAmount; i++)
            {
                const button = new FancyButton({
                    defaultView: new Graphics()
                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                        .fill(0xa5e24d),
                    hoverView: new Graphics()
                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                        .fill(0xfec230),
                    pressedView: new Graphics()
                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                        .fill(0xfe6048),
                    text: new Text({
                        text: i + 1,
                        style: {
                            ...defaultTextStyle,
                            fontSize: 28,
                            fill: fontColor,
                        },
                    }),
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

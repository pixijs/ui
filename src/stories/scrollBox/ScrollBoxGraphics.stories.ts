import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

const args = {
    fontColor: '#000000',
    backgroundColor: '#F5E3A9',
    width: 320,
    height: 420,
    radius: 20,
    elementsMargin: 10,
    elementsPadding: 10,
    elementsWidth: 300,
    elementsHeight: 80,
    itemsAmount: 100,
    disableEasing: false,
    globalScroll: true,
    shiftScroll: false,
    type: [undefined, 'vertical', 'horizontal'],
    onPress: action('Button pressed'),
};

export const UseGraphics: StoryFn<
  typeof args & { type: 'vertical' | 'horizontal' | undefined }
> = (
    {
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
    },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
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

            scrollBox.addItems(items);

            view.addChild(scrollBox);
        },
        resize: (view) => centerElement(view.children[0]),
    });

export default {
    title: 'Components/ScrollBox/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

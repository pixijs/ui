import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { action } from '@storybook/addon-actions';

const args = {
    proximityRange: 100,
    proximityDebounce: 10,
    width: 320,
    height: 420,
    radius: 20,
    elementsMargin: 10,
    elementsPadding: 10,
    elementsWidth: 300,
    elementsHeight: 80,
    itemsAmount: 100,
    type: [undefined, 'vertical', 'horizontal'],
    fadeSpeed: 0.5,
};

const items: FancyButton[] = [];
const inRangeCache: boolean[] = [];

export const ProximityEvent: StoryFn<
    typeof args & { type: 'vertical' | 'horizontal' | undefined }
> = (
    {
        width,
        height,
        radius,
        elementsMargin,
        elementsPadding,
        elementsWidth,
        elementsHeight,
        itemsAmount,
        proximityRange,
        proximityDebounce,
        type,
        fadeSpeed,
    },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) => {
            const fontColor = '#000000';
            const backgroundColor = '#F5E3A9';
            const disableEasing = false;
            const globalScroll = true;
            const shiftScroll = type === 'horizontal';
            const onPress = action('Button pressed');

            items.length = 0;
            inRangeCache.length = 0;

            for (let i = 0; i < itemsAmount; i++) {
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
                button.alpha = 0;

                items.push(button);
                inRangeCache.push(false);
            }

            const scrollBox = new ScrollBox({
                background: backgroundColor,
                elementsMargin,
                width,
                height,
                radius,
                padding: elementsPadding,
                disableEasing,
                globalScroll,
                shiftScroll,
                type,
                proximityRange,
                proximityDebounce,
            });

            scrollBox.addItems(items);

            // Handle on proximity change event.
            scrollBox.onProximityChange.connect(({ index, inRange }) => {
                inRangeCache[index] = inRange;
            });

            view.addChild(scrollBox);
        },
        resize: (view) => centerElement(view.children[0]),
        update: () => {
            items.forEach((item, index) => {
                const inRange = inRangeCache[index];

                // Fade in/out according to whether the item is within the specified range.
                if (inRange && item.alpha < 1) item.alpha += 0.04 * fadeSpeed;
                else if (!inRange && item.alpha > 0) item.alpha -= 0.04 * fadeSpeed;
            });
        },
    });

export default {
    title: 'Components/ScrollBox/Proximity Event',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ScrollBox } from '../../ScrollBox';
import { FancyButton } from '../../FancyButton';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';

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

export const ProximityEvent: StoryFn = ({
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
}: any) =>
{
    const view = new Container();

    const fontColor = '#000000';
    const backgroundColor = '#F5E3A9';
    const disableEasing = false;
    const globalScroll = true;
    const shiftScroll = type === 'horizontal';
    const onPress = action('Button pressed');

    items.length = 0;
    inRangeCache.length = 0;

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: new Graphics().beginFill(0xa5e24d).drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            hoverView: new Graphics().beginFill(0xfec230).drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            pressedView: new Graphics().beginFill(0xfe6048).drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            text: new Text(`Item ${i + 1}`, {
                ...defaultTextStyle,
                fill: fontColor
            })
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
    scrollBox.onProximityChange.connect(({ index, inRange }) =>
    {
        inRangeCache[index] = inRange;
    });

    view.addChild(scrollBox);

    return {
        view,
        resize: () => centerElement(view),
        update: () =>
        {
            items.forEach((item, index) =>
            {
                const inRange = inRangeCache[index];

                // Fade in/out according to whether the item is within the specified range.
                if (inRange && item.alpha < 1) item.alpha += 0.04 * fadeSpeed;
                else if (!inRange && item.alpha > 0) item.alpha -= 0.04 * fadeSpeed;
            });
        },
    };
};

export default {
    title: 'Components/ScrollBox/Proximity Event',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

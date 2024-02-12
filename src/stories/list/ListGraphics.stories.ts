import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/types';
import { Graphics, Text } from 'pixi.js';
import { FancyButton } from '../../FancyButton';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';

const args = {
    type: [null, 'horizontal', 'vertical'],
    fontColor: '#000000',
    bgColor: '#f5e3a9',
    width: 271,
    height: 270,
    radius: 20,
    elementsMargin: 10,
    vertPadding: 20,
    horPadding: 20,
    elementsWidth: 70,
    elementsHeight: 70,
    itemsAmount: 9,
    onPress: action('Button pressed')
};

export const UseGraphics: StoryFn = ({
    type,
    fontColor,
    bgColor,
    width,
    height,
    elementsMargin,
    vertPadding,
    horPadding,
    elementsWidth,
    elementsHeight,
    radius,
    itemsAmount,
    onPress
}: any) =>
{
    fontColor = getColor(fontColor);
    bgColor = getColor(bgColor);

    const view = new Graphics().fill(bgColor).roundRect(0, 0, width, height, radius);

    const items = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: new Graphics().fill(0xa5e24d).roundRect(0, 0, elementsWidth, elementsHeight, radius),
            hoverView: new Graphics().fill(0xfec230).roundRect(0, 0, elementsWidth, elementsHeight, radius),
            pressedView: new Graphics().fill(0xfe6048).roundRect(0, 0, elementsWidth, elementsHeight, radius),
            text: new Text(i + 1, {
                ...defaultTextStyle,
                fontSize: 28,
                fill: fontColor
            })
        });

        button.anchor.set(0);
        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    // Component usage !!!
    const list = new List({
        elementsMargin,
        vertPadding,
        horPadding,
        type
    });

    view.addChild(list);
    items.forEach((item) => list.addChild(item));

    return {
        view,
        resize: () => centerElement(view)
    };
};

export default {
    title: 'Components/List/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

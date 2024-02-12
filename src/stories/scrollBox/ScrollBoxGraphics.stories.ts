import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/types';
import { Container, Graphics, Text } from 'pixi.js';
import { FancyButton } from '../../FancyButton';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';

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
    type: [undefined, 'vertical', 'horizontal'],
    onPress: action('Button pressed')
};

export const UseGraphics: StoryFn = ({
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
    onPress
}: any) =>
{
    const view = new Container();

    backgroundColor = getColor(backgroundColor);
    fontColor = getColor(fontColor);

    const items = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: new Graphics().fill(0xa5e24d).roundRect(0, 0, elementsWidth, elementsHeight, radius),
            hoverView: new Graphics().fill(0xfec230).roundRect(0, 0, elementsWidth, elementsHeight, radius),
            pressedView: new Graphics().fill(0xfe6048).roundRect(0, 0, elementsWidth, elementsHeight, radius),
            text: new Text(`Item ${i + 1}`, {
                ...defaultTextStyle,
                fill: fontColor
            })
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
        type
    });

    scrollBox.addItems(items);

    view.addChild(scrollBox);

    return {
        view,
        resize: () => centerElement(view)
    };
};

export default {
    title: 'Components/ScrollBox/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

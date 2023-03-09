import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { FancyButton } from '../../FancyButton';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { getColor } from '../utils/color';
import { List } from '../../List';

const args = {
    type: ['vertical', 'horizontal'],
    fontColor: '#000000',
    radius: 20,
    elementsMargin: 10,
    vertPadding: 0,
    horPadding: 0,
    elementsWidth: 200,
    elementsHeight: 70,
    itemsAmount: 3,
    onPress: action('Button pressed')
};

export const UseGraphics: StoryFn = ({
    type,
    fontColor,
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
    const view = new Container();

    fontColor = getColor(fontColor);

    const items = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: new Graphics().beginFill(0xa5e24d).drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            hoverView: new Graphics().beginFill(0xfec230).drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            text: new Text(`Item ${i + 1}`, {
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
    const layout = new List({
        elementsMargin,
        vertPadding,
        horPadding,
        type
    });

    items.forEach((item) => layout.addChild(item));

    view.addChild(layout);

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

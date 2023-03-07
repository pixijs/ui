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
import { Layout } from '../../Layout';

const args = {
    fontColor: '#000000',
    backgroundColor: '#F5E3A9',
    width: 320,
    height: 420,
    radius: 20,
    elementsMargin: 10,
    vertPadding: 10,
    horPadding: 10,
    elementsPadding: 10,
    elementsWidth: 300,
    elementsHeight: 80,
    itemsAmount: 3,
    type: ['vertical', 'horizontal'],
    onPress: action('Button pressed')
};

export const Vertical: StoryFn = ({
    fontColor,
    elementsMargin,
    vertPadding,
    horPadding,
    elementsWidth,
    elementsHeight,
    radius,
    itemsAmount,
    type,
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
                fill: fontColor
            })
        });

        button.anchor.set(0);
        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    // Component usage !!!
    const layout = new Layout({
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
    title: 'Components/Layout/Vertical',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

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
import { getColor } from '../utils/color';

const args = {
    fontColor: '#000000',
    backgroundColor: '#F5E3A9',
    width: 320,
    height: 420,
    radius: 20,
    elementsMargin: 10,
    paddingTop: 11,
    paddingRight: 11,
    paddingBottom: 11,
    paddingLeft: 11,
    elementsWidth: 300,
    elementsHeight: 80,
    itemsAmount: 100,
    onPress: action('Button pressed'),
};

export const UseGraphics: StoryFn = ({
    fontColor,
    elementsMargin,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    elementsWidth,
    elementsHeight,
    width,
    height,
    radius,
    itemsAmount,
    backgroundColor,
    onPress,
}: any) =>
{
    const view = new Container();

    backgroundColor = getColor(backgroundColor);
    fontColor = getColor(fontColor);

    const items = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: new Graphics()
                .beginFill(0xa5e24d)
                .drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            hoverView: new Graphics()
                .beginFill(0xfec230)
                .drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            text: new Text(`Item ${i + 1}`, {
                ...defaultTextStyle,
                fill: fontColor,
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
        padding: {
            top: paddingTop,
            right: paddingRight,
            bottom: paddingBottom,
            left: paddingLeft,
        },
    });

    items.forEach((item) => scrollBox.addItem(item));

    view.addChild(scrollBox);

    return {
        view,
        resize: () => centerElement(view),
    };
};

export default {
    title: 'Components/ScrollBox/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

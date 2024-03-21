import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ScrollBox } from '../../ScrollBox';
import { FancyButton } from '../../FancyButton';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { getColor } from '../utils/color';

const args = {
    fontColor: '#000000',
    backgroundColor: '#F5E3A9',
    itemsAmount: 100,
};

export const UseDynamicDimensions: StoryFn = ({
    fontColor,
    itemsAmount,
    backgroundColor,
}: any) =>
{
    const view = new Container();

    backgroundColor = getColor(backgroundColor);
    fontColor = getColor(fontColor);

    const sizes: {w: number, h: number}[] = [
        { w: 320, h: 440 },
        { w: 630, h: 440 },
        { w: 630, h: 360 },
        { w: 320, h: 200 }
    ];
    const elementsWidth = 300;
    const elementsHeight = 80;
    const radius = 20;
    let currentSizeID = 0;

    // Component usage !!!
    const scrollBox = new ScrollBox({
        background: backgroundColor,
        elementsMargin: 10,
        width: sizes[currentSizeID].w,
        height: sizes[currentSizeID].h,
        radius,
        padding: 10,
    });

    const items = [];
    const resizeScrollBox = () =>
    {
        currentSizeID++;

        if (currentSizeID >= sizes.length)
        {
            currentSizeID = 0;
        }

        const size = sizes[currentSizeID];

        scrollBox.width = size.w;
        scrollBox.height = size.h;
    };

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
        button.onPress.connect(() => resizeScrollBox());

        items.push(button);
    }

    scrollBox.addItems(items);

    view.addChild(scrollBox);

    return {
        view,
        resize: () => centerElement(view)
    };
};

export default {
    title: 'Components/ScrollBox/Use Dynamic Dimensions',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

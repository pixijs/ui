import { Graphics, Text } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { LIST_TYPE } from '../../utils/HelpTypes';
import { argTypes, getDefaultArgs } from '../utils/argTypes';

import type { Args, StoryContext } from '@pixi/storybook-renderer';

const args = {
    fontColor: colors.textColor,
    backgroundColor: colors.pannelBorderColor,
    bgBorderColor: colors.pannelBorderColor,
    buttonColor: colors.color,
    hoverButtonColor: colors.hoverColor,
    pressedButtonColor: colors.pressedColor,
    itemsAmount: 100,
    type: [null, ...LIST_TYPE],
};

export const UseDynamicDimensions = {
    render: (args: Args, ctx: StoryContext) =>
    {
        const { fontColor, itemsAmount, backgroundColor, type, buttonColor, hoverButtonColor, pressedButtonColor } = args;

        return new PixiStory({
            context: ctx,
            init(view)
            {
                const sizes: { w: number; h: number }[] = [
                    { w: 320, h: 440 },
                    { w: 630, h: 440 },
                    { w: 630, h: 360 },
                    { w: 320, h: 200 },
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
                    type,
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
                        defaultView: new Graphics()
                            .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                            .fill(buttonColor),
                        hoverView: new Graphics()
                            .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                            .fill(hoverButtonColor),
                        pressedView: new Graphics()
                            .roundRect(0, 0, elementsWidth, elementsHeight, radius)
                            .fill(pressedButtonColor),
                        text: new Text({
                            text: `Item ${i + 1}`,
                            style: {
                                ...defaultTextStyle,
                                fill: fontColor,
                            },
                        }),
                    });

                    button.anchor.set(0);
                    button.onPress.connect(() => resizeScrollBox());

                    items.push(button);
                }

                scrollBox.addItems(items);

                view.addChild(scrollBox);
            },
            resize: (view) => centerElement(view.children[0]),
        });
    },
};

export default {
    title: 'Components/ScrollBox/Use Dynamic Dimensions',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

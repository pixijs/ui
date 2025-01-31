import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';

const args = {
    fontColor: '#000000',
    backgroundColor: '#F5E3A9',
  itemsAmount: 1000,
};

export const UseDynamicDimensions: StoryFn<typeof args> = (
    { fontColor, itemsAmount, backgroundColor },
    context,
) =>
    new PixiStory({
        context,
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
                button.onPress.connect(() => resizeScrollBox());

                items.push(button);
            }

            scrollBox.addItems(items);

            view.addChild(scrollBox);
        },
        resize: (view) => centerElement(view.children[0]),
    });

export default {
    title: 'Components/ScrollBox/Use Dynamic Dimensions',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

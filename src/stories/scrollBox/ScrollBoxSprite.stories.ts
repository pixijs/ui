import { ColorSource, Container, Sprite, Text } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    fontColor: '#000000',
    elementsMargin: 6,
    itemsAmount: 100,
    disableEasing: false,
    type: [undefined, 'vertical', 'horizontal'],
    onPress: action('Button pressed'),
    globalScroll: true,
    shiftScroll: false
};

export const UseSprite: StoryFn<typeof args & { type: 'vertical' | 'horizontal' | undefined }> = (
    { fontColor, elementsMargin, itemsAmount, disableEasing, type, onPress, globalScroll, shiftScroll }, context
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const assets = [`window.png`, `SmallButton.png`, `SmallButton-hover.png`, `SmallButton-pressed.png`];

            preload(assets).then(() =>
            {
                const window = new Container();
                const windowBg = Sprite.from(`window.png`);
                const title = new Text({ text: `Levels`, style: { fill: 0x000000, fontSize: 40 } });

                title.anchor.set(0.5);
                window.addChild(windowBg, title);
                title.x = windowBg.width / 2;
                title.y = 25;

                view.addChild(window);

                const items: Container[] = createItems(itemsAmount, fontColor, onPress);

                // Component usage !!!
                const scrollBox = new ScrollBox({
                    elementsMargin,
                    width: window.width - 80,
                    height: window.height - 90,
                    vertPadding: 18,
                    radius: 5,
                    disableEasing,
                    type,
                    globalScroll,
                    shiftScroll
                });

                scrollBox.addItems(items);

                scrollBox.x = (window.width / 2) - (scrollBox.width / 2);
                scrollBox.y = (window.height / 2) - (scrollBox.height / 2) + 18;

                window.addChild(scrollBox);

                centerElement(view);
            });
        },

        resize:  centerElement
    });

function createItems(itemsAmount: number, fontColor: ColorSource, onPress: (buttonID: number) => void): FancyButton[]
{
    const items = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: `SmallButton.png`,
            hoverView: `SmallButton-hover.png`,
            pressedView: `SmallButton-pressed.png`,
            text: new Text({
                text: i + 1, style: {
                    ...defaultTextStyle,
                    fontSize: 68,
                    fill: fontColor
                }
            }),
            textOffset: {
                x: 0,
                y: -7
            }
        });

        button.anchor.set(0);
        button.scale.set(0.5);

        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    return items;
}

export default {
    title: 'Components/ScrollBox/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

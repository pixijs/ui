import { ColorSource, Container, Sprite, Text } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { FancyButton } from '../../FancyButton';
import { ListType } from '../../List';
import { ScrollBox } from '../../ScrollBox';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { LIST_TYPE } from '../../utils/HelpTypes';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    fontColor: '#000000',
    elementsMargin: 6,
    itemsAmount: 100,
    disableEasing: false,
    type: [null, ...LIST_TYPE],
    onPress: action('Button pressed'),
    globalScroll: true,
    shiftScroll: false,
};

export const UseSprite: StoryFn<typeof args & { type: ListType }> = (
    {
        fontColor,
        elementsMargin,
        itemsAmount,
        disableEasing,
        type,
        onPress,
        globalScroll,
        shiftScroll,
    },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const assets = [
                `window.png`,
                `SmallButton.png`,
                `SmallButton-hover.png`,
                `SmallButton-pressed.png`,
            ];

            preload(assets).then(() =>
            {
                const window = new Container();
                const windowBg = Sprite.from(`window.png`);
                const title = new Text({
                    text: `Levels`,
                    style: { fill: 0x000000, fontSize: 40 },
                });

                title.anchor.set(0.5);
                window.addChild(windowBg, title);
                title.x = windowBg.width / 2;
                title.y = 25;

                view.addChild(window);

                console.log('=== ScrollBoxSprite Debug Info ===');
                console.log('windowBg dimensions:', { width: windowBg.width, height: windowBg.height });
                console.log('window dimensions:', { width: window.width, height: window.height });

                const items: Container[] = createItems(itemsAmount, fontColor, onPress);
                console.log('Created items count:', items.length);
                console.log('First item dimensions:', items[0] ? { width: items[0].width, height: items[0].height } : 'No items');

                // Component usage !!!
                const scrollBoxWidth = window.width - 80;
                const scrollBoxHeight = window.height - 90;
                console.log('Calculated scrollBox dimensions:', { width: scrollBoxWidth, height: scrollBoxHeight });
                console.log('elementsMargin:', elementsMargin);
                console.log('type:', type);

                const scrollBox = new ScrollBox({
                    elementsMargin,
                    width: scrollBoxWidth,
                    height: scrollBoxHeight,
                    vertPadding: 18,
                    radius: 5,
                    disableEasing,
                    type,
                    globalScroll,
                    shiftScroll,
                });

                console.log('ScrollBox created with dimensions:', { width: scrollBox.width, height: scrollBox.height });
                console.log('ScrollBox list exists:', !!scrollBox.list);
                if (scrollBox.list)
                {
                    console.log('ScrollBox list dimensions before adding items:', { width: scrollBox.list.width, height: scrollBox.list.height });
                }

                if (type === 'bidirectional' && scrollBox.list)
                {
                    scrollBox.list.width = window.width - 40;
                    scrollBox.list.height = window.height - 60;
                    console.log('Updated bidirectional list dimensions:', { width: scrollBox.list.width, height: scrollBox.list.height });
                }

                scrollBox.addItems(items);

                if (scrollBox.list)
                {
                    console.log('ScrollBox list dimensions after adding items:', { width: scrollBox.list.width, height: scrollBox.list.height });
                    console.log('ScrollBox list children count:', scrollBox.list.children.length);
                }

                scrollBox.x = (window.width / 2) - (scrollBox.width / 2);
                scrollBox.y = (window.height / 2) - (scrollBox.height / 2) + 18;

                console.log('ScrollBox final position:', { x: scrollBox.x, y: scrollBox.y });
                console.log('=== End Debug Info ===');

                window.addChild(scrollBox);

                centerElement(view);
            });
        },

        resize: centerElement,
    });

function createItems(
    itemsAmount: number,
    fontColor: ColorSource,
    onPress: (buttonID: number) => void,
): FancyButton[]
{
    const items = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: `SmallButton.png`,
            hoverView: `SmallButton-hover.png`,
            pressedView: `SmallButton-pressed.png`,
            text: new Text({
                text: i + 1,
                style: {
                    ...defaultTextStyle,
                    fontSize: 68,
                    fill: fontColor,
                },
            }),
            textOffset: {
                x: 0,
                y: -7,
            },
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
    args: getDefaultArgs(args),
};

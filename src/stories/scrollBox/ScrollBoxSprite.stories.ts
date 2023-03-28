import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ScrollBox } from '../../ScrollBox';
import { FancyButton } from '../../FancyButton';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';
import { preload } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { getColor } from '../utils/color';

const args = {
    fontColor: '#000000',
    elementsMargin: 6,
    itemsAmount: 100,
    onPress: action('Button pressed')
};

export const UseSprite: StoryFn = ({ fontColor, elementsMargin, itemsAmount, onPress }: any) =>
{
    fontColor = getColor(fontColor);

    const view = new Container();

    const assets = [`window.png`, `SmallButton.png`, `SmallButton-hover.png`, `SmallButton-pressed.png`];

    preload(assets).then(() =>
    {
        const window = Sprite.from(`window.png`);
        const title = new Text(`Levels`, { fill: 0x000000, fontSize: 40 });

        title.anchor.set(0.5);
        window.addChild(title);
        title.x = window.width / 2;
        title.y = 25;

        view.addChild(window);

        const items: Container[] = createItems(itemsAmount, fontColor, onPress);

        // Component usage !!!
        const scrollBox = new ScrollBox({
            // type: 'vertical',
            elementsMargin,
            width: window.width - 80,
            height: window.height - 90,
            vertPadding: 18,
            radius: 5
        });

        scrollBox.addItems(items);

        scrollBox.x = (window.width / 2) - (scrollBox.width / 2);
        scrollBox.y = (window.height / 2) - (scrollBox.height / 2) + 18;

        window.addChild(scrollBox);

        centerElement(view);
    });

    return {
        view,
        resize: () => centerElement(view)
    };
};

function createItems(itemsAmount: number, fontColor: number, onPress: (buttonID: number) => void): FancyButton[]
{
    const items = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        const button = new FancyButton({
            defaultView: `SmallButton.png`,
            hoverView: `SmallButton-hover.png`,
            pressedView: `SmallButton-pressed.png`,
            text: new Text(i + 1, {
                ...defaultTextStyle,
                fontSize: 68,
                fill: fontColor
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

import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { FancyButton } from '../../FancyButton';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';
import { preload } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { getColor } from '../utils/color';
import { List } from '../../List';

const args = {
    type: [null, 'horizontal', 'vertical'],
    fontColor: '#000000',
    elementsMargin: 29,
    itemsAmount: 10,
    onPress: action('Button pressed')
};

export const UseSprite: StoryFn = ({ fontColor, elementsMargin, itemsAmount, onPress, type }: any) =>
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
        const list = new List({
            type,
            vertPadding: 70,
            horPadding: 50,
            elementsMargin
        });

        items.forEach((item) => list.addChild(item));

        window.addChild(list);

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

        button.scale.set(0.5);

        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    return items;
}

export default {
    title: 'Components/List/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

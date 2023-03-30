import { Container } from '@pixi/display';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Select } from '../../Select';
import { action } from '@storybook/addon-actions';
import { preload } from '../utils/loader';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { getColor } from '../utils/color';

const args = {
    dropDownHoverColor: '#A5E24D',
    fontColor: '#FFFFFF',
    fontSize: 28,
    itemsAmount: 100,
    onSelect: action('Item selected')
};

export const UseSprite: StoryFn = ({ fontColor, fontSize, itemsAmount, dropDownHoverColor, onSelect }: any) =>
{
    const view = new Container();
    const assets = [`select_closed.png`, `select_open.png`];

    let select: Select;

    preload(assets).then(() =>
    {
        const hoverColor = getColor(dropDownHoverColor);

        fontColor = getColor(fontColor);
        const textStyle = { ...defaultTextStyle, fill: fontColor, fontSize };

        const items = getItems(itemsAmount, 'Item');

        // Component usage !!!
        // Important: in order scroll to work, you have to call update() method in your game loop.
        select = new Select({
            closedBG: `select_closed.png`,
            openBG: `select_open.png`,
            textStyle,
            items: {
                items,
                backgroundColor: 'RGBA(0, 0, 0, 0.0001)',
                hoverColor,
                width: 200,
                height: 50,
                textStyle,
                radius: 25
            },
            selectedTextOffset: {
                y: -13
            },
            scrollBox: {
                width: 200,
                height: 350,
                radius: 30,
                offset: {
                    y: -16,
                    x: 24
                }
            }
        });

        select.y = 10;

        select.onSelect.connect((_, text) =>
        {
            onSelect({
                id: select.value,
                text
            });
        });

        view.addChild(select);

        centerElement(view, 0.5, 0);
    });

    return {
        view,
        resize: () => centerElement(view, 0.5, 0)
    };
};

function getItems(itemsAmount: number, text: string): string[]
{
    const items: string[] = [];

    for (let i = 0; i < itemsAmount; i++)
    {
        items.push(`${text} ${i + 1}`);
    }

    return items;
}

export default {
    title: 'Components/Select/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

import { Container } from '@pixi/display';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Select } from '../../Select';
import { action } from '@storybook/addon-actions';
import { preloadAssets } from '../utils/loader';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';

const args = {
    backgroundColor: '#F5E3A9',
    dropDownHoverColor: '#A5E24D',
    fontColor: '#FFFFFF',
    fontSize: 28,
    itemsAmount: 100,
    onSelect: action('Item selected')
};

export const UseSprite: StoryFn = (
    { fontColor, fontSize, itemsAmount, backgroundColor, dropDownHoverColor, onSelect }: any,
    context
) =>
{
    const { app } = context.parameters.pixi;

    app.renderer.events.rootBoundary.moveOnAll = true;
    const view = new Container();
    const assets = [`select_closed.png`, `select_open.png`];

    let select: Select;

    preloadAssets(assets).then(() =>
    {
        backgroundColor = Number(backgroundColor.replace('#', '0x'));
        const hoverColor = Number(dropDownHoverColor.replace('#', '0x'));

        fontColor = Number(fontColor.replace('#', '0x'));
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
                backgroundColor,
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
            onSelect(select.value, text);
        });

        view.addChild(select);

        centerElement(view, 0.5, 0);
    });

    return {
        view,
        resize: () => centerElement(view, 0.5, 0),
        update: () => select?.update()
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

import { Container } from '@pixi/display';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Select } from '../../Select';
import { action } from '@storybook/addon-actions';
import { preloadAssets } from '../utils/loader';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';
import type { Application } from '@pixi/app';

const args = {
    backgroundColor: '#F5E3A9',
    dropDownHoverColor: '#A5E24D',
    fontColor: '#FFFFFF',
    fontSize: 28,
    itemsCount: 100,
    onSelect: action('Item selected'),
};

export const Sprite = ({
    fontColor,
    fontSize,
    itemsCount,
    backgroundColor,
    dropDownHoverColor,
    onSelect,
}: any) =>
{
    const view = new Container();
    const assets = [`select_closed.png`, `select_open.png`];

    let select: Select;

    preloadAssets(assets).then(() =>
    {
        backgroundColor = Number(backgroundColor.replace('#', '0x'));
        const hoverColor = Number(dropDownHoverColor.replace('#', '0x'));

        fontColor = Number(fontColor.replace('#', '0x'));
        const textStyle = { ...defaultTextStyle, fill: fontColor, fontSize };

        const items = getItems(itemsCount, 'Item');

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
                radius: 25,
            },
            selectedTextOffset: {
                y: -13,
            },
            scrollBox: {
                width: 200,
                height: 350,
                radius: 30,
                offset: {
                    y: -16,
                    x: 24,
                },
            },
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
        update: () => select?.update(),
        startup: (app: Application) => { app.renderer.events.rootBoundary.moveOnAll = true; }
    };
};

function getItems(itemsCount: number, text: string): string[]
{
    const items: string[] = [];

    for (let i = 0; i < itemsCount; i++)
    {
        items.push(`${text} ${i + 1}`);
    }

    return items;
}

export default {
    title: 'UI components/Select/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

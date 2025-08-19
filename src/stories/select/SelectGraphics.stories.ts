import { ColorSource, Container, Graphics, Sprite, TextStyle } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { Select } from '../../Select';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    backgroundColor: '#F5E3A9',
    dropDownBackgroundColor: '#F5E3A9',
    dropDownHoverColor: '#e91e63',
    fontColor: '#000000',
    fontSize: 28,
    width: 250,
    height: 50,
    radius: 15,
    itemsAmount: 100,
    onSelect: action('Item selected'),
};

export const UseGraphics: StoryFn<typeof args> = (
    {
        fontColor,
        fontSize,
        width,
        height,
        radius,
        itemsAmount,
        backgroundColor,
        dropDownBackgroundColor,
        dropDownHoverColor,
        onSelect,
    },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const textStyle = {
                ...defaultTextStyle,
                fill: fontColor,
                fontSize,
            } as TextStyle;

            const items = getItems(itemsAmount, 'Item');

            // Component usage !!!
            // Important: in order scroll to work, you have to call update() method in your game loop.
            const select = new Select({
                closedBG: getClosedBG(backgroundColor, width, height, radius),
                openBG: getOpenBG(dropDownBackgroundColor, width, height, radius),
                textStyle,
                items: {
                    items,
                    backgroundColor,
                    hoverColor: dropDownHoverColor,
                    width,
                    height,
                    textStyle,
                    radius,
                },
                scrollBox: {
                    width,
                    height: height * 5,
                    radius,
                },
            });

            select.y = 10;

            select.onSelect.connect((_, text) =>
            {
                onSelect({
                    id: select.value,
                    text,
                });
            });

            view.addChild(select);
        },

        resize: (view) => centerElement(view, 0.5, 0),
    });

function getClosedBG(backgroundColor: ColorSource, width: number, height: number, radius: number)
{
    const view = new Container();
    const closedBG = new Graphics().roundRect(0, 0, width, height, radius).fill(backgroundColor);

    view.addChild(closedBG);

    preload(['arrow_down.png']).then(() =>
    {
        const arrowDown = Sprite.from('arrow_down.png');

        arrowDown.anchor.set(0.5);
        arrowDown.x = width * 0.9;
        arrowDown.y = height / 2;
        view.addChild(arrowDown);
    });

    return view;
}

function getOpenBG(backgroundColor: ColorSource, width: number, height: number, radius: number)
{
    const view = new Container();
    const openBG = new Graphics().roundRect(0, 0, width, height * 6, radius).fill(backgroundColor);

    view.addChild(openBG);

    preload(['arrow_down.png']).then(() =>
    {
        const arrowUp = Sprite.from('arrow_down.png');

        arrowUp.angle = 180;
        arrowUp.anchor.set(0.5);
        arrowUp.x = width * 0.9;
        arrowUp.y = height / 2;
        view.addChild(arrowUp);
    });

    return view;
}

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
    title: 'Components/Select/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

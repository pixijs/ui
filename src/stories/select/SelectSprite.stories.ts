import { TextStyle } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { Select } from '../../Select';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    dropDownHoverColor: colors.hoverColor,
    fontColor: colors.textColor,
    itemsAmount: 100,
    onSelect: action('Item selected'),
};

export const UseSprite: StoryFn<typeof args> = (
    { fontColor, itemsAmount, dropDownHoverColor, onSelect },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
            const assets = [`select.png`, `select_open.png`];

            let select: Select;

            preload(assets).then(() =>
            {
                const textStyle = {
                    ...defaultTextStyle,
                    fill: fontColor,
                } as TextStyle;

                const items = getItems(itemsAmount, 'Item');

                // Component usage !!!
                // Important: in order scroll to work, you have to call update() method in your game loop.
                select = new Select({
                    closedBG: `select.png`,
                    openBG: `select_open.png`,
                    textStyle,
                    items: {
                        items,
                        backgroundColor: colors.color,
                        hoverColor: dropDownHoverColor,
                        width: 297,
                        height: 50,
                        textStyle,
                        radius: 15,
                    },
                    scrollBox: {
                        width: 300,
                        height: 300,
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

                centerElement(view, 0.5, 0);
            });
        },

        resize: (view) => centerElement(view, 0.5, 0),
    });

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
    args: getDefaultArgs(args),
};

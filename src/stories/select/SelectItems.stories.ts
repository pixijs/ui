import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Select } from '../../Select';
import { action } from '@storybook/addon-actions';
import { preload } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { getColor } from '../utils/color';

const args = {
    backgroundColor: '#F5E3A9',
    dropDownBackgroundColor: '#F5E3A9',
    dropDownHoverColor: '#A5E24D',
    fontColor: '#000000',
    fontSize: 28,
    width: 200,
    height: 120,
    radius: 15,
    padding: 15,
    onSelect: action('Item selected')
};

export const UseGraphicalItems: StoryFn = ({
    width,
    height,
    radius,
    backgroundColor,
    dropDownBackgroundColor,
    dropDownHoverColor,
    onSelect,
    padding,
}: any) =>
{
    const view = new Container();

    backgroundColor = getColor(backgroundColor);
    dropDownBackgroundColor = getColor(dropDownBackgroundColor);
    const hoverColor = getColor(dropDownHoverColor);
    const items = ['avatar-01.png', 'avatar-02.png', 'avatar-03.png', 'avatar-04.png', 'avatar-05.png'];

    // Component usage !!!
    // Important: in order scroll to work, you have to call update() method in your game loop.
    const select = new Select({
        type: 'sprite',
        closedBG: getClosedBG(backgroundColor, width, height, radius),
        openBG: getOpenBG(dropDownBackgroundColor, width, height, radius),
        items,
        itemOptions: {
            backgroundColor,
            hoverColor,
            width,
            height,
            radius,
            padding,
        },
        scrollBox: {
            width,
            height: height * 5,
            radius
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

    return {
        view,
        resize: () => centerElement(view, 0.5, 0)
    };
};

function getClosedBG(backgroundColor: number, width: number, height: number, radius: number)
{
    const closedBG = new Graphics().beginFill(backgroundColor).drawRoundedRect(0, 0, width, height, radius);

    preload(['arrow_down.png']).then(() =>
    {
        const arrowDown = Sprite.from('arrow_down.png');

        arrowDown.anchor.set(0.5);
        arrowDown.x = width * 0.9;
        arrowDown.y = height / 2;
        closedBG.addChild(arrowDown);
    });

    return closedBG;
}

function getOpenBG(backgroundColor: number, width: number, height: number, radius: number)
{
    const openBG = new Graphics().beginFill(backgroundColor).drawRoundedRect(0, 0, width, height * 6, radius);

    preload(['arrow_down.png']).then(() =>
    {
        const arrowUp = Sprite.from('arrow_down.png');

        arrowUp.angle = 180;
        arrowUp.anchor.set(0.5);
        arrowUp.x = width * 0.9;
        arrowUp.y = height / 2;
        openBG.addChild(arrowUp);
    });

    return openBG;
}

export default {
    title: 'Components/Select/Use Graphical Items',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

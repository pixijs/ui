import { Container, Graphics, HTMLText, Sprite } from 'pixi.js';
import { Select } from '../../Select';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryFn } from '@storybook/types';

const args = {
    backgroundColor: '#F5E3A9',
    dropDownBackgroundColor: '#F5E3A9',
    dropDownHoverColor: '#A5E24D',
    fontColor: '#000000',
    fontSize: 28,
    width: 250,
    height: 50,
    radius: 15,
    itemsAmount: 5,
    onSelect: action('Item selected'),
};

export const UseHTMLText: StoryFn = ({
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
}: any) => {
    const view = new Container();

    backgroundColor = getColor(backgroundColor);
    fontColor = getColor(fontColor);
    dropDownBackgroundColor = getColor(dropDownBackgroundColor);
    const hoverColor = getColor(dropDownHoverColor);
    const textStyle = { ...defaultTextStyle, fill: fontColor, fontSize };

    const items = getItems(itemsAmount, 'Item');

    // Component usage !!!
    // Important: in order scroll to work, you have to call update() method in your game loop.
    const select = new Select({
        closedBG: getClosedBG(backgroundColor, width, height, radius),
        openBG: getOpenBG(dropDownBackgroundColor, width, height, radius),
        textStyle,
        TextClass: HTMLText,
        items: {
            items,
            backgroundColor,
            hoverColor,
            width,
            height,
            textStyle,
            TextClass: HTMLText,
            radius,
        },
        scrollBox: {
            width,
            height: height * 5,
            radius,
        },
    });

    select.y = 10;

    select.onSelect.connect((_, text) => {
        onSelect({
            id: select.value,
            text,
        });
    });

    view.addChild(select);

    return {
        view,
        resize: () => centerElement(view, 0.5, 0),
    };
};

function getClosedBG(backgroundColor: number, width: number, height: number, radius: number) {
    const closedBG = new Graphics().roundRect(0, 0, width, height, radius).fill(backgroundColor);

    preload(['arrow_down.png']).then(() => {
        const arrowDown = Sprite.from('arrow_down.png');

        arrowDown.anchor.set(0.5);
        arrowDown.x = width * 0.9;
        arrowDown.y = height / 2;
        closedBG.addChild(arrowDown);
    });

    return closedBG;
}

function getOpenBG(backgroundColor: number, width: number, height: number, radius: number) {
    const openBG = new Graphics().roundRect(0, 0, width, height * 6, radius).fill(backgroundColor);

    preload(['arrow_down.png']).then(() => {
        const arrowUp = Sprite.from('arrow_down.png');

        arrowUp.angle = 180;
        arrowUp.anchor.set(0.5);
        arrowUp.x = width * 0.9;
        arrowUp.y = height / 2;
        openBG.addChild(arrowUp);
    });

    return openBG;
}

function getItems(itemsAmount: number, text: string): string[] {
    const items: string[] = [];

    for (let i = 0; i < itemsAmount; i++) {
        items.push(`${text} ${i + 1}`);
    }

    return items;
}

export default {
    title: 'Components/Select/Use HTML Text',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

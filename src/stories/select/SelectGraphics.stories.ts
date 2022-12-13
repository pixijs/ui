import { Graphics as PixiGraphics, Sprite, Texture, Container } from 'pixi.js';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { Select } from '../../Select';
import { action } from '@storybook/addon-actions';
import { preloadAssets } from '../../utils/helpers/loader';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    backgroundColor: '#F5E3A9',
    dropDownBackgroundColor: '#F5E3A9',
    dropDownHoverColor: '#A5E24D',
    fontColor: '#000000',
    fontSize: 28,
    width: 250,
    height: 50,
    radius: 15,
    itemsCount: 100,
    onSelect: action('Item selected'),
};

export const Graphics = ({
    fontColor,
    fontSize,
    width,
    height,
    radius,
    itemsCount,
    backgroundColor,
    dropDownBackgroundColor,
    dropDownHoverColor,
    onSelect,
}: any) => {
    const view = new Container();

    backgroundColor = Number(backgroundColor.replace('#', '0x'));
    fontColor = Number(fontColor.replace('#', '0x'));
    dropDownBackgroundColor = Number(
        dropDownBackgroundColor.replace('#', '0x'),
    );
    const hoverColor = Number(dropDownHoverColor.replace('#', '0x'));
    const textStyle = { ...defaultTextStyle, fill: fontColor, fontSize };

    const items = getItems(itemsCount, 'Item');

    // Component usage !!!
    const select = new Select({
        closedBG: getClosedBG(backgroundColor, width, height, radius),
        openBG: getOpenBG(dropDownBackgroundColor, width, height, radius),
        textStyle,
        items: {
            items,
            backgroundColor,
            hoverColor,
            width,
            height,
            textStyle,
            radius,
        },
        selected: 2,
        scrollBox: {
            height: height * 5,
            radius,
        },
    });

    select.y = 10;

    select.onSelect.connect((_, text) => {
        onSelect(select.value, text);
    });

    view.addChild(select);

    return { view, resize: () => centerElement(view, 0.5, 0) };
};

function getClosedBG(
    backgroundColor: number,
    width: number,
    height: number,
    radius: number,
) {
    const closedBG = new PixiGraphics()
        .beginFill(backgroundColor)
        .drawRoundedRect(0, 0, width, height, radius);

    preloadAssets(['arrow_down.png']).then(() => {
        const arrowDown = new Sprite(Texture.from('arrow_down.png'));

        arrowDown.anchor.set(0.5);
        arrowDown.x = width * 0.9;
        arrowDown.y = height / 2;
        closedBG.addChild(arrowDown);
    });

    return closedBG;
}

function getOpenBG(
    backgroundColor: number,
    width: number,
    height: number,
    radius: number,
) {
    const openBG = new PixiGraphics()
        .beginFill(backgroundColor)
        .drawRoundedRect(0, 0, width, height * 6, radius);

    preloadAssets(['arrow_down.png']).then(() => {
        const arrowUp = new Sprite(Texture.from('arrow_down.png'));

        arrowUp.angle = 180;
        arrowUp.anchor.set(0.5);
        arrowUp.x = width * 0.9;
        arrowUp.y = height / 2;
        openBG.addChild(arrowUp);
    });

    return openBG;
}

function getItems(itemsCount: number, text: string): string[] {
    const items: string[] = [];

    for (let i = 0; i < itemsCount; i++) {
        items.push(`${text} ${i + 1}`);
    }

    return items;
}

export default {
    title: 'UI components/Select/Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

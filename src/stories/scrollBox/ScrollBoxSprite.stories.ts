import { Sprite as PixiSprite, Text, Texture, Container } from 'pixi.js';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { ScrollBox } from '../../ScrollBox';
import { Button } from '../../Button';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';
import { preloadAssets } from '../../utils/helpers/loader';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    type: ['vertical', 'horizontal'],
    fontColor: '#000000',
    elementsMargin: 6,
    itemsCount: 100,
    onPress: action('Button was pressed > '),
};

export const Sprite = ({
    type,
    fontColor,
    elementsMargin,
    itemsCount,
    onPress,
}: any) => {
    fontColor = Number(fontColor.replace('#', '0x'));

    const view = new Container();

    const assets = [
        `window.png`,
        `scroll_bg.png`,
        `button.png`,
        `button_hover.png`,
    ];

    preloadAssets(assets).then(() => {
        const window = new PixiSprite(Texture.from(`window.png`));
        view.addChild(window);

        const items: Container[] = createItems(itemsCount, fontColor, onPress);

        // Component usage !!!
        const scrollBox = new ScrollBox({
            type,
            elementsMargin,
            width: 150,
            height: 318,
            items,
            vertPadding: 18,
        });

        scrollBox.x = window.width / 2 - scrollBox.width / 2;
        scrollBox.y = window.height / 2 - scrollBox.height / 2 + 18;

        window.addChild(scrollBox);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

function createItems(
    itemsCount: number,
    fontColor: number,
    onPress: (buttonID: number) => void,
): Button[] {
    const items = [];

    for (let i = 0; i < itemsCount; i++) {
        const button = new Button({
            view: new PixiSprite(Texture.from(`button.png`)),
            hoverView: new PixiSprite(Texture.from(`button_hover.png`)),
            textView: new Text(`Item ${i + 1}`, {
                ...defaultTextStyle,
                fill: fontColor,
            }),
            textOffset: { x: 0, y: -7 },
        });

        button.scale.set(0.5);

        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    return items;
}

export default {
    title: 'UI components/ScrollBox/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

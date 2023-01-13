import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ScrollBox } from '../../ScrollBox';
import { Button } from '../../Button';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';
import { preloadAssets } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';
import type { Application } from '@pixi/app';

const args = {
    fontColor: '#000000',
    elementsMargin: 6,
    itemsCount: 100,
    onPress: action('Button was pressed > '),
};

export const UseSprite = ({
    fontColor,
    elementsMargin,
    itemsCount,
    onPress,
}: any) =>
{
    fontColor = Number(fontColor.replace('#', '0x'));

    const view = new Container();

    const assets = [`window.png`, `button.png`, `button_hover.png`];

    // Component usage !!!
    const scrollBox = new ScrollBox({
        type: 'vertical',
        elementsMargin,
        width: 150,
        height: 318,
        vertPadding: 18,
    });

    preloadAssets(assets).then(() =>
    {
        const window = Sprite.from(`window.png`);

        view.addChild(window);

        const items: Container[] = createItems(itemsCount, fontColor, onPress);

        items.forEach((item) => scrollBox.addItem(item));

        scrollBox.x = (window.width / 2) - (scrollBox.width / 2);
        scrollBox.y = (window.height / 2) - (scrollBox.height / 2) + 18;

        window.addChild(scrollBox);

        centerElement(view);
    });

    return {
        view,
        resize: () => centerElement(view),
        startup: (app: Application) => { app.renderer.events.rootBoundary.moveOnAll = true; }
    };
};

function createItems(
    itemsCount: number,
    fontColor: number,
    onPress: (buttonID: number) => void,
): Button[]
{
    const items = [];

    for (let i = 0; i < itemsCount; i++)
    {
        const button = new Button({
            defaultView: `button.png`,
            hoverView: `button_hover.png`,
            text: new Text(`Item ${i + 1}`, {
                ...defaultTextStyle,
                fill: fontColor,
            }),
            offsets: {
                text: { x: 0, y: -7 },
            }
        });

        button.scale.set(0.5);

        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    return items;
}

export default {
    title: 'UI components/ScrollBox/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

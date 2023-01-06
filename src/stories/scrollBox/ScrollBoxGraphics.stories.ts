import { Graphics as PixiGraphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ScrollBox } from '../../ScrollBox';
import { Button } from '../../Button';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';
import { centerElement } from '../../utils/helpers/resize';
import { FederatedPointerEvent } from '@pixi/events';

const args = {
    type: ['vertical', 'horizontal'],
    fontColor: '#000000',
    backgroundColor: '#F5E3A9',
    width: 320,
    height: 420,
    radius: 20,
    elementsMargin: 10,
    elementsPadding: 10,
    elementsWidth: 300,
    elementsHeight: 80,
    itemsCount: 100,
    onPress: action('Button was pressed > '),
};

export const Graphics = ({
    type,
    fontColor,
    elementsMargin,
    elementsPadding,
    elementsWidth,
    elementsHeight,
    width,
    height,
    radius,
    itemsCount,
    backgroundColor,
    onPress,
}: any) =>
{
    // TODO: We should update the components to work with the new move events
    window.PIXI.renderer.events.rootBoundary.moveOnAll = true;

    const view = new Container();

    // const scroll = new Container();

    // scroll.interactive = true;
    // view.addChild(scroll);

    // const bg = new PixiGraphics()
    //     .beginFill(0x000000)
    //     .drawRect(0, 0, width, height);
    // const elementA = new PixiGraphics()
    //     .beginFill(0xff0000)
    //     .drawRect(0, 0, 50, 50);
    // const elementB = new PixiGraphics()
    //     .beginFill(0x00ff00)
    //     .drawRect(40, 0, 50, 50);

    // const mask = new PixiGraphics()
    //     .beginFill(0x000000)
    //     .drawRect(0, 0, width - 50, height);

    // scroll.mask = mask;
    // scroll.addChild(mask);

    // elementA.interactive = elementB.interactive = true;
    // elementA.on('pointerdown', () => console.log('elementA pointerdown'));
    // elementB.on('pointerdown', () => console.log('elementB pointerdown'));
    // scroll.on('pointerdown', () => console.log('scroll pointerdown'));

    // scroll.addChild(bg, elementA, elementB);

    backgroundColor = Number(backgroundColor.replace('#', '0x'));
    fontColor = Number(fontColor.replace('#', '0x'));

    const items = [];

    for (let i = 0; i < itemsCount; i++)
    {
        const button = new Button({
            view: new PixiGraphics()
                .beginFill(0xa5e24d)
                .drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            hoverView: new PixiGraphics()
                .beginFill(0xfec230)
                .drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            textView: new Text(`Item ${i + 1}`, {
                ...defaultTextStyle,
                fill: fontColor || defaultTextStyle.fill,
            }),
        });

        button.onPress.connect(() => onPress(i + 1));

        items.push(button);
    }

    // Component usage !!!
    const scrollBox = new ScrollBox({
        background: backgroundColor,
        type,
        elementsMargin,
        width,
        height,
        radius,
        padding: elementsPadding,
    });

    items.forEach((item) => scrollBox.addItem(item));

    view.addChild(scrollBox);

    console.log('scrollBox', scrollBox);

    return {
        view,
        resize: () => centerElement(view),
    };
};

export default {
    title: 'UI components/ScrollBox/Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

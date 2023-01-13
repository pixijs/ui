import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { ScrollBox } from '../../ScrollBox';
import { Button } from '../../Button';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { action } from '@storybook/addon-actions';
import { centerElement } from '../../utils/helpers/resize';
import type { Application } from '@pixi/app';

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

export const UseGraphics = ({
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
    const view = new Container();

    backgroundColor = Number(backgroundColor.replace('#', '0x'));
    fontColor = Number(fontColor.replace('#', '0x'));

    const items = [];

    for (let i = 0; i < itemsCount; i++)
    {
        const button = new Button({
            defaultView: new Graphics()
                .beginFill(0xa5e24d)
                .drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            hoverView: new Graphics()
                .beginFill(0xfec230)
                .drawRoundedRect(0, 0, elementsWidth, elementsHeight, radius),
            text: new Text(`Item ${i + 1}`, {
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

    return {
        view,
        resize: () => centerElement(view),
        startup: (app: Application) => { app.renderer.events.rootBoundary.moveOnAll = true; }
    };
};

export default {
    title: 'Components/ScrollBox/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

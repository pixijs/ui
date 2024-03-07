import { Container, Graphics } from 'pixi.js';
import { CheckBox } from '../../CheckBox';
import { RadioGroup } from '../../RadioGroup';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { action } from '@storybook/addon-actions';

const args = {
    text: 'Radio',
    textColor: '#FFFFFF',
    bgColor: '#F1D583',
    fillColor: '#82C822',
    width: 50,
    height: 50,
    padding: 5,
    radius: 25,
    amount: 3,

    onChange: action('Radio changed'),
};

export const UseGraphics = ({
    amount,
    text,

    textColor,
    fillColor,
    bgColor,

    width,
    height,
    padding,
    radius,

    onChange,
}: any) =>
{
    const view = new Container();

    bgColor = getColor(bgColor);
    fillColor = getColor(fillColor);

    const items = [];

    for (let i = 0; i < amount; i++)
    {
        items.push(
            new CheckBox({
                text: `${text} ${i + 1}`,
                style: {
                    unchecked: drawRadio({
                        color: bgColor,
                        width,
                        height,
                        padding,
                        radius,
                    }),
                    checked: drawRadio({
                        color: bgColor,
                        fillColor,
                        width,
                        height,
                        padding,
                        radius,
                    }),
                    text: {
                        ...defaultTextStyle,
                        fontSize: 22,
                        fill: textColor,
                    },
                },
            }),
        );
    }

    // Component usage
    const radioGroup = new RadioGroup({
        selectedItem: 0,
        items,
        type: 'vertical',
        elementsMargin: 10,
    });

    radioGroup.onChange.connect((selectedItemID: number, selectedVal: string) =>
        onChange({ id: selectedItemID, val: selectedVal }),
    );

    view.addChild(radioGroup.innerView);

    return { view, resize: () => centerElement(view) };
};

function drawRadio({ color, fillColor, width, height, radius, padding }: GraphicsType)
{
    const graphics = new Graphics();

    const isCircle = width === height && radius >= width / 2;

    if (isCircle)
    {
        graphics.circle(width / 2, width / 2, width / 2);
    }
    else
    {
        graphics.roundRect(0, 0, width, height, radius);
    }

    graphics.fill(color);

    if (fillColor !== undefined)
    {
        const center = width / 2;

        if (isCircle)
        {
            graphics.circle(center, center, center - padding);
        }
        else
        {
            graphics.roundRect(
                padding,
                padding,
                width - (padding * 2),
                height - (padding * 2),
                radius,
            );
        }

        graphics.fill(fillColor);
    }

    return graphics;
}

type GraphicsType = {
    color: number;
    fillColor?: number;
    width?: number;
    height?: number;
    radius?: number;
    padding?: number;
};

export default {
    title: 'Components/RadioGroup/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

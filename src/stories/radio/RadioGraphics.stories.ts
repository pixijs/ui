import { RadioGroup } from '../../RadioGroup';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';
import { Container } from '@pixi/display';
import { getColor } from '../utils/color';

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

    onChange: action('Radio changed')
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

    onChange
}: any) =>
{
    const view = new Container();

    bgColor = getColor(bgColor);
    fillColor = getColor(fillColor);

    const items = [];

    for (let i = 0; i < amount; i++)
    {
        items.push(`${text} ${i + 1}`);
    }

    // Component usage
    const radioGroup = new RadioGroup({
        selectedItem: 0,
        items,
        type: 'vertical',
        elementsMargin: 10,
        style: {
            bg: {
                color: bgColor,
                width,
                height,
                padding,
                radius
            },
            checked: {
                color: bgColor,
                fillColor,
                width,
                height,
                padding,
                radius
            },
            textStyle: {
                ...defaultTextStyle,
                fontSize: 22,
                fill: textColor
            }
        }
    });

    radioGroup.onChange.connect((selectedItemID: number, selectedVal: string) =>
        onChange({ id: selectedItemID, val: selectedVal })
    );

    view.addChild(radioGroup.innerView);

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/RadioGroup/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

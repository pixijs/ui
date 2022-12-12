import { RadioGroup } from "../../RadioGroup";
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { defaultTextStyle } from "../../utils/helpers/styles";
import { centerElement } from '../../utils/helpers/resize';
import { Container } from 'pixi.js';
    
const args = {
    count: 3,
    text: "Radio",
    textColor: '#FFFFFF',
    bgColor: '#F1D583',
    fillColor: '#82C822',
    width: 50,
    height: 50,
    padding: 5,
    radius: 25,

    onChange: action('Radio changed'),
}

export const Graphics = ({
    count,
    text,

    textColor,
    fillColor,
    bgColor,
    
    width,
    height,
    padding,
    radius,

    onChange,
}: any) => {
    const view = new Container();

    bgColor = bgColor.replace('#', '0x');
    fillColor = fillColor.replace('#', '0x');

    const items = [];

    for (let i = 0; i < count; i++) {
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
                radius,
            },
            checked: {
                color: bgColor,
                fillColor: fillColor,
                width,
                height,
                padding,
                radius,
            },
            textStyle: {
                ...defaultTextStyle,
                fontSize: 22,
                fill: textColor,
            }
        },
    });

    radioGroup.onChange.connect((selectedItemID: number, selectedVal: string) => onChange(selectedItemID, selectedVal));

    view.addChild(radioGroup.view);

    return { view, resize: () => centerElement(view)};
};

export default {
    title: 'UI components/RadioGroup/Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};
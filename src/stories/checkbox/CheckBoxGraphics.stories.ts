import { Graphics } from 'pixi.js';
import { CheckBox } from '../../CheckBox';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { action } from '@storybook/addon-actions';

const args = {
    text: 'Checkbox',
    textColor: '#FFFFFF',
    color: '#F1D583',
    borderColor: '#DCB000',
    fillBorderColor: '#FFFFFF',
    fillColor: '#A5E24D',
    width: 50,
    height: 50,
    radius: 11,
    amount: 3,
    checked: false,
    onPress: action('Checkbox')
};

export const UseGraphics = ({
    text,
    amount,
    checked,

    textColor,
    borderColor,
    fillBorderColor,
    fillColor,
    color,
    width,
    height,
    radius,

    onPress
}: any) =>
{
    const view = new List({ type: 'vertical', elementsMargin: 10 });

    color = getColor(color);
    borderColor = getColor(borderColor);
    fillColor = getColor(fillColor);
    fillBorderColor = getColor(fillBorderColor);

    for (let i = 0; i < amount; i++)
    {
    // Component usage !!!
        const checkBox = new CheckBox({
            text: `${text} ${i + 1}`,
            checked,
            style: {
                unchecked: new Graphics()
                    .fill(borderColor)
                    .roundRect(-2, -2, width + 4, height + 4, radius)
                    .fill(color)
                    .roundRect(0, 0, width, height, radius),
                checked: new Graphics()
                    .fill(borderColor)
                    .roundRect(-2, -2, width + 4, height + 4, radius)
                    .fill(color)
                    .roundRect(0, 0, width, height, radius)
                    .fill(fillBorderColor)
                    .roundRect(3, 3, width - 6, height - 6, radius)
                    .fill(fillColor)
                    .roundRect(5, 5, width - 10, height - 10, radius),
                text: {
                    ...defaultTextStyle,
                    fontSize: 22,
                    fill: textColor
                }
            }
        });

        checkBox.onCheck.connect((checked) =>
        {
            onPress(`checkBox ${i + 1} ${checked}`);
        });

        view.addChild(checkBox);
    }

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/Checkbox/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

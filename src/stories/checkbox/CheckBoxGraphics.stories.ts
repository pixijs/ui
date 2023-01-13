import { Graphics } from '@pixi/graphics';
import { CheckBox } from '../../CheckBox';
import { action } from '@storybook/addon-actions';
import { Layout } from '../../Layout';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';

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
    count: 3,
    checked: false,
    onPress: action('Checkbox: '),
};

export const UseGraphics = ({
    text,
    count,
    checked,

    textColor,
    borderColor,
    fillBorderColor,
    fillColor,
    color,
    width,
    height,
    radius,

    onPress,
}: any) =>
{
    const view = new Layout({ type: 'vertical', elementsMargin: 10 });

    color = Number(color.replace('#', '0x'));
    borderColor = Number(borderColor.replace('#', '0x'));
    fillColor = Number(fillColor.replace('#', '0x'));
    fillBorderColor = Number(fillBorderColor.replace('#', '0x'));

    for (let i = 0; i < count; i++)
    {
        // Component usage !!!
        const checkBox = new CheckBox({
            text: `${text} ${i + 1}`,
            checked,
            style: {
                unchecked: new Graphics()
                    .beginFill(borderColor)
                    .drawRoundedRect(-2, -2, width + 4, height + 4, radius)
                    .beginFill(color)
                    .drawRoundedRect(0, 0, width, height, radius),
                checked: new Graphics()
                    .beginFill(borderColor)
                    .drawRoundedRect(-2, -2, width + 4, height + 4, radius)
                    .beginFill(color)
                    .drawRoundedRect(0, 0, width, height, radius)
                    .beginFill(fillBorderColor)
                    .drawRoundedRect(3, 3, width - 6, height - 6, radius)
                    .beginFill(fillColor)
                    .drawRoundedRect(5, 5, width - 10, height - 10, radius),
                text: {
                    ...defaultTextStyle,
                    fontSize: 22,
                    fill: textColor,
                },
            },
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
    title: 'UI components/Checkbox/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

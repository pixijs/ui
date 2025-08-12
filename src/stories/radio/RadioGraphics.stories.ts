import { ColorSource, Graphics } from 'pixi.js';
import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { RadioGroup } from '../../RadioGroup';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
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

export const UseGraphics: StoryFn<typeof args> = (
    {
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
    },
    context,
) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
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

            if (radioGroup.innerView)
            {
                view.addChild(radioGroup.innerView);
            }
        },
        resize: (view) => centerElement(view),
    });

function drawRadio({ color, fillColor, width, height, radius, padding }: GraphicsType)
{
    const graphics = new Graphics();

    const isCircle = width === height && (radius ?? 0) >= (width ?? 0) / 2;

    if (isCircle)
    {
        const w = width ?? 0;

        graphics.circle(w / 2, w / 2, w / 2);
    }
    else
    {
        graphics.roundRect(0, 0, width ?? 0, height ?? 0, radius ?? 0);
    }

    graphics.fill(color);

    if (fillColor !== undefined)
    {
        const center = (width ?? 0) / 2;

        if (isCircle)
        {
            graphics.circle(center, center, center - (padding ?? 0));
        }
        else
        {
            const p = padding ?? 0;

            graphics.roundRect(p, p, (width ?? 0) - (p * 2), (height ?? 0) - (p * 2), radius ?? 0);
        }

        graphics.fill(fillColor);
    }

    return graphics;
}

type GraphicsType = {
    color: ColorSource;
    fillColor?: ColorSource;
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

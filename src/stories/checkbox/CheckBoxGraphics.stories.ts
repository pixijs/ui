import { Graphics, HTMLText } from 'pixi.js';
import { PixiStory } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: 'Checkbox',
    textColor: colors.textColor,
    color: colors.color,
    borderColor: colors.hoverColor,
    fillBorderColor: colors.textColor,
    fillColor: colors.hoverColor,
    width: 50,
    height: 50,
    radius: 50,
    amount: 3,
    useHTMLtext: false,
    onPress: action('Checkbox'),
};

type Args = typeof args;

export const UseGraphics = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    text,
                    amount,
                    useHTMLtext,
                    textColor,
                    borderColor,
                    fillBorderColor,
                    fillColor,
                    color,
                    width,
                    height,
                    radius,
                    onPress,
                } = args;
                const list = new List({ type: 'vertical', elementsMargin: 5 });

                for (let i = 0; i < amount; i++)
                {
                // Component usage !!!
                    const checkBox = new CheckBox({
                        text: `${text} ${i + 1}`,
                        TextClass: useHTMLtext ? HTMLText : undefined,
                        checked: i % 2 === 0,
                        style: {
                            unchecked: new Graphics()
                                .roundRect(-2, -2, width + 4, height + 4, radius)
                                .fill(borderColor)
                                .roundRect(0, 0, width, height, radius)
                                .fill(color),
                            checked: new Graphics()
                                .roundRect(-2, -2, width + 4, height + 4, radius)
                                .fill(borderColor)
                                .roundRect(0, 0, width, height, radius)
                                .fill(color)
                                .roundRect(3, 3, width - 6, height - 6, radius)
                                .fill(fillBorderColor)
                                .roundRect(5, 5, width - 10, height - 10, radius)
                                .fill(fillColor),
                            text: {
                                ...defaultTextStyle,
                                fontSize: 22,
                                fill: getColor(textColor),
                            },
                        },
                    });

                    checkBox.onCheck.connect((checked) =>
                    {
                        onPress(`checkBox ${i + 1} ${checked}`);
                    });

                    list.addChild(checkBox);
                }
                view.addChild(list);
                centerElement(list);
            },
            resize: (view) => centerElement(view.children[0]),
        }),
};

export default {
    title: 'Components/Checkbox/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { PixiStory } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { Args, StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: 'Checkbox',
    textColor: colors.textColor,
    amount: 3,
    onChange: action('Checkbox'),
};

export const UseSprite = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const { onChange, amount, textColor, text } = args;
                const list = new List({
                    type: 'vertical',
                    elementsMargin: 5,
                });

                const assets = [`radio.png`, `radio_checked.png`];

                preload(assets).then(() =>
                {
                    for (let i = 0; i < amount; i++)
                    {
                    // Component usage !!!
                        const checkBox = new CheckBox({
                            text: `${text} ${i + 1}`,
                            checked: i % 2 === 0,
                            style: {
                                unchecked: `radio.png`,
                                checked: `radio_checked.png`,
                                text: {
                                    ...defaultTextStyle,
                                    fontSize: 22,
                                    fill: textColor,
                                },
                            },
                        });

                        checkBox.onCheck.connect((checked) => onChange(`${i + 1} ${checked}`));

                        list.addChild(checkBox);
                    }

                    view.addChild(list);

                    centerElement(view);
                });
            },
            resize: centerElement,
        }),
};

export default {
    title: 'Components/Checkbox/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

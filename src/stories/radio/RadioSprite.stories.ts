import { PixiStory } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { List } from '../../List';
import { RadioGroup } from '../../RadioGroup';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    text: 'Radio',
    textColor: '#FFFFFF',
    amount: 3,
    onChange: action('Radio changed'),
};

type Args = typeof args;

export const UseSprite = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const { amount, text, textColor, onChange } = args;
                const list = new List({
                    type: 'vertical',
                    elementsMargin: 20,
                });

                const assets = [`radio.png`, `radio_checked.png`];

                preload(assets).then(() =>
                {
                    const items = [];

                    for (let i = 0; i < amount; i++)
                    {
                        items.push(
                            new CheckBox({
                                text: `${text} ${i + 1}`,
                                style: {
                                    unchecked: 'radio.png',
                                    checked: 'radio_checked.png',
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
                        list.addChild(radioGroup.innerView);
                    }

                    centerElement(list);
                });
                view.addChild(list);
            },
            resize: (view) => centerElement(view.children[0]),
        }),
};

export default {
    title: 'Components/RadioGroup/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

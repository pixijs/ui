import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    text: 'Checkbox',
    textColor: colors.textColor,
    amount: 3,
    checked: false,
    onChange: action('Checkbox'),
};

export const UseSprite: StoryFn<typeof args> = (
    { checked, onChange, amount, textColor, text },
    context,
) =>
    new PixiStory({
        context,
        init: (view) =>
        {
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
                        checked,
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
    });

export default {
    title: 'Components/Checkbox/Use Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
import { CheckBox } from '../../CheckBox';
import { List } from '../../List';
import { centerElement } from '../../utils/helpers/resize';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    text: '',
    textColor: '#FFFFFF',
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

            const assets = [`switch_off.png`, `switch_on.png`];

            preload(assets).then(() =>
            {
                for (let i = 0; i < amount; i++)
                {
                    // Component usage !!!
                    const checkBox = new CheckBox({
                        text: text ?? `${text} ${i + 1}`,
                        checked,
                        style: {
                            unchecked: `switch_off.png`,
                            checked: `switch_on.png`,
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

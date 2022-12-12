import { RadioGroup } from '../../RadioGroup';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { Layout } from '../../Layout';
import { preloadAssets } from '../../utils/helpers/loader';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    count: 3,
    text: 'Radio',
    textColor: '#FFFFFF',
    onChange: action('Radio changed'),
};

export const Sprite = ({ count, text, textColor, onChange }: any) => {
    const view = new Layout({
        type: 'vertical',
        elementsMargin: 20,
    });

    const assets = [`radio.png`, `radio_checked.png`];

    preloadAssets(assets).then(() => {
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
                bg: 'radio.png',
                checked: 'radio_checked.png',
                textStyle: {
                    ...defaultTextStyle,
                    fontSize: 22,
                    fill: textColor,
                },
            },
        });

        radioGroup.onChange.connect(
            (selectedItemID: number, selectedVal: string) =>
                onChange(selectedItemID, selectedVal),
        );

        view.addChild(radioGroup.view);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/RadioGroup/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

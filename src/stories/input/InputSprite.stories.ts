import { Sprite as PixiSprite, Texture } from 'pixi.js';
import { action } from '@storybook/addon-actions';
import { Layout } from "../../Layout";
import { Input } from "../../Input";
import { argTypes, getDefaultArgs } from '../../utils/helpers/argTypes';
import { defaultTextStyle } from '../../utils/helpers/styles';
import { preloadAssets } from '../../utils/helpers/loader';
import { centerElement } from '../../utils/helpers/resize';
    
const args = {
    count: 1,
    text: "",
    placeholder: "Enter text",
    maxLength: 100,
    align: ['center', 'left', 'right'],
    textColor: '#000000',
    fontSize: 24,
    padding: 5,
    onChange: action('Input: '),
}

export const Sprite = ({
    text,
    count,
    padding,
    textColor,
    fontSize,
    maxLength,
    align,
    placeholder,
    onChange,
}: any) => {
    const view = new Layout({ type: 'vertical', elementsMargin: 10 });

    
    const assets = [
        `input.png`,
    ];

    preloadAssets(assets).then(() => {
        for (let i = 0; i < count; i++) {
            // Component usage
            const input = new Input({
                bg: new PixiSprite(Texture.from('input.png')),
                padding,
                textStyle: {
                    ...defaultTextStyle,
                    fill: textColor,
                    fontSize,
                },
                maxLength,
                align,
                placeholder,
                value: text,
            });

            input.onChange.connect(() => onChange(input.value));

            view.addChild(input);
        }
        
        centerElement(view);
    });

    return { view, resize: () => centerElement(view)};
};

export default {
    title: 'UI components/Input/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};
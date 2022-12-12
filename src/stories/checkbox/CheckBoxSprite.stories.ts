import { Sprite as PixiSprite, Texture } from 'pixi.js';
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../helpers/argTypes';
import { Layout } from '../../Layout';
import { CheckBox } from '../../CheckBox';
import { defaultTextStyle } from './../helpers/styles';
import { preloadAssets } from './../helpers/loader';
import { centerElement } from '../helpers/resize';

const args = {
    count: 3,
    text: "",
    textColor: '#000000',
    checked: false,
    onChange: action('Checkbox changed'),
}

export const Sprite = ({ 
    checked,
    onChange, 
    count,
    textColor,
    text,
}: any) => {
    const view = new Layout({
        type: 'vertical',
        elementsMargin: 5,
    });
    
    const assets = [
        `switch_off.png`,
        `switch_on.png`,
    ];

    preloadAssets(assets).then(() => {
        for(let i = 0; i < count; i++) {
            // Component usage !!!
            const checkBox = new CheckBox({
                checked,
                style: {
                    unchecked: new PixiSprite(Texture.from(`switch_off.png`)),
                    checked: new PixiSprite(Texture.from(`switch_on.png`)), 
                    text: {
                        text: text ?? `${text} ${i + 1}`,
                        style: {
                            ...defaultTextStyle,
                            fontSize: 22,
                            fill: textColor,
                        }
                    }
                }
            });
    
            checkBox.onChange.connect(() => onChange(`${checkBox.checked}`));
    
            view.addChild(checkBox);
        }
        
        centerElement(view);
    });
    
    return { view, resize: () => centerElement(view)};
};

export default {
    title: 'UI components/Checkbox/Sprite',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};
import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Layout } from '../../Layout';
import { Swich } from '../../Swich';
import { preloadAssets } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    onChange: action('Checkbox changed'),
};

export const Simple = ({ onChange }: any) =>
{
    const view = new Layout({
        type: 'vertical',
        elementsMargin: 5,
    });

    const assets = [
        `avatar-01.png`,
        `avatar-02.png`,
        `avatar-03.png`,
        `avatar-04.png`,
        `avatar-05.png`
    ];

    preloadAssets(assets).then(() =>
    {
        // Component usage !!!
        const swich = new Swich(assets);

        swich.onChange.connect((state) => onChange(`swich state ${state}`));
        swich.onPress.connect((state) => onChange(`swich onPress ${state}`));
        swich.onDown.connect((state) => onChange(`swich onDown ${state}`));
        swich.onUp.connect((state) => onChange(`swich onUp ${state}`));
        swich.onHover.connect((state) => onChange(`swich onHover ${state}`));
        swich.onOut.connect((state) => onChange(`swich onOut ${state}`));
        swich.onUpOut.connect((state) => onChange(`swich onUpOut ${state}`));
        swich.onChange.connect((state) => onChange(`swich state ${state}`));

        view.addChild(swich);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Swich/Simple',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

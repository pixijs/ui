import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Swich } from '../../Swich';
import { preloadAssets } from '../utils/loader';
import { centerView } from '../../utils/helpers/resize';
import { Container } from '@pixi/display';

const args = {
    onChange: action('Checkbox changed'),
};

export const Simple = ({ onChange }: any) =>
{
    const view = new Container();

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
        swich.anchor.set(0.5);
        centerView(view);

        view.addChild(swich);
    });

    return { view, resize: () => centerView(view) };
};

export default {
    title: 'Components/Swich/Simple',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

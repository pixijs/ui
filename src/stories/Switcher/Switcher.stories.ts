import { Container } from 'pixi.js';
import { Switcher } from '../../Switcher';
import { centerElement } from '../../utils/helpers/resize';
import { BUTTON_EVENTS } from '../../utils/HelpTypes';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

const args = {
    triggerEvent1: BUTTON_EVENTS,
    triggerEvent2: ['onHover', ...BUTTON_EVENTS],
    triggerEvent3: ['onOut', ...BUTTON_EVENTS],
    action: action('swich: ')
};

export const Sprites = ({ action, triggerEvent1, triggerEvent2, triggerEvent3 }: any) =>
{
    const view = new Container();

    const assets = [`avatar-01.png`, `avatar-02.png`, `avatar-03.png`, `avatar-04.png`, `avatar-05.png`];

    preload(assets).then(() =>
    {
    // Component usage !!!
        const swich = new Switcher(assets, [triggerEvent1, triggerEvent2, triggerEvent3]);

        swich.onChange.connect((state) => action(`state ${state}`));

        view.addChild(swich);

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'Components/Switcher/Sprites',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

import { PixiStory } from '@pixi/storybook-renderer';
import { Switcher } from '../../Switcher';
import { centerElement } from '../../utils/helpers/resize';
import { ButtonEvent } from '../../utils/HelpTypes';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { preload } from '../utils/loader';
import { action } from '@storybook/addon-actions';

import type { StoryContext } from '@pixi/storybook-renderer';

const args = {
    triggerEvent1: 'onPress' as ButtonEvent,
    triggerEvent2: 'onHover' as ButtonEvent,
    triggerEvent3: 'onOut' as ButtonEvent,
    action: action('swich: '),
};

type Args = typeof args;

export const Sprites = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const { action, triggerEvent1, triggerEvent2, triggerEvent3 } = args;
                const assets = [
                    `avatar-01.png`,
                    `avatar-02.png`,
                    `avatar-03.png`,
                    `avatar-04.png`,
                    `avatar-05.png`,
                ];

                preload(assets).then(() =>
                {
                // Component usage !!!
                    const swich = new Switcher(assets, [triggerEvent1, triggerEvent2, triggerEvent3]);

                    swich.onChange.connect((state) => action(`state ${state}`));

                    view.addChild(swich);

                    centerElement(view);
                });
            },
            resize: centerElement,
        }),
};

export default {
    title: 'Components/Switcher/Sprites',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

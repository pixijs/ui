import { PixiStory, StoryFn } from '@pixi/storybook-renderer';
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
    action: action('swich: '),
};

export const Sprites: StoryFn<
    typeof args & {
    triggerEvent1: string;
    triggerEvent2: string;
    triggerEvent3: string;
}
> = ({ action, triggerEvent1, triggerEvent2, triggerEvent3 }, context) =>
    new PixiStory<typeof args>({
        context,
        init: (view) =>
        {
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
    });

export default {
    title: 'Components/Switcher/Sprites',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

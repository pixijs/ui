import { action } from '@storybook/addon-actions';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { Layout } from '../../Layout';
import { Swich } from '../../Swich';
import { preloadAssets } from '../utils/loader';
import { centerElement } from '../../utils/helpers/resize';

const args = {
    count: 1,
    checked: false,
    onChange: action('Checkbox changed'),
};

export const Simple = ({ onChange, count, checked }: any) =>
{
    const view = new Layout({
        type: 'vertical',
        elementsMargin: 5,
    });

    const assets = [`switch_off.png`, `switch_on.png`];

    preloadAssets(assets).then(() =>
    {
        for (let i = 0; i < count; i++)
        {
            // Component usage !!!
            const swich = new Swich([
                `switch_off.png`,
                `switch_on.png`
            ], checked ? 1 : 0);

            swich.onChange.connect((state) => onChange(`swich ${i + 1} state ${state}`));

            view.addChild(swich);
        }

        centerElement(view);
    });

    return { view, resize: () => centerElement(view) };
};

export default {
    title: 'UI components/Swich/Simple',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};

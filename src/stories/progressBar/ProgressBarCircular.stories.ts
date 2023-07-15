import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { CircularProgressBar } from '../../CircularProgressBar';
import { centerElement } from '../../utils/helpers/resize';
import type { StoryFn } from '@storybook/types';
import { Container } from '@pixi/display';

const args = {
    fillColor: '#00b1dd',
    borderColor: '#FFFFFF',
    backgroundColor: '#fe6048',
    value: 50,
    radius: 25,
    border: 3,
    animate: true
};

export const circular: StoryFn = ({
    value,
    borderColor,
    backgroundColor,
    fillColor,
    radius,
    border,
    animate
}: any) =>
{
    const view = new Container();

    const progressBar = new CircularProgressBar({
        fillColor,
        borderColor,
        backgroundColor,
        value,
        radius,
        border
    });

    view.addChild(progressBar);

    let isFilling = true;

    return {
        view,
        resize: () =>
        {
            centerElement(view);
            view.y += view.height;
        },
        update: () =>
        {
            if (!animate)
            {
                return;
            }

            isFilling ? value++ : value--;

            if (value >= 100)
            {
                isFilling = false;
            }
            else if (value < -50)
            {
                isFilling = true;
            }

            progressBar.progress = value;
        }
    };
};

export default {
    title: 'Components/ProgressBar/Circular',
    argTypes: argTypes(args),
    args: getDefaultArgs(args)
};

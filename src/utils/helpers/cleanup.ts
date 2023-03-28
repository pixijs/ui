import { Container } from '@pixi/display';

export function cleanup(element: Container)
{
    if (!element) return;

    if (element.parent)
    {
        element.parent.removeChild(element);
    }

    element.destroy();
    element = null;
}

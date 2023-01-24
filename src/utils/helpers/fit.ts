import { Container } from '@pixi/display';

export function fitToView(parent: Container, child: Container, padding = 0)
{
    const maxWidth = parent.width - (padding * 2);
    const maxHeight = parent.height - (padding * 2);

    if (Math.round(child.width) > maxWidth)
    {
        const scale = maxWidth / child.width;

        child.scale.set(scale);
    }

    if (Math.round(child.height) > maxHeight)
    {
        const scale = maxHeight / child.height;

        child.scale.set(scale);
    }
}

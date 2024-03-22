import { Container } from '@pixi/display';

export function fitToView(parent: Container, child: Container, padding = 0, uniformScaling = true)
{
    let scaleX = child.scale.x;
    let scaleY = child.scale.y;

    if (!parent)
    {
        throw new Error('Parent is not defined');
    }

    const maxWidth = parent.width - (padding * 2);
    const maxHeight = parent.height - (padding * 2);

    const widthOverflow = maxWidth - Math.round(child.width);
    const heightOverflow = maxHeight - Math.round(child.height);

    if (widthOverflow < 0)
    {
        scaleX = maxWidth / (child.width / scaleX);
    }

    if (heightOverflow < 0)
    {
        scaleY = maxHeight / (child.height / scaleY);
    }

    if (scaleX <= 0 || scaleY <= 0)
    {
        child.scale.set(0);

        return;
    }

    if (uniformScaling || child.scale.x === child.scale.y)
    {
        const scale = Math.min(scaleX, scaleY);

        child.scale.set(scale, scale);
    }
    else
    {
        const ratio = child.scale.x / child.scale.y;

        if (widthOverflow < heightOverflow)
        {
            child.scale.set(scaleX, scaleX / ratio);
        }
        else
        {
            child.scale.set(scaleY * ratio, scaleY);
        }
    }
}

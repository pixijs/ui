import { Container } from '@pixi/display';

export function fitToView(parent: Container, child: Container, padding = 0)
{
    let scaleX = child.scale.x;
    let scaleY = child.scale.y;

    const maxWidth = parent.width - (padding * 2);
    const maxHeight = parent.height - (padding * 2);

    const widthOverflow = maxWidth - Math.round(child.width);
    const heightOverflow = maxHeight - Math.round(child.height);

    if (widthOverflow < 0)
    {
        scaleX = maxWidth / (child.width * scaleX);
    }

    if (heightOverflow < 0)
    {
        scaleY = maxHeight / (child.height * scaleY);
    }
    console.log({
        scaleX,
        scaleY
    });

    child.scale.set(Math.min(scaleX, scaleY));
}

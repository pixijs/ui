import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';

export function getView(view: string | Container): Container
{
    if (typeof view === 'string')
    {
        return Sprite.from(view);
    }

    return view;
}

import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';

export type GetViewSettings = string | Texture | Container | Sprite | Graphics;

export function getView(view: GetViewSettings): Container | Sprite | Graphics
{
    if (typeof view === 'string')
    {
        return Sprite.from(view);
    }

    if (view instanceof Texture)
    {
        return new Sprite(view);
    }

    return view;
}

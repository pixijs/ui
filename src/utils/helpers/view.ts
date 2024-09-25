import { Container, Sprite, Texture } from 'pixi.js';

export function getView(view: string | Texture | Container): Container
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

export function getSpriteView(view: string | Texture | Sprite): Sprite
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

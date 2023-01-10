import { Rectangle } from '@pixi/core';
import { DisplayObject } from '@pixi/display';

export function removeHitBox(...obj: DisplayObject[])
{
    obj.forEach((o) => o && (o.hitArea = new Rectangle()));
}

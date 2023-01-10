import { Point } from '@pixi/core';
import { DisplayObject } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';

/** TODO */
export interface DragObject extends DisplayObject
{
    dragData: FederatedPointerEvent;
    dragging: number;
    dragPointerStart: DisplayObject;
    dragObjStart: Point;
    dragGlobalStart: Point;
}

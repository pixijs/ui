import type { DisplayObject, InteractionData, Point } from 'pixi.js';

export interface DragObject extends DisplayObject {
    dragData: InteractionData;
    dragging: number;
    dragPointerStart: DisplayObject;
    dragObjStart: Point;
    dragGlobalStart: Point;
}

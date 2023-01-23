import { Point } from '@pixi/core';
import { DisplayObject, Container } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Signal } from 'typed-signals';

/** TODO */
export interface DragObject extends DisplayObject
{
    dragData: FederatedPointerEvent;
    dragging: number;
    dragPointerStart: DisplayObject;
    dragObjStart: Point;
    dragGlobalStart: Point;
}

export const BUTTON_EVENTS = ['onPress', 'onDown', 'onUp', 'onHover', 'onOut', 'onUpOut'];

export type ButtonEvent = typeof BUTTON_EVENTS[number];

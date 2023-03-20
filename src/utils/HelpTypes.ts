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

export const BUTTON_EVENTS = ['onPress', 'onDown', 'onUp', 'onHover', 'onOut', 'onUpOut'];

export type ButtonEvent = typeof BUTTON_EVENTS[number];

export type Padding =
  | number
  | [number, number]
  | [number, number, number, number]
  | {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
  };

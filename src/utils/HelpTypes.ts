import { Container, FederatedPointerEvent, Point } from 'pixi.js';

/** TODO */
export interface DragObject extends Container
{
    dragData: FederatedPointerEvent;
    dragging: number;
    dragPointerStart: Container;
    dragObjStart: Point;
    dragGlobalStart: Point;
}

export const BUTTON_EVENTS = ['onPress', 'onDown', 'onUp', 'onHover', 'onOut', 'onUpOut'];

export type ButtonEvent = (typeof BUTTON_EVENTS)[number];

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

export const LIST_TYPE = ['vertical', 'horizontal', 'bidirectional'];


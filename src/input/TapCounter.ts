import {
    MULTI_TAP_DISTANCE,
    MULTI_TAP_DISTANCE_TOUCH,
    MULTI_TAP_INTERVAL,
    MULTI_TAP_INTERVAL_TOUCH,
} from './constants';

/**
 * Counts presses in a quick sequence at one spot, as a multi-click: the second within the window
 * and the distance is a double click, the third a triple click, and anything else starts over.
 *
 * The component keeps its own count rather than using Pixi's `detail`, which counts per pointer
 * id — touch browsers issue a new id for every touch, so it stays at 1 there — and counts any
 * quick clicks on the component wherever they land.
 *
 * Internal to {@link Input}; not exported from the package.
 */
export class TapCounter
{
    protected count = 0;
    protected lastTime = -Infinity;
    protected lastX = 0;
    protected lastY = 0;

    /**
     * Records a press and returns its place in the sequence, starting at 1.
     * @param x - horizontal position of the press; any space, as long as it is the same throughout.
     * @param y - vertical position of the press.
     * @param touch - whether it is a finger, which gets a wider spot and a shorter window.
     * @param now - time of the press, in milliseconds.
     */
    next(x: number, y: number, touch = false, now = performance.now()): number
    {
        const distance = touch ? MULTI_TAP_DISTANCE_TOUCH : MULTI_TAP_DISTANCE;
        const interval = touch ? MULTI_TAP_INTERVAL_TOUCH : MULTI_TAP_INTERVAL;
        const near = Math.hypot(x - this.lastX, y - this.lastY) <= distance;

        this.count = near && now - this.lastTime <= interval ? this.count + 1 : 1;
        this.lastTime = now;
        this.lastX = x;
        this.lastY = y;

        return this.count;
    }
}

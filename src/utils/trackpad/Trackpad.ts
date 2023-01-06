import { Point, Rectangle } from '@pixi/core';
import { ConstrainEase, SlidingNumber } from './SlidingNumber';

interface TrackpadOptions
{
    /** override the easing function when constraining */
    xEase?: ConstrainEase;
    yEase?: ConstrainEase;

    maxSpeed?: number
    constrain?: boolean
}

/** A track pad class that lets you scroll both in al directions. Its up to you to hook up the events. */
export class Trackpad
{
    public xAxis: SlidingNumber;
    public yAxis: SlidingNumber;

    private _isDown: boolean;
    private _globalPosition: Point;
    private _frame: Rectangle;
    private _bounds: Rectangle;
    private _dirty: boolean;

    constructor(options: TrackpadOptions)
    {
        this.xAxis = new SlidingNumber({
            ease: options.xEase,
            maxSpeed: options.maxSpeed,
            constrain: options.constrain,
        });

        this.yAxis = new SlidingNumber({
            ease: options.yEase,
            maxSpeed: options.maxSpeed,
            constrain: options.constrain,
        });

        this._frame = new Rectangle();

        this._bounds = new Rectangle();
        this._globalPosition = new Point();
    }

    public pointerDown(pos: Point): void
    {
        this.xAxis.grab(pos.x);
        this.yAxis.grab(pos.y);
        this._isDown = true;
    }

    public pointerUp(): void
    {
        this._isDown = false;
    }

    public pointerMove(pos: Point): void
    {
        this._globalPosition = pos;
    }

    public update(): void
    {
        if (this._dirty)
        {
            this._dirty = false;

            this.xAxis.min = this._bounds.left;
            this.xAxis.min = this._bounds.right - this._frame.width;

            this.xAxis.min = this._bounds.top;
            this.xAxis.min = this._bounds.bottom - this._frame.height;
        }

        if (this._isDown)
        {
            this.xAxis.hold(this._globalPosition.x);
            this.yAxis.hold(this._globalPosition.y);
        }
        else
        {
            this.xAxis.slide();
            this.yAxis.slide();
        }
    }

    public resize(w: number, h: number): void
    {
        this._frame.x = 0;
        this._frame.width = w;

        this._frame.y = 0;
        this._frame.height = h;

        this._dirty = true;
    }

    public setBounds(minX: number, maxX: number, minY: number, maxY: number): void
    {
        this._bounds.x = minX;
        this._bounds.width = maxX - minX;
        this._bounds.y = minY;
        this._bounds.height = maxY - minY;

        this._dirty = true;
    }

    get x(): number
    {
        return this.xAxis.value;
    }

    get y(): number
    {
        return this.yAxis.value;
    }
}

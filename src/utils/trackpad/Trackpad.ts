import { Point, Rectangle } from 'pixi.js';
import { ConstrainEase, SlidingNumber } from './SlidingNumber';

interface TrackpadOptions
{
    /** override the easing function when constraining */
    xEase?: ConstrainEase;
    yEase?: ConstrainEase;

    maxSpeed?: number;
    constrain?: boolean;

    disableEasing?: boolean;
}

/** Easing controller for the {@link ScrollBox}. */
export class Trackpad
{
    xAxis: SlidingNumber;
    yAxis: SlidingNumber;

    protected _isDown: boolean = false;
    protected _globalPosition: Point | undefined;
    protected _frame: Rectangle | undefined;
    protected _bounds: Rectangle | undefined;
    protected _dirty: boolean = false;
    protected disableEasing = false;

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

        this.disableEasing = options.disableEasing ?? false;

        this._frame = new Rectangle();

        this._bounds = new Rectangle();
        this._globalPosition = new Point();
    }

    pointerDown(pos: Point): void
    {
        this._globalPosition = pos;
        this.xAxis.grab(pos.x);
        this.yAxis.grab(pos.y);
        this._isDown = true;
    }

    pointerUp(): void
    {
        this._isDown = false;
    }

    pointerMove(pos: Point): void
    {
        this._globalPosition = pos;
    }

    update(): void
    {
        if (this._dirty && this._bounds && this._frame)
        {
            this._dirty = false;

            this.xAxis.min = this._bounds.left;
            this.xAxis.min = this._bounds.right - this._frame.width;

            this.xAxis.min = this._bounds.top;
            this.xAxis.min = this._bounds.bottom - this._frame.height;
        }

        if (this._isDown && this._globalPosition)
        {
            this.xAxis.hold(this._globalPosition.x);
            this.yAxis.hold(this._globalPosition.y);
        }
        else
        {
            this.xAxis.slide(this.disableEasing);
            this.yAxis.slide(this.disableEasing);
        }
    }

    resize(w: number, h: number): void
    {
        if (!this._frame) return;

        this._frame.x = 0;
        this._frame.width = w;

        this._frame.y = 0;
        this._frame.height = h;

        this._dirty = true;
    }

    setBounds(minX: number, maxX: number, minY: number, maxY: number): void
    {
        if (!this._bounds) return;

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

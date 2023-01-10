import ScrollSpring from './ScrollSpring';

export interface SlidingNumberOptions
{
    constrain?: boolean
    maxSpeed?: number;
    ease?: ConstrainEase
}

export interface ConstrainEase
{
    done: boolean;
    to: number;
    start(speed: number, pos: number, to: number): void;
    update(): number;
}

export class SlidingNumber
{
    public position = 0;
    public constrain = true;
    public min = 0; // the window width of the drag
    public max = 0; // the window width of the drag
    public maxSpeed = 400;

    private _ease: ConstrainEase;

    private _offset = 0;
    private _prev = 0;
    private _speed = 0;
    private _hasStopped: boolean;

    private _targetSpeed = 0;
    private _speedChecker = 0;
    private _grab = 0;
    private _activeEase: ConstrainEase;

    constructor(options: SlidingNumberOptions = {})
    {
        this.constrain = options.constrain ?? true;
        this.maxSpeed = options.maxSpeed ?? 400;
        this._ease = options.ease ?? new ScrollSpring();
    }

    set value(n: number)
    {
        this._speed = 0;
        this.position = n;
    }

    get value(): number
    {
        return this.position;
    }

    public grab(offset: number): void
    {
        this._grab = offset;
        this._offset = this.position - offset;
        this._speedChecker = 0;
        this._targetSpeed = this._speed = 0;
        this._hasStopped = false;
    }

    public hold(newPosition: number): void
    {
        this._speedChecker++;

        this.position = newPosition + this._offset;

        if (this._speedChecker > 1)
        {
            this._targetSpeed = this.position - this._prev;
        }

        this._speed += (this._targetSpeed - this._speed) / 2;

        if (this._speed > this.maxSpeed) this._speed = this.maxSpeed;
        else if (this._speed < -this.maxSpeed) this._speed = -this.maxSpeed;

        this._prev = this.position;

        if (this.constrain)
        {
            this._activeEase = null;

            if (this.position > this.min)
            {
                this.position -= (this.position - this.min) / 1.5;
            }
            else if (this.position < this.max)
            {
                this.position += (this.max - this.position) / 1.5;
            }
        }
    }

    public slide(): void
    {
        if (this._hasStopped) return;

        if (this.constrain)
        {
            this._updateConstrain();
        }
        else
        {
            this._updateDefault();
        }
    }

    get moveAmount(): number
    {
        return -(this.position - this._offset - this._grab);
    }

    private _updateDefault(): void
    {
        this._speed *= 0.9;
        this.position += this._speed;

        if ((this._speed < 0 ? this._speed * -1 : this._speed) < 0.01)
        {
            this._hasStopped = true;
        }
    }

    private _updateConstrain(): void
    {
        const max: number = this.max;

        if (this.position > this.min || this.position < max || this._activeEase)
        {
            if (!this._activeEase)
            {
                this._activeEase = this._ease;

                if (this.position > this.min)
                {
                    this._activeEase.start(this._speed, this.position, this.min);
                }
                else
                {
                    this._activeEase.start(this._speed, this.position, max);
                }
            }

            this.position = this._activeEase.update();

            if (this._activeEase.done)
            {
                this.position = this._activeEase.to;
                this._speed = 0;
                this._activeEase = null;
            }
        }
        else
        {
            this._updateDefault();
        }
    }
}

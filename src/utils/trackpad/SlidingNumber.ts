import ScrollSpring from './ScrollSpring';

export interface SlidingNumberOptions
{
    constrain?: boolean;
    maxSpeed?: number;
    ease?: ConstrainEase;
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
    position = 0;
    constrain = true;
    min = 0; // the window width of the drag
    max = 0; // the window width of the drag
    maxSpeed = 400;

    protected _ease: ConstrainEase;

    protected _offset = 0;
    protected _prev = 0;
    protected _speed = 0;
    protected _hasStopped: boolean;

    protected _targetSpeed = 0;
    protected _speedChecker = 0;
    protected _grab = 0;
    protected _activeEase: ConstrainEase;

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

    grab(offset: number): void
    {
        this._grab = offset;
        this._offset = this.position - offset;
        this._speedChecker = 0;
        this._targetSpeed = this._speed = 0;
        this._hasStopped = false;
    }

    hold(newPosition: number): void
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

    slide(instant = false): void
    {
        if (this._hasStopped) return;

        if (this.constrain)
        {
            this._updateConstrain(instant);
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

    protected _updateDefault(): void
    {
        this._speed *= 0.9;
        this.position += this._speed;

        if ((this._speed < 0 ? this._speed * -1 : this._speed) < 0.01)
        {
            this._hasStopped = true;
        }
    }

    protected _updateConstrain(instant = false): void
    {
        const max: number = this.max;

        if (instant)
        {
            if (this.value > 0)
            {
                this.value = 0;
            }

            if (this.value > 0)
            {
                this.value = 0;
            }

            if (this.value < this.max)
            {
                this.value = this.max;
            }

            if (this.value < this.max)
            {
                this.value = this.max;
            }
        }
        else if (this.position > this.min || this.position < max || this._activeEase)
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

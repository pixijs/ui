import { Spring } from './Spring';

export default class ScrollSpring
{
    public done: boolean;
    public to: number;

    private _spring: Spring;
    private _pos: number;
    private _speed: number;
    private _correctSpeed: boolean;

    constructor()
    {
        this._spring = new Spring();
        this._pos = 0;
        this.to = 0;
    }

    start(speed: number, pos: number, to: number): void
    {
        this._speed = speed;
        this._pos = pos;
        this.to = to;
        this.done = false;

        this._spring.x = this._pos;
        this._spring.tx = this.to;

        const diff = this.to - this._pos;
        const toDirection = Math.abs(diff) / diff;
        const currentDirection = Math.abs(this._speed) / this._speed;

        if (toDirection !== currentDirection)
        {
            this._correctSpeed = true;
        }

        else
        {
            this._correctSpeed = false;
        }
    }

    update(): number
    {
        if (this._correctSpeed)
        {
            this._speed *= 0.6;

            if (Math.abs(this._speed) < 2)
            {
                this._correctSpeed = false;
            }

            this._pos += this._speed;

            this._spring.x = this._pos;
        }

        else
        {
            const diff = this.to - this._pos;

            if (Math.abs(diff) < 0.05)
            {
                this._pos = this.to;
                this.done = true;
            }

            else
            {
                this._spring.tx = this.to;
                this._spring.update();
                this._pos = this._spring.x;
            }
        }

        return this._pos;
    }

    cancel(): void
    {
        // matches jux interface
    }
}

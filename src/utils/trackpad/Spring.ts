export interface SpringOptions
{
    max?: number;
    damp?: number;
    springiness?: number;
}

export class Spring
{
    public x: number;
    public ax: number;
    public dx: number;
    public tx: number;

    private _options: SpringOptions;

    constructor(options: SpringOptions = {})
    {
        this.x = 0;
        this.ax = 0;
        this.dx = 0;
        this.tx = 0;

        // add opts to object for shared opts.
        this._options = options;
        this._options.max = options.max || 160;
        this._options.damp = options.damp || 0.8;
        this._options.springiness = options.springiness || 0.1;
    }

    update(): void
    {
        this.ax = (this.tx - this.x) * this._options.springiness;

        this.dx += this.ax;
        this.dx *= this._options.damp;

        if (this.dx < -this._options.max) this.dx = -this._options.max;
        else if (this.dx > this._options.max) this.dx = this._options.max;

        this.x += this.dx;
    }

    reset(): void
    {
        this.x = 0;
        this.ax = 0;
        this.dx = 0;
        this.tx = 0;
    }

    get max(): number
    {
        return this._options.max;
    }

    set max(value: number)
    {
        this._options.max = value;
    }

    get damp(): number
    {
        return this._options.damp;
    }

    set damp(value: number)
    {
        this._options.damp = value;
    }

    get springiness(): number
    {
        return this._options.springiness;
    }

    set springiness(value: number)
    {
        this._options.springiness = value;
    }
}

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

/** Class for store control flexible padding config. */
export class PaddingController {
    /** Top side padding */
    public top = 0;

    /** Right side padding */
    public right = 0;

    /** Bottom side padding */
    public bottom = 0;

    /** Left side padding */
    public left = 0;

    constructor(padding: Padding) {
        this.padding = padding;
    }

    /**
     * Set paddings
     * @param value - number, array of 4 numbers or object with keys: top, right, bottom, left
     * or: [top, right, bottom, left]
     * or: [top&bottom, right&left]
     * or: {
     *  left: 10,
     *  right: 10,
     *  top: 10,
     *  bottom: 10,
     * }
     */
    public set padding(value: Padding)
    {
        if (typeof value === 'number')
        {
            this.top = value;
            this.right = value;
            this.bottom = value;
            this.left = value;
        }

        if (Array.isArray(value))
        {
            this.top = value[0] ?? 0;
            this.right = value[1] ?? value[0] ?? 0;
            this.bottom = value[2] ?? value[0] ?? 0;
            this.left = value[3] ?? value[1] ?? value[0] ?? 0;
        }
        else if (typeof value === 'object')
        {
            this.top = value.top ?? 0;
            this.right = value.right ?? 0;
            this.bottom = value.bottom ?? 0;
            this.left = value.left ?? 0;
        }
    }

    // Return array of paddings [top, right, bottom, left]
    public get padding(): [number, number, number, number]
    {
        return [this.top, this.right, this.bottom, this.left];
    }
}
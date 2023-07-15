import { Container } from '@pixi/display';

export type CircularProgressBarOptions = {
    fillColor: number;
    borderColor: number,
    backgroundColor: number,
    value: number,
    radius: number,
    border: number,
};

/**
 * Creates a Circular ProgressBar.
 * @example
 * new ProgressBar({
 *     fillColor: '#00b1dd',
 *     borderColor: '#FFFFFF',
 *     backgroundColor: '#fe6048',
 *     value: 50,
 *     radius: 25,
 *     border: 3,
 * });
 */
export class CircularProgressBar extends Container
{
    private _progress = 0;

    /** Container, that holds all inner views. */
    innerView = new Container();

    constructor(params?: CircularProgressBarOptions)
    {
        super();

        this.addChild(this.innerView);
    }

    /** Set progress value. */
    set progress(value: number)
    {
        this._progress = value;
    }

    /** Current progress value. */
    get progress(): number
    {
        return this._progress;
    }
}

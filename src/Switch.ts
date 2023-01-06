import { Container } from 'pixi.js';
import { Signal } from 'typed-signals';
import { Button } from './Button';

/**
 * Container based component that switches visibility of containers by click.
 *
 * Can be used for creating tabs, radio buttons, checkboxes etc.
 * @example
 * ```
 * const switch = new Switch([
 *     new PixiSprite(Texture.from(`switch_off.png`)),
 *     new PixiSprite(Texture.from(`switch_on.png`)),
 * ]);
 *
 * ```
 */
export class Switch extends Container
{
    public view = new Container();
    private button: Button;

    public onChange: Signal<(state: number) => void>;

    constructor(public views: Container[], public activeViewID = 0)
    {
        super();

        views.forEach((state, id) =>
        {
            this.view.addChild(state);

            state.visible = id === this.activeViewID;
        });

        this.button = new Button({ view: this.view });

        this.addChild(this.button);

        this.onChange = new Signal();

        this.button.onPress.connect(() =>
        {
            this.switch();
            this.onChange.emit(this.activeViewID);
        });
    }

    public get activeView(): Container
    {
        return this.views[this.activeViewID];
    }

    public switch(id?: number): void
    {
        this.activeView.visible = false;

        this.activeViewID = id === undefined ? this.activeViewID + 1 : id;

        if (this.activeViewID > this.views.length - 1)
        {
            this.activeViewID = 0;
        }

        const newState = this.views[this.activeViewID];

        newState.visible = true;
    }
}

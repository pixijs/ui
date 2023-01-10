import { Container } from '@pixi/display';
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
    /** TODO */
    public view = new Container();
    /** TODO */
    public views: Container[] = [];
    /** TODO */
    public activeViewID = 0;
    /** TODO */
    public onChange: Signal<(state: number) => void>;
    private button: Button;

    constructor(views: Container[], activeViewID = 0)
    {
        super();

        views.forEach((state, id) =>
        {
            this.view.addChild(state);

            state.visible = id === this.activeViewID;
        });

        this.views = views;
        this.activeViewID = activeViewID;

        this.button = new Button({ view: this.view });

        this.addChild(this.button);

        this.onChange = new Signal();

        this.button.onPress.connect(() =>
        {
            this.switch();
            this.onChange.emit(this.activeViewID);
        });
    }

    /** TODO */
    public get activeView(): Container
    {
        return this.views[this.activeViewID];
    }

    /**
     * TODO
     * @param id
     */
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

import { Container } from '@pixi/display';
import { Signal } from 'typed-signals';
import { Button } from './Button';
import { getView } from './utils/helpers/view';

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
export class Swich extends Container
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

    constructor(views: Array<Container | string>, activeViewID = 0)
    {
        super();

        this.views = views.map((stateView, id) =>
        {
            const view = getView(stateView);

            this.view.addChild(view);

            view.visible = id === this.activeViewID;

            return view;
        });

        this.activeViewID = activeViewID;

        this.button = new Button({ defaultView: this.view });

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

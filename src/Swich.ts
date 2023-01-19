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
 *     Sprite.from(`switch_off.png`),
 *     Sprite.from(`switch_on.png`),
 * ]);
 *
 * ```
 */
export class Swich extends Button
{
    /** TODO */
    public views: Container[] = [];
    /** TODO */
    public activeViewID = 0;
    /** TODO */
    public onChange: Signal<(state: number | boolean) => void>;

    constructor(views: Array<Container | string>, activeViewID = 0)
    {
        super({ defaultView: new Container() });

        this.views = views.map((stateView, id) =>
        {
            const view = getView(stateView);

            this.defaultView.addChild(view);

            view.visible = id === this.activeViewID;

            return view;
        });

        this.activeViewID = activeViewID;

        this.setAnchor();

        this.onChange = new Signal();

        this.onPress.connect(() =>
        {
            this.switch();

            const res = this.views.length > 2 ? this.activeViewID : this.activeViewID === 1;

            this.onChange.emit(res);
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

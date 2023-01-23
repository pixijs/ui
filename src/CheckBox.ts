import { Rectangle } from '@pixi/core';
import { Container } from '@pixi/display';
import { TextStyle, ITextStyle, Text } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Swich } from './Swich';
import { getView } from './utils/helpers/view';

export type CheckBoxStyle = {
    checked: Container | string;
    unchecked: Container | string;
    text?: TextStyle | Partial<ITextStyle>;
};

export type CheckBoxOptions = {
    style: CheckBoxStyle;
    text?: string;
    checked?: boolean;
};

/**
 * Creates a container based checkbox element
 * @example
 * ```
 *  new CheckBox({
 *     checked: false,
 *     style: {
 *         unchecked: Sprite.from(`switch_off.png`),
 *         checked: Sprite.from(`switch_on.png`),
 *     }
 * });
 *
 * ```
 */
export class CheckBox extends Swich
{
    public label: Text;
    public onCheck: Signal<(state: boolean) => void>;

    constructor(options: CheckBoxOptions)
    {
        const unchecked = getView(options.style.unchecked);
        const checked = getView(options.style.checked);

        super([unchecked, checked], ['onPress'], options.checked ? 1 : 0);

        this.label = new Text(options.text ?? '', options.style.text);
        this.label.visible = options.text.length > 0;
        this.label.x = unchecked.width + 10;
        this.label.y = (unchecked.height - this.label.height) / 2;

        this.addChild(this.label);

        this.update();

        this.onCheck = new Signal();

        this.onChange.connect(() => this.onCheck.emit(this.checked));
    }

    /** TODO */
    public update()
    {
        this.hitArea = new Rectangle(0, 0, this.width, this.height);
    }

    /** TODO */
    public get checked(): boolean
    {
        return this.active === 1;
    }

    /** TODO */
    public set checked(checked: boolean)
    {
        this.switch(checked ? 1 : 0);
        this.update();
    }
}

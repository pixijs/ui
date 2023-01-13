import { Texture, Rectangle } from '@pixi/core';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { TextStyle, Text, ITextStyle } from '@pixi/text';
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
 *         unchecked: new PixiSprite(Texture.from(`switch_off.png`)),
 *         checked: new PixiSprite(Texture.from(`switch_on.png`)),
 *     }
 * });
 *
 * ```
 */
export class CheckBox extends Swich
{
    private label1: Text;
    private label2: Text;
    public onCheck: Signal<(state: boolean) => void>;

    constructor(options: CheckBoxOptions)
    {
        const unchecked = getView(options.style.unchecked);
        const checked = getView(options.style.checked);

        super([unchecked, checked], options.checked ? 1 : 0);

        this.label1 = new Text(options.text ?? '', options.style.text);
        this.label1.visible = options.text.length > 0;
        this.label1.x = unchecked.width + 10;
        this.label1.y = (unchecked.height - this.label1.height) / 2;
        unchecked.addChild(this.label1);

        this.label2 = new Text(options.text ?? '', options.style.text);
        this.label2.visible = options.text.length > 0;
        this.label2.x = checked.width + 10;
        this.label2.y = (checked.height - this.label2.height) / 2;
        checked.addChild(this.label2);

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
    public set text(text: string)
    {
        this.label1.text = text;
        this.label2.text = text;
        this.label1.visible = text.length > 0;
        this.label2.visible = text.length > 0;
        this.update();
    }

    /** TODO */
    public get text(): string
    {
        return this.label1.text;
    }

    /** TODO */
    public get checked(): boolean
    {
        return this.activeViewID === 1;
    }

    /** TODO */
    public set checked(checked: boolean)
    {
        this.switch(checked ? 1 : 0);
        this.update();
    }
}

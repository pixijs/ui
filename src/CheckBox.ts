import { Texture, Rectangle } from '@pixi/core';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { TextStyle, Text, ITextStyle } from '@pixi/text';
import { Signal } from 'typed-signals';
import { Swich } from './Swich';

export type CheckBoxStyle = {
    checked: Container | string;
    unchecked: Container | string;
    text?: TextStyle | Partial<ITextStyle>;
};

export type CheckBoxOptions = {
    style: CheckBoxStyle;
    text: string;
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
    private label: Text;

    constructor(options: CheckBoxOptions)
    {
        const unchecked = typeof options.style.unchecked === 'string'
            ? new Sprite(Texture.from(options.style.unchecked))
            : options.style.unchecked;

        const checked = typeof options.style.checked === 'string'
            ? new Sprite(Texture.from(options.style.checked))
            : options.style.checked;

        super([unchecked, checked], options.checked ? 1 : 0);

        if (options.text)
        {
            this.label = new Text(options.text, options.style.text);
            this.label.x = unchecked.width + 10;
            this.label.y = (unchecked.height - this.label.height) / 2;
            unchecked.addChild(this.label);

            this.label = new Text(options.text, options.style.text);
            this.label.x = checked.width + 10;
            this.label.y = (checked.height - this.label.height) / 2;
            checked.addChild(this.label);
        }

        this.update();

        this.onChange = new Signal();
    }

    /** TODO */
    public update()
    {
        this.hitArea = new Rectangle(0, 0, this.width, this.height);
    }

    /** TODO */
    public set text(text: string)
    {
        this.label.text = text;
        this.update();
    }

    /** TODO */
    public get text(): string
    {
        return this.label.text;
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

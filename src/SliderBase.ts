import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { ITextStyle, Text, TextStyle } from '@pixi/text';

import { FederatedPointerEvent } from '@pixi/events';
import { ProgressBar } from './ProgressBar';
import { getView } from './utils/helpers/view';

export type BaseSliderOptions = {
    bg?: Container | string;
    fill?: Container | string;
    min?: number;
    max?: number;
    valueTextStyle?: TextStyle | Partial<ITextStyle>;
    showValue?: boolean;
    valueTextOffset?: {
        x?: number;
        y?: number;
    };
    fillOffset?: {
        x?: number;
        y?: number;
    };
};

export type DoubleSliderOptions = BaseSliderOptions & {
    slider1?: Container | string;
    slider2?: Container | string;

    value1?: number;
    value2?: number;
};

/** Hepper class, used as a base for single or double slider creation. */
export class SliderBase extends ProgressBar
{
    protected _slider1: Container;
    protected _slider2: Container;

    protected value1Text?: Text;
    protected value2Text?: Text;

    protected _value1: number;
    protected _value2: number;

    protected dragging = 0;

    /** Minimal value. */
    public min = 0;

    /** Maximal value. */
    public max = 100;

    private startUpdateValue1!: number;
    private startUpdateValue2!: number;

    private settings: DoubleSliderOptions;

    constructor(options: DoubleSliderOptions)
    {
        super({
            bg: options.bg,
            fill: options.fill ? options.fill : options.bg,
            fillOffset: options.fill ? options.fillOffset : undefined
        });

        this.settings = options;

        this.slider1 = options.slider1;
        this.slider2 = options.slider2;

        this.min = options.min ?? 0;
        this.max = options.max ?? 100;

        this.activate();
    }

    /**
     * Sets Slider1 instance.
     * @param value - Container or string with texture name.
     */
    set slider1(value: Container | string)
    {
        if (!value) return;

        if (this._slider1)
        {
            this.slider1.removeAllListeners();
            this.removeChild(this._slider1);
            this.slider1.destroy();
        }

        this._slider1 = this.createSlider(value);

        this._slider1.eventMode = 'static';

        this._slider1
            .on('pointerdown', this.startUpdate, this)
            .on('globalpointermove', this.update, this)
            .on('pointerup', this.endUpdate, this)
            .on('pointerupoutside', this.endUpdate, this);

        if (this.settings.showValue && !this.value1Text)
        {
            this.value1Text = new Text('', this.settings.valueTextStyle || { fill: 0xffffff });
            this.value1Text.anchor.set(0.5);
            this.addChild(this.value1Text);
        }
    }

    /** Get Slider1 instance. */
    get slider1(): Container
    {
        return this._slider1;
    }

    /**
     * Sets Slider2 instance.
     * @param value - Container or string with texture name.
     */
    set slider2(value: Container | string)
    {
        if (!value) return;

        if (this._slider2)
        {
            this.slider2.removeAllListeners();
            this.removeChild(this._slider2);
            this.slider2.destroy();
        }

        this._slider2 = this.createSlider(value);

        this._slider2.eventMode = 'static';

        this._slider2
            .on('pointerdown', this.startUpdate, this)
            .on('globalpointermove', this.update, this)
            .on('pointerup', this.endUpdate, this)
            .on('pointerupoutside', this.endUpdate, this);

        if (this.settings.showValue && !this.value2Text)
        {
            this.value2Text = new Text('', this.settings.valueTextStyle || { fill: 0xffffff });
            this.value2Text.anchor.set(0.5);
            this.addChild(this.value2Text);
        }
    }

    /** Get Slider2 instance. */
    get slider2(): Container
    {
        return this._slider2;
    }

    /**
     * Set bg.
     * @param bg
     */
    override setBackground(bg: Container | string)
    {
        if (this.bg)
        {
            this.bg.removeAllListeners();
        }

        super.setBackground(bg);

        this.activate();
    }

    protected activate()
    {
        this.bg.eventMode = 'static';
        this.bg
            .on('pointerdown', this.startUpdate, this)
            .on('globalpointermove', this.update, this)
            .on('pointerup', this.endUpdate, this)
            .on('pointerupoutside', this.endUpdate, this);

        if (this.fill)
        {
            this.fill.eventMode = 'none';
        }

        if (this.value1Text)
        {
            this.value1Text.eventMode = 'none';
        }

        if (this.value2Text)
        {
            this.value2Text.eventMode = 'none';
        }
    }

    protected createSlider(sliderData: Container | string): Container
    {
        const slider = getView(sliderData);

        slider.x = slider.width / 2;

        const container = new Container();

        container.addChild(slider);

        if (slider instanceof Sprite)
        {
            slider.anchor.set(0.5);
        }

        container.y = this.bg.height / 2;

        this.addChild(container);

        return container;
    }

    protected startUpdate(event: FederatedPointerEvent)
    {
        this.dragging = 1;
        this.startUpdateValue1 = this._value1;
        this.startUpdateValue2 = this._value2;
        this.update(event);
    }

    protected endUpdate()
    {
        if (!this.dragging) return;
        this.dragging = 0;

        if (this.startUpdateValue1 !== this._value1 || this.startUpdateValue2 !== this._value2)
        {
            this.change();
        }

        this.startUpdateValue1 = null;
        this.startUpdateValue2 = null;
    }

    /* Called when dragging started and on every move. */
    protected update(_event: FederatedPointerEvent)
    {
    // override me
    }

    /** Called when dragging stopped. */
    protected change()
    {
    // override me
    }
}

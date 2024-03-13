import { Text, ITextStyle, TextStyle } from '@pixi/text';
import { BitmapText, IBitmapTextStyle } from '@pixi/text-bitmap';
import { HTMLText, HTMLTextStyle } from '@pixi/text-html';

export type PixiText = Text | BitmapText | HTMLText;
export type AnyText = string | number | PixiText;
export type PixiTextClass = new (...args: any[]) => PixiText;
export type PixiTextStyle = Partial<ITextStyle> | TextStyle | HTMLTextStyle | Partial<IBitmapTextStyle>;

export function getTextView(text: AnyText): Text | BitmapText | HTMLText
{
    if (typeof text === 'string' || typeof text === 'number')
    {
        return new Text(String(text));
    }

    return text;
}

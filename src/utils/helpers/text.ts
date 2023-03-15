import { Text } from '@pixi/text';
import { BitmapText } from '@pixi/text-bitmap';
import { HTMLText } from '@pixi/text-html';

export type PixiText = Text | BitmapText | HTMLText;
export type AnyText = string | number | PixiText;

export function getTextView(text: AnyText): Text | BitmapText | HTMLText
{
    if (typeof text === 'string' || typeof text === 'number')
    {
        return new Text(String(text));
    }

    return text;
}

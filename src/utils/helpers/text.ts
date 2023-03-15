import { Text } from '@pixi/text';
import { BitmapText } from '@pixi/text-bitmap';

export type PixiText = Text | BitmapText;
export type AnyText = string | number | PixiText;

export function getTextView(text: AnyText): Text | BitmapText
{
    if (typeof text === 'string' || typeof text === 'number')
    {
        return new Text(String(text));
    }

    return text;
}

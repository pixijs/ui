import { BitmapText, HTMLText, Text } from 'pixi.js';

export type PixiText = Text | BitmapText | HTMLText;
export type AnyText = string | number | PixiText;

export function getTextView(text: AnyText): Text | BitmapText | HTMLText
{
    if (typeof text === 'string' || typeof text === 'number')
    {
        return new Text({ text: String(text) });
    }

    return text;
}

import { Text } from '@pixi/text';

export function getTextView(text: string | Text): Text
{
    if (text instanceof Text)
    {
        return text;
    }

    return new Text(text);
}

// eslint-disable-next-line no-restricted-imports
import { Color } from 'pixi.js';

/**
 * Converts a color value to a number, handling 'transparent' and undefined cases
 * @param color - The color value as a number or string (including 'transparent')
 * @returns The color as a number, or undefined for transparent/undefined inputs
 */
export function getColor(color: number | string): number | undefined
{
    if (color === 'transparent')
    {
        return undefined;
    }

    if (color === undefined)
    {
        return undefined;
    }

    return Color.shared.setValue(color).toNumber();
}

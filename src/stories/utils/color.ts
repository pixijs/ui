// eslint-disable-next-line no-restricted-imports
import { utils } from 'pixi.js';

export function getColor(color: number | string): number
{
    if (color === 'transparent')
    {
        return undefined;
    }

    if (color === undefined)
    {
        return undefined;
    }

    switch (typeof color)
    {
        case 'string':
            if (color.startsWith('#') || color.startsWith('0x'))
            {
                return utils.string2hex(color);
            }
            else if (color.startsWith('rgba('))
            {
                const colorData = color.slice(5, -1).split(',');
                const rgbData = colorData.map((v) => parseInt(v, 10));

                return rgba2Hex(rgbData);
            }
            else if (color.startsWith('rgb('))
            {
                const colorData = color.slice(5, -1).split(',');
                const rgbData = colorData.map((v) => parseInt(v, 10));

                return utils.rgb2hex(rgbData);
            }
            else if (color.startsWith('hsla('))
            {
                const colorData = color.slice(5, -1).split(',');
                const [r, g, b] = colorData.map((v) => parseInt(v, 10));

                return hsl2Hex(r, g, b);
            }
            throw new Error(`Unknown color format: ${color}`);

        case 'number':
            return color;

        default:
            return parseInt(color, 16);
    }
}

export function hsl2Hex(h: number, s: number, l: number): number
{
    l /= 100;

    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) =>
    {
        const k = (n + (h / 30)) % 12;
        const color = l - (a * Math.max(Math.min(k - 3, 9 - k, 1), -1));

        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };

    return utils.string2hex(`#${f(0)}${f(8)}${f(4)}`);
}

export function rgba2Hex([r, g, b]: number[]): number
{
    return Number(`0x${getHex(r)}${getHex(g)}${getHex(b)}`);
}

export function getHex(n: number)
{
    const hex = n.toString(16);

    return hex.length === 1 ? `0${hex}` : hex;
}

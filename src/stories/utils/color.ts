// eslint-disable-next-line no-restricted-imports
import { Color } from 'pixi.js';

export function getColor(color: number | string): number {
    if (color === 'transparent') {
        return undefined;
    }

    if (color === undefined) {
        return undefined;
    }

    return Color.shared.setValue(color).toNumber();
}

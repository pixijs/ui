import { TextStyle } from 'pixi.js';

export const defaultTextStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 42,
    fontWeight: 'bold',
    dropShadow: {
        color: 0x000000,
        alpha: 0.5,
        distance: 0,
        blur: 3,
        angle: 0
    }
});

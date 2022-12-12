import { TextStyle } from 'pixi.js';

export const defaultTextStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 42,
    // fontFamily: 'Arial',
    fontWeight: 'bold',
    dropShadow: true,
    dropShadowAlpha: 0.5,
    dropShadowDistance: 0,
    dropShadowBlur: 3,
});

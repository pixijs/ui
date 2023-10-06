/* eslint-disable no-restricted-imports */
import { Application } from 'pixi.js';

const app = new Application();

app.init({
    resizeTo: window,
    background: 0x000000,
}).then(() =>
{
    document.body.appendChild(app.canvas as any);
});

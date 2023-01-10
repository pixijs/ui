<div align="center">
    <h1>PIXI-UI</h1>
    <h3>It is a library that contains commonly used UI components, that are extensible to allow them to be used in any project</h3>
</div>

Here are some useful resources:

-   [Full docs](https://pixijs.io/ui/)
-   [Github Repo](https://github.com/pixijs/ui)
-   [Storybook](https://pixijs.io/ui/storybook/)

## Install

```sh
npm install @pixi/ui
```

There is no default export. The correct way to import pixi-ui is:

```js
import { Button, Layout, ScrollBox } from '@pixi/ui';
```

To use any of the components you can go to it's page and copy/paste the example code to your project.

## Known Issues

Dragging behaviour for components such as `select`, `slider`, and `scrollbox` need to have `moveOnAll` set to `true` in the pixi's `EventsSystem`

```ts
app.renderer.events.rootBoundary.moveOnAll = true;
```

<div align="center">
    <h1><img src="https://user-images.githubusercontent.com/11766115/228632186-ea0caf7d-f829-4b38-b005-bc9141b0190b.png" />
</h1>
    <h3>It is a library that contains commonly used UI components, that are extensible to allow them to be used in any project</h3>
</div>

Here are some useful resources:

-   [Full docs](https://pixijs.io/ui/)
-   [Github Repo](https://github.com/pixijs/ui)
-   [Sandbox](https://pixijs.io/ui/storybook/)

**We are now a part of the [Open Collective](https://opencollective.com/pixijs) and with your support you can help us make PixiJS even better. To make a donation, simply click the button below and we'll love you forever!**

## Compatibility

Depending on your version of PixiJS, you'll need to figure out which major version of PixiUI to use.

| PixiJS | PixiUI |
| ------ | ------ |
| v7.x   | v1.x   |
| v8.x   | v2.x   |

## Install

```sh
npm install @pixi/ui
```

There is no default export. The correct way to import pixi-ui is:

## Usage

```js
import { Button } from '@pixi/ui';

const button = new Button();

button.onPress.connect(() => console.log('Button pressed!'));
```

To use any of the components you can go to it's page in the [sandbox](https://pixijs.io/ui/storybook/),
and copy/paste the example code to your project (check the `Code` tab):

## Components

-   [Switcher](https://pixijs.io/ui/storybook/?path=/story/components-switcher-sprites--sprites)
-   [Button](https://pixijs.io/ui/storybook/?path=/story/components-button-button-container-sprite--button-container-sprite)
-   [CheckBox](https://pixijs.io/ui/storybook/?path=/story/components-checkbox-use-graphics--use-graphics)
-   [FancyButton](https://pixijs.io/ui/storybook/?path=/story/components-fancybutton-using-sprite-and-bitmaptext--using-sprite-and-bitmap-text)
-   [Input](https://pixijs.io/ui/storybook/?path=/story/components-input-use-graphics--use-graphics)
-   [List](https://pixijs.io/ui/storybook/?path=/story/components-list-use-graphics--use-graphics)
-   [MaskedFrame](https://pixijs.io/ui/storybook/?path=/story/components-maskedframe-use-graphics--use-graphics)
-   [ProgressBar](https://pixijs.io/ui/storybook/?path=/story/components-progressbar-circular--circular)
-   [RadioGroup](https://pixijs.io/ui/storybook/?path=/story/components-radiogroup-use-graphics--use-graphics)
-   [ScrollBox](https://pixijs.io/ui/storybook/?path=/story/components-scrollbox-use-graphics--use-graphics)
-   [Select](https://pixijs.io/ui/storybook/?path=/story/components-select-use-graphics--use-graphics)
-   [Slider](https://pixijs.io/ui/storybook/?path=/story/components-slider-graphics--double)

### Contribute

Want to be part of the PixiUI project? Great! All are welcome! We will get there quicker
together :) Whether you find a bug, have a great feature request, or you fancy owning a task
from the road map above, feel free to get in touch.

Make sure to read the [Contributing Guide](.github/CONTRIBUTING.md)
before submitting changes.

### License

This content is released under the (http://opensource.org/licenses/MIT) MIT License.

## Known Issues

This library requires Pixi `v7.1.1` or higher as this is when the `globalpointermove` event was added
See [here](https://github.com/pixijs/pixijs/pull/9067) for details

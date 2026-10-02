// Type-only smoke test for the declarations we publish.
//
// It imports the `lib/*.d.ts` files `xs build` emits, with `skipLibCheck` off and
// no ambient `@types` packages, under TypeScript 7. Anything those declarations
// lean on but never declare - Node globals, for instance - fails here instead of
// in someone else's project.
//
// The root entry re-exports every module, so naming it is enough to pull the whole
// declaration output into the program. check.mjs separately walks the `exports` map
// to confirm each subpath's `types` target is actually on disk.
import * as UI from '@pixi/ui';
import { Button } from '@pixi/ui/Button';
import { Signal } from '@pixi/ui/utils/Signal';

import type { Container } from 'pixi.js';

export type Components = [
    UI.Button,
    UI.ButtonContainer,
    UI.CheckBox,
    UI.CircularProgressBar,
    UI.Dialog,
    UI.DoubleSlider,
    UI.Drawer,
    UI.FancyButton,
    UI.Input,
    UI.List,
    UI.MaskedFrame,
    UI.ProgressBar,
    UI.RadioGroup,
    UI.ScrollBox,
    UI.Select,
    UI.Slider,
    UI.Switcher,
];

export type Types = [
    UI.ButtonOptions,
    UI.CheckBoxOptions,
    UI.ContentFittingMode,
    UI.DialogOptions,
    UI.DrawerOptions,
    UI.DrawerPosition,
    UI.InputAlign,
    UI.InputOptions,
    UI.ListOptions,
    UI.ListType,
    UI.MaskedFrameOptions,
    UI.MaskedProgressBarOptions,
    UI.NineSliceSprite,
    UI.Offset,
    UI.ProgressBarOptions,
    UI.ProgressBarViewType,
    UI.RadioBoxOptions,
    UI.ScrollBoxOptions,
    UI.SelectItemsOptions,
    UI.SelectOptions,
    UI.SignalConnection,
    UI.SliderOptions,
];

// A subpath import has to yield the same declaration the root entry does.
export type SameButton = Button extends UI.Button ? (UI.Button extends Button ? true : never) : never;
export type SameSignal = Signal<() => void> extends UI.Signal<() => void> ? true : never;

// The components have to line up with the pixi.js copy the consumer resolves,
// not a second one bundled inside our own declarations.
export const containers: Container[] = [
    new UI.ButtonContainer(),
    new UI.List(),
    new UI.ScrollBox({ width: 100, height: 100 }),
];

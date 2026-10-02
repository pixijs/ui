# Release tests

Run all of this before every release of `@pixi/ui`. Part 1 is automated and blocks the release on any failure. Part 2 runs the automated end-to-end suites in real browsers. Part 3 is manual: it covers what automation cannot see or do, such as how things look, real keyboards, IME, the clipboard and system menus.

Case IDs are stable. The E2E runner prints the same IDs, so a failure in `qa/results/*.json` maps straight back to a row here.

Platforms: **Chrome**, **Firefox** and **Safari** on desktop (macOS); **iOS Safari** (simulator, or a device if you have one); **Android Chrome** (emulator, or a device if you have one).

## 0. Setup

```bash
npm ci
```

```bash
npm run storybook
```

Storybook must be on `http://localhost:6006`; set `QA_STORYBOOK=<url>` to point the runner elsewhere.

One-time setup per machine:

| Target | What it needs |
|---|---|
| Chrome | Google Chrome in `/Applications`. The runner starts its own instance with a temporary profile. |
| Firefox | Firefox in `/Applications`. The runner starts its own instance with a temporary profile. |
| Safari | `safaridriver --enable` once (asks for your password), and Safari > Settings > Advanced > "Show features for web developers". |
| iOS | A booted simulator (`xcrun simctl boot "iPhone 17 Pro"`), and in it Settings > Safari > Advanced > Web Inspector and Remote Automation turned on. |
| Android | A running emulator or device with USB debugging, and Chrome installed. The runner sets up `adb forward` and `adb reverse` itself. |

Desktop Safari and Firefox only deliver focus and synthetic input while their automation window is the frontmost window. Leave the machine alone while those two run. A case the environment cannot check, such as Tab with no OS focus, is reported as `SKIP` rather than `FAIL`.

## 1. Automated gates

All must pass with no errors.

| # | Command | Checks |
|---|---|---|
| G1 | `npm run lint` | Zero warnings (`--max-warnings 0`). |
| G2 | `npm run types` | TypeScript, no emit. |
| G3 | `npm test` | Unit, component and regression suites under `tests/`. The regression suites pin every defect fixed so far, so none may be skipped or marked `failing` without a linked issue. |
| G4 | `npm run build` | `lib/` and `dist/` build; `lib/index.d.ts` exports every component. |
| G5 | `npm run docs` | API docs (webdoc) and the static Storybook build both succeed. |

### G6. Generated docs review

Open `docs/index.html` after G5 and check:

- Every exported component has a page: Button, ButtonContainer, ButtonEvents, CheckBox, CircularProgressBar, Dialog, DoubleSlider, Drawer, FancyButton, Input, List, MaskedFrame, ProgressBar, RadioGroup, ScrollBox, Select, Slider, Switcher.
- **Input** shows the constructor options. These are `bg`, `textStyle`, `TextClass`, `placeholder`, `value`, `maxLength`, `secure`, `align`, `padding`, `cleanOnFocus`, `inputAttributes`, `addMask` and `nineSliceSprite`. The page lists the members `bg`, `value`, `secure`, `padding`, `width`, `height`, `selectAll()`, `onEnter` and `onChange`.
- Input's layer pages (`InputView`, `InputText`, `InputSelection`, `InputTouch`, `TapCounter`) say they are internal. They show up only because webdoc documents every class in `src/`; none of them is exported.
- No `{ number }`-style placeholder types and no `@param` on members that take no parameters.
- Every Storybook link in `README.md` opens an existing story.

## 2. End-to-end suites

```bash
node qa/e2e/run.mjs <chrome|firefox|safari|ios|android> [input|components|smoke|all]
```

Each run writes `qa/results/<target>-<suite>.json`. The runner sends input through each browser's own input pipeline, so the page receives trusted events:

- Chrome and Android: CDP.
- Firefox: WebDriver BiDi.
- Safari and iOS: classic WebDriver.
- Android text and editing keys: `adb`.

After each step the runner reads the component's state back from the page.

| Suite | Cases | Desktop | Touch (iOS, Android) |
|---|---|---|---|
| `input` | `IN-*` (Part 3, Input) | all 43 | the 26 a finger and an on-screen keyboard can do |
| `components` | `SM-*` (every story renders, no errors) and the automated cases below | all | all except hover and wheel cases |

Release requirement: `all` passes on every target, and any `SKIP` is covered by the matching manual case.

## 3. Cases by component

**A** means the E2E runner automates the case; **M** means it is manual. A manual case runs on every platform in its Platforms column; **all** means desktop plus touch.

### Button, ButtonContainer, ButtonEvents

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| BTN-1 | Press and release a ButtonContainer | `onDown`, `onUp`, `onPress` fire once each; with a mouse also `onHover` | all | A |
| BTN-2 | Press, drag off the button, release | `onUpOut` fires, `onPress` does not | all | M |
| BTN-3 | Hover then leave (mouse) | `onHover` then `onOut` | desktop | M |
| BTN-4 | Set `enabled = false`, press | No events | all | M |

### FancyButton

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| FB-1 | Hover | State `hover`, hover view shown | desktop | A |
| FB-2 | Press and release | `onPress` once, back to `hover`/`default` | all | A |
| FB-3 | Move away | State `default` | desktop | A |
| FB-4 | `enabled = false`, press | Disabled view shown, no `onPress` | all | A |
| FB-5 | Each FancyButton story: Graphics, Sprite, NineSlice, Icon, BitmapText, HTMLText, Text link, Dynamic update | Text centred, icon and text offsets as configured, no clipping, the animations play and settle (scale and offset do not drift after many presses) | all | M |
| FB-6 | Change controls (text, padding, anchor, `contentFittingMode`) in Storybook | Layout updates live, no stale views left behind | desktop | M |

### CheckBox

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| CB-1 | Press the box, then again | `checked` toggles both times, `onCheck` each time | all | A |
| CB-2 | Press the label | Toggles too | all | A |
| CB-3 | Graphics, Sprite and HTML stories | Label aligned to the box; HTML label renders bold and italic | all | M |

### RadioGroup

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| RG-1 | Press the third option, then the first, then the first again | Exactly one selected at a time; pressing the selected one keeps it | all | A |
| RG-2 | Sprite story | Checked and unchecked textures swap, layout unchanged | all | M |

### Switcher

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| SW-1 | With `triggerEvents = ['onPress']`, press | Next view, `onChange` once | all | A |
| SW-2 | Story defaults (also switches on hover) | Hover switches once per enter, no flicker | desktop | M |

### Slider and DoubleSlider

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| SL-1 | Drag the handle right | Value rises, `onUpdate` while dragging, `onChange` once on release | all | A |
| SL-2 | Drag far past the start | Clamps to `min` | all | A |
| SL-3 | Press the track | Value jumps there | all | A |
| SL-4 | Graphics, Sprite and NineSlice stories with `step` set | Value snaps to step, value text follows the handle, fill matches the handle | all | M |
| DSL-1 | Drag each handle | Each moves its own value | all | A |
| DSL-2 | Drag the low handle past the high one | Low never exceeds high | all | A |

### ProgressBar and CircularProgressBar

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| PB-1 | Set progress 0, 50, 100, 150, -10 | Applies 0, 50, 100; clamps to 100 and 0 | all | A |
| PB-2 | Circular: 0, 50, 100 | Applies, no errors | all | A |
| PB-3 | All stories, animate progress control | Fill matches the value, NineSlice keeps its corners, circular arc starts at the top and runs clockwise | all | M |

### ScrollBox

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| SB-1 | Mouse wheel over the box | Scrolls, `onScroll` fires | desktop | A |
| SB-2 | Drag the content | Scrolls | all | A |
| SB-3 | Press an item without moving | The item gets the press | all | A |
| SB-4 | Drag that starts on an item | Scrolls, the item is **not** pressed | all | A |
| SB-5 | Flick and release | Inertia then settles inside the bounds; no overscroll left | all | M |
| SB-6 | Dynamic dimensions story: change width and height | Scroll limits follow the new size; content never scrolls into empty space | desktop | M |
| SB-7 | Proximity story | Items fade in and out by distance as described in the story | all | M |
| SB-8 | Trackpad two-finger scroll (macOS) | Smooth, no page scroll behind it unless `globalScroll` | desktop | M |

### List

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| LST-1 | Default story | Children do not overlap | all | A |
| LST-2 | Type vertical / horizontal / bidirectional | Children never overlap | all | A |
| LST-3 | Change padding and margins in controls | Spacing changes evenly; anchored children are placed by their visual corner | desktop | M |

### Select

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| SEL-1 | Open, pick the second item | `onSelect(1, text)`, closes, header shows the item | all | A |
| SEL-2 | Open, press the header again | Closes without selecting | all | A |
| SEL-3 | Open and scroll the list (100 items) | Scrolls; dragging the list does not select an item | all | M |
| SEL-4 | HTML text story | Items render HTML, hit areas match the text | all | M |

### Dialog

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| DLG-1 | Press a dialog button | `onSelect(index, text)`, closes, `onClose` | all | A |
| DLG-2 | Press the backdrop | Closes only when `closeOnBackdropClick` is set | all | A |
| DLG-3 | All dialog stories, including Letter grid and Checkbox swap | Centred, content scrolls when tall, open and close animations finish, re-opens after 1 s as the story intends | all | M |
| DLG-4 | Resize the window (desktop) or rotate (mobile) while open | Stays centred, backdrop covers the screen | all | M |

### Drawer

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| DRW-1 | Bottom drawer: press the backdrop | Closes, `onClose` once | all | A |
| DRW-2 | Swipe the drawer toward its edge, ending past it | Closes | all | A |
| DRW-3 | Top, left, right drawers | Fully on screen, flush with the edge | all | A |
| DRW-4 | Resize the window or rotate while open, also during the open animation | Stays flush with the edge | all | M |
| DRW-5 | Scroll the drawer content | Scrolls; a short scroll does not close it | all | M |
| DRW-6 | Close, then open again before the close animation ends | Ends open and visible | all | M |

### MaskedFrame

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| MF-1 | Graphics and Sprite stories | Image clipped by the mask, border drawn around it | all | A + M |

### Input

Story: `Components/Input/Use Graphics` with args `addMask:true;maxLength:60;cleanOnFocus:false` unless noted.

**A. Activation and focus**

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| IN-A1 | Press an empty input | Editing, caret shown, placeholder hidden, hidden field focused; keyboard rises on mobile | all | A |
| IN-A2 | Press an idle input mid-word | Editing starts with the caret at the press, not at the end | all | A |
| IN-A3 | Press empty canvas while editing | Ends once, `onEnter(value)`, keyboard hidden, text kept | all | A |
| IN-A4 | Press another DOM element while editing | Ends once | desktop | A |
| IN-A5 | Enter, and (desktop) Escape | Ends once | all | A |
| IN-A6 | Tab while editing | Focus leaves, ends once | desktop | A (SKIP without OS focus, then M) |
| IN-A7 | Activate again | Value kept; with `cleanOnFocus:true` it is cleared | all | A |
| IN-A8 | Press in, then out within 0.5 s | Ends exactly once, focus not pulled back | desktop | A |
| IN-A9 | Press inside while editing | Caret moves, session continues, no `onEnter` | all | A |
| IN-A10 | iOS: tap a `secure` input and type straight away | Every character lands | iOS | M |

**B. Typing**

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| IN-B1 | Type `hello world` | Value and drawing match, `onChange` per change | all | A |
| IN-B2 | Backspace at end and middle, Delete in middle | Removes the right character, caret stays | all (Delete desktop) | A |
| IN-B3 | Type past `maxLength`, paste a long text | Capped at 60 | all | A + M (paste) |
| IN-B4 | Type an emoji, arrow over it, Backspace | Arrows skip the pair, Backspace removes it whole | desktop | A |
| IN-B5 | Type on the on-screen keyboard, including suggestions and autocorrect bar taps | Each character appears at once, no lag by one, suggestion replaces the word | iOS, Android | M |
| IN-B6 | `secure` on, type, toggle `secure` mid-session | Masked, `type=password`, selection kept | all | A |
| IN-B6b | `secure` with an emoji, press around it | Caret never lands inside the masked emoji | desktop | A |
| IN-B7 | Select a range, type | Replaces the range | all | A |
| IN-B8 | Inspect the hidden field | `autocomplete`, `autocapitalize`, `autocorrect` off, `spellcheck=false`, password-manager ignore attributes | all | A |
| IN-B9 | IME composition (CDP-simulated) | Commits once into the value | Chrome, Android | A |
| IN-B10 | Real IME: Japanese/Chinese on macOS, Gboard composing on Android | Underlined composition is drawn, Enter commits without ending the session, `maxLength` is applied after commit | Chrome, Firefox, Safari, Android | M |
| IN-B11 | Paste with Cmd/Ctrl+V and the context menu | Pasted text is inserted at the caret, `onChange` once | desktop | M |
| IN-B12 | Password managers (1Password, iCloud Keychain) | No autofill offer, no "save password" prompt after editing | all | M |

**C. Keyboard selection (desktop)**

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| IN-C1 | Left, Right, Cmd/Ctrl+Left, Cmd/Ctrl+Right (Home/End) | Drawn caret follows the native one | desktop | A |
| IN-C2 | Shift+arrows | Range highlighted, caret hidden | desktop | A |
| IN-C3 | Cmd/Ctrl+A | All selected | desktop | A |
| IN-C4 | Alt (macOS) / Ctrl (Windows) + arrows | Word jumps mirrored | desktop | A |
| IN-C5 | Arrow into a selection | Collapses, highlight cleared | desktop | A |

**D. Pointer selection (F: the same with a finger)**

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| IN-D1 | Press mid-text, far left, far right | Caret at the nearest boundary, 0, end | all | A |
| IN-D2 | Drag left to right and right to left | Range with the right direction | all | A |
| IN-D3 | Shift+click | Extends from the anchor | desktop | A |
| IN-D4 | Double press on a word, on punctuation | Word; punctuation run | all | A |
| IN-D5 | Triple press | All selected | all | A |
| IN-D6 | Right click inside a selection | Selection kept, menu opens | desktop | A |
| IN-D7 | Two quick presses far apart | No word selection | all | A |
| IN-F1 | Long-press the field (mobile) | System menu (Paste, Select all); paste inserts | iOS, Android | M |
| IN-F2 | Second finger during a drag | Does not disturb the selection | iOS, Android | M |
| IN-F3 | iOS: drag the native selection handles | Drawn selection follows | iOS | M |

**E. Overflow and scroll**

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| IN-E1 | Type text wider than the field | End visible, caret at the right edge | all | A |
| IN-E2 | Go to line start | Start visible, caret at the left edge | desktop | A |
| IN-E3 | Arrow right through overflowing text | Caret reaches the edge, then text scrolls with it | desktop | A |
| IN-E3b | Drag and hold past the left edge | Auto-scrolls to the start | all | A |
| IN-E4 | Press on scrolled text | Lands on that character | all | A |
| IN-E5 | End the session | Start of the text shown | all | A |
| IN-E6 | Delete until it fits | Scroll resets, `align` applies | all | A |
| IN-E7 | `addMask` true and false | Text clipped by the background only with the mask | all | M |

**G. API and instances**

| ID | Steps | Expected | Platforms | |
|---|---|---|---|---|
| IN-G1 | `input.value = 'abc'` while editing, then type | Field and drawing updated, typing continues it | all | A |
| IN-G2 | `selectAll()` while editing | All selected, in the field too | all | A |
| IN-G3 | Two inputs: edit A, press B | A ends once, B starts, one hidden field in the DOM | all | A |
| IN-G4 | `destroy()` while editing | Field removed, no errors, the other input still works | all | A |
| IN-G5 | Programmatic `value` | No `onChange` | all | A |
| IN-G6 | Sprite and NineSlice stories | Background scales without distorting corners, text vertically centred | all | M |
| IN-G7 | Page zoom 50% / 200% (desktop), pinch-zoomed page (mobile) | Caret and hit-testing still line up with the text | all | M |

## 4. Results

Copy this table into the release PR and fill it in. Attach the `qa/results/*.json` files.

| Section | Chrome | Firefox | Safari | iOS | Android | Notes |
|---|---|---|---|---|---|---|
| Gates G1–G6 | | | | | | |
| E2E `input` | | | | | | |
| E2E `components` | | | | | | |
| Manual cases | | | | | | |

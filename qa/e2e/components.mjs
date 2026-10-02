// Long lines are page scripts evaluated in the browser; wrapping them would not make them clearer.
/* eslint-disable max-len */
// Component end-to-end suite: every story renders without errors, and each component reacts to real
// pointer input the way the release checklist (qa/RELEASE_TESTS.md) describes. Cases are numbered
// as in the checklist.
import { sleep } from './drivers.mjs';
import { loadStory, STORYBOOK } from './page.mjs';

const q = (js) => `(() => { const qa = window.__qa; ${js} })()`;

async function stories()
{
    const index = await (await fetch(`${STORYBOOK}/index.json`)).json();

    return Object.values(index.entries).filter((e) => e.type === 'story').map((e) => e.id);
}

// Which component each story must contain; the smoke check fails if it is missing.
const EXPECTED = [
    [/^components-button-button-container/, 'ButtonContainer'],
    [/^components-checkbox-/, 'CheckBox'],
    [/^components-dialog-/, 'Dialog'],
    [/^components-drawer-/, 'Drawer'],
    [/^components-fancybutton-/, 'FancyButton'],
    [/^components-input-/, 'Input'],
    [/^components-list-/, 'List'],
    [/^components-maskedframe-/, 'MaskedFrame'],
    [/^components-progressbar-circular/, 'CircularProgressBar'],
    [/^components-progressbar-(?!circular)/, 'ProgressBar'],
    [/^components-radiogroup-/, 'CheckBox'],
    [/^components-scrollbox-/, 'ScrollBox'],
    [/^components-select-/, 'Select'],
    [/^components-slider-.*--double/, 'DoubleSlider'],
    [/^components-slider-.*--single/, 'Slider'],
    [/^components-switcher-/, 'Switcher'],
];

export async function componentsSuite(d, record, { only } = {})
{
    const touch = d.touch;
    const ev = (js) => d.eval(q(js));
    const settle = (ms = 400) => sleep(touch ? ms * 1.5 : ms);

    // ---- SM: every story renders ----
    if (!only || only === 'smoke')
    {
        for (const id of await stories())
        {
            await loadStory(d, id);
            const r = await ev('return { sum: qa.summary(), errors: qa.errors(), kids: window.__PIXI_APP__.stage.children.length };');
            const want = EXPECTED.find(([re]) => re.test(id))?.[1];
            const present = !want || (r.sum[want] ?? 0) > 0;

            record(`SM ${id}`, 'story renders, expected component present, no errors', present && r.errors.length === 0 && r.kids > 0, r);
        }
    }
    if (only === 'smoke') return;

    // ---- BTN: ButtonContainer ----
    await loadStory(d, 'components-button-button-container-sprite--button-container-sprite');
    let p = await ev(`const b = qa.find('ButtonContainer'); window.__ev = [];
        for (const s of ['onDown', 'onUp', 'onPress', 'onHover', 'onOut']) b[s].connect(() => window.__ev.push(s));
        return qa.at(b);`);

    if (!touch)
    {
        await d.hover(...p); await settle(200);
    }
    await d.click(...p); await settle();
    let r = await ev('return window.__ev;');

    record('BTN-1', 'press fires onDown, onUp, onPress (and onHover with a mouse)',
        ['onDown', 'onUp', 'onPress'].every((s) => r.includes(s)) && (touch || r.includes('onHover')), r);

    // ---- FB: FancyButton states ----
    await loadStory(d, 'components-fancybutton-use-graphics--use-graphics');
    p = await ev(`const b = qa.find('FancyButton'); window.__fb = b; window.__presses = 0; b.onPress.connect(() => window.__presses++);
        return qa.at(b);`);
    if (!touch)
    {
        // Start away from the button: a move to where the pointer already is fires no pointerover.
        await d.hover(p[0] + 400, p[1] + 250); await settle(100);
        await d.hover(...p); await settle(200);
        r = await ev('return window.__fb.state;');
        record('FB-1', 'hover shows the hover state', r === 'hover', r);
    }
    await d.drag(p[0], p[1], p[0] + 1, p[1] + 1, { holdMs: 300, steps: 1 }); await settle();
    r = await ev('return { presses: window.__presses, state: window.__fb.state };');
    record('FB-2', 'press and release fires onPress once and leaves the pressed state', r.presses === 1 && r.state !== 'pressed', r);

    if (!touch)
    {
        await d.hover(p[0] + 400, p[1] + 250); await settle(200);
        r = await ev('return window.__fb.state;');
        record('FB-3', 'moving away restores the default state', r === 'default', r);
    }

    const off = await ev(`const b = window.__fb; b.enabled = false; return qa.at(b);`);

    await d.click(...off); await settle();
    r = await ev('return { presses: window.__presses, state: window.__fb.state };');
    record('FB-4', 'a disabled button ignores presses and shows the disabled state', r.presses === 1 && r.state === 'disabled', r);

    // ---- CB: CheckBox ----
    await loadStory(d, 'components-checkbox-use-graphics--use-graphics');
    p = await ev(`const c = qa.find('CheckBox'); window.__cb = c; window.__checks = []; c.onCheck.connect((v) => window.__checks.push(v));
        window.__cb0 = c.checked; return qa.at(c, 0.1, 0.5);`);
    await d.click(...p); await settle();
    r = await ev('return { checked: window.__cb.checked, was: window.__cb0, checks: window.__checks };');
    const cb1 = r.checked === !r.was && r.checks.length === 1;

    await d.click(...p); await settle();
    r = await ev('return { checked: window.__cb.checked, was: window.__cb0, checks: window.__checks };');
    record('CB-1', 'press toggles checked and fires onCheck, a second press toggles back',
        cb1 && r.checked === r.was && r.checks.length === 2, r);

    p = await ev('return qa.at(window.__cb, 0.8, 0.5);');
    await d.click(...p); await settle();
    r = await ev('return window.__checks.length;');
    record('CB-2', 'pressing the label toggles too', r === 3, r);

    // ---- RG: RadioGroup ----
    await loadStory(d, 'components-radiogroup-use-graphics--use-graphics');
    const radios = await ev(`const all = qa.all('CheckBox'); window.__rg = all; return all.map((c) => qa.at(c, 0.15, 0.5));`);

    await d.click(...radios[2]); await settle();
    r = await ev('return window.__rg.map((c) => c.checked);');
    const rg1 = JSON.stringify(r) === '[false,false,true]';

    await d.click(...radios[0]); await settle();
    const r2 = await ev('return window.__rg.map((c) => c.checked);');

    await d.click(...radios[0]); await settle();
    const r3 = await ev('return window.__rg.map((c) => c.checked);');

    record('RG-1', 'exactly one radio is selected; pressing the selected one keeps it selected',
        rg1 && JSON.stringify(r2) === '[true,false,false]' && JSON.stringify(r3) === '[true,false,false]', { r, r2, r3 });

    // ---- SW: Switcher ----
    await loadStory(d, 'components-switcher-sprites--sprites');
    // The story also switches on hover; only the press is under test here.
    p = await ev(`const s = qa.find('Switcher'); window.__sw = s; window.__swc = []; s.onChange.connect((v) => window.__swc.push(v));
        s.triggerEvents = ['onPress'];
        window.__sw0 = s.active; return qa.at(s);`);
    await d.click(...p); await settle();
    r = await ev('return { active: window.__sw.active, was: window.__sw0, changes: window.__swc, n: window.__sw.views.length };');
    record('SW-1', 'press switches to the next view and fires onChange', r.active === (r.was + 1) % r.n && r.changes.length === 1, r);

    // ---- SL: Slider ----
    await loadStory(d, 'components-slider-graphics--single');
    p = await ev(`const s = qa.find('Slider'); window.__sl = s; window.__slu = 0; window.__slc = [];
        s.onUpdate.connect(() => window.__slu++); s.onChange.connect((v) => window.__slc.push(v));
        window.__sl0 = s.value; return { handle: qa.at(s._slider1), bar: qa.bounds(s) };`);
    await d.drag(p.handle[0], p.handle[1], p.handle[0] + (p.bar.w * 0.3), p.handle[1], { steps: 10 }); await settle();
    r = await ev('return { v: window.__sl.value, v0: window.__sl0, u: window.__slu, c: window.__slc, min: window.__sl.min, max: window.__sl.max };');
    record('SL-1', 'dragging the handle right raises the value, onUpdate while dragging, onChange once at release',
        r.v > r.v0 && r.u > 0 && r.c.length === 1 && r.v <= r.max, r);

    p = await ev('return { handle: qa.at(window.__sl._slider1), bar: qa.bounds(window.__sl) };');
    await d.drag(p.handle[0], p.handle[1], p.bar.x - 200, p.handle[1], { steps: 10 }); await settle();
    r = await ev('return { v: window.__sl.value, min: window.__sl.min };');
    record('SL-2', 'dragging past the start clamps to min', r.v === r.min, r);

    p = await ev('return qa.at(window.__sl, 0.75, 0.5);');
    await d.click(...p); await settle();
    r = await ev('return { v: window.__sl.value, min: window.__sl.min, max: window.__sl.max };');
    record('SL-3', 'pressing the track moves the value there', r.v > r.min + ((r.max - r.min) * 0.5), r);

    // ---- DSL: DoubleSlider ----
    await loadStory(d, 'components-slider-graphics--double');
    p = await ev(`const s = qa.find('DoubleSlider'); window.__ds = s; window.__ds0 = [s.value1, s.value2];
        return { h1: qa.at(s._slider1), h2: qa.at(s._slider2), bar: qa.bounds(s) };`);
    await d.drag(p.h2[0], p.h2[1], p.h2[0] - (p.bar.w * 0.15), p.h2[1], { steps: 10 }); await settle();
    await d.drag(p.h1[0], p.h1[1], p.h1[0] + (p.bar.w * 0.1), p.h1[1], { steps: 10 }); await settle();
    r = await ev('return { v: [window.__ds.value1, window.__ds.value2], v0: window.__ds0 };');
    record('DSL-1', 'each handle moves its own value', r.v[1] < r.v0[1] && r.v[0] > r.v0[0] && r.v[0] <= r.v[1], r);

    p = await ev('return { h1: qa.at(window.__ds._slider1), bar: qa.bounds(window.__ds) };');
    await d.drag(p.h1[0], p.h1[1], p.bar.x + p.bar.w + 200, p.h1[1], { steps: 12 }); await settle();
    r = await ev('return [window.__ds.value1, window.__ds.value2];');
    record('DSL-2', 'the low handle cannot pass the high one', r[0] <= r[1], r);

    // ---- PB: ProgressBar ----
    await loadStory(d, 'components-progressbar-usegraphics--use-graphics');
    r = await ev(`const b = qa.find('ProgressBar'); const out = [];
        for (const v of [0, 50, 100, 150, -10]) { b.progress = v; out.push(b.progress); } return { out, errors: qa.errors() };`);
    record('PB-1', 'progress 0..100 applies, values out of range are clamped, no errors',
        JSON.stringify(r.out) === '[0,50,100,100,0]' && r.errors.length === 0, r);

    await loadStory(d, 'components-progressbar-circular--circular');
    r = await ev(`const b = qa.find('CircularProgressBar'); const out = [];
        for (const v of [0, 50, 100]) { b.progress = v; out.push(b.progress); } return { out, errors: qa.errors() };`);
    record('PB-2', 'circular progress applies 0, 50, 100 without errors', JSON.stringify(r.out) === '[0,50,100]' && r.errors.length === 0, r);

    // ---- SB: ScrollBox ----
    await loadStory(d, 'components-scrollbox-use-graphics--use-graphics');
    p = await ev(`const s = qa.find('ScrollBox'); window.__sb = s; window.__sbe = 0; s.onScroll.connect(() => window.__sbe++);
        return { c: qa.at(s, 0.5, 0.7), b: qa.bounds(s) };`);
    if (!touch)
    {
        await d.wheel(p.c[0], p.c[1], 300); await settle(600);
        r = await ev('return { y: window.__sb.scrollY, e: window.__sbe };');
        record('SB-1', 'mouse wheel scrolls and fires onScroll', r.y !== 0 && r.e > 0, r);
        await ev('window.__sb.scrollTop(); return true;'); await settle(600);
    }
    const y0 = await ev('return window.__sb.scrollY;');

    await d.drag(p.c[0], p.c[1], p.c[0], p.c[1] - (p.b.h * 0.4), { steps: 10 }); await settle(800);
    r = await ev('return { y: window.__sb.scrollY };');
    record('SB-2', 'dragging the content scrolls it', r.y !== y0, { y0, ...r });

    r = await ev(`const s = window.__sb; s.scrollTop(); return true;`); await settle(800);
    p = await ev(`const s = window.__sb; window.__presses = 0; const first = s.items[0]; first.onPress.connect(() => window.__presses++);
        return qa.at(first);`);
    await d.click(...p); await settle();
    r = await ev('return window.__presses;');
    record('SB-3', 'a press (no drag) on an item reaches the item', r === 1, r);

    await d.drag(p[0], p[1], p[0], p[1] - 120, { steps: 10 }); await settle();
    r = await ev('return window.__presses;');
    record('SB-4', 'a drag that scrolls does not press the item it started on', r === 1, r);

    // ---- LST: List ----
    await loadStory(d, 'components-list-use-graphics--use-graphics');
    r = await ev(`const l = qa.find('List'); const bs = l.children.map((c) => c.getBounds());
        let overlaps = 0; for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i], b = bs[j]; if (a.x < b.x + b.width - 0.5 && b.x < a.x + a.width - 0.5 && a.y < b.y + b.height - 0.5 && b.y < a.y + a.height - 0.5) overlaps++; }
        return { n: bs.length, overlaps };`);
    record('LST-1', 'list children do not overlap', r.n > 1 && r.overlaps === 0, r);

    r = await ev(`const l = qa.find('List'); const out = {};
        for (const t of ['vertical', 'horizontal', 'bidirectional']) { l.type = t; l.arrangeChildren && l.arrangeChildren();
          const bs = l.children.map((c) => c.getBounds()); let overlaps = 0;
          for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) { const a = bs[i], b = bs[j];
            if (a.x < b.x + b.width - 0.5 && b.x < a.x + a.width - 0.5 && a.y < b.y + b.height - 0.5 && b.y < a.y + a.height - 0.5) overlaps++; }
          out[t] = overlaps; } return out;`);
    record('LST-2', 'switching type vertical / horizontal / bidirectional keeps children apart',
        r.vertical === 0 && r.horizontal === 0 && r.bidirectional === 0, r);

    // ---- SEL: Select ----
    await loadStory(d, 'components-select-use-graphics--use-graphics');
    p = await ev(`const s = qa.find('Select'); window.__sel = s; window.__sels = []; s.onSelect.connect((v, t) => window.__sels.push([v, t]));
        return qa.at(s.openButton);`);
    await d.click(...p); await settle();
    r = await ev('return { open: window.__sel.view.visible && !window.__sel.openButton.visible };');
    const sel1 = r.open;

    p = await ev('const sb = window.__sel.scrollBox; return qa.at(sb.items[1]);');
    await d.click(...p); await settle();
    r = await ev('return { open: window.__sel.view.visible, sels: window.__sels, value: window.__sel.value };');
    record('SEL-1', 'press opens the list; picking an item fires onSelect with its index and closes it',
        sel1 && !r.open && r.sels.length === 1 && r.sels[0][0] === 1, r);

    p = await ev('return qa.at(window.__sel.openButton);');
    await d.click(...p); await settle();
    p = await ev('return qa.at(window.__sel.closeButton);');
    await d.click(...p); await settle();
    r = await ev('return { open: window.__sel.view.visible, sels: window.__sels.length };');
    record('SEL-2', 'pressing the header again closes it without selecting', !r.open && r.sels === 1, r);

    // ---- DLG: Dialog ----
    await loadStory(d, 'components-dialog-use-graphics--confirm-dialog');
    await sleep(800);
    p = await ev(`const g = qa.find('Dialog'); window.__dlg = g; window.__dsel = []; window.__dclose = 0;
        g.onSelect.connect((i, t) => window.__dsel.push([i, t])); g.onClose.connect(() => window.__dclose++);
        const btn = qa.all('FancyButton').find((b) => { let p = b.parent; while (p) { if (p === g) return true; p = p.parent; } return false; });
        return { open: g.isOpen, btn: btn && qa.at(btn) };`);
    await d.click(...p.btn); await settle(900);
    r = await ev('return { open: window.__dlg.isOpen, sel: window.__dsel, close: window.__dclose };');
    record('DLG-1', 'dialog opens; pressing a button fires onSelect and closes it', p.open && !r.open && r.sel.length === 1 && r.close >= 1, r);

    await ev('window.__dlg.open(); return true;'); await settle(900);
    p = await ev('return qa.screen();');
    await d.click(p.x + 10, p.y + 10); await settle(900);
    r = await ev('return { open: window.__dlg.isOpen, opt: window.__dlg.options && window.__dlg.options.closeOnBackdropClick };');
    record('DLG-2', 'backdrop press closes the dialog only when closeOnBackdropClick is set', r.open === !r.opt, r);

    // ---- DRW: Drawer ----
    await loadStory(d, 'components-drawer-use-graphics--bottom-drawer');
    await sleep(800);
    p = await ev(`const g = qa.find('Drawer'); window.__drw = g; window.__drc = 0; g.onClose.connect(() => window.__drc++);
        return { open: g.isOpen, screen: qa.screen() };`);
    await d.click(p.screen.x + (p.screen.w / 2), p.screen.y + 20); await settle(900);
    r = await ev('return { open: window.__drw.isOpen, closes: window.__drc };');
    record('DRW-1', 'bottom drawer opens; a backdrop press closes it and fires onClose', p.open && !r.open && r.closes === 1, r);

    await ev('window.__drw.open(); return true;'); await settle(900);
    p = await ev('return { c: qa.at(window.__drw.innerView || window.__drw, 0.5, 0.15), screen: qa.screen() };');
    await d.drag(p.c[0], p.c[1], p.c[0], p.c[1] + 300, { steps: 12 }); await settle(900);
    r = await ev('return { open: window.__drw.isOpen, closes: window.__drc };');
    record('DRW-2', 'swiping the drawer down closes it', !r.open && r.closes === 2, r);

    for (const side of ['top', 'left', 'right'])
    {
        await loadStory(d, `components-drawer-use-graphics--${side}-drawer`);
        await sleep(800);
        r = await ev(`const g = qa.find('Drawer'); const b = qa.bounds(g.innerView || g); const s = qa.screen();
            return { open: g.isOpen, b, s, errors: qa.errors() };`);
        const inside = r.b.x >= r.s.x - 2 && r.b.y >= r.s.y - 2 && r.b.x + r.b.w <= r.s.x + r.s.w + 2 && r.b.y + r.b.h <= r.s.y + r.s.h + 2;

        record(`DRW-3 ${side}`, `${side} drawer opens fully on screen`, r.open && inside && r.errors.length === 0, r);
    }

    // ---- MF: MaskedFrame ----
    await loadStory(d, 'components-maskedframe-use-graphics--use-graphics');
    r = await ev(`const m = qa.find('MaskedFrame'); const b = m.getBounds(); return { w: b.width, h: b.height, mask: !!(m.target && m.target.mask), errors: qa.errors() };`);
    record('MF-1', 'masked frame renders with its mask applied', r.w > 0 && r.h > 0 && r.mask && r.errors.length === 0, r);
}

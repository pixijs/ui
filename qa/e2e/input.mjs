// Long lines are page scripts evaluated in the browser; wrapping them would not make them clearer.
/* eslint-disable max-len */
// Input end-to-end suite: the activation, typing, keyboard, pointer, overflow and API cases of the
// release checklist (qa/RELEASE_TESTS.md, section "Input"). Desktop drivers run every case; touch
// drivers (iOS, Android) run the cases a finger and an on-screen keyboard can perform.
import { sleep } from './drivers.mjs';
import { storyUrl } from './page.mjs';

const STORY = 'components-input-use-graphics--use-graphics';
const ARGS = 'addMask:true;maxLength:60;cleanOnFocus:false';

// Finds the first Input on the stage and installs state readers. Runs in the page.
const SETUP = `(() => {
  const find = (c) => { if (c && 'selectionStart' in c && 'editing' in c) return c; for (const ch of (c?.children || [])) { const r = find(ch); if (r) return r; } };
  const app = window.__PIXI_APP__; const i = find(app.stage); const canvas = app.canvas || app.view;
  window.__i = i; window.__enters = []; window.__changes = []; window.__errs = [];
  window.addEventListener('error', (e) => window.__errs.push(String(e.message)));
  i.onEnter.connect((v) => window.__enters.push(v)); i.onChange.connect((v) => window.__changes.push(v));
  if (!document.getElementById('qa-other')) { const b = document.createElement('button'); b.id = 'qa-other'; b.textContent = 'other'; b.style.cssText = 'position:fixed;left:0;top:0;width:120px;height:40px;z-index:10'; document.body.appendChild(b); }
  const toViewport = (inp, lx, ly) => { const r = canvas.getBoundingClientRect(); const s = r.width / app.screen.width; const p = inp.toGlobal({ x: lx, y: ly }); return [r.left + p.x * s, r.top + p.y * s]; };
  window.__qaInput = {
    state: (inp = i) => ({ editing: inp.editing, value: inp.value, sel: [inp.selectionStart, inp.selectionEnd], dir: inp.selectionDirection, scrollX: Math.round(inp.scrollX), field: !!inp.input, active: !!inp.input && document.activeElement === inp.input, fieldValue: inp.input ? inp.input.value : null, fieldSel: inp.input ? [inp.input.selectionStart, inp.input.selectionEnd] : null, enters: window.__enters.length, changes: window.__changes.length, cursorAlpha: inp._cursor.alpha, drawn: inp.inputField.text, overflowing: inp.isOverflowing, anchorX: inp.inputField.anchor.x, placeholder: inp.placeholder.visible }),
    at: (k, inp = i) => toViewport(inp, inp.textLeft + inp.offsetAt(k), inp.inputField.y),
    local: (lx, inp = i) => toViewport(inp, lx, inp.inputField.y),
    center: (inp = i) => toViewport(inp, inp._bg.width / 2, inp._bg.height / 2),
    edges: (inp = i) => [toViewport(inp, inp.paddingLeft, inp.inputField.y), toViewport(inp, inp._bg.width - inp.paddingRight, inp.inputField.y)],
    select: (a, b) => { i.input.setSelectionRange(a, b); i.update(1); return true; },
  };
  return { ok: !!i, ua: navigator.userAgent, viewport: [innerWidth, innerHeight] };
})()`;

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export async function inputSuite(d, record)
{
    const st = () => d.eval('window.__qaInput.state()');
    const at = (k) => d.eval(`window.__qaInput.at(${k})`);
    const select = (a, b) => d.eval(`window.__qaInput.select(${a}, ${b})`);
    const touch = d.touch;
    // Past the multi-tap window, so the next press is not counted as a double click.
    const GAP = 700;

    const load = async (args = ARGS) =>
    {
        await d.navigate(storyUrl(STORY, args));
        for (let n = 0; n < 60; n++)
        {
            if (await d.eval('!!(window.__PIXI_APP__ && window.__PIXI_APP__.stage.children.length)').catch(() => false)) break;
            await sleep(250);
        }
        await sleep(500);

        return d.eval(SETUP);
    };
    const clearAndType = async (text) =>
    {
        await select(0, 1e6);
        await d.press('Backspace');
        if (text) await d.type(text);
        await sleep(touch ? 400 : 150);
    };

    const info = await load();
    const center = await d.eval('window.__qaInput.center()');
    // Empty canvas below the input, inside the viewport.
    const outside = [center[0], Math.min(center[1] + 220, info.viewport[1] - 30)];

    // ---- A: activation and focus ----
    await d.click(...center); await sleep(touch ? 1000 : 300);
    let s = await st();

    record('IN-A1', 'press activates: caret shown, placeholder hidden, field focused', s.editing && s.active && !s.placeholder, s);

    await d.type('hello world'); await sleep(touch ? 600 : 200);
    s = await st();
    record('IN-B1', 'typing mirrors the value, onChange once per character',
        s.value === 'hello world' && (touch ? s.changes >= 1 : s.changes === 11), { value: s.value, changes: s.changes });

    let p = await at(1);

    await d.click(...p); await sleep(GAP);
    s = await st();
    record('IN-A9', 'press inside during a session moves the caret, no onEnter', s.editing && eq(s.sel, [1, 1]) && s.enters === 0, s);

    await d.click(...outside); await sleep(touch ? 800 : 300);
    s = await st();
    record('IN-A3', 'press on empty canvas ends the session once, text kept',
        !s.editing && !s.field && s.enters === 1 && s.value === 'hello world', s);

    p = await at(3);
    await d.click(...p); await sleep(touch ? 1200 : GAP);
    s = await st();
    record('IN-A2', 'press on an idle input starts editing with the caret at the press', s.editing && eq(s.sel, [3, 3]), s);

    await d.press('Enter'); await sleep(touch ? 600 : 200);
    s = await st();
    record('IN-A5a', 'Enter ends the session', !s.editing && s.enters === 2, s);

    if (!touch)
    {
        await d.click(...center); await sleep(300);
        await d.press('Escape'); await sleep(200);
        s = await st();
        record('IN-A5b', 'Escape ends the session', !s.editing && s.enters === 3, s);

        await d.eval(`(() => { if (!document.getElementById('qa-text')) { const t = document.createElement('input'); t.id = 'qa-text';
            t.style.cssText = 'position:fixed;left:0;top:50px;width:120px'; document.body.appendChild(t); } return true; })()`);
        let e0 = (await st()).enters;

        await d.click(...center); await sleep(300);
        // The hidden field is the last element in the page, so Tab would leave for the browser's own
        // UI, which a synthetic click cannot bring focus back from; give it somewhere to go.
        // A text field, since Safari's Tab skips buttons by default.
        await d.eval(`(() => { const b = document.getElementById('qa-after') || document.createElement('input');
            b.id = 'qa-after'; b.style.cssText = 'position:fixed;right:0;top:0;width:80px';
            document.body.appendChild(b); return true; })()`);
        await d.press('Tab'); await sleep(300);
        s = await st();
        const tabStayed = await d.eval('document.activeElement === window.__i.input');

        const hasFocus = await d.eval('document.hasFocus()');

        // Without OS focus (an automated window in the background) browsers fire no blur at all.
        record('IN-A6', 'Tab moves focus out of the field and ends the session once',
            hasFocus ? !s.editing && s.enters === e0 + 1 && !tabStayed : null, { s, tabStayed, hasFocus });
        await d.click(...outside); await sleep(300);

        e0 = (await st()).enters;
        await d.click(...center); await sleep(300);
        await d.click(40, 18); await sleep(300);
        s = await st();
        record('IN-A4', 'press on another DOM element ends the session once', !s.editing && s.enters === e0 + 1, s);

        e0 = (await st()).enters;
        await d.clicksAt([center, outside], 80); await sleep(400);
        s = await st();
        record('IN-A8', 'press in, then quickly out, ends exactly once', !s.editing && s.enters === e0 + 1, s);
    }

    await d.click(...center); await sleep(touch ? 1000 : 300);
    s = await st();
    record('IN-A7', 'reactivation keeps the value (cleanOnFocus off)', s.editing && s.value === 'hello world', s);

    // ---- B: typing ----
    await select(11, 11);
    await d.press('Backspace'); await sleep(touch ? 400 : 100);
    s = await st();
    const b2a = s.value === 'hello worl' && eq(s.sel, [10, 10]);
    let b2b = true;
    let b2c = true;

    if (!touch)
    {
        await d.press('ArrowLeft'); await d.press('ArrowLeft');
        await d.press('Backspace'); await sleep(100);
        s = await st();
        b2b = s.value === 'hello wrl' && eq(s.sel, [7, 7]);
        await d.press('Delete'); await sleep(100);
        s = await st();
        b2c = s.value === 'hello wl' && eq(s.sel, [7, 7]);
    }
    record('IN-B2', touch ? 'Backspace deletes one character' : 'Backspace at the end, Backspace and Delete in the middle',
        b2a && b2b && b2c, { b2a, b2b, b2c, s });

    await clearAndType('0123456789'.repeat(7));
    s = await st();
    record('IN-B3', 'maxLength caps typing at 60, caret inside the text',
        s.value.length === 60 && s.sel[0] <= 60 && s.fieldValue.length === 60, { len: s.value.length, sel: s.sel });

    if (!touch)
    {
        await clearAndType('a\u{1F600}b'); await sleep(100);
        s = await st();
        const b4a = s.value === 'a\u{1F600}b';

        await d.press('ArrowLeft'); await d.press('ArrowLeft');
        await sleep(100);
        s = await st();
        const b4b = eq(s.sel, [1, 1]);

        await d.press('ArrowRight'); await d.press('Backspace');
        await sleep(100);
        s = await st();
        const b4c = s.value === 'ab' && eq(s.sel, [1, 1]);

        record('IN-B4', 'emoji: typed, arrows skip the pair, Backspace removes it whole', b4a && b4b && b4c, { b4a, b4b, b4c, s });
    }

    await clearAndType('hello world');
    await select(0, 5);
    await d.type('J'); await sleep(touch ? 500 : 100);
    s = await st();
    record('IN-B7', 'typing replaces a selection', s.value === 'J world' && eq(s.sel, [1, 1]), s);

    await select(1, 3);
    await d.eval('(() => { window.__i.secure = true; return true; })()');
    s = await st();
    const b6a = s.drawn === '*******' && eq(s.sel, [1, 3]) && eq(s.fieldSel, [1, 3]);
    const type6 = await d.eval('window.__i.input.type');

    await select(3, 3);
    await d.type('pw'); await sleep(touch ? 500 : 100);
    s = await st();
    const b6b = s.value === 'J wpworld';

    await d.eval('(() => { window.__i.secure = false; return true; })()');
    s = await st();
    record('IN-B6', 'secure: masked, password field, selection kept across the toggle, typing works',
        b6a && type6 === 'password' && b6b && s.drawn === s.value, { b6a, type6, b6b, value: s.value });

    if (d.compose)
    {
        await clearAndType('ab');
        await d.compose('xyz'); await sleep(300);
        s = await st();
        record('IN-B9', 'IME composition commits once into the value', s.value === 'abxyz' && eq(s.sel, [5, 5]), s);
    }

    // ---- C: keyboard selection (desktop) ----
    if (!touch)
    {
        await clearAndType('hello brave world');
        await d.press('ArrowLeft', ['Mod']); await sleep(100);
        s = await st();
        const c1a = eq(s.sel, [0, 0]);

        await d.press('ArrowRight', ['Mod']); await sleep(100);
        s = await st();
        const c1b = eq(s.sel, [17, 17]);

        await d.press('ArrowLeft'); await sleep(100);
        s = await st();
        record('IN-C1', 'line start / line end / Left move the drawn caret', c1a && c1b && eq(s.sel, [16, 16]), { c1a, c1b, s });

        await d.press('ArrowLeft', ['Shift']); await d.press('ArrowLeft', ['Shift']);
        await sleep(150);
        s = await st();
        const hl = await d.eval('(() => { const c = window.__i._selection.context; return c ? c.bounds.maxX - c.bounds.minX : -1; })()');

        record('IN-C2', 'Shift+Left extends backward, caret hidden, highlight drawn',
            eq(s.sel, [14, 16]) && s.dir === 'backward' && s.cursorAlpha === 0 && hl > 0, { s, hl });

        await d.press('a', ['Mod']); await sleep(150);
        s = await st();
        record('IN-C3', 'Cmd/Ctrl+A selects all', eq(s.sel, [0, 17]), s);

        await d.press('ArrowLeft', ['Mod']); await d.press('ArrowRight', ['Alt']);
        await sleep(150);
        s = await st();
        record('IN-C4', 'Alt+Right jumps a word', eq(s.sel, [5, 5]), s);

        await d.press('ArrowRight', ['Shift', 'Alt']); await sleep(100);
        await d.press('ArrowLeft'); await sleep(150);
        s = await st();
        const hl2 = await d.eval('(() => { const c = window.__i._selection.context; return c ? c.bounds.maxX - c.bounds.minX : -1; })()');

        record('IN-C5', 'Left collapses a selection, highlight cleared', s.sel[0] === s.sel[1] && hl2 <= 0, { s, hl2 });
    }

    // ---- D: pointer selection (F on touch) ----
    await clearAndType('hello, world');
    await sleep(GAP);
    p = await at(3);
    await d.click(...p); await sleep(GAP);
    s = await st();
    const d1a = eq(s.sel, [3, 3]);
    let [lEdge, rEdge] = await d.eval('window.__qaInput.edges()');

    await d.click(lEdge[0] + 2, lEdge[1]); await sleep(GAP);
    s = await st();
    const d1b = eq(s.sel, [0, 0]);

    await d.click(rEdge[0] - 2, rEdge[1]); await sleep(GAP);
    s = await st();
    const d1c = eq(s.sel, [12, 12]);

    record('IN-D1', 'press mid-text / far left / far right', d1a && d1b && d1c && s.editing, { d1a, d1b, d1c });

    const p3 = await at(3);
    const p8 = await at(8);

    await d.drag(p3[0], p3[1], p8[0], p8[1], { pressMs: touch ? 80 : 0 }); await sleep(GAP);
    s = await st();
    const d2a = eq(s.sel, [3, 8]) && s.dir === 'forward';

    await d.drag(p8[0], p8[1], p3[0], p3[1], { pressMs: touch ? 80 : 0 }); await sleep(GAP);
    s = await st();
    const d2b = eq(s.sel, [3, 8]) && (s.dir === 'backward' || touch);

    record('IN-D2', 'drag selects both ways, direction follows the drag', d2a && d2b, { d2a, d2b, s });

    if (!touch)
    {
        await d.click(...p3); await sleep(GAP);
        await d.shiftClick(...p8); await sleep(GAP);
        s = await st();
        record('IN-D3', 'Shift+click extends from the anchor', eq(s.sel, [3, 8]), s);
    }

    const mid = async (a, b) =>
    {
        const x = await at(a);
        const y = await at(b);

        return [(x[0] + y[0]) / 2, x[1]];
    };
    const tapGap = touch ? 120 : 60;

    await d.click(...(await mid(1, 2)), { count: 2, gap: tapGap }); await sleep(GAP);
    s = await st();
    const d4a = eq(s.sel, [0, 5]);

    await d.click(...(await mid(5, 6)), { count: 2, gap: tapGap }); await sleep(GAP);
    s = await st();
    const d4b = eq(s.sel, [5, 6]);

    await d.click(...(await mid(9, 10)), { count: 2, gap: tapGap }); await sleep(GAP);
    s = await st();
    const d4c = eq(s.sel, [7, 12]);

    record('IN-D4', 'double press: word / punctuation / word', d4a && d4b && d4c, { d4a, d4b, d4c });

    await d.click(...(await mid(1, 2)), { count: 3, gap: tapGap }); await sleep(GAP);
    s = await st();
    record('IN-D5', 'triple press selects all', eq(s.sel, [0, 12]), s);

    if (!touch)
    {
        await d.click(...(await mid(1, 2)), { count: 2 }); await sleep(GAP);
        await d.click(...(await mid(2, 3)), { button: 2 }); await sleep(400);
        s = await st();
        const d6 = eq(s.sel, [0, 5]) && s.editing;

        await d.press('Escape'); await sleep(200);
        if (!(await st()).editing)
        {
            await d.click(...center); await sleep(GAP);
        }
        record('IN-D6', 'right click inside a selection keeps it', d6, { s });
    }

    await d.clicksAt([await at(1), await at(11)], tapGap); await sleep(GAP);
    s = await st();
    record('IN-D7', 'two quick presses at different places do not select a word', s.sel[0] === s.sel[1], s);

    // ---- E: overflow and scroll ----
    await clearAndType('the quick brown fox jumps over the lazy dog'); await sleep(200);
    s = await st();
    [lEdge, rEdge] = await d.eval('window.__qaInput.edges()');
    let caretX = await d.eval('window.__qaInput.local(window.__i._cursor.x)');

    record('IN-E1', 'overflowing text shows its end, caret at the right edge',
        s.overflowing && s.scrollX > 0 && Math.abs(caretX[0] - rEdge[0]) < 1.5, { s, caretX, rEdge });

    if (!touch)
    {
        await d.press('ArrowLeft', ['Mod']); await sleep(150);
        s = await st();
        caretX = await d.eval('window.__qaInput.local(window.__i._cursor.x)');
        record('IN-E2', 'line start shows the start, caret at the left edge',
            s.scrollX === 0 && Math.abs(caretX[0] - lEdge[0]) < 1.5, { s, caretX, lEdge });

        let prevScroll = 0;
        let onlyAtEdge = true;

        for (let n = 0; n < 40; n++)
        {
            await d.press('ArrowRight'); await sleep(30);
            s = await st();
            const cx = await d.eval('window.__qaInput.local(window.__i._cursor.x)');

            if (s.scrollX !== prevScroll && Math.abs(cx[0] - rEdge[0]) > 1.5) onlyAtEdge = false;
            if (cx[0] > rEdge[0] + 1.5 || cx[0] < lEdge[0] - 1.5) onlyAtEdge = false;
            prevScroll = s.scrollX;
        }
        record('IN-E3', 'Right arrow walks the caret to the edge, then scrolls the text with it', onlyAtEdge && s.scrollX > 0, { s });
    }
    else
    {
        await select(38, 38); await sleep(200);
    }

    const p38 = await at(38);

    await d.click(...p38); await sleep(GAP);
    s = await st();
    record('IN-E4', 'press on scrolled text lands on that character', eq(s.sel, [38, 38]), s);

    const pIn = await at(38);

    await d.drag(pIn[0], pIn[1], lEdge[0] - (touch ? 40 : 120), lEdge[1], { holdMs: 1800, pressMs: touch ? 80 : 0 });
    await sleep(300);
    s = await st();
    record('IN-E3b', 'drag held past the left edge auto-scrolls to the start', s.sel[0] === 0 && s.scrollX === 0, s);

    await select(10, 43);
    await d.press('Backspace'); await sleep(touch ? 400 : 150);
    s = await st();
    record('IN-E6', 'once the text fits again the scroll resets and align applies',
        !s.overflowing && s.scrollX === 0 && s.anchorX === 0.5, s);

    await d.type(' brown fox jumps over the lazy dog'); await sleep(touch ? 800 : 100);
    await d.press('Enter'); await sleep(touch ? 600 : 200);
    s = await st();
    const tl = await d.eval('window.__i.textLeft === window.__i.paddingLeft');

    record('IN-E5', 'idle input shows the start of the text', !s.editing && s.scrollX === 0 && tl, { s, tl });

    // ---- G: API and instances ----
    await d.click(...center); await sleep(touch ? 1000 : GAP);
    await d.eval(`(() => { const i = window.__i; i.input.setSelectionRange(4, 20); i.update(1);
        window.__c0 = window.__changes.length; i.value = 'abc'; return true; })()`);
    s = await st();
    const g1a = s.fieldValue === 'abc' && eq(s.sel, [3, 3]) && eq(s.fieldSel, [3, 3]);
    const g5 = (await d.eval('window.__changes.length === window.__c0'));

    await d.type('x'); await sleep(touch ? 500 : 150);
    s = await st();
    record('IN-G1', 'value set during a session reaches the field, typing continues it', g1a && s.value === 'abcx', { g1a, s });
    record('IN-G5', 'a programmatic value does not emit onChange', g5, {});

    await d.eval('(() => { window.__i.input.setSelectionRange(0, 0); window.__i.update(1); window.__i.selectAll(); return true; })()');
    s = await st();
    record('IN-G2', 'selectAll() selects everything, in the field too', eq(s.sel, [0, 4]) && eq(s.fieldSel, [0, 4]), s);

    const bCenter = await d.eval(`(() => {
      const A = window.__i; const Input = A.constructor; const G = A._bg.constructor;
      const bg = new G().roundRect(0, 0, 320, 70, 12).fill(0x3355aa);
      const B = new Input({ bg, textStyle: { fill: 0xffffff, fontSize: 24 }, value: 'second' });
      B.x = A.x; B.y = A.y + 110; A.parent.addChild(B); window.__b = B;
      return window.__qaInput.center(B);
    })()`);

    await d.click(...center); await sleep(touch ? 1000 : GAP);
    const e0 = await d.eval('window.__enters.length');

    await d.click(...bCenter); await sleep(touch ? 1200 : GAP);
    const g3 = await d.eval(`({ a: window.__i.editing, b: window.__b.editing, bActive: document.activeElement === window.__b.input,
        fields: document.querySelectorAll('input:not(#qa-text):not(#qa-after)').length, aEnters: window.__enters.length })`);

    await d.type('!'); await sleep(touch ? 500 : 100);
    const bVal = await d.eval('window.__b.value');

    record('IN-G3', 'switching instances ends A once, starts B, one field in the DOM, typing goes to B',
        !g3.a && g3.b && g3.bActive && g3.fields === 1 && g3.aEnters === e0 + 1 && bVal.endsWith('!'), { g3, bVal });

    await d.click(...center); await sleep(touch ? 1000 : GAP);
    const g4 = await d.eval(`(() => { const i = window.__i; i.destroy();
        return { fields: document.querySelectorAll('input:not(#qa-text):not(#qa-after)').length, destroyed: i.destroyed }; })()`);

    await d.click(...center); await sleep(300);
    await d.click(...outside); await sleep(300);
    await d.click(...bCenter); await sleep(touch ? 1200 : GAP);
    await d.type('?'); await sleep(touch ? 500 : 100);
    const g4b = await d.eval('({ errs: window.__errs, b: window.__b.value })');

    record('IN-G4', 'destroy() during a session: field removed, no errors, the other input still works',
        g4.fields === 0 && g4.destroyed && g4b.errs.length === 0 && g4b.b.endsWith('?'), { g4, g4b });

    // ---- B6b: a masked emoji never takes the caret inside ----
    if (!touch)
    {
        await load();
        await d.click(...(await d.eval('window.__qaInput.center()'))); await sleep(300);
        await d.type('a\u{1F600}b'); await sleep(100);
        await d.eval('(() => { window.__i.secure = true; window.__i.update(1); return true; })()');
        const inside = [];

        for (const f of [0.3, 0.4, 0.5, 0.6, 0.7])
        {
            const q = await d.eval(`window.__qaInput.local(window.__i.textLeft + window.__i.inputField.width * ${f})`);

            await d.click(...q); await sleep(GAP);
            inside.push((await st()).sel[0]);
        }
        record('IN-B6b', 'secure: a press never puts the caret inside a masked emoji', inside.every((k) => k !== 2), { inside });
    }

    // ---- B8: no autocapitalisation or autocorrect attributes lost ----
    await load();
    await d.click(...(await d.eval('window.__qaInput.center()'))); await sleep(touch ? 1000 : 300);
    const attrs = await d.eval(`(() => { const f = window.__i.input; return ['autocomplete', 'autocapitalize', 'autocorrect', 'spellcheck', 'data-1p-ignore']
        .map((a) => a + '=' + f.getAttribute(a)).join(' '); })()`);

    record('IN-B8', 'hidden field turns off autocomplete, autocapitalize, autocorrect, spellcheck, password managers',
        attrs === 'autocomplete=off autocapitalize=off autocorrect=off spellcheck=false data-1p-ignore=true', { attrs });
    await d.click(...outside); await sleep(300);
}

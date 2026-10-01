// Browser drivers for the release E2E suites. Every driver sends input through the browser's own
// input pipeline (CDP, WebDriver BiDi or classic WebDriver), so the page sees trusted events, and
// exposes the same small interface:
//
//   name, touch, navigate(url), eval(js), click(x, y, opts), clicksAt(points, gap), drag(x1, y1, x2, y2, opts),
//   shiftClick(x, y), hover(x, y), wheel(x, y, dy), type(text), press(key, mods), compose(text), close()
//
// Coordinates are CSS pixels in the viewport. Keys are DOM `key` names ('Enter', 'ArrowLeft', 'a') and
// modifiers are 'Shift', 'Alt', 'Control', 'Meta', or 'Mod' for the platform's primary modifier.
import { execFile } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import WebSocket from 'ws';

const run = promisify(execFile);

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const IS_MAC = process.platform === 'darwin';
const PRIMARY_MOD = IS_MAC ? 'Meta' : 'Control';
const resolveMod = (m) => (m === 'Mod' ? PRIMARY_MOD : m);

async function waitFor(fn, timeout = 20000, what = 'condition')
{
    const end = Date.now() + timeout;
    let lastError;

    while (Date.now() < end)
    {
        try
        {
            const v = await fn();

            if (v) return v;
        }
        catch (e)
        {
            lastError = e;
        }
        await sleep(250);
    }
    throw new Error(`timed out waiting for ${what}${lastError ? `: ${lastError.message}` : ''}`);
}

function jsonRpc(url)
{
    const ws = new WebSocket(url, { perMessageDeflate: false });
    const pending = new Map();
    const listeners = [];
    let id = 0;

    ws.on('message', (data) =>
    {
        const m = JSON.parse(data);

        if (m.id && pending.has(m.id))
        {
            pending.get(m.id)(m);
            pending.delete(m.id);
        }
        else if (m.method)
        {
            listeners.forEach((l) => l(m));
        }
    });

    return {
        ready: new Promise((resolve, reject) =>
        {
            ws.on('open', resolve);
            ws.on('error', reject);
        }),
        send: (method, params = {}, extra = {}) => new Promise((resolve, reject) =>
        {
            const n = ++id;
            // A protocol call that never answers would hang the whole run; fail it instead.
            const timer = setTimeout(() =>
            {
                pending.delete(n);
                reject(new Error(`${method}: no answer in 30 s`));
            }, 30000);

            pending.set(n, (m) =>
            {
                clearTimeout(timer);
                if (m.error || m.type === 'error') reject(new Error(`${method}: ${JSON.stringify(m.error ?? m.message)}`));
                else resolve(m.result);
            });
            ws.send(JSON.stringify({ id: n, method, params, ...extra }));
        }),
        on: (l) => listeners.push(l),
        close: () => ws.close(),
    };
}

// ---------------------------------------------------------------------------------------------
// WebDriver action-sequence input, shared by BiDi (Firefox) and classic WebDriver (Safari, iOS).
// ---------------------------------------------------------------------------------------------

const WD_KEYS = {
    Backspace: '', Tab: '', Enter: '', Shift: '', Control: '', Alt: '',
    Escape: '', End: '', Home: '', ArrowLeft: '', ArrowUp: '',
    ArrowRight: '', ArrowDown: '', Delete: '', Meta: '',
};
const wdKey = (k) => WD_KEYS[k] ?? k;

// WebDriver rejects moves outside the viewport, so targets are clamped into it, as a real pointer
// pressed against the window edge would be.
function webdriverInput(perform, pointerType, viewport)
{
    const touch = pointerType === 'touch';
    const pointer = (actions) => ({ type: 'pointer', id: touch ? 'finger' : 'mouse', parameters: { pointerType }, actions });
    const keys = (actions) => ({ type: 'key', id: 'kbd', actions });
    const clamp = (v, max) => Math.round(Math.max(0, Math.min(v, (max ?? Infinity) - 1)));
    const move = (x, y, duration = 0) => ({
        type: 'pointerMove', x: clamp(x, viewport.w), y: clamp(y, viewport.h), origin: 'viewport', duration,
    });

    return {
        async click(x, y, { button = 0, count = 1, gap = 60 } = {})
        {
            const steps = [move(x, y)];

            for (let i = 0; i < count; i++)
            {
                steps.push({ type: 'pointerDown', button }, { type: 'pointerUp', button });
                if (i < count - 1) steps.push({ type: 'pause', duration: gap });
            }
            await perform([pointer(steps)]);
        },
        async clicksAt(points, gap = 60)
        {
            const steps = [];

            points.forEach(([x, y], i) =>
            {
                steps.push(move(x, y), { type: 'pointerDown', button: 0 }, { type: 'pointerUp', button: 0 });
                if (i < points.length - 1) steps.push({ type: 'pause', duration: gap });
            });
            await perform([pointer(steps)]);
        },
        async drag(x1, y1, x2, y2, { holdMs = 0, steps: n = 8, pressMs = 0 } = {})
        {
            const steps = [move(x1, y1), { type: 'pointerDown', button: 0 }];

            if (pressMs) steps.push({ type: 'pause', duration: pressMs });
            for (let i = 1; i <= n; i++)
            {
                steps.push(move(x1 + ((x2 - x1) * i / n), y1 + ((y2 - y1) * i / n), 20));
            }
            if (holdMs) steps.push({ type: 'pause', duration: holdMs });
            steps.push({ type: 'pointerUp', button: 0 });
            await perform([pointer(steps)]);
        },
        async shiftClick(x, y)
        {
            await perform([
                keys([{ type: 'keyDown', value: WD_KEYS.Shift }, { type: 'pause' }, { type: 'pause' },
                    { type: 'keyUp', value: WD_KEYS.Shift }]),
                pointer([move(x, y), { type: 'pointerDown', button: 0 }, { type: 'pointerUp', button: 0 },
                    { type: 'pause' }]),
            ]);
        },
        async hover(x, y)
        {
            await perform([pointer([move(x, y)])]);
        },
        async type(text)
        {
            const steps = [];

            for (const ch of text) steps.push({ type: 'keyDown', value: ch }, { type: 'keyUp', value: ch });
            await perform([keys(steps)]);
        },
        async press(key, mods = [])
        {
            const ms = mods.map((m) => wdKey(resolveMod(m)));
            const steps = [];

            ms.forEach((m) => steps.push({ type: 'keyDown', value: m }));
            steps.push({ type: 'keyDown', value: wdKey(key) }, { type: 'keyUp', value: wdKey(key) });
            [...ms].reverse().forEach((m) => steps.push({ type: 'keyUp', value: m }));
            await perform([keys(steps)]);
        },
    };
}

// ---------------------------------------------------------------------------------------------
// Firefox, WebDriver BiDi. Launch: firefox --remote-debugging-port 9223 --profile <tmp> --no-remote
// ---------------------------------------------------------------------------------------------

export async function firefox({ port = 9223, launch = true } = {})
{
    let proc;

    if (launch)
    {
        const profile = mkdtempSync(join(tmpdir(), 'pixi-ui-qa-ff-'));

        proc = execFile('/Applications/Firefox.app/Contents/MacOS/firefox', [
            '--remote-debugging-port', String(port), '--profile', profile, '--no-remote', '--new-instance', 'about:blank',
        ]);
        await waitFor(() => fetch(`http://127.0.0.1:${port}/json`).then(() => true), 30000, 'Firefox remote agent')
            .catch(() => sleep(3000));
    }

    const rpc = jsonRpc(`ws://127.0.0.1:${port}/session`);

    await rpc.ready;
    await rpc.send('session.new', { capabilities: {} });
    const tree = await rpc.send('browsingContext.getTree', {});
    const context = tree.contexts[0].context;

    await rpc.send('browsingContext.setViewport', { context, viewport: { width: 1000, height: 760 } });
    // Firefox fires no focus or blur events while its window is not the active one.
    if (IS_MAC) await run('osascript', ['-e', 'tell application "Firefox" to activate']).catch(() => undefined);
    const perform = (actions) => rpc.send('input.performActions', { context, actions });
    const viewport = { w: 1000, h: 760 };

    return {
        name: 'firefox',
        touch: false,
        navigate: (url) => rpc.send('browsingContext.navigate', { context, url, wait: 'complete' }),
        async eval(js)
        {
            const r = await rpc.send('script.evaluate', {
                expression: `(async () => JSON.stringify(await (async () => (${js}))()))()`,
                target: { context }, awaitPromise: true, resultOwnership: 'none',
            });

            if (r.type === 'exception') throw new Error(`eval: ${r.exceptionDetails.text}`);

            return JSON.parse(r.result.value ?? 'null');
        },
        ...webdriverInput(perform, 'mouse', viewport),
        async wheel(x, y, dy)
        {
            await perform([{
                type: 'wheel', id: 'wheel', actions: [
                    { type: 'scroll', x: Math.round(x), y: Math.round(y), deltaX: 0, deltaY: dy, origin: 'viewport' }]
            }]);
        },
        compose: null,
        async close()
        {
            await rpc.send('session.end', {}).catch(() => undefined);
            rpc.close();
            proc?.kill();
        },
    };
}

// ---------------------------------------------------------------------------------------------
// Safari (macOS) and Safari on the iOS simulator, classic WebDriver through safaridriver.
// macOS: `safaridriver --enable` once. iOS: Settings > Safari > Advanced > Remote Automation on.
// ---------------------------------------------------------------------------------------------

async function classicWebDriver({ port, capabilities, name, touch })
{
    const proc = execFile('safaridriver', ['-p', String(port)]);
    const base = `http://127.0.0.1:${port}`;

    await waitFor(() => fetch(`${base}/status`).then((r) => r.ok), 10000, 'safaridriver');

    const call = async (method, path, body) =>
    {
        const res = await fetch(base + path, {
            method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body),
        });
        const json = await res.json();

        if (json.value && json.value.error) throw new Error(`${path}: ${json.value.error} ${json.value.message}`);

        return json.value;
    };
    const session = await call('POST', '/session', { capabilities: { alwaysMatch: capabilities } });
    const sid = session.sessionId;
    const perform = (actions) => call('POST', `/session/${sid}/actions`, { actions });
    const viewport = {};

    if (!touch)
    {
        await call('POST', `/session/${sid}/window/rect`, { width: 1000, height: 820 }).catch(() => undefined);
    }

    const script = 'const done = arguments[arguments.length - 1]; (async () => (%JS%))()'
        + '.then((v) => done(JSON.stringify(v)), (e) => done(JSON.stringify({ __error: String(e && e.stack || e) })));';

    return {
        name,
        touch,
        async navigate(url)
        {
            await call('POST', `/session/${sid}/url`, { url });
            const size = JSON.parse(await call('POST', `/session/${sid}/execute/sync`, {
                script: 'return JSON.stringify([innerWidth, innerHeight]);', args: [],
            }));

            [viewport.w, viewport.h] = size;
        },
        async eval(js)
        {
            const v = JSON.parse(await call('POST', `/session/${sid}/execute/async`, {
                script: script.replace('%JS%', js), args: [],
            }) ?? 'null');

            if (v && v.__error) throw new Error(`eval: ${v.__error}`);

            return v;
        },
        ...webdriverInput(perform, touch ? 'touch' : 'mouse', viewport),
        async wheel(x, y, dy)
        {
            await perform([{
                type: 'wheel', id: 'wheel', actions: [
                    { type: 'scroll', x: Math.round(x), y: Math.round(y), deltaX: 0, deltaY: dy, origin: 'viewport' }]
            }]);
        },
        compose: null,
        async close()
        {
            await call('DELETE', `/session/${sid}/actions`).catch(() => undefined);
            await call('DELETE', `/session/${sid}`).catch(() => undefined);
            proc.kill();
        },
    };
}

export const safari = ({ port = 4446 } = {}) => classicWebDriver({
    port, name: 'safari', touch: false, capabilities: { browserName: 'safari' },
});

export async function ios({ port = 4447, udid } = {})
{
    let device = udid;

    if (!device)
    {
        const { stdout } = await run('xcrun', ['simctl', 'list', 'devices', 'booted', '-j']);
        const booted = Object.values(JSON.parse(stdout).devices).flat().find((dev) => dev.state === 'Booted');

        if (!booted) throw new Error('no booted iOS simulator; boot one first');
        device = booted.udid;
    }

    return classicWebDriver({
        port,
        name: 'ios',
        touch: true,
        capabilities: {
            browserName: 'safari', platformName: 'iOS', 'safari:useSimulator': true, 'safari:deviceUDID': device,
        },
    });
}

// ---------------------------------------------------------------------------------------------
// Chrome over CDP: desktop Chrome launched with a temporary profile, or Chrome on an Android
// emulator through `adb forward`. On Android, text and editing keys go through adb, so they reach
// Chrome the way a hardware keyboard would; taps and drags are CDP touch events.
// ---------------------------------------------------------------------------------------------

const CDP_KEYS = {
    Backspace: { code: 'Backspace', keyCode: 8, command: 'deleteBackward' },
    Delete: { code: 'Delete', keyCode: 46, command: 'deleteForward' },
    Tab: { code: 'Tab', keyCode: 9 },
    Enter: { code: 'Enter', keyCode: 13, text: '\r' },
    Escape: { code: 'Escape', keyCode: 27 },
    ArrowLeft: { code: 'ArrowLeft', keyCode: 37, command: 'moveLeft' },
    ArrowRight: { code: 'ArrowRight', keyCode: 39, command: 'moveRight' },
    ArrowUp: { code: 'ArrowUp', keyCode: 38 },
    ArrowDown: { code: 'ArrowDown', keyCode: 40 },
    Home: { code: 'Home', keyCode: 36, command: 'moveToBeginningOfLine' },
    End: { code: 'End', keyCode: 35, command: 'moveToEndOfLine' },
};
const CDP_MOD_BITS = { Alt: 1, Control: 2, Meta: 4, Shift: 8 };

// Synthetic key events on macOS skip the system key bindings, so editing shortcuts have to name
// the editing command they stand for, the way puppeteer does.
function macCommand(key, mods)
{
    const m = new Set(mods);
    const shift = m.has('Shift') ? 'AndModifySelection' : '';

    if (m.has('Meta') && key.toLowerCase() === 'a') return 'selectAll';
    if (m.has('Meta') && key === 'ArrowLeft') return `moveToBeginningOfLine${shift}`;
    if (m.has('Meta') && key === 'ArrowRight') return `moveToEndOfLine${shift}`;
    if (m.has('Alt') && key === 'ArrowLeft') return `moveWordLeft${shift}`;
    if (m.has('Alt') && key === 'ArrowRight') return `moveWordRight${shift}`;
    if (key === 'ArrowLeft' || key === 'ArrowRight') return `${CDP_KEYS[key].command}${shift}`;
    if (m.size === 0) return CDP_KEYS[key]?.command;

    return undefined;
}

function cdpPage(rpc, { name, touch, adbKeys })
{
    const send = rpc.send;
    let mouse = [0, 0];

    const mouseEvent = (type, x, y, extra = {}) => send('Input.dispatchMouseEvent', { type, x, y, ...extra });
    const touchEvent = (type, points) => send('Input.dispatchTouchEvent', {
        type,
        touchPoints: points.map(([x, y]) => ({
            x: Math.round(x), y: Math.round(y), id: 1, radiusX: 4, radiusY: 4, force: 1,
        })),
    });
    const tap = async (x, y) =>
    {
        await touchEvent('touchStart', [[x, y]]);
        await sleep(40);
        await touchEvent('touchEnd', []);
    };

    const key = async (k, mods = []) =>
    {
        const ms = mods.map(resolveMod);
        const modifiers = ms.reduce((b, m) => b | (CDP_MOD_BITS[m] ?? 0), 0);
        const def = CDP_KEYS[k];
        const single = !def && [...k].length === 1;
        const command = IS_MAC && !touch ? macCommand(k, ms) : undefined;
        const base = def
            ? { key: k, code: def.code, windowsVirtualKeyCode: def.keyCode, nativeVirtualKeyCode: def.keyCode }
            : { key: k, code: `Key${k.toUpperCase()}`, windowsVirtualKeyCode: k.toUpperCase().charCodeAt(0) };
        const text = def?.text ?? (single && !(modifiers & 6) ? k : undefined);

        await send('Input.dispatchKeyEvent', {
            type: text ? 'keyDown' : 'rawKeyDown', modifiers, ...base, text, unmodifiedText: text,
            commands: command ? [command] : undefined,
        });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', modifiers, ...base });
    };

    return {
        name,
        touch,
        /** Raw CDP access, for screenshots and debugging. */
        cdp: send,
        async navigate(url)
        {
            await send('Page.navigate', { url });
            await sleep(500);
            await waitFor(async () => (await send('Runtime.evaluate', {
                expression: 'document.readyState', returnByValue: true,
            })).result.value === 'complete', 20000, 'page load');
        },
        async eval(js)
        {
            const r = await send('Runtime.evaluate', {
                expression: `(async () => JSON.stringify(await (async () => (${js}))()))()`,
                awaitPromise: true, returnByValue: true, userGesture: false,
            });

            const failure = r.exceptionDetails;

            if (failure) throw new Error(`eval: ${failure.exception?.description ?? failure.text}`);

            return JSON.parse(r.result.value ?? 'null');
        },
        async click(x, y, { button = 0, count = 1, gap = 60 } = {})
        {
            if (touch)
            {
                for (let i = 0; i < count; i++)
                {
                    await tap(x, y);
                    if (i < count - 1) await sleep(gap);
                }

                return;
            }
            const b = ['left', 'middle', 'right'][button];
            // `buttons` is a bitmask in which right is 2 and middle 4, unlike `button`.
            const mask = [1, 4, 2][button];

            await mouseEvent('mouseMoved', x, y);
            mouse = [x, y];
            for (let i = 1; i <= count; i++)
            {
                await mouseEvent('mousePressed', x, y, { button: b, buttons: mask, clickCount: i });
                await mouseEvent('mouseReleased', x, y, { button: b, buttons: 0, clickCount: i });
                if (i < count) await sleep(gap);
            }
        },
        async clicksAt(points, gap = 60)
        {
            for (const [i, [x, y]] of points.entries())
            {
                await this.click(x, y);
                if (i < points.length - 1) await sleep(gap);
            }
        },
        async drag(x1, y1, x2, y2, { holdMs = 0, steps = 8, pressMs = 0 } = {})
        {
            const at = (i) => [x1 + ((x2 - x1) * i / steps), y1 + ((y2 - y1) * i / steps)];

            if (touch)
            {
                await touchEvent('touchStart', [[x1, y1]]);
                if (pressMs) await sleep(pressMs);
                for (let i = 1; i <= steps; i++)
                {
                    await touchEvent('touchMove', [at(i)]);
                    await sleep(20);
                }
                if (holdMs) await sleep(holdMs);
                await touchEvent('touchEnd', []);

                return;
            }
            await mouseEvent('mouseMoved', x1, y1);
            await mouseEvent('mousePressed', x1, y1, { button: 'left', buttons: 1, clickCount: 1 });
            if (pressMs) await sleep(pressMs);
            for (let i = 1; i <= steps; i++)
            {
                await mouseEvent('mouseMoved', ...at(i), { button: 'left', buttons: 1 });
                await sleep(20);
            }
            if (holdMs) await sleep(holdMs);
            await mouseEvent('mouseReleased', x2, y2, { button: 'left', buttons: 0, clickCount: 1 });
            mouse = [x2, y2];
        },
        async shiftClick(x, y)
        {
            await mouseEvent('mouseMoved', x, y, { modifiers: 8 });
            await mouseEvent('mousePressed', x, y, { button: 'left', buttons: 1, clickCount: 1, modifiers: 8 });
            await mouseEvent('mouseReleased', x, y, { button: 'left', buttons: 0, clickCount: 1, modifiers: 8 });
        },
        async hover(x, y)
        {
            await mouseEvent('mouseMoved', x, y);
            mouse = [x, y];
        },
        async wheel(x, y, dy)
        {
            await mouseEvent('mouseWheel', x ?? mouse[0], y ?? mouse[1], { deltaX: 0, deltaY: dy });
        },
        async type(text)
        {
            if (adbKeys)
            {
                await adbKeys.text(text);

                return;
            }
            for (const ch of text)
            {
                if ([...ch].length === 1 && ch.length > 1)
                {
                    await send('Input.insertText', { text: ch });
                }
                else
                {
                    await key(ch);
                }
            }
        },
        async press(k, mods = [])
        {
            if (adbKeys && adbKeys.has(k) && mods.length === 0)
            {
                await adbKeys.key(k);

                return;
            }
            await key(k, mods);
        },
        /**
         * IME composition: compose `text` in steps, then commit it.
         * @param text
         */
        async compose(text)
        {
            for (let i = 1; i <= text.length; i++)
            {
                await send('Input.imeSetComposition', { text: text.slice(0, i), selectionStart: i, selectionEnd: i });
                await sleep(30);
            }
            await send('Input.insertText', { text });
        },
        async close()
        {
            rpc.close();
        },
    };
}

export async function chrome({ port = 9224, launch = true } = {})
{
    let proc;

    if (launch)
    {
        const profile = mkdtempSync(join(tmpdir(), 'pixi-ui-qa-chrome-'));

        proc = execFile('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
            `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run',
            '--no-default-browser-check', '--window-size=1000,860', 'about:blank',
        ]);
    }
    const page = await waitFor(async () =>
        (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'), 20000, 'Chrome');
    const rpc = jsonRpc(page.webSocketDebuggerUrl);

    await rpc.ready;
    await rpc.send('Page.enable');
    await rpc.send('Runtime.enable');
    await rpc.send('Page.bringToFront');
    const driver = cdpPage(rpc, { name: 'chrome', touch: false });
    const close = driver.close;

    driver.close = async () =>
    {
        await close();
        proc?.kill();
    };

    return driver;
}

const ADB_KEYCODES = { Backspace: 67, Enter: 66, Delete: 112, Tab: 61, Escape: 111, ArrowLeft: 21, ArrowRight: 22 };

export async function android({ port = 9333 } = {})
{
    const adb = (...args) => run('adb', args);

    await adb('forward', `tcp:${port}`, 'localabstract:chrome_devtools_remote');
    const sbPort = new URL(process.env.QA_STORYBOOK ?? 'http://localhost:6006').port || '80';

    await adb('reverse', `tcp:${sbPort}`, `tcp:${sbPort}`);
    // Chrome has to be running for the devtools socket to exist. The runner then opens a tab of its
    // own and brings it to the front: a background tab is throttled and never finishes a run.
    await adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'about:blank', 'com.android.chrome');
    const page = await waitFor(async () =>
        (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json(), 20000, 'Android Chrome');

    await fetch(`http://127.0.0.1:${port}/json/activate/${page.id}`);
    const rpc = jsonRpc(page.webSocketDebuggerUrl);

    await rpc.ready;
    await rpc.send('Page.enable');
    await rpc.send('Runtime.enable');
    const adbKeys = {
        has: (k) => k in ADB_KEYCODES,
        key: (k) => adb('shell', 'input', 'keyevent', String(ADB_KEYCODES[k])),
        // `input text` takes %s for a space and needs shell metacharacters escaped.
        text: (t) => adb('shell', 'input', 'text', `'${t.replace(/ /g, '%s').replace(/'/g, '\'\\\'\'')}'`),
    };

    const driver = cdpPage(rpc, { name: 'android', touch: true, adbKeys });
    const close = driver.close;

    // Every run opens a tab; leaving them behind soon starves the emulator's Chrome.
    driver.close = async () =>
    {
        await close();
        await fetch(`http://127.0.0.1:${port}/json/close/${page.id}`).catch(() => undefined);
    };

    return driver;
}

export const DRIVERS = { chrome, firefox, safari, ios, android };

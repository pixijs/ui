// Long lines are page scripts evaluated in the browser; wrapping them would not make them clearer.
/* eslint-disable max-len */
// Code evaluated inside the Storybook iframe. It finds components on the Pixi stage and maps their
// local coordinates to viewport CSS pixels, so the suites can aim real pointer input at them.
export const STORYBOOK = process.env.QA_STORYBOOK ?? 'http://localhost:6006';

export const storyUrl = (id, args = '') =>
    `${STORYBOOK}/iframe.html?id=${id}&viewMode=story${args ? `&args=${args}` : ''}`;

export const PAGE_HELPERS = `(() => {
  if (window.__qa) return true;
  const app = () => window.__PIXI_APP__;
  const canvas = () => app().canvas || app().view;
  const chain = (o) => { const names = []; let p = o && Object.getPrototypeOf(o); while (p && p.constructor && p.constructor !== Object) { names.push(p.constructor.name); p = Object.getPrototypeOf(p); } return names; };
  const toViewport = (x, y) => { const r = canvas().getBoundingClientRect(); const s = r.width / app().screen.width; return [r.left + x * s, r.top + y * s]; };
  window.__qaErrors = window.__qaErrors || [];
  window.addEventListener('error', (e) => window.__qaErrors.push(String(e.message)));
  window.addEventListener('unhandledrejection', (e) => window.__qaErrors.push('unhandled: ' + String(e.reason)));
  const origError = console.error.bind(console);
  console.error = (...a) => { window.__qaErrors.push('console.error: ' + a.map(String).join(' ').slice(0, 300)); origError(...a); };
  window.__qa = {
    chain,
    all(name) { const out = []; const walk = (c) => { if (chain(c).includes(name)) out.push(c); for (const ch of (c.children || [])) walk(ch); }; walk(app().stage); return out; },
    find(name, n = 0) { return this.all(name)[n]; },
    // Viewport point of a local point of a display object.
    point(obj, lx, ly) { const p = obj.toGlobal({ x: lx, y: ly }); return toViewport(p.x, p.y); },
    // Viewport point at fractions of an object's global bounds.
    at(obj, fx = 0.5, fy = 0.5) { const b = obj.getBounds(); return toViewport(b.x + b.width * fx, b.y + b.height * fy); },
    bounds(obj) { const b = obj.getBounds(); const [x, y] = toViewport(b.x, b.y); const [x2, y2] = toViewport(b.x + b.width, b.y + b.height); return { x, y, w: x2 - x, h: y2 - y }; },
    screen() { const r = canvas().getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; },
    summary() { const names = {}; const walk = (c) => { const n = c.constructor.name; if (/^(Input|CheckBox|RadioGroup|Switcher|Slider|DoubleSlider|Select|Dialog|Drawer|ScrollBox|List|ProgressBar|CircularProgressBar|MaskedFrame|FancyButton|ButtonContainer|Button)$/.test(n)) names[n] = (names[n] || 0) + 1; for (const ch of (c.children || [])) walk(ch); }; walk(app().stage); return names; },
    errors() { return window.__qaErrors.slice(); },
  };
  return true;
})()`;

/**
 * Navigates to a story and waits until Pixi has drawn something, then installs the helpers.
 * @param d
 * @param id
 * @param args
 */
export async function loadStory(d, id, args = '')
{
    await d.navigate(storyUrl(id, args));
    for (let n = 0; n < 60; n++)
    {
        const ready = await d.eval('!!(window.__PIXI_APP__ && window.__PIXI_APP__.stage.children.length)').catch(() => false);

        if (ready) break;
        await new Promise((r) => setTimeout(r, 250));
    }
    await new Promise((r) => setTimeout(r, 600));
    await d.eval(PAGE_HELPERS);
}

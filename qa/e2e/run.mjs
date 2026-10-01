/* eslint-disable no-console */
// Release E2E runner. Usage:
//   node qa/e2e/run.mjs <chrome|firefox|safari|ios|android> [input|components|smoke|all]
// Storybook must be running (npm run storybook); set QA_STORYBOOK to use another URL.
// Writes qa/results/<browser>-<suite>.json and exits non-zero when a case fails.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentsSuite } from './components.mjs';
import { DRIVERS } from './drivers.mjs';
import { inputSuite } from './input.mjs';

const [browser, suite = 'all'] = process.argv.slice(2);

if (!DRIVERS[browser])
{
    console.error(`usage: node qa/e2e/run.mjs <${Object.keys(DRIVERS).join('|')}> [input|components|smoke|all]`);
    process.exit(2);
}

const results = [];
// `pass` is true, false, or null for a case the environment cannot check (reported as SKIP).
const record = (id, title, pass, detail) =>
{
    let status = pass ? 'PASS' : 'FAIL';

    if (pass === null) status = 'SKIP';

    results.push({ id, title, status, detail });
    console.log(`${status}  ${id}  ${title}${status === 'PASS' ? '' : `  ->  ${JSON.stringify(detail)}`}`);
};

const d = await DRIVERS[browser]();
const started = Date.now();

try
{
    console.log(`browser: ${browser} ${await d.eval('navigator.userAgent').catch(() => '?')}`);
    if (suite === 'input' || suite === 'all') await inputSuite(d, record);
    if (suite === 'components' || suite === 'all') await componentsSuite(d, record);
    if (suite === 'smoke') await componentsSuite(d, record, { only: 'smoke' });
}
catch (e)
{
    record('RUNNER', 'suite ran to the end', false, String(e.stack ?? e));
}
finally
{
    await d.close().catch(() => undefined);
}

const failed = results.filter((r) => r.status === 'FAIL');
const skipped = results.filter((r) => r.status === 'SKIP');
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'results');

mkdirSync(out, { recursive: true });
writeFileSync(join(out, `${browser}-${suite}.json`), JSON.stringify({
    browser, suite, date: new Date().toISOString(), seconds: Math.round((Date.now() - started) / 1000), results,
}, null, 2));
console.log(`\n${results.length} cases, ${results.length - failed.length - skipped.length} passed, `
    + `${failed.length} failed, ${skipped.length} skipped`);
process.exit(failed.length ? 1 : 0);

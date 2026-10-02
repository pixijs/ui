// Type-checks the declarations in `lib/` with TypeScript 7, through the entry point
// consumers import and with no ambient `@types` packages, so anything our `.d.ts`
// files reference but never declare fails here rather than in someone else's project.
//
// `skipLibCheck` is off, which is what gives this teeth - a bad type on a `protected`
// member only ever surfaces as a diagnostic inside a `.d.ts` file. The cost is that
// our dependencies' declarations get checked too, and we cannot fix those: pixi.js
// below v8.21.0, for one, referenced `@webgpu/types` and collides in the hundreds
// with the WebGPU types now built into `lib.dom.d.ts`. So diagnostics from outside
// this repo are reported as a count but do not fail the check - an upstream
// regression should not be able to block a release here.

/* eslint-disable no-console -- this is a CLI reporter; the console is its output. */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const tsc = path.join(root, 'node_modules', 'typescript-7', 'bin', 'tsc');
const project = path.join(root, 'tests', 'declarations', 'tsconfig.json');

if (!existsSync(path.join(root, 'lib', 'index.d.ts')))
{
    console.error('No declarations to check. Run `npm run build` first.');
    process.exit(1);
}

// Every subpath in the `exports` map promises a `types` target. consumer.ts pulls the
// declaration *content* in through the root entry, which re-exports everything, so what
// is left to check is that each entry points at a file that exists - a subpath whose
// `types` is a typo resolves to nothing and the import silently falls back to `any`.
const { exports: exportsMap } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const missing = Object.entries(exportsMap)
    .filter(([, entry]) => entry?.types)
    .filter(([, entry]) => !existsSync(path.join(root, entry.types)))
    .map(([subpath, entry]) => `  ${subpath} -> ${entry.types}`);

if (missing.length > 0)
{
    console.error('These `exports` entries point at declarations that were not built:\n');
    missing.forEach((line) => console.error(line));
    process.exit(1);
}

const child = spawn(process.execPath, [tsc, '-p', project, '--pretty', 'false'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'inherit'],
});

let output = '';

child.stdout.setEncoding('utf8');
child.stdout.on('data', (chunk) => (output += chunk));

child.on('error', (error) =>
{
    console.error(error.message);
    process.exit(1);
});

child.on('close', (code) =>
{
    // Diagnostics look like `path(line,col): error TSxxxx: message`, with paths
    // relative to `cwd`. Ours are the ones that stay inside the repo.
    const isDiagnostic = (/^\S.*\(\d+,\d+\): error TS\d+:/);
    const diagnostics = output.split('\n').filter((line) => isDiagnostic.test(line));
    const ours = diagnostics.filter((line) =>
    {
        const file = line.slice(0, line.indexOf('('));

        return !file.startsWith('..') && !file.includes('node_modules');
    });

    if (ours.length > 0)
    {
        console.error('The declarations in lib/ are not clean under TypeScript 7:\n');
        ours.forEach((line) => console.error(`  ${line}`));
        process.exit(1);
    }

    if (diagnostics.length === 0 && code !== 0)
    {
        // tsc failed for a reason we cannot attribute to a file, a malformed project
        // file for instance. Surface it verbatim.
        console.error(output.trim() || `tsc exited with code ${code}.`);
        process.exit(1);
    }

    const upstream = diagnostics.length - ours.length;

    const subpaths = Object.keys(exportsMap).filter((key) => exportsMap[key]?.types).length;

    console.log(`lib/ type-checks under TypeScript 7 across ${subpaths} \`exports\` entries`
        + ` (ignored ${upstream} diagnostic(s) from dependencies).`);
});

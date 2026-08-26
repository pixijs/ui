// Type-checks the declarations in `lib/` with TypeScript 7, through the entry point
// consumers import and with no ambient `@types` packages, so anything our `.d.ts`
// files reference but never declare fails here rather than in someone else's project.
//
// `skipLibCheck` is off, which is what gives this teeth - a bad type on a `protected`
// member only ever surfaces as a diagnostic inside a `.d.ts` file. The cost is that
// pixi.js's declarations get checked too, and on TypeScript 7 they are not clean:
// pixi.js pulls in `@webgpu/types`, which collides with the WebGPU types now built
// into `lib.dom.d.ts`. That is upstream of us and a pixi.js user hits it with or
// without this package, so diagnostics from outside this repo are reported as a
// count but do not fail the check.

/* eslint-disable no-console -- this is a CLI reporter; the console is its output. */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
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

    console.log(`lib/ type-checks under TypeScript 7 (ignored ${upstream} diagnostic(s) from dependencies).`);
});

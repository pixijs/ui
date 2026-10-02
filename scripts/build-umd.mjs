/**
 * Rebuilds the browser (IIFE/UMD-style) bundle `dist/pixi-ui.js` so that it is self-contained apart from
 * `pixi.js`: tweedle.js is bundled in instead of being expected as a `tweedle_js` global.
 *
 * `xs build` marks every entry of `dependencies` as external and offers no way to change that for the
 * browser bundle only, so this runs after it and overwrites the file. The ESM/CJS builds in `lib/` and
 * `dist/pixi-ui.mjs` are untouched and still list tweedle.js as a regular dependency.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

// These are installed as dependencies of @pixi/extension-scripts, the tool that produces the other bundles
const require = createRequire(path.join(process.cwd(), 'node_modules/@pixi/extension-scripts/package.json'));
const { rollup } = require('rollup');
const esbuild = require('rollup-plugin-esbuild');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const file = 'dist/pixi-ui.js';

const banner = [
    '/*!',
    ` * ${pkg.name} - v${pkg.version}`,
    ` * Compiled ${new Date().toUTCString().replace(/GMT/g, 'UTC')}`,
    ' *',
    ` * ${pkg.name} is licensed under the MIT License.`,
    ' * http://www.opensource.org/licenses/mit-license',
    ' *',
    ` * Copyright ${new Date().getFullYear()}, ${pkg.author}, All Rights Reserved`,
    ' */',
].join('\n');

const bundle = await rollup({
    input: 'src/index.ts',
    // pixi.js is a peer dependency and must stay the host page's copy; everything else is bundled
    external: ['pixi.js'],
    plugins: [
        commonjs(),
        (resolve.default ?? resolve)(),
        (esbuild.default ?? esbuild)({ target: 'ES2017', minify: true }),
    ],
});

await bundle.write({
    banner,
    file,
    format: 'iife',
    name: 'PIXI.ui',
    globals: { 'pixi.js': 'PIXI' },
    sourcemap: true,
    exports: 'named',
});
await bundle.close();

console.log(`[build-umd] ${file} bundles tweedle.js; only the PIXI global is required`);

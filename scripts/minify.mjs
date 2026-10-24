// Minifies the built Jekyll site in place: HTML (with inline CSS/JS), JS, and the service worker.
// CSS is already compressed by Sass (see `sass.style` in _config.yml).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { minify as minifyHtml } from 'html-minifier-terser';
import { minify as minifyJs } from 'terser';

const root = process.argv[2] ?? '_site';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let before = 0;
let after = 0;

for await (const file of walk(root)) {
  const ext = extname(file);
  if (ext !== '.html' && ext !== '.js') continue;
  if (file.endsWith('.min.js')) continue;

  const source = await readFile(file, 'utf8');
  let output;
  if (ext === '.html') {
    output = await minifyHtml(source, {
      collapseWhitespace: true,
      conservativeCollapse: false,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      keepClosingSlash: true,
      // <dialog> form fields and <pre> keep their whitespace
      ignoreCustomFragments: [/<pre[\s\S]*?<\/pre>/],
    });
  } else {
    output = (await minifyJs(source, { compress: true, mangle: true })).code;
  }

  before += Buffer.byteLength(source);
  after += Buffer.byteLength(output);
  await writeFile(file, output);
}

const pct = before ? (((before - after) / before) * 100).toFixed(1) : '0';
console.log(`minified ${before} -> ${after} bytes (${pct}% smaller)`);

// Next 16 static export writes RSC segment files as `__next.<seg>/<file>.txt`, but the client
// prefetches `__next.<seg>.<file>.txt`. Copy each nested file to the flat name so static hosts
// (GitHub Pages) serve it instead of 404-ing and falling back to full page loads.
import fs from 'node:fs';
import path from 'node:path';
let n = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    if (e.name.startsWith('__next.')) flatten(p, e.name, dir);
    else if (e.name !== '_next') walk(p);
  }
}
function flatten(dir, prefix, root) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    const name = `${prefix}.${e.name}`;
    if (e.isDirectory()) flatten(p, name, root);
    else if (e.name.endsWith('.txt')) { fs.copyFileSync(p, path.join(root, name)); n++; }
  }
}
walk('out');
console.log(`fix-rsc-paths: wrote ${n} flat segment files`);

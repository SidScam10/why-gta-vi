// Serves ./out under /why-gta-vi/ to mimic GitHub Pages. Usage: npm run build && npm run preview
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const BASE = '/why-gta-vi';
const ROOT = path.resolve('out');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain' };
http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/') { res.writeHead(302, { Location: BASE + '/' }); return res.end(); }
  if (!url.startsWith(BASE)) { res.writeHead(404); return res.end('Not under ' + BASE); }
  let p = path.join(ROOT, url.slice(BASE.length));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { res.writeHead(404, { 'Content-Type': 'text/html' }); return res.end(fs.readFileSync(path.join(ROOT, '404.html'))); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(4173, () => console.log(`http://localhost:4173${BASE}/`));

// Generates original gradient SVG placeholders into public/img/placeholder/. Safe to delete once real media exists.
import fs from 'node:fs';
const out = 'public/img/placeholder';
fs.mkdirSync(out, { recursive: true });
const palettes = [
  ['#ff8a5c', '#ff5fa8', '#2c284b'], ['#2c284b', '#7a3cff', '#ff6fb5'], ['#0f0e1a', '#3b2d6b', '#f2e6b6'],
  ['#ff5fa8', '#ffb36b', '#161527'], ['#13304a', '#2bb3c0', '#ffd27a'], ['#401a3d', '#ff6f91', '#ffc6a8'],
];
const items = [
  ['hero', 2400, 1350], ['hero-mobile', 900, 1600], ['ch-1', 2400, 1350], ['ch-2', 2400, 1350], ['ch-3', 2400, 1350], ['ch-4', 2400, 1350],
  ['inset', 1600, 1000], ['pair-a', 1200, 1500], ['pair-b', 1200, 1500], ['grid-1', 1200, 900], ['grid-2', 1200, 900], ['grid-3', 1200, 900], ['grid-4', 1200, 900],
  ['wide', 2400, 1200], ['m-1', 1000, 1300], ['m-2', 1200, 800], ['m-3', 1000, 1000], ['m-4', 1000, 1400], ['m-5', 1200, 900], ['m-6', 1000, 1200],
  ['step-1', 1200, 1500], ['step-2', 1200, 1500], ['step-3', 1200, 1500], ['loop-poster', 1280, 720], ['thumb', 1200, 800],
];
items.forEach(([name, w, h], i) => {
  const [a, b, c] = palettes[i % palettes.length];
  const r = Math.min(w, h);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>
<radialGradient id="s" cx=".7" cy=".75" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/><circle cx="${w * 0.7}" cy="${h * 0.62}" r="${r * 0.28}" fill="url(#s)"/>
<path d="M0 ${h * 0.82} Q ${w * 0.25} ${h * 0.74} ${w * 0.5} ${h * 0.8} T ${w} ${h * 0.78} V ${h} H 0 Z" fill="${c}" opacity=".55"/>
<text x="50%" y="50%" fill="#fff" fill-opacity=".55" font-family="sans-serif" font-size="${r * 0.06}" text-anchor="middle" letter-spacing="${r * 0.01}">PLACEHOLDER · ${name.toUpperCase()}</text></svg>`;
  fs.writeFileSync(`${out}/${name}.svg`, svg);
});
console.log(`wrote ${items.length} placeholders to ${out}`);

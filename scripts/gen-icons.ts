import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");

function svgIcon(size: number, padding = 0): string {
  const inner = size - padding * 2;
  const radius = Math.round(size * 0.2);
  const cardRadius = Math.round(size * 0.055);
  const stroke = Math.max(6, Math.round(size * 0.028));
  const smallStroke = Math.max(4, Math.round(size * 0.018));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="tile" x1="${padding}" y1="${padding}" x2="${padding + inner}" y2="${padding + inner}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#22c55e"/>
      <stop offset="0.5" stop-color="#16a34a"/>
      <stop offset="1" stop-color="#0f766e"/>
    </linearGradient>
    <linearGradient id="card" x1="${padding + inner * 0.18}" y1="${padding + inner * 0.17}" x2="${padding + inner * 0.82}" y2="${padding + inner * 0.78}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#ecfdf5"/>
    </linearGradient>
    <linearGradient id="accent" x1="${padding + inner * 0.25}" y1="${padding + inner * 0.33}" x2="${padding + inner * 0.75}" y2="${padding + inner * 0.7}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#facc15"/>
      <stop offset="1" stop-color="#f97316"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="${Math.round(size * 0.045)}" stdDeviation="${Math.round(size * 0.04)}" flood-color="#064e3b" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" fill="#ecfdf5"/>
  <rect x="${padding}" y="${padding}" width="${inner}" height="${inner}" rx="${radius}" fill="url(#tile)"/>
  <path
    d="M ${padding + inner * 0.07} ${padding + inner * 0.57} C ${padding + inner * 0.21} ${padding + inner * 0.13}, ${padding + inner * 0.63} ${padding - inner * 0.01}, ${padding + inner * 0.93} ${padding + inner * 0.21} L ${padding + inner * 0.93} ${padding + inner * 0.93} C ${padding + inner * 0.72} ${padding + inner * 0.77}, ${padding + inner * 0.33} ${padding + inner * 0.9}, ${padding + inner * 0.07} ${padding + inner * 0.57} Z"
    fill="#ffffff"
    opacity="0.13"
  />
  <g filter="url(#shadow)">
    <rect
      x="${padding + inner * 0.19}"
      y="${padding + inner * 0.19}"
      width="${inner * 0.5}"
      height="${inner * 0.62}"
      rx="${cardRadius}"
      fill="#064e3b"
      opacity="0.28"
      transform="rotate(-9 ${padding + inner * 0.44} ${padding + inner * 0.5})"
    />
    <rect
      x="${padding + inner * 0.28}"
      y="${padding + inner * 0.17}"
      width="${inner * 0.54}"
      height="${inner * 0.66}"
      rx="${cardRadius}"
      fill="url(#card)"
      transform="rotate(7 ${padding + inner * 0.55} ${padding + inner * 0.5})"
    />
    <path
      d="M ${padding + inner * 0.39} ${padding + inner * 0.42} C ${padding + inner * 0.46} ${padding + inner * 0.34}, ${padding + inner * 0.56} ${padding + inner * 0.34}, ${padding + inner * 0.63} ${padding + inner * 0.42} C ${padding + inner * 0.7} ${padding + inner * 0.34}, ${padding + inner * 0.8} ${padding + inner * 0.34}, ${padding + inner * 0.87} ${padding + inner * 0.42}"
      fill="none"
      stroke="#15803d"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="${stroke}"
      transform="rotate(7 ${padding + inner * 0.63} ${padding + inner * 0.42})"
    />
    <path
      d="M ${padding + inner * 0.45} ${padding + inner * 0.32} L ${padding + inner * 0.79} ${padding + inner * 0.32}"
      fill="none"
      stroke="url(#accent)"
      stroke-linecap="round"
      stroke-width="${smallStroke}"
      transform="rotate(7 ${padding + inner * 0.62} ${padding + inner * 0.32})"
    />
    <path
      d="M ${padding + inner * 0.4} ${padding + inner * 0.62} L ${padding + inner * 0.76} ${padding + inner * 0.62} M ${padding + inner * 0.43} ${padding + inner * 0.72} L ${padding + inner * 0.68} ${padding + inner * 0.72}"
      fill="none"
      stroke="#0f766e"
      stroke-linecap="round"
      stroke-width="${smallStroke}"
      opacity="0.65"
      transform="rotate(7 ${padding + inner * 0.59} ${padding + inner * 0.67})"
    />
  </g>
</svg>`;
}

type Spec = { name: string; size: number; padding: number };

const SPECS: Spec[] = [
  { name: "icon-192.png", size: 192, padding: 0 },
  { name: "icon-512.png", size: 512, padding: 0 },
  // Maskable: 20% safe zone padding so the F survives any platform mask shape.
  { name: "icon-maskable-192.png", size: 192, padding: 38 },
  { name: "icon-maskable-512.png", size: 512, padding: 102 },
  { name: "apple-touch-icon.png", size: 180, padding: 0 },
];

async function main() {
  await mkdir(PUBLIC, { recursive: true });
  for (const spec of SPECS) {
    const svg = Buffer.from(svgIcon(spec.size, spec.padding));
    const out = path.join(PUBLIC, spec.name);
    await sharp(svg).png({ compressionLevel: 9 }).toFile(out);
    console.log(`✓ ${spec.name} (${spec.size}×${spec.size})`);
  }
  // Inline SVG copy for the favicon route.
  await writeFile(path.join(PUBLIC, "icon.svg"), svgIcon(512, 0), "utf8");
  console.log("✓ icon.svg (vector)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

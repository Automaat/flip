import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");

function svgIcon(size: number, padding = 0): string {
  const inner = size - padding * 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0a0a0a"/>
      <stop offset="1" stop-color="#1f1f1f"/>
    </linearGradient>
    <linearGradient id="fg" x1="0" y1="${padding}" x2="0" y2="${padding + inner}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fbbf24"/>
      <stop offset="1" stop-color="#f97316"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="url(#bg)"/>
  <text
    x="50%"
    y="54%"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="-apple-system, system-ui, sans-serif"
    font-weight="800"
    font-size="${Math.round(inner * 0.68)}"
    fill="url(#fg)"
  >F</text>
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

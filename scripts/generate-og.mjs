import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const cards = [
  ["assets/og/patrik-doczy.svg", "public/og/patrik-doczy.png"],
  ["assets/og/voleq.svg", "public/og/voleq.png"],
];

let failed = false;

for (const [source, destination] of cards) {
  const svg = await readFile(resolve(root, source));
  const png = await sharp(svg, { density: 144 })
    .resize(1200, 630, { fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: false, palette: false })
    .toBuffer();

  if (check) {
    const existing = await readFile(resolve(root, destination));
    if (!png.equals(existing)) {
      console.error(`${destination} is not reproducible from ${source}`);
      failed = true;
    }
  } else {
    await writeFile(resolve(root, destination), png);
    console.log(`Generated ${destination}`);
  }
}

if (failed) process.exit(1);

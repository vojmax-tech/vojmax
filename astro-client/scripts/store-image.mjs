/**
 * Add a product cover to the store.
 *
 *   npm run store:image -- <slug> <image-url-or-path>
 *
 * Downloads (or reads) the image, fits it inside a 1600x1000 frame without
 * cropping the product, and saves it as public/store/<slug>-main.png, which
 * ProductCard and the product page pick up automatically.
 *
 * Official product shots usually sit on a plain background, so the frame is
 * filled with the colour of the image's top-left pixel and the padding blends
 * in. Only use images you are allowed to: the brand's own product photos or
 * your supplier's image pack, not another shop's photos.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [slug, source] = process.argv.slice(2);

if (!slug || !source) {
  console.error("Usage: npm run store:image -- <slug> <image-url-or-path>");
  process.exit(1);
}

const input = /^https?:\/\//.test(source)
  ? Buffer.from(
      await fetch(source).then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
        return res.arrayBuffer();
      }),
    )
  : await fs.readFile(source);

const { data } = await sharp(input)
  .extract({ left: 0, top: 0, width: 1, height: 1 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const background = { r: data[0], g: data[1], b: data[2], alpha: 1 };

const out = path.join(process.cwd(), "public", "store", `${slug}-main.png`);

// Leave some breathing room around the product, then pad out to 16:10.
const inner = await sharp(input)
  .flatten({ background })
  .resize(1360, 850, { fit: "inside", withoutEnlargement: false })
  .toBuffer();

await sharp({ create: { width: 1600, height: 1000, channels: 4, background } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile(out);

console.log(`Saved ${path.relative(process.cwd(), out)}`);

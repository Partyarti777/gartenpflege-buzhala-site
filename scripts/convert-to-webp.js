// One-shot WebP-Konvertierung der Vorher/Nachher-Galerie-Bilder.
// Erzeugt fuer jedes p0[1-9]-*.jpg eine .webp-Datei in derselben Groesse.
// Idempotent: ueberschreibt vorhandene .webp-Dateien.
//
// Aufruf: node scripts/convert-to-webp.js
//   Optional: --quality=80   (default 80, gute Qualitaet / 30-50% kleiner)
//
// Voraussetzung: npm install sharp (siehe package.json)

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v];
  })
);
const QUALITY = Number(args.quality || 75);

const GALLERY_DIRS = [
  // Galerie Vorher/Nachher (40 Bilder: 10 Projekte x vorher/nachher x 540w/1200w)
  path.join(__dirname, '..', 'images', 'vorher-nachher'),
];

async function convertOne(srcPath) {
  const ext = path.extname(srcPath);
  const dst = srcPath.slice(0, -ext.length) + '.webp';
  if (!fs.existsSync(srcPath)) return null;
  if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs > fs.statSync(srcPath).mtimeMs) {
    return { src: srcPath, dst, skipped: true };
  }
  await sharp(srcPath)
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(dst);
  const before = fs.statSync(srcPath).size;
  const after = fs.statSync(dst).size;
  return {
    src: path.basename(srcPath),
    dst: path.basename(dst),
    before,
    after,
    savedPct: Math.round((1 - after / before) * 100),
  };
}

(async () => {
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;
  for (const dir of GALLERY_DIRS) {
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.jpg'))
      .sort();
    for (const file of files) {
      const src = path.join(dir, file);
      try {
        const r = await convertOne(src);
        if (!r) continue;
        if (r.skipped) {
          console.log(`SKIP  ${r.src} (webp neuer als jpg)`);
          continue;
        }
        totalBefore += r.before;
        totalAfter += r.after;
        count++;
        console.log(
          `OK    ${r.src} (${(r.before / 1024).toFixed(0)}KB) -> ${r.dst} (${(r.after / 1024).toFixed(0)}KB, -${r.savedPct}%)`
        );
      } catch (err) {
        console.error(`FAIL  ${file}: ${err.message}`);
      }
    }
  }
  const saved = totalBefore - totalAfter;
  console.log(
    `\nFertig: ${count} konvertiert. Gesamt-Ersparnis: ${(saved / 1024).toFixed(0)}KB (${totalBefore > 0 ? Math.round((saved / totalBefore) * 100) : 0}%)`
  );
})();
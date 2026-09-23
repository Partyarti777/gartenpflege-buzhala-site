// Einmal-Script: packt alle Vorher/Nachher-Galerie-<img>-Tags in <picture>
// mit WebP-<source> + JPEG-<img>-Fallback. Idempotent (matched nur noch-nicht
// gewrappte <img>-Tags, weil schon gewrappte als <picture>...</picture> vorliegen).
//
// Aufruf: node scripts/add-picture-tag.js

const fs = require('fs');
const path = require('path');

const HTML = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(HTML, 'utf8');

// Match: einzelnes <img>-Tag der Galerie (nicht in <picture>):
//   class="vn-img vn-photo"
//   src="images/vorher-nachher/..." (.jpg)
//   srcset="images/vorher-nachher/...-540.jpg 540w, images/vorher-nachher/....jpg 1200w"
//   sizes="..."
//   alt="..."
//   width="1200" height="900" loading="lazy"
//
// Wir packen es in <picture> + <source type="image/webp">.
// Capture-Groups: 1=src, 2=basename, 3=srcset, 4=sizes, 5=alt.
const re =
  /<img class="vn-img vn-photo[^"]*" src="(images\/vorher-nachher\/([^"]+\.jpg))" srcset="(images\/vorher-nachher\/[^"]+\.jpg[^"]+)" sizes="([^"]*)" alt="([^"]*)" width="1200" height="900" loading="lazy" \/>/g;

let count = 0;
const updated = html.replace(re, (_match, src, _basename, srcset, sizes, alt) => {
  // WebP-Version des srcset (jpg -> webp)
  const srcsetWebp = srcset.replace(/\.jpg/g, '.webp');
  count++;
  return (
    `<picture>` +
    `<source type="image/webp" srcset="${srcsetWebp}" sizes="${sizes}" />` +
    `<img class="vn-img vn-photo" src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${alt}" width="1200" height="900" loading="lazy" />` +
    `</picture>`
  );
});

if (count === 0) {
  console.log('Keine Galerie-<img>-Tags gefunden (bereits alle in <picture>?).');
  process.exit(0);
}

fs.writeFileSync(HTML, updated, 'utf8');
console.log(`OK: ${count} Galerie-<img>-Tags in <picture> umgewickelt.`);
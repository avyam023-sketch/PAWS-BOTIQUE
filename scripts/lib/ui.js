/* Small HTML helpers shared by the page templates. */
const fs = require("fs");
const path = require("path");

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const icon = {
  paw: `<svg viewBox="0 0 64 64" aria-hidden="true" fill="currentColor"><ellipse cx="32" cy="43" rx="14" ry="12"/><ellipse cx="13.5" cy="27" rx="6" ry="8" transform="rotate(-22 13.5 27)"/><ellipse cx="25" cy="15.5" rx="6.2" ry="8.6" transform="rotate(-7 25 15.5)"/><ellipse cx="39" cy="15.5" rx="6.2" ry="8.6" transform="rotate(7 39 15.5)"/><ellipse cx="50.5" cy="27" rx="6" ry="8" transform="rotate(22 50.5 27)"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  back: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.8 1.8 0 0 1-1.9 1.8C10.3 20.3 3.7 13.7 3.2 5.4A1.8 1.8 0 0 1 5 3.5Z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.2Z"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="check-path" d="M4.5 12.5l4.8 4.8L19.5 7"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`,
};

// Real photos win over the coat-colour art: drop <id>.webp (or .jpg/.png) into src/assets/img/breeds/.
const IMG_DIR = path.resolve(__dirname, "../../src/assets/img/breeds");
function photo(id) {
  for (const ext of ["webp", "jpg", "jpeg", "png"]) if (fs.existsSync(path.join(IMG_DIR, `${id}.${ext}`))) return `assets/img/breeds/${id}.${ext}`;
  return null;
}

function breedArt(b, root, { eager = false } = {}) {
  const src = photo(b.id);
  if (src) return `<img src="${root}${src}" alt="${esc(b.name)} puppy" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  return `<div class="art" style="--c1:${b.coat[0]};--c2:${b.coat[1]}" role="img" aria-label="${esc(b.name)}">
      <span class="art__initial" aria-hidden="true">${esc(b.name[0])}</span>
      <span class="art__paw">${icon.paw}</span>
    </div>`;
}

const heatLabel = { good: "Handles heat well", moderate: "Fine with care in summer", ac: "Needs AC in summer" };

function card(b, data, root) {
  const size = data.sizes.find((s) => s.id === b.size);
  const href = `${root}breeds/${b.id}.html`;
  return `<article class="card" data-card data-size="${b.size}" data-flat="${b.flat}" data-heat="${b.heat}" data-search="${esc([b.name, b.origin, size.label, ...b.traits].join(" ").toLowerCase())}">
  <a class="card__media" href="${href}" data-cursor="Meet" tabindex="-1" aria-hidden="true">
    ${breedArt(b, root)}
    <span class="card__size">${size.label}</span>
  </a>
  <div class="card__body">
    <p class="card__origin">${esc(b.origin)}</p>
    <h3 class="card__name"><a href="${href}">${esc(b.name)}</a></h3>
    <ul class="card__traits">${b.traits.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <dl class="card__specs">
      <div><dt>Lifespan</dt><dd>${esc(b.life)}</dd></div>
      <div><dt>Adult weight</dt><dd>${esc(b.weight)}</dd></div>
    </dl>
    <button class="btn btn--price" type="button" data-quote-open="${b.id}" data-cursor="Price">
      <span>View Price</span>${icon.arrow}
    </button>
  </div>
</article>`;
}

// Split a phrase into masked lines for the rise-in headline animation.
const lines = (arr) => arr.map((l) => `<span class="line"><span>${l}</span></span>`).join("");

module.exports = { esc, icon, photo, breedArt, card, lines, heatLabel };

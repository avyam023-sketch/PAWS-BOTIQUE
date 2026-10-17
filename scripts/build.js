#!/usr/bin/env node
/*
 * Static site builder for Paws Boutique.
 * Reads content from src/assets/js/data.js and writes a fully static site into dist/:
 * home, all-breeds listing, one page per breed, 404 and sitemap.
 * No dependencies: `node scripts/build.js`
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const data = require(path.join(SRC, "assets/js/data.js"));
const { layout } = require("./lib/layout");
const { photo } = require("./lib/ui");
const pages = {
  home: require("./pages/home"),
  puppies: require("./pages/puppies"),
  breed: require("./pages/breed"),
  notFound: require("./pages/not-found"),
};

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}
function write(rel, html) {
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

// Fail on broken content; warn on things to finish before launch.
const sizeIds = new Set(data.sizes.map((s) => s.id));
const seen = new Set();
const problems = [];
for (const b of data.breeds) {
  if (seen.has(b.id)) problems.push(`${b.id}: duplicate id`);
  seen.add(b.id);
  if (!sizeIds.has(b.size)) problems.push(`${b.id}: unknown size ${b.size}`);
  if (!["good", "moderate", "ac"].includes(b.heat)) problems.push(`${b.id}: heat must be good, moderate or ac`);
  if (!Array.isArray(b.coat) || b.coat.length !== 2) problems.push(`${b.id}: coat needs two colours`);
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

const todo = [];
if (/0000/.test(data.company.phone + data.company.whatsapp)) todo.push("company.phone / company.whatsapp are placeholders");
if (data.company.address === `${data.company.city}, ${data.company.region}`) todo.push("company.address has no street address");
const noPhoto = data.breeds.filter((b) => !photo(b.id)).length;
if (noPhoto) todo.push(`${noPhoto} breeds have no photo yet (src/assets/img/breeds/<id>.webp) — coat-colour art is shown instead`);

fs.rmSync(DIST, { recursive: true, force: true });
copyDir(path.join(SRC, "assets"), path.join(DIST, "assets"));
for (const f of ["favicon.svg", "robots.txt", "CNAME"]) if (fs.existsSync(path.join(SRC, f))) fs.copyFileSync(path.join(SRC, f), path.join(DIST, f));
fs.writeFileSync(path.join(DIST, ".nojekyll"), "");

const built = [];
function emit(rel, page) {
  write(rel, layout({ ...page, data, depth: rel.split("/").length - 1 }));
  built.push(rel);
}
emit("index.html", pages.home(data));
emit("puppies.html", pages.puppies(data));
for (const b of data.breeds) emit(`breeds/${b.id}.html`, pages.breed(data, b));
emit("404.html", pages.notFound(data));

const today = new Date().toISOString().slice(0, 10);
const urls = built.filter((r) => r !== "404.html").map((r) => `  <url><loc>${data.company.siteUrl}/${r === "index.html" ? "" : r}</loc><lastmod>${today}</lastmod></url>`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);

console.log(`Built ${built.length} pages (${data.breeds.length} breeds) → dist/`);
if (todo.length) console.warn(`\nBefore launch:\n${todo.map((t) => `  • ${t}`).join("\n")}`);

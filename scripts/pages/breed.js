/* One page per breed, for search ("<breed> puppies in Amritsar") and for sharing on WhatsApp. */
const { esc, icon, card, breedArt, lines, heatLabel } = require("../lib/ui");
const { waLink } = require("../lib/layout");

module.exports = function breed(data, b) {
  const c = data.company;
  const root = "../";
  const size = data.sizes.find((s) => s.id === b.size);
  const related = data.breeds.filter((x) => x.size === b.size && x.id !== b.id).slice(0, 3);
  const fit = [
    ["Size", `${size.label} · ${b.weight}`],
    ["Lifespan", b.life],
    ["Good for flats", b.flat ? "Yes" : "Needs space"],
    ["With children", b.kids],
    ["Energy", b.energy],
    ["Grooming", b.grooming],
    ["Amritsar summer", heatLabel[b.heat]],
    ["Origin", b.origin],
  ];
  const body = `
<section class="breed-hero">
  <div class="wrap breed-hero__in">
    <div class="breed-hero__copy">
      <nav class="crumbs" aria-label="Breadcrumb" data-hero-in><a href="${root}index.html">Home</a><span>/</span><a href="${root}puppies.html">Puppies</a><span>/</span><span aria-current="page">${esc(b.name)}</span></nav>
      <p class="eyebrow" data-hero-in>${size.label} breed · ${esc(c.city)}</p>
      <h1 class="page-hero__h">${lines([`${esc(b.name)}`, "puppies <em>for sale.</em>"])}</h1>
      <p class="lead" data-hero-in>${esc(b.blurb)}</p>
      <ul class="card__traits card__traits--lg" data-hero-in>${b.traits.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="hero__cta" data-hero-in>
        <button class="btn btn--accent btn--lg" type="button" data-quote-open="${b.id}" data-magnetic><span>View Price</span>${icon.arrow}</button>
        <a class="btn btn--wa btn--lg" href="${waLink(c, `Hi ${c.name}, I'd like the price of a ${b.name} puppy.`)}" target="_blank" rel="noopener" data-magnetic>${icon.whatsapp}<span>WhatsApp</span></a>
      </div>
    </div>
    <div class="breed-hero__media" data-breed-media>${breedArt(b, root, { eager: true })}</div>
  </div>
</section>
<section class="fit">
  <div class="wrap">
    <h2 class="h2">Is a ${esc(b.name)} <em>right for you?</em></h2>
    <dl class="fit__grid">${fit.map(([k, v]) => `<div class="fit__row" data-reveal><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
  </div>
</section>
<section class="included">
  <div class="wrap">
    <p class="eyebrow">Every ${esc(b.name)} puppy comes with</p>
    <ul class="included__list">${data.promises.map((p) => `<li data-reveal><span class="promise__check">${icon.check}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`).join("")}</ul>
  </div>
</section>
${related.length ? `<section class="listing">
  <div class="wrap">
    <div class="listing__head"><div><p class="eyebrow">Also ${size.label.toLowerCase()}</p><h2 class="h2">Similar breeds</h2></div></div>
    <div class="grid grid--3">${related.map((r) => card(r, data, root)).join("")}</div>
  </div>
</section>` : ""}
<section class="band">
  <div class="wrap band__in">
    <h2 class="h2">Want to see the ${esc(b.name)} puppies <em>available now?</em></h2>
    <button class="btn btn--accent btn--lg" type="button" data-quote-open="${b.id}" data-magnetic><span>View Price</span>${icon.arrow}</button>
  </div>
</section>`;
  return {
    title: `${b.name} Puppies for Sale in ${c.city} | ${c.name}`,
    description: `${b.name} puppies in ${c.city}: vet-checked, vaccinated for their age, 8+ weeks old. ${b.traits.join(", ")}. Lifespan ${b.life}. Tap View Price for photos and price on WhatsApp.`,
    body,
    page: "puppies",
    canonical: `breeds/${b.id}.html`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${c.siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Puppies", item: `${c.siteUrl}/puppies.html` },
        { "@type": "ListItem", position: 3, name: b.name, item: `${c.siteUrl}/breeds/${b.id}.html` },
      ],
    },
  };
};

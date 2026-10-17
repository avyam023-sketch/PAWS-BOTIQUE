/* Homepage: a scroll-driven story that ends at "ask for a price". Choreography lives in src/assets/js/home.js. */
const { esc, icon, card, breedArt, lines } = require("../lib/ui");
const { waLink } = require("../lib/layout");

// Paw prints walking diagonally across the hero, left foot / right foot.
function trail() {
  const n = 14;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const x = 4 + t * 88;
    const y = 88 - t * 70 + (i % 2 ? -4 : 4);
    return `<span class="trail__p" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--r:${(48 + (i % 2 ? 10 : -10)).toFixed(0)}deg">${icon.paw}</span>`;
  }).join("");
}

module.exports = function home(data) {
  const c = data.company;
  const root = "";
  const byId = Object.fromEntries(data.breeds.map((b) => [b.id, b]));
  const fan = ["golden-retriever", "pomeranian", "german-shepherd", "shih-tzu", "siberian-husky"].map((id) => byId[id]);
  const featured = data.breeds.filter((b) => b.featured);
  const ordered = [...featured, ...data.breeds.filter((b) => !b.featured)];
  const heatGroups = [
    ["good", "Handles the heat", "Short coats, long noses. Comfortable with shade, water and early walks."],
    ["moderate", "Fine with care", "Happy year-round with a cool room at midday and walks before 9 am."],
    ["ac", "Needs AC in summer", "Short noses or heavy coats. Wonderful dogs — with an air-conditioned room from April to September."],
  ];
  const manifesto = "Most people buy a puppy from a photo and hope for the best. We'd rather you meet them. Every puppy here is vet-checked, vaccinated for its age and at least eight weeks old — and goes home with the records to prove it.";

  const body = `
<section class="hero" data-hero>
  <div class="hero__trail" aria-hidden="true">${trail()}</div>
  <div class="wrap hero__in">
    <div class="hero__copy">
      <p class="eyebrow" data-hero-in>Pedigree puppies · ${esc(c.city)}</p>
      <h1 class="hero__h1">${lines(["A healthy puppy,", "raised <em>right.</em>"])}</h1>
      <p class="hero__lead" data-hero-in>Vet-checked, vaccinated for their age and at least eight weeks old. Meet them in ${esc(c.city)} before you decide.</p>
      <div class="hero__cta" data-hero-in>
        <a class="btn btn--dark btn--lg" href="#puppies" data-magnetic><span>See puppies & prices</span>${icon.arrow}</a>
        <a class="btn btn--ghost btn--lg" href="${waLink(c, `Hi ${c.name}, I'd like to know about your puppies.`)}" target="_blank" rel="noopener" data-magnetic>${icon.whatsapp}<span>WhatsApp us</span></a>
      </div>
    </div>
    <div class="hero__fan" aria-hidden="true">
      ${fan.map((b, i) => `<div class="fan__slot" data-fan-slot><div class="fan__card" data-fan="${i}">${breedArt(b, root, { eager: true })}<span class="fan__name">${esc(b.name)}</span></div></div>`).join("")}
    </div>
  </div>
  <div class="hero__scroll" aria-hidden="true">
    <svg viewBox="0 0 120 120"><defs><path id="ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#ring">SCROLL TO MEET THEM · SCROLL TO MEET THEM · </textPath></text></svg>
    <span>${icon.paw}</span>
  </div>
  <div class="hero__curtain" aria-hidden="true"></div>
</section>

<section class="manifesto" data-manifesto>
  <div class="wrap">
    <p class="eyebrow eyebrow--light">Why ${esc(c.name)}</p>
    <p class="manifesto__text" data-words>${esc(manifesto)}</p>
  </div>
</section>

<section class="stats">
  <div class="wrap stats__grid">
    <div class="stat"><span class="stat__n" data-count="${data.breeds.length}">${data.breeds.length}</span><span class="stat__l">breeds, from toy to giant</span></div>
    <div class="stat"><span class="stat__n" data-count="8">8</span><span class="stat__l">weeks minimum before any puppy goes home</span></div>
    <div class="stat"><span class="stat__n" data-count="1">1</span><span class="stat__l">message to get prices, photos and videos</span></div>
  </div>
  <div class="marquee" data-marquee aria-hidden="true">
    <div class="marquee__track">${[0, 1].map(() => `<span>${data.breeds.map((b) => `${esc(b.name)}<i>${icon.paw}</i>`).join("")}</span>`).join("")}</div>
  </div>
</section>

<section class="sizes" data-sizes aria-label="Breeds by size">
  <div class="sizes__track" data-sizes-track>
    <div class="size size--intro">
      <p class="eyebrow">Start with size</p>
      <h2 class="h2">Every home suits<br>a different <em>dog.</em></h2>
      <p class="lead">A flat in the walled city and a kothi in Ranjit Avenue need different breeds. Scroll through the five sizes.</p>
      <span class="size__hint">${icon.arrow}</span>
    </div>
    ${data.sizes.map((s, i) => {
      const list = data.breeds.filter((b) => b.size === s.id);
      return `<div class="size" data-size-panel style="--s:${s.scale}">
      <div class="size__num">0${i + 1}</div>
      <div class="size__paw">${icon.paw}</div>
      <div class="size__info">
        <h3 class="size__label">${s.label}</h3>
        <p class="size__weight">${s.weight}</p>
        <p class="size__fit">${s.fit}</p>
        <ul class="size__list">${list.map((b) => `<li><a href="breeds/${b.id}.html">${esc(b.name)}</a></li>`).join("")}</ul>
        <a class="link-arrow" href="puppies.html?size=${s.id}">See ${s.label.toLowerCase()} breeds ${icon.arrow}</a>
      </div>
    </div>`;
    }).join("")}
  </div>
  <div class="sizes__bar" aria-hidden="true"><span data-sizes-bar></span></div>
</section>

<section class="listing" id="puppies">
  <div class="wrap">
    <div class="listing__head">
      <div>
        <p class="eyebrow">Puppies</p>
        <h2 class="h2" data-split-lines>Choose a breed.<br><em>We'll send the price.</em></h2>
      </div>
      <p class="lead">Prices change with every litter, so we share them directly — with photos and videos of the puppies available right now.</p>
    </div>
    <div class="filters" role="tablist" aria-label="Filter breeds" data-filters>
      <button type="button" role="tab" aria-selected="true" data-filter="popular">Popular</button>
      <button type="button" role="tab" aria-selected="false" data-filter="all">All ${data.breeds.length}</button>
      ${data.sizes.map((s) => `<button type="button" role="tab" aria-selected="false" data-filter="${s.id}">${s.label}</button>`).join("")}
      <span class="filters__pill" aria-hidden="true" data-filter-pill></span>
    </div>
    <div class="grid" data-grid>
      ${ordered.map((b) => card(b, data, root).replace("data-card", `data-card${b.featured ? " data-featured" : ""}`)).join("")}
    </div>
    <div class="listing__more"><a class="btn btn--ghost btn--lg" href="puppies.html" data-magnetic><span>Search all ${data.breeds.length} breeds</span>${icon.arrow}</a></div>
  </div>
</section>

<section class="process" id="process" data-process>
  <div class="wrap process__in">
    <div class="process__copy">
      <p class="eyebrow">How it works</p>
      <h2 class="h2">From first message<br>to first <em>walk.</em></h2>
      <p class="lead">No forms to print, no deposits before you've met the puppy.</p>
      <button class="btn btn--dark btn--lg" type="button" data-quote-open data-magnetic><span>Start with step one</span>${icon.arrow}</button>
    </div>
    <div class="process__stack">
      ${data.steps.map((s, i) => `<article class="step" data-step-card>
        <span class="step__n">0${i + 1}</span>
        <h3 class="step__t">${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
        <span class="step__paw">${icon.paw}</span>
      </article>`).join("")}
    </div>
  </div>
</section>

<section class="promise" id="promise" data-promise>
  <div class="wrap promise__in">
    <div class="passport-wrap">
      <div class="passport" data-passport>
        <div class="passport__head"><span class="logo__mark">${icon.paw}</span><span>Puppy record</span><span class="passport__no">No. 0001</span></div>
        <div class="passport__photo">${breedArt(byId["labrador-retriever"], root)}</div>
        <dl class="passport__rows">
          ${[["Breed", "Labrador Retriever"], ["Age at handover", "8+ weeks"], ...data.promises.slice(0, 4).map((p) => [p.title, "✓"])].map(([k, v], i) => `<div data-passport-row${i > 1 ? " data-tick" : ""}><dt>${esc(k)}</dt><dd>${i > 1 ? icon.check : esc(v)}</dd></div>`).join("")}
        </dl>
        <div class="passport__stamp" data-stamp>${icon.paw}<span>Ready<br>for home</span></div>
      </div>
    </div>
    <div class="promise__copy">
      <p class="eyebrow">Our health promise</p>
      <h2 class="h2">Every puppy goes home with <em>the paperwork.</em></h2>
      <ul class="promise__list">
        ${data.promises.map((p) => `<li data-promise-item><span class="promise__check">${icon.check}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`).join("")}
      </ul>
    </div>
  </div>
</section>

<section class="heat" data-heat-section>
  <div class="wrap">
    <div class="heat__head">
      <div class="heat__temp"><span data-temp>45</span><sup>°C</sup></div>
      <div>
        <p class="eyebrow">Honest advice</p>
        <h2 class="h2">${esc(c.city)} in June is <em>45 degrees.</em></h2>
        <p class="lead">Some breeds love it. Some need air-conditioning. We'll always tell you which is which before you choose.</p>
      </div>
    </div>
    <div class="heat__cols">
      ${heatGroups.map(([k, t, d]) => `<div class="heat__col heat__col--${k}" data-heat-col>
        <h3>${t}</h3><p>${d}</p>
        <ul>${data.breeds.filter((b) => b.heat === k).map((b) => `<li><a href="breeds/${b.id}.html">${esc(b.name)}</a></li>`).join("")}</ul>
      </div>`).join("")}
    </div>
  </div>
</section>

<section class="faq" id="faq">
  <div class="wrap faq__in">
    <div>
      <p class="eyebrow">Questions</p>
      <h2 class="h2">Asked before<br><em>every puppy.</em></h2>
    </div>
    <div class="faq__list">
      ${data.faqs.map((f) => `<details class="qa"><summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary><div class="qa__a"><p>${esc(f.a)}</p></div></details>`).join("")}
    </div>
  </div>
</section>

<section class="final" data-final>
  <div class="final__in">
    <p class="eyebrow eyebrow--light">One message away</p>
    <h2 class="final__h" data-final-h>Ask for<br>a <em>price.</em></h2>
    <p class="final__lead">Tell us the breed. We'll send the price, photos and videos of the puppies available now.</p>
    <div class="final__cta">
      <button class="btn btn--accent btn--xl" type="button" data-quote-open data-magnetic><span>Get a price</span>${icon.arrow}</button>
      <a class="btn btn--light btn--xl" href="tel:${c.phone}" data-magnetic>${icon.phone}<span>Call us</span></a>
      <a class="btn btn--wa btn--xl" href="${waLink(c, `Hi ${c.name}, I'd like a price for a puppy.`)}" target="_blank" rel="noopener" data-magnetic>${icon.whatsapp}<span>WhatsApp</span></a>
    </div>
  </div>
</section>`;

  return {
    title: `${c.name} — Pedigree Puppies for Sale in ${c.city}`,
    description: `Healthy, vet-checked pedigree puppies in ${c.city}, ${c.region}. ${data.breeds.length} breeds from Pomeranian and Shih Tzu to Labrador and German Shepherd. Ask for a price on WhatsApp.`,
    body,
    page: "home",
    canonical: "",
    preloader: true,
    scripts: ["home.js"],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "PetStore",
      name: c.name,
      url: c.siteUrl,
      telephone: c.phone,
      email: c.email,
      address: { "@type": "PostalAddress", streetAddress: c.address, addressLocality: c.city, addressRegion: c.region, addressCountry: "IN" },
    },
  };
};

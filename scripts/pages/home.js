/* Homepage: a scroll-driven story that ends at "ask for a price". Choreography lives in src/assets/js/home.js. */
const { esc, icon, card, breedArt, lines } = require("../lib/ui");

const speech = ["Woof. Ask for my price.", "Tap me. I don't bite.", "Eight weeks old and ready.", "Come meet me in Amritsar."];
const { waLink } = require("../lib/layout");

module.exports = function home(data) {
  const c = data.company;
  const root = "";
  const byId = Object.fromEntries(data.breeds.map((b) => [b.id, b]));
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
  <div class="wrap hero__in">
    <div class="hero__copy" data-hero-type>
      <p class="eyebrow" data-hero-in>Pedigree puppies · ${esc(c.city)}</p>
      <h1 class="hero__h1" aria-label="Meet your new ${esc(data.heroBreeds.map((h) => h.word).join(", "))}.">
        <span class="line" aria-hidden="true"><span>Meet your new</span></span>
        <span class="line" aria-hidden="true"><span><span class="rot" data-rot>${data.heroBreeds.map((h, i) => `<span class="rot__w" data-rot-word data-coat="${h.coat}">${[...(h.word + ".")].map((ch) => `<span class="rot__c">${esc(ch)}</span>`).join("")}</span>`).join("")}</span></span></span>
      </h1>
      <p class="hero__lead" data-hero-in>Vet-checked, vaccinated for their age and at least eight weeks old. Meet them in ${esc(c.city)} before you decide.</p>
      <div class="hero__cta" data-hero-in>
        <a class="btn btn--accent btn--lg" href="#puppies" data-magnetic><span>See puppies & prices</span>${icon.arrow}</a>
        <a class="btn btn--wa btn--lg" href="${waLink(c, `Hi ${c.name}, I'd like to know about your puppies.`)}" target="_blank" rel="noopener" data-magnetic>${icon.whatsapp}<span>WhatsApp us</span></a>
      </div>
      <div class="coats" data-hero-in>
        <span class="coats__l">Try a breed</span>
        ${data.heroBreeds.map((h, i) => `<button type="button" class="coats__b${i ? "" : " is-on"}" data-coat-btn="${h.coat}">${esc(h.word)}</button>`).join("")}
      </div>
    </div>
    <div class="stage" data-puppy-stage>
      <span class="stage__blob" aria-hidden="true"></span>
      <canvas class="stage__canvas" data-puppy data-rise="reveal" data-cursor="Pet me" aria-label="A 3D puppy. Tap it to make it hop."></canvas>
      <p class="bubble" data-bubble aria-hidden="true">Woof!</p>
      <p class="stage__hint" aria-hidden="true"><b>Tap the puppy.</b> It likes it.</p>
      <span class="stage__fallback" aria-hidden="true">${icon.paw}</span>
    </div>
  </div>
  <div class="hero__curtain" aria-hidden="true"></div>
</section>

<section class="manifesto" data-manifesto>
  <div class="wrap">
    <p class="eyebrow eyebrow--light">Why ${esc(c.name)}</p>
    <p class="manifesto__text" data-words>${esc(manifesto)}</p>
  </div>
</section>

<div class="mbands" aria-hidden="true">
  <div class="mband mband--sky"><div class="mband__track" data-band="-1">${[0, 1].map(() => `<span>${data.breeds.map((b) => `${esc(b.name)}<i>${icon.paw}</i>`).join("")}</span>`).join("")}</div></div>
  <div class="mband mband--lilac"><div class="mband__track" data-band="1">${[0, 1].map(() => `<span>${["Vet-checked", "Vaccinated for age", "8+ weeks old", "Meet before you decide", "Photos & videos on WhatsApp", c.city].map((t) => `${esc(t)}<i>${icon.paw}</i>`).join("")}</span>`).join("")}</div></div>
</div>

<section class="stats">
  <div class="wrap stats__grid">
    <div class="stat"><span class="stat__n" data-count="${data.breeds.length}">${data.breeds.length}</span><span class="stat__l">breeds, from toy to giant</span></div>
    <div class="stat"><span class="stat__n" data-count="8">8</span><span class="stat__l">weeks minimum before any puppy goes home</span></div>
    <div class="stat"><span class="stat__n" data-count="1">1</span><span class="stat__l">message to get prices, photos and videos</span></div>
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
      <h2 class="h2">From first tap<br>to first <em>walk.</em></h2>
      <ol class="steplist" data-steplist>
        ${data.steps.map((st, i) => `<li${i ? "" : ' class="on"'} data-n="0${i + 1}"><b>${esc(st.title)}</b><p>${esc(st.text)}</p></li>`).join("")}
      </ol>
      <button class="btn btn--accent btn--lg" type="button" data-quote-open data-magnetic><span>Start with step one</span>${icon.arrow}</button>
    </div>
    <div class="phone" role="img" aria-label="Illustration: choosing a Labrador, answering three questions, getting photos and the price on WhatsApp, and booking a visit">
      <div class="phone__screen">
        <div class="phone__bar"><span>9:41</span><span>5G</span></div>

        <div class="scr scr--browse" data-scr="0">
          <div class="app__head"><span class="logo__mark">${icon.paw}</span><b>${esc(c.name)}</b></div>
          <p class="app__h">Choose a breed.</p>
          <div class="app__grid">
            ${["labrador-retriever", "pomeranian", "siberian-husky", "beagle"].map((id) => { const b = byId[id]; return `<div class="app__card${id === "labrador-retriever" ? " is-target" : ""}"><div class="app__art" style="--c1:${b.coat[0]};--c2:${b.coat[1]}"></div><b>${esc(b.name)}</b><span class="app__btn">View Price</span>${id === "labrador-retriever" ? '<span class="tap" data-tap="0"></span>' : ""}</div>`; }).join("")}
          </div>
        </div>

        <div class="scr scr--flash" data-scr="1">
          <p class="app__eyebrow">Price & availability</p>
          <p class="app__h">Get the price for a <em>Labrador</em></p>
          <div class="app__deck">
            <div class="app__flash" data-mini-flash="1"><small>03</small><b>When would you like to bring them home?</b><span class="app__opt">This week</span><span class="app__opt" data-pick="2">This month<span class="tap" data-tap="2"></span></span><span class="app__opt">Just exploring</span></div>
            <div class="app__flash" data-mini-flash="0"><small>02</small><b>Male or female?</b><span class="app__opt">Male</span><span class="app__opt" data-pick="1">Female<span class="tap" data-tap="1"></span></span><span class="app__opt">No preference</span></div>
          </div>
        </div>

        <div class="scr scr--chat" data-scr="2">
          <div class="chat__head"><span class="logo__mark">${icon.paw}</span><div><b>${esc(c.name)}</b><small data-chat-status>online</small></div></div>
          <div class="chat__body"><div class="chat__list" data-chat-list>
            <p class="msg msg--out" data-msg>Hi! I'd like the price for a Labrador puppy.<br>Female · This month</p>
            <p class="msg msg--typing" data-msg><i></i><i></i><i></i></p>
            <p class="msg msg--in" data-msg>Hi Harpreet! Two Labrador girls are ready to go home.</p>
            <div class="msg msg--in msg--media" data-msg><span style="--c1:#e2be85;--c2:#f6e7c9"></span><span style="--c1:#c9a270;--c2:#f3e2c4"></span><span style="--c1:#e9cc98;--c2:#fff3dc"></span></div>
            <div class="msg msg--in msg--video" data-msg><span class="msg__play"></span><small>0:24</small></div>
            <p class="msg msg--in msg--doc" data-msg><b>Price + vaccination record.pdf</b><small>2 pages</small></p>
            <p class="msg msg--in" data-msg>Would you like to meet them on Saturday?</p>
            <p class="msg msg--out" data-msg>Yes! Saturday, 11 am.</p>
          </div></div>
        </div>

        <div class="scr scr--visit" data-scr="3">
          <div class="map" aria-hidden="true">
            <svg viewBox="0 0 300 330" preserveAspectRatio="xMidYMid slice"><rect width="300" height="330" fill="#ebedd8"/><g fill="#dde0bd"><rect x="18" y="20" width="90" height="80" rx="12"/><rect x="150" y="14" width="130" height="100" rx="12"/><rect x="18" y="150" width="70" height="140" rx="12"/><rect x="130" y="160" width="150" height="70" rx="12"/><rect x="140" y="260" width="140" height="60" rx="12"/></g><g stroke="#f8f9f2" stroke-width="14" fill="none" stroke-linecap="round"><path d="M0 128H300M118 0V330M0 245H300M206 128V330"/></g><path data-route d="M30 310 V245 H118 V128 H206 V80" fill="none" stroke="#4a051c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 10"/></svg>
            <span class="map__pin" data-pin>${icon.paw}</span>
          </div>
          <div class="visit">
            <small>Visit booked</small>
            <b>Saturday · 11:00 am</b>
            <p>${esc(c.name)}, ${esc(c.city)}</p>
            <ul class="visit__checks">${["Vet health check", "Vaccinated for age", "Diet & care chart"].map((t) => `<li data-check>${icon.check}<span>${t}</span></li>`).join("")}</ul>
            <span class="visit__stamp" data-visit-stamp>${icon.paw}<span>Ready<br>for home</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <p class="process__note">Illustration of how a price request works.</p>
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
  <div class="wrap final__in">
    <div class="final__copy">
      <p class="eyebrow eyebrow--light">One message away</p>
      <h2 class="final__h" data-final-h>Ask for<br>a <em>price.</em></h2>
      <p class="final__lead">Tell us the breed. We'll send the price, photos and videos of the puppies available now.</p>
      <div class="final__cta">
        <button class="btn btn--accent btn--xl" type="button" data-quote-open data-magnetic data-confetti><span>Get a price</span>${icon.arrow}</button>
        <a class="btn btn--light btn--xl" href="tel:${c.phone}" data-magnetic>${icon.phone}<span>Call us</span></a>
        <a class="btn btn--wa btn--xl" href="${waLink(c, `Hi ${c.name}, I'd like a price for a puppy.`)}" target="_blank" rel="noopener" data-magnetic>${icon.whatsapp}<span>WhatsApp</span></a>
      </div>
    </div>
    <div class="stage stage--final" data-puppy-stage>
      <span class="stage__blob" aria-hidden="true"></span>
      <canvas class="stage__canvas" data-puppy data-coat="golden" data-cursor="Pet me" aria-label="A 3D puppy. Tap it to make it hop."></canvas>
      <p class="bubble bubble--talk" data-speech="${esc(JSON.stringify(speech))}" aria-hidden="true">${esc(speech[0])}</p>
      <span class="stage__fallback" aria-hidden="true">${icon.paw}</span>
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
    modules: ["puppy.js"],
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

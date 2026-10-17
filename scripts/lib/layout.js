/* Page shell: <head>, header, mobile menu, footer, quote flashcards, floating WhatsApp. */
const { esc, icon } = require("./ui");

const waLink = (c, text) => `https://wa.me/${c.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

function header(data, root, page) {
  const c = data.company;
  const nav = [
    ["Puppies", `${root}puppies.html`, "puppies"],
    ["How it works", `${root}index.html#process`, ""],
    ["Health promise", `${root}index.html#promise`, ""],
    ["FAQ", `${root}index.html#faq`, ""],
    ["Contact", `${root}index.html#contact`, ""],
  ];
  return `<header class="header" data-header>
  <div class="header__in">
    <a class="logo" href="${root}index.html" aria-label="${esc(c.name)} home">
      <span class="logo__pup"><img src="${root}assets/img/brand/husky-front.webp" alt="" width="808" height="1253"></span>
      <span class="logo__word">${esc(c.name)}<small>${esc(c.city)}</small></span>
    </a>
    <nav class="nav" aria-label="Main" data-nav>
      <span class="nav__blob" aria-hidden="true" data-nav-blob></span>
      ${nav.map(([l, h, k]) => `<a href="${h}"${k && k === page ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
    </nav>
    <div class="header__cta">
      <a class="header__call" href="tel:${c.phone}" aria-label="Call ${esc(c.phoneDisplay)}" data-magnetic><span class="header__call-ic">${icon.phone}</span><span class="header__call-n">${esc(c.phoneDisplay)}</span></a>
      <button class="btn btn--sm btn--accent" type="button" data-quote-open data-magnetic><span>Get a price</span>${icon.arrow}</button>
      <button class="menu-btn" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span class="sr">Menu</span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
  <nav aria-label="Mobile">${nav.map(([l, h]) => `<a href="${h}">${l}</a>`).join("")}</nav>
  <div class="mobile-menu__foot">
    <a class="btn btn--light" href="tel:${c.phone}">${icon.phone}<span>Call ${esc(c.phoneDisplay)}</span></a>
    <a class="btn btn--wa" href="${waLink(c, `Hi ${c.name}, I'd like to know about your puppies.`)}" target="_blank" rel="noopener">${icon.whatsapp}<span>WhatsApp us</span></a>
  </div>
</div>`;
}

function footer(data, root) {
  const c = data.company;
  return `<footer class="footer" id="contact">
  <div class="wrap">
    <img class="footer__pup" data-footer-pup src="${root}assets/img/brand/husky-back.webp" alt="" aria-hidden="true" loading="lazy" width="386" height="593">
    <div class="footer__top">
      <div>
        <p class="eyebrow eyebrow--light">Visit · Call · WhatsApp</p>
        <h2 class="footer__h">Come and meet them<br><em>in ${esc(c.city)}.</em></h2>
      </div>
      <div class="footer__actions">
        <a class="btn btn--light btn--lg" href="tel:${c.phone}" data-magnetic>${icon.phone}<span>${esc(c.phoneDisplay)}</span></a>
        <a class="btn btn--wa btn--lg" href="${waLink(c, `Hi ${c.name}, I'd like to know about your puppies.`)}" target="_blank" rel="noopener" data-magnetic>${icon.whatsapp}<span>WhatsApp us</span></a>
      </div>
    </div>
    <div class="footer__grid">
      <div><h3>Shop</h3><p>${icon.pin}<span>${esc(c.address)}</span></p><p>${esc(c.hours)}</p>${c.mapUrl ? `<p><a href="${c.mapUrl}" target="_blank" rel="noopener">Get directions →</a></p>` : ""}</div>
      <div><h3>Talk to us</h3><p><a href="tel:${c.phone}">${esc(c.phoneDisplay)}</a></p><p><a href="mailto:${c.email}">${esc(c.email)}</a></p>${c.instagram ? `<p><a href="${c.instagram}" target="_blank" rel="noopener">Instagram</a></p>` : ""}</div>
      <div><h3>Puppies by size</h3>${data.sizes.map((s) => `<p><a href="${root}puppies.html?size=${s.id}">${s.label} breeds</a></p>`).join("")}</div>
      <div><h3>Popular</h3>${data.breeds.filter((b) => b.featured).slice(0, 5).map((b) => `<p><a href="${root}breeds/${b.id}.html">${esc(b.name)}</a></p>`).join("")}</div>
    </div>
    <div class="footer__word" aria-hidden="true">${esc(c.name)}</div>
    <div class="footer__base"><span>© ${new Date().getFullYear()} ${esc(c.name)}, ${esc(c.city)}</span><span>Puppies are never sold before eight weeks of age.</span></div>
  </div>
</footer>`;
}

function quoteModal(data) {
  const c = data.company;
  const opt = (v, label, sub) => `<button type="button" class="choice" data-choice="${esc(v)}"><span class="choice__l">${label}</span>${sub ? `<span class="choice__s">${sub}</span>` : ""}</button>`;
  return `<div class="quote" data-quote hidden>
  <div class="quote__scrim" data-quote-close></div>
  <div class="quote__panel" role="dialog" aria-modal="true" aria-labelledby="quote-title">
    <div class="quote__head">
      <div>
        <p class="eyebrow">Price & availability</p>
        <h2 class="quote__title" id="quote-title">Get the price for <em data-q-title>your puppy</em></h2>
      </div>
      <button class="quote__x" type="button" data-quote-close aria-label="Close">${icon.close}</button>
    </div>
    <div class="quote__progress" aria-hidden="true"><span data-q-bar></span></div>
    <p class="quote__count" aria-live="polite"><span data-q-count>1</span> / 4</p>

    <form class="deck" data-deck novalidate>
      <div class="flash" role="group" aria-labelledby="q-breed" data-flash="breed">
        <h3 class="flash__q" id="q-breed"><span class="flash__n">01</span>Which breed are you looking for?</h3>
        <label class="field">
          <span class="sr">Breed</span>
          <select name="breed" data-q-breed>
            ${data.sizes.map((s) => `<optgroup label="${s.label}">${data.breeds.filter((b) => b.size === s.id).map((b) => `<option value="${b.id}">${esc(b.name)}</option>`).join("")}</optgroup>`).join("")}
            <option value="help">Not sure yet — help me choose</option>
          </select>
        </label>
        <button class="btn btn--dark flash__next" type="button" data-next>Continue ${icon.arrow}</button>
      </div>

      <div class="flash" role="group" aria-labelledby="q-gender" data-flash="gender">
        <h3 class="flash__q" id="q-gender"><span class="flash__n">02</span>Male or female?</h3>
        <div class="choices choices--3" data-group="gender">
          ${opt("Male", "Male")}${opt("Female", "Female")}${opt("Either", "No preference")}
        </div>
      </div>

      <div class="flash" role="group" aria-labelledby="q-when" data-flash="when">
        <h3 class="flash__q" id="q-when"><span class="flash__n">03</span>When would you like to bring them home?</h3>
        <div class="choices" data-group="when">
          ${opt("This week", "This week", "Ready now")}${opt("This month", "This month")}${opt("In 1–3 months", "In 1–3 months")}${opt("Just exploring", "Just exploring", "Send me prices")}
        </div>
      </div>

      <div class="flash" role="group" aria-labelledby="q-contact" data-flash="contact">
        <h3 class="flash__q" id="q-contact"><span class="flash__n">04</span>Where should we send the price?</h3>
        <label class="field"><span>Your name</span><input name="name" autocomplete="name" required placeholder="Full name"></label>
        <label class="field"><span>WhatsApp number</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="10-digit mobile number"></label>
        <label class="field"><span>City</span><input name="city" autocomplete="address-level2" value="${esc(c.city)}"></label>
        <p class="field__err" data-q-err role="alert"></p>
        <button class="btn btn--accent flash__next" type="submit">Send me the price ${icon.arrow}</button>
      </div>

      <div class="flash flash--done" data-flash="done" tabindex="-1">
        <span class="done__icon">${icon.check}</span>
        <h3 class="flash__q" data-q-done-title>Thank you.</h3>
        <p data-q-done-text>We'll send the price, photos and videos on WhatsApp shortly.</p>
        <a class="btn btn--wa" data-q-wa href="${waLink(c)}" target="_blank" rel="noopener">${icon.whatsapp}<span>Open WhatsApp chat</span></a>
      </div>
    </form>

    <div class="quote__nav">
      <button class="quote__back" type="button" data-back>${icon.back}<span>Back</span></button>
    </div>
    <div class="quote__alt">
      <span>Or talk to us now</span>
      <a href="tel:${c.phone}">${icon.phone}<span>Call ${esc(c.phoneDisplay)}</span></a>
      <a href="${waLink(c, `Hi ${c.name}, I'd like a price for a puppy.`)}" target="_blank" rel="noopener" class="is-wa">${icon.whatsapp}<span>WhatsApp us</span></a>
    </div>
  </div>
</div>`;
}

function layout({ title, description, body, data, depth = 0, page = "", scripts = [], modules = [], canonical = "", jsonLd = null, preloader = false }) {
  const c = data.company;
  const root = "../".repeat(depth);
  const url = `${c.siteUrl}/${canonical}`;
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta name="theme-color" content="#4A051C">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${root}assets/css/site.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
<script>(function(d){d.classList.add("js");if(matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("no-motion");else try{if(sessionStorage.getItem("pb-wipe")){d.classList.add("pt-in");sessionStorage.removeItem("pb-wipe")}}catch(e){}setTimeout(function(){if(!window.PB_READY)d.classList.add("no-motion")},4000)})(document.documentElement)</script>
</head>
<body data-root="${root}" data-page="${page}"${preloader ? " data-loading" : ""}>
<a class="skip" href="#main">Skip to content</a>
${preloader ? `<div class="loader" data-loader aria-hidden="true">
  <div class="loader__bg" data-loader-bg></div>
  <div class="loader__in">
    <div class="loader__stage">
      <img class="loader__pup loader__pup--back" data-loader-back src="${root}assets/img/brand/husky-back.webp" alt="">
      <img class="loader__pup loader__pup--front" data-loader-front src="${root}assets/img/brand/husky-front.webp" alt="">
      <p class="loader__bubble" data-loader-bubble>Woof!</p>
    </div>
    <p class="loader__msg" data-loader-msg>Fetching your new best friend…</p>
    <span class="loader__dots" aria-hidden="true"><i></i><i></i><i></i></span>
  </div>
</div>` : ""}
<div class="pt" data-pt aria-hidden="true"><div class="pt__paws">${Array.from({ length: 5 }, () => `<span>${icon.paw}</span>`).join("")}</div></div>
${header(data, root, page)}
<main id="main">
${body}
</main>
${footer(data, root)}
${quoteModal(data)}
<a class="fab" href="${waLink(c, `Hi ${c.name}, I'd like to know about your puppies.`)}" target="_blank" rel="noopener" aria-label="WhatsApp us">${icon.whatsapp}</a>
<div class="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"><span class="cursor__label" data-cursor-label></span></span></div>
<script src="${root}assets/vendor/gsap.min.js"></script>
<script src="${root}assets/vendor/ScrollTrigger.min.js"></script>
<script src="${root}assets/vendor/SplitText.min.js"></script>
<script src="${root}assets/vendor/Flip.min.js"></script>
<script src="${root}assets/vendor/lenis.min.js"></script>
<script src="${root}assets/js/data.js"></script>
<script src="${root}assets/js/site.js"></script>
${scripts.map((s) => `<script src="${root}assets/js/${s}"></script>`).join("\n")}
${modules.map((s) => `<script type="module" src="${root}assets/js/${s}"></script>`).join("\n")}
</body>
</html>
`;
}

module.exports = { layout, waLink };

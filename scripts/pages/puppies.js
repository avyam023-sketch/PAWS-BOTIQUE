/* All breeds: search, size tabs and two practical filters. Behaviour in src/assets/js/site.js (initGrid). */
const { esc, icon, card, lines } = require("../lib/ui");

module.exports = function puppies(data) {
  const c = data.company;
  const body = `
<section class="page-hero">
  <div class="wrap">
    <p class="eyebrow" data-hero-in>${data.breeds.length} breeds · ${esc(c.city)}</p>
    <h1 class="page-hero__h">${lines(["Puppies for sale", "in <em>" + esc(c.city) + ".</em>"])}</h1>
    <p class="lead" data-hero-in>Tap <strong>View Price</strong> on any breed. We'll send the price with photos and videos of the puppies available now.</p>
  </div>
</section>
<section class="listing listing--page">
  <div class="wrap">
    <div class="toolbar">
      <label class="search"><span class="sr">Search breeds</span><input type="search" placeholder="Search a breed — e.g. Labrador" data-search-input autocomplete="off"></label>
      <div class="toggles">
        <label class="toggle"><input type="checkbox" data-flat-filter><span>Good for flats</span></label>
        <label class="toggle"><input type="checkbox" data-heat-filter><span>Handles summer heat</span></label>
      </div>
    </div>
    <div class="filters" role="tablist" aria-label="Filter by size" data-filters>
      <button type="button" role="tab" aria-selected="true" data-filter="all">All</button>
      ${data.sizes.map((s) => `<button type="button" role="tab" aria-selected="false" data-filter="${s.id}">${s.label}</button>`).join("")}
      <span class="filters__pill" aria-hidden="true" data-filter-pill></span>
    </div>
    <p class="results" aria-live="polite"><span data-result-count>${data.breeds.length}</span> breeds</p>
    <div class="grid" data-grid>
      ${data.breeds.map((b) => card(b, data, "")).join("")}
    </div>
    <div class="empty" data-empty hidden>
      <h2 class="h3">Don't see the breed you want?</h2>
      <p>We can often source other breeds. Tell us what you're looking for.</p>
      <button class="btn btn--dark" type="button" data-quote-open="help">Ask us ${icon.arrow}</button>
    </div>
  </div>
</section>`;
  return {
    title: `Puppies for Sale in ${c.city} — ${data.breeds.length} Breeds | ${c.name}`,
    description: `Browse ${data.breeds.length} pedigree dog breeds available in ${c.city}: toy, small, medium, large and giant. Vet-checked and vaccinated. Tap View Price for photos and price on WhatsApp.`,
    body,
    page: "puppies",
    canonical: "puppies.html",
  };
};

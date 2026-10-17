const { icon, lines } = require("../lib/ui");

module.exports = function notFound(data) {
  return {
    title: `Page not found | ${data.company.name}`,
    description: "This page doesn't exist.",
    body: `<section class="page-hero page-hero--center">
  <div class="wrap">
    <p class="eyebrow" data-hero-in>404</p>
    <h1 class="page-hero__h">${lines(["This page ran off", "<em>after a squirrel.</em>"])}</h1>
    <div class="hero__cta" data-hero-in><a class="btn btn--dark btn--lg" href="/"><span>Back to home</span>${icon.arrow}</a></div>
  </div>
</section>`,
    canonical: "404.html",
  };
};

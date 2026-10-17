/* Paws Boutique — homepage scroll choreography (GSAP + ScrollTrigger + SplitText). */
(function () {
  "use strict";
  const S = window.PBSite;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const loader = $("[data-loader]");

  // Manifesto words are split up front so the no-motion layout matches.
  const words = $("[data-words]");
  if (words) words.innerHTML = words.textContent.split(" ").map((w) => `<span class="w">${w}</span>`).join(" ");

  if (!S.motion) {
    loader && loader.remove();
    document.body.removeAttribute("data-loading");
    return;
  }

  const mm = gsap.matchMedia();
  const DESKTOP = "(min-width: 961px)";
  const fan = $$("[data-fan]");
  // Fan spread is narrower on small screens so the outer cards stay on screen.
  const spread = innerWidth < 641 ? 0.42 : 0.6;
  const FAN = [
    { r: -18, x: -78 * spread, y: 10 },
    { r: -9, x: -40 * spread, y: 2 },
    { r: 0, x: 0, y: 0 },
    { r: 9, x: 40 * spread, y: 2 },
    { r: 18, x: 78 * spread, y: 10 },
  ];

  /* 01 · Hero scroll — pinned: the cards scatter, paws walk across, a green curtain rises.
     Built first so later pins measure against its spacing. It moves the slots; the intro moves the cards inside. */
  const slots = $$("[data-fan-slot]");
  const trail = $$(".trail__p");
  gsap.timeline({ scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "+=130%", pin: true, scrub: 1, anticipatePin: 1 } })
    .to(".hero__copy", { yPercent: -30, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
    .to(slots, {
      x: (i) => (i - 2) * innerWidth * 0.28, y: (i) => -innerHeight * [0.75, 0.95, 1.1, 0.9, 0.7][i], rotation: (i) => (i - 2) * 22,
      scale: 1.15, ease: "power2.in", duration: 0.7, stagger: { each: 0.03, from: "center" },
    }, 0)
    .to(trail, { opacity: 0.55, scale: 1.25, color: "#4a051c", duration: 0.12, stagger: 0.035, ease: "back.out(3)" }, 0.05)
    .to(".hero__scroll", { opacity: 0, scale: 0.6, duration: 0.2 }, 0)
    .to(".hero__curtain", { clipPath: "circle(150% at 50% 100%)", ease: "power2.inOut", duration: 0.5 }, 0.55);

  /* 00 · Preloader → hero intro (the loader plays once per visit) */
  gsap.set(fan, { yPercent: 150, rotation: (i) => (i - 2) * -6, opacity: 0 });
  function heroIntro() {
    document.body.removeAttribute("data-loading");
    S.intro();
    gsap.to(fan, {
      rotation: (i) => FAN[i].r, xPercent: (i) => FAN[i].x, yPercent: (i) => FAN[i].y, opacity: 1,
      duration: 1.8, ease: "expo.out", delay: 0.2, stagger: { each: 0.07, from: "center" },
    });
    gsap.from(".hero__scroll", { scale: 0, rotation: -180, duration: 1.4, ease: "expo.out", delay: 0.9 });
  }

  let seen = false;
  try { seen = sessionStorage.getItem("pb-loaded") === "1"; sessionStorage.setItem("pb-loaded", "1"); } catch (e) {}
  if (!loader || seen) {
    loader && loader.remove();
    heroIntro();
  } else {
    S.lenis && S.lenis.stop();
    const n = { v: 0 };
    const out = $("[data-loader-n]");
    gsap.timeline({ onComplete: () => { loader.remove(); S.lenis && S.lenis.start(); } })
      .to(".loader__paws span", { opacity: 1, scale: 1, duration: 0.3, stagger: 0.28, ease: "back.out(3)", startAt: { scale: 0.3 } }, 0)
      .to(n, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => (out.textContent = Math.round(n.v)) }, 0)
      .to(".loader__count, .loader__paws, .loader__name", { yPercent: -60, opacity: 0, duration: 0.6, ease: "power3.in", stagger: 0.05 }, 1.7)
      .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, 2)
      .add(heroIntro, 2.35);
  }

  // Cards follow the pointer a little while the hero is on screen.
  if (S.finePointer) {
    $("[data-hero]").addEventListener("pointermove", (e) => {
      const px = e.clientX / innerWidth - 0.5, py = e.clientY / innerHeight - 0.5;
      fan.forEach((c, i) => gsap.to(c, { x: px * (14 + i * 6), y: py * (10 + i * 4), duration: 1.2, ease: "power3.out", overwrite: "auto" }));
    });
  }

  /* 02 · Manifesto — words light up as you read */
  if (words) {
    gsap.to($$(".w", words), {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: "[data-manifesto]", start: "top top", end: "+=140%", pin: true, scrub: 0.6 },
    });
  }

  /* 03 · Stats count up + velocity-reactive marquee */
  $$("[data-count]").forEach((el) => {
    const to = +el.dataset.count, o = { v: 0 };
    el.textContent = "0";
    gsap.to(o, { v: to, duration: to > 1 ? 2.2 : 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true }, onUpdate: () => (el.textContent = Math.round(o.v)) });
    gsap.from(el, { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  const track = $(".marquee__track");
  if (track) {
    const loop = gsap.to(track, { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
    const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
    let dir = 1;
    ScrollTrigger.create({
      trigger: ".stats", start: "top bottom", end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        dir = self.direction;
        gsap.to(loop, { timeScale: dir * Math.min(6, 1 + Math.abs(v) / 350), duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" });
        skew(gsap.utils.clamp(-10, 10, v / -250));
        clearTimeout(track._t);
        track._t = setTimeout(() => skew(0), 120);
      },
    });
  }

  /* 04 · Sizes — horizontal scroll, the paw grows from toy to giant */
  const sTrack = $("[data-sizes-track]");
  if (sTrack) {
    const dist = () => Math.max(0, sTrack.scrollWidth - innerWidth);
    const horiz = gsap.to(sTrack, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: "[data-sizes]", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    gsap.to("[data-sizes-bar]", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-sizes]", start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
    $$("[data-size-panel]").forEach((p) => {
      const st = { containerAnimation: horiz, trigger: p, scrub: true };
      gsap.fromTo($(".size__paw", p), { rotation: -40, scale: 0.4, xPercent: 40 }, { rotation: 16, scale: 1, xPercent: 0, ease: "none", scrollTrigger: { ...st, start: "left right", end: "center center" } });
      gsap.from($(".size__label", p), { xPercent: 50, opacity: 0, ease: "none", scrollTrigger: { ...st, start: "left 95%", end: "left 35%" } });
      gsap.from($$(".size__weight, .size__fit, .size__list li, .link-arrow", p), { y: 30, opacity: 0, stagger: 0.04, ease: "none", scrollTrigger: { ...st, start: "left 75%", end: "left 25%" } });
    });
  }

  /* 05 · Process — cards stack on top of each other */
  const steps = $$("[data-step-card]");
  if (steps.length) {
    mm.add({ desktop: DESKTOP, mobile: "(max-width: 960px)" }, (ctx) => {
      gsap.set(steps.slice(1), { y: () => innerHeight, rotation: 6 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ctx.conditions.desktop ? "[data-process]" : ".process__stack",
          start: ctx.conditions.desktop ? "top top" : "center 55%",
          end: `+=${(steps.length - 1) * 80}%`, pin: true, scrub: 1, anticipatePin: 1,
        },
      });
      steps.slice(1).forEach((s, i) => {
        tl.to(s, { y: 0, rotation: 0, ease: "power2.out", duration: 1 }, i)
          .to(steps.slice(0, i + 1), { scale: (k) => 1 - (i + 1 - k) * 0.05, y: (k) => -(i + 1 - k) * 22, ease: "power2.out", duration: 1 }, i);
      });
      return () => gsap.set(steps, { clearProps: "all" });
    });
  }

  /* 06 · Promise — the puppy record turns, ticks fill in, the stamp lands */
  const passport = $("[data-passport]");
  if (passport) {
    gsap.fromTo(passport, { rotationY: -32, rotationX: 14, y: 60 }, { rotationY: 8, rotationX: -4, y: -20, ease: "none", scrollTrigger: { trigger: "[data-promise]", start: "top bottom", end: "bottom top", scrub: 1 } });
    const ticks = $$("[data-tick] svg", passport);
    gsap.set(ticks, { scale: 0 });
    gsap.set("[data-stamp]", { scale: 2.6, opacity: 0, rotation: 20 });
    gsap.timeline({ scrollTrigger: { trigger: passport, start: "top 70%", once: true } })
      .from($$("[data-passport-row]", passport), { x: -20, opacity: 0, duration: 0.6, stagger: 0.08, ease: "expo.out" })
      .to(ticks, { scale: 1, duration: 0.5, stagger: 0.18, ease: "back.out(4)" }, 0.4)
      .to("[data-stamp]", { scale: 1, opacity: 1, rotation: -14, duration: 0.5, ease: "power4.in" }, ">0.1")
      .fromTo(passport, { x: -6 }, { x: 0, duration: 0.5, ease: "elastic.out(1.4, 0.2)" }, ">-0.02");
    $$("[data-promise-item]").forEach((li, i) => {
      const path = $(".check-path", li);
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.timeline({ scrollTrigger: { trigger: li, start: "top 88%", once: true } })
        .from(li, { y: 40, opacity: 0, duration: 0.9, ease: "expo.out", delay: (i % 2) * 0.08 })
        .to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, 0.25);
    });
  }

  /* 07 · Heat — the thermometer climbs and the section warms up */
  const temp = $("[data-temp]");
  if (temp) {
    const o = { t: 18 };
    gsap.timeline({ scrollTrigger: { trigger: "[data-heat-section]", start: "top 75%", end: "center 55%", scrub: 1 } })
      .to(o, { t: 45, ease: "none", onUpdate: () => (temp.textContent = Math.round(o.t)) }, 0)
      .fromTo("[data-heat-section]", { backgroundColor: "#dde0bd" }, { backgroundColor: "#f2d5f8", ease: "none" }, 0)
      .fromTo(".heat__temp", { scale: 0.8, color: "#3a9fd0" }, { scale: 1, color: "#4a051c", ease: "none" }, 0);
    gsap.from("[data-heat-col]", { y: 80, opacity: 0, rotation: (i) => [-4, 0, 4][i], duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".heat__cols", start: "top 85%", once: true } });
  }

  /* 08 · Final CTA — the frame opens and the letters drop in */
  const finalH = $("[data-final-h]");
  if (finalH) {
    gsap.fromTo("[data-final]", { clipPath: "inset(6% 5% 6% 5% round 48px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: "[data-final]", start: "top bottom", end: "top 20%", scrub: true } });
    SplitText.create(finalH, {
      type: "chars, words", autoSplit: true,
      onSplit: (self) => gsap.from(self.chars, {
        yPercent: 120, rotation: () => gsap.utils.random(-30, 30), opacity: 0, stagger: 0.03, ease: "back.out(1.6)",
        scrollTrigger: { trigger: "[data-final]", start: "top 65%", end: "center 55%", scrub: 1 },
      }),
    });
    gsap.from(".final__lead, .final__cta > *", { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".final__cta", start: "top 92%", once: true } });
  }

  /* Listing head: the paragraph slides in beside the heading */
  gsap.from(".listing__head .lead, .filters", { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".listing__head", start: "top 80%", once: true } });
})();

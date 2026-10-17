/* Paws Boutique — homepage choreography (GSAP + ScrollTrigger + SplitText): loader, the husky, and every scroll scene. */
(function () {
  "use strict";
  const S = window.PBSite;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const loader = $("[data-loader]");
  const heroPup = $('[data-pup="hero"]');

  // Manifesto words are split up front so the no-motion layout matches.
  const words = $("[data-words]");
  if (words) words.innerHTML = words.textContent.split(" ").map((w) => `<span class="w">${w}</span>`).join(" ");

  if (!S.motion) {
    loader && loader.remove();
    document.body.removeAttribute("data-loading");
    return;
  }

  /* ---------- The husky: head follows the cursor, tail wags, it breathes, and hops when tapped ---------- */
  function rig(el) {
    const inner = $("[data-pup-in]", el);
    const head = $("[data-pup-head]", el);
    gsap.set(inner, { transformPerspective: 1000 });
    gsap.to(inner, { scaleY: 1.014, scaleX: 0.996, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const turnY = gsap.quickTo(inner, "rotationY", { duration: 0.9, ease: "power3" });
    const turnX = gsap.quickTo(inner, "rotationX", { duration: 0.9, ease: "power3" });
    const hRot = head && gsap.quickTo(head, "rotation", { duration: 0.7, ease: "power3" });
    const hX = head && gsap.quickTo(head, "xPercent", { duration: 0.7, ease: "power3" });
    const hY = head && gsap.quickTo(head, "yPercent", { duration: 0.7, ease: "power3" });
    let lastMove = 0;
    const look = (dx, dy) => {
      turnY(dx * 9);
      turnX(-dy * 4);
      if (head) { hRot(dx * 6); hX(dx * 1.6); hY(dy * 1.1); }
    };
    if (S.finePointer) {
      window.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        lastMove = performance.now();
        const cx = r.left + r.width * 0.6;
        const cy = r.top + r.height * 0.3;
        look(gsap.utils.clamp(-1, 1, (e.clientX - cx) / (innerWidth * 0.45)), gsap.utils.clamp(-1, 1, (e.clientY - cy) / (innerHeight * 0.5)));
      }, { passive: true });
    }
    // Idle: the curious head tilt, then a glance the other way.
    let flip = 1;
    setInterval(() => {
      if (performance.now() - lastMove < 2500 || document.hidden) return;
      flip *= -1;
      look(flip * gsap.utils.random(0.3, 0.8), gsap.utils.random(-0.4, 0.2));
    }, 2200);
    let happyTimer;
    el.addEventListener("click", (e) => {
      window.dispatchEvent(new CustomEvent("pb:poke", { detail: { x: e.clientX, y: e.clientY, canvas: el } }));
      el.classList.add("is-happy");
      clearTimeout(happyTimer);
      happyTimer = setTimeout(() => el.classList.remove("is-happy"), 2400);
      gsap.timeline({ overwrite: true })
        .to(el, { scaleY: 0.86, scaleX: 1.08, duration: 0.11, ease: "power2.out" })
        .to(el, { yPercent: -13, scaleY: 1.08, scaleX: 0.95, duration: 0.28, ease: "power2.out" })
        .to(el, { scaleY: 1, scaleX: 1, duration: 0.2 }, "<0.12")
        .to(el, { yPercent: 0, duration: 0.42, ease: "bounce.out" })
        .to(el, { scaleY: 0.93, scaleX: 1.04, duration: 0.08 }, "-=0.14")
        .to(el, { scaleY: 1, scaleX: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  }
  $$("[data-pup]").forEach(rig);

  /* ---------- Hero headline: "Meet your new best friend / sofa buddy / shadow …" ---------- */
  const rot = $("[data-rot]");
  const rotWords = $$("[data-rot-word]");
  let current = 0;
  function nextWord() {
    const prev = rotWords[current];
    current = (current + 1) % rotWords.length;
    const next = rotWords[current];
    gsap.set(next, { visibility: "visible" });
    gsap.to($$(".rot__c", prev), { yPercent: -115, rotation: () => gsap.utils.random(-20, 20), duration: 0.45, ease: "power3.in", stagger: 0.022, overwrite: true });
    gsap.to(rot, { width: next.offsetWidth, duration: 0.7, ease: "expo.inOut", delay: 0.1 });
    gsap.fromTo($$(".rot__c", next), { yPercent: 115, rotation: () => gsap.utils.random(-20, 20) }, { yPercent: 0, rotation: 0, duration: 0.8, ease: "back.out(1.8)", stagger: 0.03, delay: 0.3, overwrite: true });
  }
  if (rot) {
    rotWords.forEach((w, i) => { w.style.position = "absolute"; if (i) gsap.set($$(".rot__c", w), { yPercent: 115 }); gsap.set(w, { visibility: "visible" }); });
    const fit = () => gsap.set(rot, { width: rotWords[current].offsetWidth });
    fit();
    window.addEventListener("resize", fit);
  }

  /* 01 · Hero scroll — pinned: the headline splits apart, the stickers fly off, the husky leans in, a maroon curtain rises. */
  gsap.timeline({ scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "+=110%", pin: true, scrub: 1, anticipatePin: 1 } })
    .to('[data-h-line="1"]', { xPercent: -45, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
    .to('[data-h-line="2"]', { xPercent: 45, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
    .to("[data-sticker]", { x: (i) => [-1, 1, -1, 1][i] * 340, y: (i) => [-240, -260, 160, 180][i], rotation: (i) => [-50, 50, -40, 40][i], opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
    .to(".hero__foot", { y: 80, opacity: 0, ease: "power2.in", duration: 0.4 }, 0)
    .to(".hero__stage", { scale: 1.2, yPercent: 8, ease: "power1.in", duration: 0.7 }, 0)
    .to(".hero__curtain", { clipPath: "circle(150% at 50% 75%)", ease: "power2.inOut", duration: 0.5 }, 0.5);

  /* ---------- Hero entrance ---------- */
  function heroIntro(fromLoader) {
    document.body.removeAttribute("data-loading");
    S.intro();
    const tl = gsap.timeline();
    if (!fromLoader) tl.from(heroPup, { yPercent: 45, scale: 0.8, opacity: 0, duration: 1.4, ease: "elastic.out(1, 0.55)" }, 0.1);
    tl.from(".hero__disc", { scale: 0, duration: 1.3, ease: "elastic.out(1, 0.6)" }, 0)
      .from("[data-sticker]", { scale: 0, rotation: () => gsap.utils.random(-40, 40), duration: 0.9, stagger: 0.12, ease: "back.out(2.4)" }, 0.6)
      .add(() => bark("Woof!"), fromLoader ? 0.2 : 1);
    // the stickers bob gently afterwards
    $$("[data-sticker]").forEach((st, i) => gsap.to(st, { y: i % 2 ? 9 : -9, duration: 2 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 }));
    setInterval(() => { if (!document.hidden && scrollY < innerHeight) nextWord(); }, 3200);
  }

  /* ---------- Loader: the husky waits with its back turned, turns round at 100%, then jumps into the hero ---------- */
  let seen = false;
  try { seen = sessionStorage.getItem("pb-loaded") === "1"; sessionStorage.setItem("pb-loaded", "1"); } catch (e) {}
  if (!loader || seen) {
    loader && loader.remove();
    heroIntro(false);
  } else {
    S.lenis && S.lenis.stop();
    const back = $("[data-loader-back]", loader);
    const front = $("[data-loader-front]", loader);
    const fill = $("[data-loader-fill]", loader);
    const paw = $("[data-loader-paw]", loader);
    const num = $("[data-loader-n]", loader);
    const msg = $("[data-loader-msg]", loader);
    const msgs = ["Fetching your new best friend…", "Checking vaccination records…", "Fluffing the fur…", "Practising sit and stay…", "Almost there…"];
    gsap.from(back, { yPercent: 30, opacity: 0, duration: 0.8, ease: "back.out(2)" });
    gsap.to(back, { rotation: 2, duration: 0.5, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" });
    const urls = ["husky-head", "husky-body", "husky-tail", "husky-front"].map((n) => `assets/img/brand/${n}.webp`);
    let loaded = 0;
    urls.forEach((u) => { const im = new Image(); im.onload = im.onerror = () => loaded++; im.src = u; });
    const t0 = performance.now();
    const shown = { v: 0 };
    let mi = 0;
    const msgTimer = setInterval(() => {
      mi = (mi + 1) % msgs.length;
      gsap.to(msg, { y: -10, opacity: 0, duration: 0.2, onComplete: () => { msg.textContent = msgs[mi]; gsap.fromTo(msg, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }); } });
    }, 700);
    const tick = () => {
      const target = Math.min(loaded / urls.length, (performance.now() - t0) / 1600);
      shown.v += (target - shown.v) * 0.12;
      const p = Math.min(1, shown.v + 0.002);
      fill.style.width = `${p * 100}%`;
      paw.style.left = `${p * 100}%`;
      paw.style.transform = `rotate(${Math.sin(performance.now() / 90) * 18}deg)`;
      num.textContent = Math.round(p * 100);
      if (p >= 0.995 && loaded === urls.length) { gsap.ticker.remove(tick); finish(); }
    };
    gsap.ticker.add(tick);
    // Never hold the page hostage to a slow network.
    const cap = setTimeout(() => { loaded = urls.length; }, 6000);

    function finish() {
      clearInterval(msgTimer);
      clearTimeout(cap);
      num.textContent = "100";
      msg.textContent = "Ready!";
      gsap.killTweensOf(back);
      const turn = gsap.timeline();
      turn.to(back, { scaleX: 0.82, scaleY: 1.06, rotation: 0, duration: 0.14, ease: "power2.in", transformOrigin: "50% 100%" })
        .set(back, { opacity: 0 })
        .fromTo(front, { opacity: 1, scaleX: 0.82, scaleY: 1.06 }, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" })
        .fromTo("[data-loader-bubble]", { scale: 0, rotation: -14 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(3)" }, "-=0.55")
        .to([msg, ".loader__track", ".loader__pct"], { y: 24, opacity: 0, duration: 0.3, stagger: 0.04, ease: "power2.in" }, "+=0.35")
        .to("[data-loader-bubble]", { scale: 0, duration: 0.2 }, "<")
        .add(() => {
          // Fly the loader husky onto the hero husky, and close the maroon backdrop around it.
          const a = front.getBoundingClientRect();
          const b = heroPup.getBoundingClientRect();
          const cx = b.left + b.width / 2;
          const cy = b.top + b.height * 0.55;
          gsap.timeline({
            onComplete: () => {
              gsap.set(heroPup, { opacity: 1 });
              loader.remove();
              S.lenis && S.lenis.start();
            },
          })
            .to(front, { x: cx - (a.left + a.width / 2), y: b.bottom - a.bottom, scale: b.height / a.height, transformOrigin: "50% 100%", duration: 1.05, ease: "expo.inOut" }, 0)
            .fromTo("[data-loader-bg]", { clipPath: `circle(150% at ${cx}px ${cy}px)` }, { clipPath: `circle(0% at ${cx}px ${cy}px)`, duration: 1.05, ease: "expo.inOut" }, 0)
            .add(() => heroIntro(true), 0.75);
          gsap.set(heroPup, { opacity: 0 });
        });
    }
  }

  // The headline drifts against the cursor, and paw prints follow it across the hero.
  if (S.finePointer) {
    const hero = $("[data-hero]");
    const tx = gsap.quickTo("[data-hero-type]", "x", { duration: 1, ease: "power3" });
    const ty = gsap.quickTo("[data-hero-type]", "y", { duration: 1, ease: "power3" });
    const stickers = $$("[data-sticker]").map((st) => [gsap.quickTo(st, "x", { duration: 1.2, ease: "power3" })]);
    const paw = $(".logo__mark svg").outerHTML;
    let last = null;
    let side = 1;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tx(nx * -30);
      ty(ny * -14);
      stickers.forEach(([sx], i) => sx(nx * (i % 2 ? 26 : -26)));
      if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 70) return;
      const ang = last ? (Math.atan2(e.clientY - last.y, e.clientX - last.x) * 180) / Math.PI + 90 : 0;
      last = { x: e.clientX, y: e.clientY };
      side *= -1;
      const p = document.createElement("span");
      p.className = "pf-fx pf-paw";
      p.innerHTML = paw;
      document.body.appendChild(p);
      const rad = (ang * Math.PI) / 180;
      gsap.set(p, { x: e.clientX - 10 + Math.cos(rad) * side * 10, y: e.clientY - 10 + Math.sin(rad) * side * 10, rotation: ang, scale: 0.4 });
      gsap.timeline({ onComplete: () => p.remove() })
        .to(p, { opacity: 0.45, scale: 1, duration: 0.25, ease: "back.out(3)" })
        .to(p, { opacity: 0, duration: 1.1, delay: 0.4 });
    });
    hero.addEventListener("pointerleave", () => { tx(0); ty(0); stickers.forEach(([sx]) => sx(0)); });
  }

  // The hero husky barks when it's tapped.
  const bubble = $("[data-bubble]");
  const barks = ["Woof!", "Again!", "Hehe.", "Arf arf!", "Good human."];
  let barkN = 0;
  function bark(text) {
    if (!bubble) return;
    bubble.textContent = text;
    gsap.timeline({ overwrite: true })
      .fromTo(bubble, { scale: 0, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(3)" })
      .to(bubble, { scale: 0, duration: 0.25, ease: "power2.in" }, "+=1.2");
  }
  window.addEventListener("pb:poke", (e) => { if (e.detail.canvas === heroPup) bark(barks[barkN++ % barks.length]); });

  // The husky in the footer turns round to look when you reach it.
  const fpup = $("[data-footer-pup]");
  if (fpup) gsap.from(fpup, { yPercent: 50, opacity: 0, rotation: -8, duration: 1.2, ease: "elastic.out(1, 0.55)", scrollTrigger: { trigger: ".footer", start: "top 85%", once: true } });

  /* 02 · Manifesto — words light up as you read */
  if (words) {
    gsap.to($$(".w", words), {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: "[data-manifesto]", start: "top top", end: "+=140%", pin: true, scrub: 0.6 },
    });
  }

  /* 03 · Stats count up; the tilted bands speed up with scroll */
  $$("[data-count]").forEach((el) => {
    const to = +el.dataset.count, o = { v: 0 };
    el.textContent = "0";
    gsap.to(o, { v: to, duration: to > 1 ? 2.2 : 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true }, onUpdate: () => (el.textContent = Math.round(o.v)) });
    gsap.from(el, { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  const loops = $$("[data-band]").map((track) => {
    const dir = +track.dataset.band;
    gsap.set(track, { xPercent: dir > 0 ? -50 : 0 });
    return gsap.to(track, { xPercent: dir > 0 ? 0 : -50, duration: 40, ease: "none", repeat: -1 });
  });
  if (loops.length) {
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300) || 0;
        loops.forEach((l) => {
          gsap.to(l, { timeScale: (1 + Math.abs(v) * 1.5) * self.direction, duration: 0.2, overwrite: true });
          gsap.to(l, { timeScale: self.direction, duration: 1.2, delay: 0.2, overwrite: false });
        });
      },
    });
    gsap.from(".mband", { xPercent: (i) => (i ? 30 : -30), duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".mbands", start: "top 95%", once: true } });
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

  /* 05 · How it works — pinned: the phone acts out a price request from tap to visit */
  const proc = $("[data-process]");
  if (proc) {
    const steps = $$("[data-steplist] li", proc);
    const setStep = (i) => steps.forEach((li, k) => li.classList.toggle("on", k === i));
    const scr = (i) => $(`[data-scr="${i}"]`, proc);
    const tap = (i) => $(`[data-tap="${i}"]`, proc);
    const open = "circle(150% at 50% 92%)";
    gsap.set([scr(1), scr(2), scr(3)], { clipPath: "circle(0% at 50% 92%)" });
    const msgs = $$("[data-msg]", proc);
    const typing = $(".msg--typing", proc);
    const list = $("[data-chat-list]", proc);
    gsap.set(msgs, { opacity: 0, y: 14, scale: 0.92, transformOrigin: "50% 100%" });
    const picked = { backgroundColor: "#4a051c", color: "#f8f9f2", borderColor: "#4a051c", duration: 0.15 };
    const ping = (t, i) => tl.fromTo(tap(i), { scale: 0.4, opacity: 0.9 }, { scale: 2.2, opacity: 0, duration: 0.45, ease: "power2.out" }, t);
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: proc, start: "top top", end: () => `+=${innerHeight * 3.4}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: () => { const t = tl.time(); setStep(t < 3.3 ? 0 : t < 7.5 ? 1 : t < 9 ? 2 : 3); },
      },
    });
    ping(0.3, 0);
    tl.to(".app__card.is-target", { scale: 0.94, duration: 0.15, yoyo: true, repeat: 1 }, 0.3)
      .to(scr(1), { clipPath: open, duration: 0.8 }, 0.75);
    ping(1.7, 1);
    tl.to('[data-pick="1"]', picked, 1.75)
      .to('[data-mini-flash="0"]', { xPercent: -130, rotation: -16, duration: 0.6, ease: "power2.in" }, 2.0)
      .to('[data-mini-flash="1"]', { y: 0, scale: 1, duration: 0.5 }, 2.25);
    ping(2.8, 2);
    tl.to('[data-pick="2"]', picked, 2.85)
      .to(scr(2), { clipPath: open, duration: 0.8 }, 3.3);
    msgs.forEach((m, i) => tl.to(m, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(2)" }, 4.1 + i * 0.45));
    tl.to(typing, { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: -7, duration: 0.2 }, 4.95)
      .to(list, { y: () => -Math.max(0, list.scrollHeight - list.parentElement.clientHeight), duration: 1.8, ease: "none" }, 5.5)
      .to(scr(3), { clipPath: open, duration: 0.8 }, 7.6)
      .from("[data-pin]", { y: -90, opacity: 0, duration: 0.6, ease: "bounce.out" }, 8.2)
      .from("[data-check]", { x: 30, opacity: 0, stagger: 0.15, duration: 0.3, ease: "back.out(2)" }, 8.5)
      .from("[data-visit-stamp]", { scale: 2.6, opacity: 0, rotation: 30, duration: 0.4, ease: "power4.in" }, 9.1)
      .to({}, { duration: 0.6 });
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

  // The CTA puppy talks.
  const speech = $("[data-speech]");
  if (speech) {
    const lines = JSON.parse(speech.dataset.speech);
    let li = 0;
    gsap.from(speech, { scale: 0, transformOrigin: "15% 100%", duration: 0.7, ease: "back.out(3)", scrollTrigger: { trigger: "[data-final]", start: "top 60%", once: true } });
    setInterval(() => {
      if (document.hidden || speech.getBoundingClientRect().bottom < 0 || speech.getBoundingClientRect().top > innerHeight) return;
      li = (li + 1) % lines.length;
      gsap.to(speech, { scale: 0, duration: 0.2, transformOrigin: "15% 100%", onComplete: () => { speech.textContent = lines[li]; gsap.to(speech, { scale: 1, duration: 0.5, ease: "back.out(3)" }); } });
    }, 2800);
    window.addEventListener("pb:poke", (e) => {
      if (e.detail.canvas === heroPup) return;
      speech.textContent = "Hehe. Now ask for my price.";
      gsap.fromTo(speech, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    });
  }

  /* Listing head: the paragraph slides in beside the heading */
  gsap.from(".listing__head .lead, .filters", { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".listing__head", start: "top 80%", once: true } });
})();

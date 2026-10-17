/* Paws Boutique — shared behaviour: smooth scroll, header, cursor, magnetic buttons, reveals, breed grid, quote flashcards. */
(function () {
  "use strict";

  const PB = window.PB;
  const C = PB.company;
  const docEl = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const motion = hasGsap && !reduced;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const byId = Object.fromEntries(PB.breeds.map((b) => [b.id, b]));

  window.PB_READY = true;
  if (!motion) docEl.classList.add("no-motion");
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, ...[window.SplitText, window.Flip].filter(Boolean));

  /* ---------- Smooth scroll (Lenis) on GSAP's ticker ---------- */
  let lenis = null;
  if (motion && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const headerH = () => parseInt(getComputedStyle(docEl).getPropertyValue("--header-h")) || 76;
  function scrollToEl(el) {
    if (!el) return;
    const offset = -headerH() + (el.matches("section") ? 0 : -20);
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? "auto" : "smooth" });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    closeMenu();
    history.replaceState(null, "", url.hash);
    scrollToEl(el);
  });

  /* ---------- Header + progress ---------- */
  const header = $("[data-header]");
  const bar = $("[data-progress]");
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 24);
    header.classList.toggle("is-hidden", y > lastY && y > 500 && !document.body.classList.contains("menu-open"));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menu = $("[data-mobile-menu]");
  const menuBtn = $("[data-menu-toggle]");
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    lenis && lenis.start();
  }
  menuBtn && menuBtn.addEventListener("click", () => {
    if (!menu.hidden) return closeMenu();
    menu.hidden = false;
    document.body.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    lenis && lenis.stop();
    if (motion) {
      gsap.fromTo(menu, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" });
      gsap.from($$("nav a, .mobile-menu__foot > *", menu), { y: 40, opacity: 0, duration: 0.8, stagger: 0.05, ease: "expo.out", delay: 0.25 });
    }
  });
  menu && menu.addEventListener("click", (e) => e.target.closest("a") && closeMenu());

  /* ---------- Cursor (desktop only) ---------- */
  if (motion && finePointer) {
    const cur = $(".cursor");
    const dot = $(".cursor__dot", cur);
    const ring = $(".cursor__ring", cur);
    const label = $("[data-cursor-label]", cur);
    docEl.classList.add("has-cursor");
    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    window.addEventListener("pointermove", (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button, summary, label, select, input");
      cur.classList.toggle("is-label", !!t);
      cur.classList.toggle("is-link", !t && !!link);
      if (t) label.textContent = t.dataset.cursor;
    });
    document.addEventListener("pointerleave", () => gsap.to(cur, { opacity: 0, duration: 0.2 }));
    document.addEventListener("pointerenter", () => gsap.to(cur, { opacity: 1, duration: 0.2 }));
  }

  /* ---------- Magnetic buttons + card tilt ---------- */
  if (motion && finePointer) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.5, ease: "power3.out" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" }));
    });
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest("[data-card]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotationY: px * 7, rotationX: -py * 7, transformPerspective: 900, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const card = e.target.closest("[data-card]");
      if (card && !card.contains(e.relatedTarget)) gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" });
    });
  }

  /* ---------- Entrance + scroll reveals ---------- */
  // Draws the lilac highlighter stroke under key words, left to right.
  function highlight(ems) {
    return gsap.fromTo(ems, { backgroundSize: "0% 0.38em" }, { backgroundSize: "100% 0.38em", duration: 1, stagger: 0.15, ease: "expo.inOut" });
  }

  function intro() {
    if (!motion) return null;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } })
      .to(".line > span", { y: 0, duration: 1.4, stagger: 0.09 }, 0)
      .to("[data-hero-in]", { opacity: 1, duration: 0.01 }, 0.2)
      .from("[data-hero-in]", { y: 30, duration: 1.1, stagger: 0.08 }, 0.2)
      .add(highlight($$(".hero__h1 em, .page-hero__h em")), 0.9);
    const media = $("[data-breed-media]");
    if (media) tl.from(media, { clipPath: "inset(100% 0% 0% 0% round 32px)", duration: 1.6, ease: "expo.inOut" }, 0).from($("img, .art", media), { scale: 1.25, duration: 2, ease: "expo.out" }, 0.2);
    return tl;
  }

  function reveals() {
    if (!motion) return;
    // Headings rise in line by line.
    if (window.SplitText) {
      $$(".h2:not([data-no-split]), .footer__h").forEach((el) => {
        SplitText.create(el, {
          type: "lines", mask: "lines", autoSplit: true,
          onSplit: (self) => gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } })
            .from(self.lines, { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "expo.out" })
            .add(highlight(el.querySelectorAll("em")), 0.5),
        });
      });
    }
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%", once: true,
      onEnter: (els) => gsap.from(els, { y: 50, opacity: 0, duration: 1, stagger: 0.07, ease: "expo.out" }),
    });
    $$(".eyebrow").forEach((el) => gsap.from(el, { opacity: 0, x: -20, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } }));
    $$(".footer__word").forEach((el) => gsap.fromTo(el, { xPercent: 12 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }));
  }

  /* ---------- FAQ: animated open/close ---------- */
  $$(".qa").forEach((d) => {
    const s = $("summary", d);
    const body = $(".qa__a", d);
    s.addEventListener("click", (e) => {
      if (!motion) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, opacity: 0, duration: 0.5, ease: "expo.inOut", onComplete: () => { d.open = false; gsap.set(body, { clearProps: "all" }); ScrollTrigger.refresh(); } });
      } else {
        d.open = true;
        gsap.fromTo(body, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.7, ease: "expo.out", onComplete: () => ScrollTrigger.refresh() });
      }
    });
  });

  /* ---------- Breed grid: filters (Flip), search, toggles ---------- */
  function initGrid() {
    const grid = $("[data-grid]");
    const tabsWrap = $("[data-filters]");
    if (!grid || !tabsWrap) return;
    const cards = $$("[data-card]", grid);
    const tabs = $$("[data-filter]", tabsWrap);
    const pill = $("[data-filter-pill]", tabsWrap);
    const search = $("[data-search-input]");
    const flat = $("[data-flat-filter]");
    const heat = $("[data-heat-filter]");
    const count = $("[data-result-count]");
    const empty = $("[data-empty]");
    const param = new URLSearchParams(location.search).get("size");
    let size = (param && tabs.some((t) => t.dataset.filter === param) && param) || (tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0]).dataset.filter;

    const match = (c) => {
      if (size === "popular" && !c.hasAttribute("data-featured")) return false;
      if (size !== "all" && size !== "popular" && c.dataset.size !== size) return false;
      const q = search ? search.value.trim().toLowerCase() : "";
      if (q && !c.dataset.search.includes(q)) return false;
      if (flat && flat.checked && c.dataset.flat !== "true") return false;
      if (heat && heat.checked && c.dataset.heat !== "good") return false;
      return true;
    };
    function movePill(animate) {
      const t = tabs.find((x) => x.dataset.filter === size);
      tabs.forEach((x) => x.setAttribute("aria-selected", String(x === t)));
      if (!pill || !motion) return;
      const props = { x: t.offsetLeft, y: t.offsetTop, width: t.offsetWidth, height: t.offsetHeight };
      animate ? gsap.to(pill, { ...props, duration: 0.6, ease: "expo.out" }) : gsap.set(pill, props);
      tabsWrap.classList.add("is-ready");
    }
    function apply(animate) {
      const state = animate && motion && window.Flip ? Flip.getState(cards) : null;
      let n = 0;
      cards.forEach((c) => { const m = match(c); c.hidden = !m; if (m) n++; });
      if (count) count.textContent = n;
      if (empty) empty.hidden = n > 0;
      if (state) {
        Flip.from(state, {
          duration: 0.8, ease: "expo.inOut", absolute: true, scale: true, stagger: 0.015, prune: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8, y: 40, rotationX: -30 }, { opacity: 1, scale: 1, y: 0, rotationX: 0, duration: 0.8, stagger: 0.04, ease: "expo.out", delay: 0.15 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.in" }),
          onComplete: () => ScrollTrigger.refresh(),
        });
      } else if (hasGsap) ScrollTrigger.refresh();
    }
    tabs.forEach((t) => t.addEventListener("click", () => { if (size === t.dataset.filter) return; size = t.dataset.filter; movePill(true); apply(true); }));
    let qTimer;
    search && search.addEventListener("input", () => { clearTimeout(qTimer); qTimer = setTimeout(() => apply(true), 180); });
    [flat, heat].forEach((el) => el && el.addEventListener("change", () => apply(true)));
    window.addEventListener("resize", () => movePill(false));
    movePill(false);
    apply(false);
    if (document.fonts) document.fonts.ready.then(() => movePill(false));

    if (motion) {
      const visible = cards.filter((c) => !c.hidden);
      gsap.set(visible, { opacity: 0, y: 90, rotationX: -22, transformPerspective: 1000, transformOrigin: "50% 0%" });
      ScrollTrigger.batch(visible, {
        start: "top 92%", once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, rotationX: 0, duration: 1.1, stagger: 0.09, ease: "expo.out" }),
      });
    }
  }

  /* ---------- Quote flashcards ---------- */
  const Quote = (function () {
    const root = $("[data-quote]");
    if (!root) return { open() {} };
    const panel = $(".quote__panel", root);
    const form = $("[data-deck]", root);
    const flashes = $$(".flash", form);
    const order = flashes.map((f) => f.dataset.flash);
    const select = $("[data-q-breed]", root);
    const title = $("[data-q-title]", root);
    const barEl = $("[data-q-bar]", root);
    const countEl = $("[data-q-count]", root);
    const back = $("[data-back]", root);
    const err = $("[data-q-err]", root);
    const waBtn = $("[data-q-wa]", root);
    const total = order.length - 1;
    const state = {};
    let idx = 0;
    let lastFocus = null;

    const breedName = (id) => (id === "help" ? null : byId[id] && byId[id].name);
    function setTitle() {
      const n = breedName(select.value);
      title.textContent = n ? `a ${n}` : "your puppy";
    }
    select.addEventListener("change", setTitle);

    function layout(animate) {
      flashes.forEach((f, i) => {
        const o = i - idx;
        f.classList.toggle("is-current", o === 0);
        f.inert = o !== 0;
        f.setAttribute("aria-hidden", String(o !== 0));
        if (!motion) return;
        const p =
          o < 0 ? { xPercent: -125, yPercent: -6, rotation: -16, scale: 1, opacity: 0, zIndex: 20 } :
          o === 0 ? { xPercent: 0, yPercent: 0, y: 0, rotation: 0, scale: 1, opacity: 1, zIndex: 10 } :
          o === 1 ? { xPercent: 0, yPercent: 0, y: 14, rotation: 2.2, scale: 0.95, opacity: 1, zIndex: 9 } :
          o === 2 ? { xPercent: 0, yPercent: 0, y: 26, rotation: -1.8, scale: 0.9, opacity: 0.85, zIndex: 8 } :
          { xPercent: 0, yPercent: 0, y: 34, rotation: 0, scale: 0.86, opacity: 0, zIndex: 7 };
        if (animate) gsap.to(f, { ...p, duration: o < 0 ? 0.6 : 0.85, ease: o < 0 ? "power3.in" : "expo.out", overwrite: true });
        else gsap.set(f, p);
      });
      const step = Math.min(idx + 1, total);
      barEl.style.width = `${(Math.min(idx + 1, total) / total) * 100}%`;
      countEl.textContent = step;
      back.disabled = idx === 0 || idx === total;
      $(".quote__count", root).style.visibility = idx === total ? "hidden" : "visible";
    }
    // The deck is as tall as its tallest card, so nothing overflows on small screens.
    function fitDeck() {
      form.style.height = "";
      const h = Math.max(...flashes.map((f) => f.scrollHeight));
      form.style.height = `${Math.max(h + 24, 300)}px`;
    }
    window.addEventListener("resize", () => { if (!root.hidden) fitDeck(); });
    function go(i) {
      idx = Math.max(0, Math.min(total, i));
      layout(true);
      const f = flashes[idx];
      setTimeout(() => { const t = $("input:not([type=hidden]), select, .choice, .btn", f) || f; t.focus({ preventScroll: true }); }, motion ? 450 : 0);
    }

    $$("[data-group]", root).forEach((g) => {
      g.addEventListener("click", (e) => {
        const b = e.target.closest("[data-choice]");
        if (!b) return;
        $$(".choice", g).forEach((x) => x.classList.toggle("is-picked", x === b));
        state[g.dataset.group] = b.dataset.choice;
        if (motion) gsap.fromTo(b, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" });
        setTimeout(() => go(idx + 1), motion ? 320 : 0);
      });
    });
    $$("[data-next]", root).forEach((b) => b.addEventListener("click", () => go(idx + 1)));
    back.addEventListener("click", () => go(idx - 1));

    function normPhone(v) {
      let d = String(v).replace(/\D/g, "");
      if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
      if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
      return /^[6-9]\d{9}$/.test(d) ? d : null;
    }
    function message() {
      const n = breedName(state.breed);
      return [
        `Hi ${C.name}, ${n ? `I'd like the price for a ${n} puppy.` : "I'd like help choosing a breed."}`,
        state.gender && `Gender: ${state.gender}`,
        state.when && `When: ${state.when}`,
        `Name: ${state.name}`,
        `WhatsApp: +91 ${state.phone}`,
        state.city && `City: ${state.city}`,
      ].filter(Boolean).join("\n");
    }
    const waUrl = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;

    function done(kind) {
      const n = breedName(state.breed);
      const first = state.name.split(" ")[0];
      $("[data-q-done-title]", root).textContent = `Thank you, ${first}.`;
      $("[data-q-done-text]", root).textContent =
        kind === "sent" ? `We'll WhatsApp the price${n ? ` of our ${n} puppies` : ""}, with photos and videos, to +91 ${state.phone} shortly.` :
        kind === "failed" ? "We couldn't send that automatically. Tap below to send it to us on WhatsApp instead." :
        "Your message is ready in WhatsApp — just tap send. If it didn't open, use the button below.";
      waBtn.href = waUrl(message());
      go(total);
      if (motion) {
        const path = $(".check-path", flashes[total]);
        const len = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.8, delay: 0.5, ease: "power2.out" });
        gsap.fromTo(".done__icon", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: "elastic.out(1, 0.5)" });
        burst();
      }
    }
    function burst() {
      const host = flashes[total];
      const paw = $(".logo__mark svg").outerHTML;
      for (let i = 0; i < 14; i++) {
        const s = document.createElement("span");
        s.innerHTML = paw;
        s.style.cssText = "position:absolute;left:50%;top:38%;width:22px;color:var(--caramel-2);pointer-events:none";
        host.appendChild(s);
        const a = (i / 14) * Math.PI * 2;
        gsap.fromTo(s, { x: -11, y: -11, scale: 0, rotation: 0 }, {
          x: Math.cos(a) * gsap.utils.random(110, 190) - 11, y: Math.sin(a) * gsap.utils.random(90, 150) - 11,
          scale: gsap.utils.random(0.6, 1.2), rotation: gsap.utils.random(-120, 120), duration: 1.4, delay: 0.35, ease: "expo.out",
          onComplete: () => gsap.to(s, { opacity: 0, duration: 0.4, onComplete: () => s.remove() }),
        });
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = normPhone(fd.get("phone"));
      const nameEl = form.elements.name, phoneEl = form.elements.phone;
      nameEl.setAttribute("aria-invalid", String(name.length < 2));
      phoneEl.setAttribute("aria-invalid", String(!phone));
      if (name.length < 2 || !phone) {
        err.textContent = name.length < 2 ? "Please enter your name." : "Please enter a valid 10-digit mobile number.";
        if (motion) gsap.fromTo(flashes[idx], { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1.2, 0.25)" });
        (name.length < 2 ? nameEl : phoneEl).focus();
        return;
      }
      err.textContent = "";
      Object.assign(state, { breed: select.value, name, phone, city: String(fd.get("city") || "").trim() });
      if (C.leadWebhook) {
        const payload = { ...state, breedName: breedName(state.breed) || "Help me choose", page: location.href, submittedAt: new Date().toISOString(), message: message() };
        fetch(C.leadWebhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
          .then((r) => done(r.ok ? "sent" : "failed"))
          .catch(() => done("failed"));
      } else {
        window.open(waUrl(message()), "_blank", "noopener");
        done("wa");
      }
    });

    function trap(e) {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const f = $$('a[href], button:not([disabled]), input, select', panel).filter((x) => !x.closest("[inert]") && x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function open(breedId) {
      lastFocus = document.activeElement;
      closeMenu();
      form.reset();
      Object.keys(state).forEach((k) => delete state[k]);
      $$(".choice", root).forEach((x) => x.classList.remove("is-picked"));
      $$("[aria-invalid]", root).forEach((x) => x.removeAttribute("aria-invalid"));
      err.textContent = "";
      if (breedId && (byId[breedId] || breedId === "help")) select.value = breedId;
      state.breed = select.value;
      setTitle();
      idx = breedId ? 1 : 0; // breed already chosen from a card: start on the next card
      root.hidden = false;
      document.body.classList.add("quote-open");
      lenis && lenis.stop();
      document.addEventListener("keydown", trap);
      fitDeck();
      layout(false);
      if (motion) {
        const live = flashes.filter((_, i) => i >= idx && i <= idx + 2);
        gsap.timeline()
          .fromTo(".quote__scrim", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
          .fromTo(panel, { y: 80, opacity: 0, scale: 0.96, rotationX: 10, transformPerspective: 1200 }, { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.9, ease: "expo.out" }, 0)
          .from(live.slice().reverse(), { y: 260, rotation: (i) => [-14, 10, -6][i] || 0, opacity: 0, duration: 0.9, stagger: 0.09, ease: "expo.out" }, 0.15);
      }
      setTimeout(() => { const t = $("select, .choice", flashes[idx]); t && t.focus({ preventScroll: true }); }, motion ? 600 : 0);
    }
    function close() {
      document.removeEventListener("keydown", trap);
      const fin = () => { root.hidden = true; document.body.classList.remove("quote-open"); lenis && lenis.start(); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); };
      if (!motion) return fin();
      gsap.timeline({ onComplete: fin })
        .to(panel, { y: 60, opacity: 0, scale: 0.97, duration: 0.4, ease: "power3.in" }, 0)
        .to(".quote__scrim", { opacity: 0, duration: 0.4 }, 0.1);
    }

    document.addEventListener("click", (e) => {
      const o = e.target.closest("[data-quote-open]");
      if (o) { e.preventDefault(); open(o.dataset.quoteOpen); return; }
      if (e.target.closest("[data-quote-close]")) close();
    });
    return { open, close };
  })();

  initGrid();
  reveals();
  if (hasGsap) {
    window.addEventListener("load", () => ScrollTrigger.refresh());
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  // The homepage runs its own intro after the preloader.
  if (document.body.dataset.page !== "home") intro();

  window.PBSite = { motion, reduced, hasGsap, lenis, finePointer, intro, quote: Quote, scrollToEl };
})();

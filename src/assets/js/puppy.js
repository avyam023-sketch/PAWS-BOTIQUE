/*
 * Paws Boutique — the 3D puppy.
 * Built from primitives in code (no model files), so the client owns it outright.
 * Mounts on every <canvas data-puppy>. The head follows the cursor, the tail wags, floppy ears swing,
 * it blinks, tilts its head when idle, hops when tapped, and spins into a new coat on "pb:breed".
 *
 * Events in:  pb:breed {id, canvas?}  pb:reveal
 * Events out: pb:poke  {x, y}          (the page draws hearts and a speech bubble)
 */
import * as THREE from "../vendor/three.module.min.js";

const gsap = window.gsap;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Coats: main, light (muzzle/chest/paws), ear, brow spots (or null), eye, ear style.
export const COATS = {
  labrador: { main: "#e2b97f", light: "#f6e4c6", ear: "#cf9f62", brow: null, eye: "#2a1610", ears: "floppy" },
  husky: { main: "#6c7782", light: "#f4f5f6", ear: "#59636e", brow: "#f4f5f6", eye: "#49aee8", ears: "up" },
  golden: { main: "#d39a4c", light: "#edc98d", ear: "#bf833a", brow: null, eye: "#2a1610", ears: "floppy" },
  shepherd: { main: "#2c2420", light: "#bd7a3e", ear: "#221b17", brow: "#bd7a3e", eye: "#2a1610", ears: "up" },
  pomeranian: { main: "#ea8f3e", light: "#f8cd96", ear: "#db7f2e", brow: null, eye: "#2a1610", ears: "up" },
  beagle: { main: "#b9733d", light: "#f8f2e9", ear: "#6b3a1e", brow: null, eye: "#2a1610", ears: "floppy" },
};
const COLLAR = "#89daff";
const TAG = "#f2d5f8";
const NOSE = "#2e0211";
const TONGUE = "#ef8ea6";
const BLUSH = "#f2d5f8";

function makePuppy() {
  const std = (hex, rough = 0.92) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0 });
  const mats = {
    main: std(COATS.labrador.main),
    light: std(COATS.labrador.light),
    ear: std(COATS.labrador.ear),
    brow: std("#ffffff"),
    eye: std(COATS.labrador.eye, 0.18),
    nose: std(NOSE, 0.28),
    tongue: std(TONGUE, 0.5),
    collar: std(COLLAR, 0.5),
    tag: std(TAG, 0.35),
    shine: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    blush: new THREE.MeshBasicMaterial({ color: BLUSH, transparent: true, opacity: 0.85 }),
  };
  const ball = new THREE.SphereGeometry(1, 48, 32);
  const blob = (mat, s, p, r) => {
    const m = new THREE.Mesh(ball, mat);
    m.scale.set(...s);
    m.position.set(...p);
    if (r) m.rotation.set(...r);
    return m;
  };

  const dog = new THREE.Group(); // hops and rises
  const body = new THREE.Group(); // turns a little with the head, breathes
  dog.add(body);

  // body, sitting
  body.add(blob(mats.main, [0.44, 0.52, 0.44], [0, 0.58, -0.06], [-0.22, 0, 0]));
  body.add(blob(mats.light, [0.24, 0.3, 0.18], [0, 0.78, 0.22], [-0.25, 0, 0]));
  for (const s of [-1, 1]) {
    body.add(blob(mats.main, [0.24, 0.24, 0.36], [s * 0.29, 0.25, -0.08]));
    body.add(blob(mats.main, [0.12, 0.075, 0.2], [s * 0.32, 0.055, 0.16]));
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.4, 8, 20), mats.main);
    leg.position.set(s * 0.15, 0.29, 0.24);
    leg.rotation.z = s * -0.05;
    body.add(leg);
    body.add(blob(mats.light, [0.11, 0.07, 0.14], [s * 0.15, 0.055, 0.32]));
  }

  // tail
  const tail = new THREE.Group();
  tail.position.set(0, 0.24, -0.48);
  const tailMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.42, 8, 16), mats.main);
  tailMesh.position.set(0, 0.26, -0.08);
  tailMesh.rotation.x = -0.5;
  tail.add(tailMesh);
  tail.add(blob(mats.light, [0.085, 0.1, 0.085], [0, 0.5, -0.2]));
  body.add(tail);

  // collar + tag
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 16, 64), mats.collar);
  collar.position.set(0, 0.98, 0.03);
  collar.rotation.x = Math.PI / 2 - 0.25;
  body.add(collar);
  const tag = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.025, 32), mats.tag);
  tag.position.set(0, 0.86, 0.27);
  tag.rotation.x = Math.PI / 2 - 0.25;
  body.add(tag);

  // head (pivot in the neck)
  const head = new THREE.Group();
  head.position.set(0, 1.0, 0.05);
  head.scale.setScalar(1.28); // big head, small body: puppy proportions
  body.add(head);
  head.add(blob(mats.main, [0.42, 0.38, 0.39], [0, 0.32, 0.04]));
  head.add(blob(mats.light, [0.2, 0.14, 0.22], [0, 0.22, 0.36]));
  head.add(blob(mats.light, [0.12, 0.07, 0.12], [0, 0.12, 0.3]));
  head.add(blob(mats.nose, [0.07, 0.05, 0.055], [0, 0.29, 0.56]));
  head.add(blob(mats.shine, [0.018, 0.011, 0.01], [-0.018, 0.312, 0.605]));
  const tongue = blob(mats.tongue, [0.065, 0.025, 0.09], [0, 0.1, 0.42], [0.5, 0, 0]);
  tongue.scale.multiplyScalar(0.001);
  head.add(tongue);

  const eyes = [];
  const brows = [];
  for (const s of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(s * 0.15, 0.4, 0.38);
    eye.add(blob(mats.eye, [0.05, 0.056, 0.035], [0, 0, 0]));
    eye.add(blob(mats.shine, [0.016, 0.016, 0.01], [s * -0.012 + 0.012, 0.022, 0.036]));
    head.add(eye);
    eyes.push(eye);
    const brow = blob(mats.brow, [0.045, 0.022, 0.03], [s * 0.13, 0.49, 0.365]);
    head.add(brow);
    brows.push(brow);
    head.add(blob(mats.blush, [0.06, 0.035, 0.015], [s * 0.25, 0.25, 0.34], [0, s * 0.6, 0]));
  }

  // ears: a floppy and an upright version on each side; the coat decides which one shows
  const ears = [];
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.3, 0.58, -0.02);
    head.add(pivot);
    const flop = new THREE.Group();
    flop.add(blob(mats.ear, [0.12, 0.26, 0.055], [s * 0.03, -0.21, 0.02]));
    flop.rotation.z = s * 0.25;
    pivot.add(flop);
    const up = new THREE.Group();
    up.position.set(-s * 0.05, 0.02, 0);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 32), mats.ear);
    cone.position.y = 0.16;
    cone.scale.z = 0.45;
    up.add(cone);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 24), mats.blush);
    inner.position.set(0, 0.13, 0.055);
    inner.scale.z = 0.3;
    up.add(inner);
    up.rotation.z = s * -0.28;
    up.scale.setScalar(0.001);
    pivot.add(up);
    ears.push({ s, pivot, flop, up, swing: 0, vel: 0 });
  }

  return { dog, body, head, tail, tongue, eyes, brows, ears, mats };
}

// A soft round shadow on the floor, drawn once into a canvas.
function shadowMesh() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(74,5,28,0.32)");
  grad.addColorStop(1, "rgba(74,5,28,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(0, 0.002, 0.05);
  return m;
}

function mount(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    canvas.parentElement.classList.add("no-webgl");
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 50);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdcc6e6, 2.0));
  const key = new THREE.DirectionalLight(0xfff6ea, 2.4);
  key.position.set(-2.5, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x89daff, 2.2);
  rim.position.set(3, 2.5, -4);
  scene.add(rim);

  const P = makePuppy();
  scene.add(P.dog);
  const shadow = shadowMesh();
  scene.add(shadow);

  // Frame the dog: it is ~1.95 units tall and ~1.4 wide (with ears and tail).
  const target = new THREE.Vector3(0, 0.98, 0);
  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fov = (camera.fov * Math.PI) / 180;
    const fitH = 2.6 / 2 / Math.tan(fov / 2);
    const fitW = 1.9 / 2 / (Math.tan(fov / 2) * camera.aspect);
    const d = Math.max(fitH, fitW);
    camera.position.set(0, 1.25, d);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(layout).observe(canvas);
  layout();

  // ---- state ----
  const S = { yaw: 0, pitch: 0, tilt: 0, hop: 0, squash: 1, rise: reduced ? 1 : 0, happy: 0, wag: 0, spin: 0, blink: 1 };
  const mouse = { x: 0, y: 0, at: -1e9, over: false };
  let coat = "labrador";
  const headWorld = new THREE.Vector3();

  window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.at = performance.now(); }, { passive: true });
  canvas.addEventListener("pointerenter", () => (mouse.over = true));
  canvas.addEventListener("pointerleave", () => (mouse.over = false));

  function poke(e) {
    window.dispatchEvent(new CustomEvent("pb:poke", { detail: { x: e.clientX, y: e.clientY, canvas } }));
    if (reduced || !gsap) return;
    S.happy = 1;
    gsap.timeline()
      .to(S, { squash: 0.82, duration: 0.12, ease: "power2.out" })
      .to(S, { squash: 1.12, hop: 0.42, duration: 0.3, ease: "power2.out" })
      .to(S, { squash: 1, duration: 0.2 }, "<0.15")
      .to(S, { hop: 0, duration: 0.32, ease: "bounce.out" })
      .to(S, { squash: 0.9, duration: 0.08 }, "-=0.12")
      .to(S, { squash: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  }
  canvas.addEventListener("click", poke);

  // Coat change: spin once, swap colours mid-turn, flip the ears.
  function setCoat(id, instant) {
    const c = COATS[id];
    if (!c || id === coat) return;
    coat = id;
    const lin = (hex) => new THREE.Color(hex);
    const pairs = [[P.mats.main, c.main], [P.mats.light, c.light], [P.mats.ear, c.ear], [P.mats.eye, c.eye], [P.mats.brow, c.brow || c.main]];
    const upright = c.ears === "up";
    const earScale = id === "pomeranian" ? 0.78 : 1;
    if (instant || reduced || !gsap) {
      pairs.forEach(([m, hex]) => m.color.copy(lin(hex)));
      P.ears.forEach((e) => { e.up.scale.setScalar(upright ? earScale : 0.001); e.flop.scale.setScalar(upright ? 0.001 : 1); });
      P.brows.forEach((b) => (b.visible = !!c.brow));
      return;
    }
    const tl = gsap.timeline();
    tl.to(S, { spin: S.spin + Math.PI * 2, duration: 1.1, ease: "expo.inOut" }, 0)
      .to(S, { hop: 0.3, duration: 0.45, ease: "power2.out", yoyo: true, repeat: 1 }, 0);
    pairs.forEach(([m, hex]) => { const t = lin(hex); tl.to(m.color, { r: t.r, g: t.g, b: t.b, duration: 0.5, ease: "power2.inOut" }, 0.3); });
    tl.add(() => P.brows.forEach((b) => (b.visible = !!c.brow)), 0.55);
    P.ears.forEach((e) => {
      tl.to((upright ? e.flop : e.up).scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.25, ease: "power2.in" }, 0.3)
        .to((upright ? e.up : e.flop).scale, { x: upright ? earScale : 1, y: upright ? earScale : 1, z: upright ? earScale : 1, duration: 0.7, ease: "elastic.out(1, 0.45)" }, 0.55);
    });
  }
  window.addEventListener("pb:breed", (e) => { if (!e.detail.canvas || e.detail.canvas === canvas) setCoat(e.detail.id); });
  if (canvas.dataset.coat) setCoat(canvas.dataset.coat, true);
  P.brows.forEach((b) => (b.visible = !!COATS[coat].brow));

  // Pop up from below once the page is revealed.
  function rise() {
    if (reduced || !gsap) { S.rise = 1; return; }
    gsap.to(S, { rise: 1, duration: 1.6, ease: "elastic.out(1, 0.5)", delay: 0.2 });
  }
  if (canvas.dataset.rise === "reveal") {
    if (window.PB_REVEALED) rise();
    else window.addEventListener("pb:reveal", rise, { once: true });
  }
  else {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { rise(); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(canvas);
  }

  // Blink every few seconds.
  (function blinkLoop() {
    setTimeout(() => {
      if (gsap && !reduced) gsap.to(S, { blink: 0.08, duration: 0.07, yoyo: true, repeat: Math.random() < 0.25 ? 3 : 1, ease: "power1.inOut" });
      blinkLoop();
    }, 2200 + Math.random() * 3200);
  })();

  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(canvas);

  let prev = performance.now();
  function frame(now) {
    if (!reduced) requestAnimationFrame(frame);
    if (!visible || document.hidden) { prev = now; return; }
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    const t = now / 1000;
    const idle = now - mouse.at > 3000;
    S.happy = Math.max(0, S.happy - dt * 0.35);
    const happy = Math.max(S.happy, mouse.over ? 0.7 : 0);

    // where is the head on screen?
    P.head.getWorldPosition(headWorld);
    headWorld.y += 0.35;
    headWorld.project(camera);
    const r = canvas.getBoundingClientRect();
    const hx = r.left + ((headWorld.x + 1) / 2) * r.width;
    const hy = r.top + ((1 - headWorld.y) / 2) * r.height;

    let yaw, pitch, tilt;
    if (idle || reduced) {
      const glance = Math.sin(t * 0.6) * 0.4 + Math.sin(t * 1.7) * 0.08;
      yaw = glance;
      pitch = Math.sin(t * 0.45) * 0.08 - 0.05;
      tilt = Math.sin(t * 0.33) > 0.6 ? 0.3 : 0; // the curious head tilt
    } else {
      const depth = Math.max(260, r.height * 0.7);
      yaw = Math.atan2(mouse.x - hx, depth);
      pitch = Math.atan2(mouse.y - hy, depth * 1.4);
      tilt = Math.hypot(mouse.x - hx, mouse.y - hy) < r.height * 0.35 ? -yaw * 0.4 + 0.15 : 0;
    }
    yaw = Math.max(-0.75, Math.min(0.75, yaw));
    pitch = Math.max(-0.4, Math.min(0.35, pitch));
    const k = 1 - Math.exp(-dt * 6);
    const prevYaw = S.yaw;
    S.yaw += (yaw - S.yaw) * k;
    S.pitch += (pitch - S.pitch) * k;
    S.tilt += (tilt - S.tilt) * (1 - Math.exp(-dt * 3));
    const yawVel = (S.yaw - prevYaw) / Math.max(dt, 1e-3);

    P.head.rotation.set(S.pitch, S.yaw, S.tilt);
    P.body.rotation.y = S.yaw * 0.22;
    const breathe = 1 + Math.sin(t * (2 + happy * 4)) * (0.012 + happy * 0.01);
    P.body.scale.set(1 / Math.sqrt(S.squash), breathe * S.squash, 1 / Math.sqrt(S.squash));
    P.dog.position.y = (S.rise - 1) * 2.4 + S.hop;
    P.dog.rotation.y = S.spin;
    shadow.scale.setScalar(Math.max(0.5, 1 - S.hop * 0.9) * Math.min(1, S.rise + 0.2));
    shadow.material.opacity = Math.min(1, S.rise);

    // tail wags faster when happy
    S.wag += dt * (7 + happy * 12);
    P.tail.rotation.z = Math.sin(S.wag) * (0.35 + happy * 0.45);
    P.tail.rotation.x = -0.15 - happy * 0.2;

    // floppy ears trail the head on a spring
    P.ears.forEach((e) => {
      const target = Math.max(-0.35, Math.min(0.35, -yawVel * 0.05)) + (S.hop > 0.05 ? -e.s * 0.3 : 0);
      e.vel += (target - e.swing) * 90 * dt;
      e.vel *= Math.exp(-dt * 8);
      e.swing = Math.max(-0.6, Math.min(0.6, e.swing + e.vel * dt));
      e.flop.rotation.z = e.s * 0.25 + e.swing;
      e.flop.rotation.x = -S.pitch * 0.3;
      e.up.rotation.z = e.s * -0.22 + e.swing * 0.15;
    });

    P.eyes.forEach((eye) => (eye.scale.y = S.blink));
    const tongue = happy > 0.3 ? 1 : 0.001;
    P.tongue.scale.lerp(new THREE.Vector3(0.065 * tongue, 0.025 * tongue, 0.09 * tongue), 1 - Math.exp(-dt * 10));
    P.tongue.position.y = 0.1 + Math.sin(t * 14) * 0.006 * tongue;

    renderer.render(scene, camera);
  }
  renderer.compile(scene, camera);
  requestAnimationFrame(frame);
  if (reduced) requestAnimationFrame(() => frame(performance.now()));
  canvas.closest("[data-puppy-stage]")?.classList.add("is-live");
}

document.querySelectorAll("canvas[data-puppy]").forEach(mount);

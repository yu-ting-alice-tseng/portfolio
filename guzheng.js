/* ════════════════════════════════════════════════════
   Guzheng : des cordes qu'on pince
   ────────────────────────────────────────────────────
   Chargé uniquement par marketing.html et
   portfolio-marketing.html.
   - Séparations (.mk-sep) : quand le toit se pose, les
     deux filets d'encre vibrent comme une corde pincée,
     puis se calment ; un survol les pince à nouveau.
   - Bandeau .mk-guzheng (marketing.html) : 21 cordes et
     leurs chevalets ; la main qui les traverse les fait
     vibrer. Le son (gamme pentatonique en ré, synthèse
     Karplus-Strong) est coupé par défaut et ne s'active
     que sur demande, par le bouton prévu.
   - Rien ne bouge en mouvement réduit ; le son reste
     disponible sur demande.
   ════════════════════════════════════════════════════ */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Une corde vibrante : déplacement maximal au point pincé,
     nul aux extrémités, oscillation amortie. */
  function vibrate(opts) {
    const { x0, x1, pluck, amp, dur, freq, draw, done } = opts;
    const start = performance.now();
    const span = x1 - x0;
    const p = Math.min(0.92, Math.max(0.08, (pluck - x0) / span));
    (function frame(now) {
      const t = (now - start) / 1000;
      if (t * 1000 >= dur) { done(); return; }
      const k = amp * Math.cos(2 * Math.PI * freq * t) * Math.exp(-3.3 * t * 1000 / dur);
      draw(u => k * (u < p ? u / p : (1 - u) / (1 - p)));
      requestAnimationFrame(frame);
    })(start);
  }

  /* ── Séparations : les filets deviennent des cordes ── */
  function bandPath(y, half, disp, w) {
    const n = 48; let top = '', bot = '';
    for (let i = 0; i <= n; i++) {
      const u = i / n, x = (u * w).toFixed(1), d = disp(u);
      top += (i ? ' L' : 'M') + x + ' ' + (y - half + d).toFixed(2);
      bot = ' L' + x + ' ' + (y + half + d).toFixed(2) + bot;
    }
    return top + bot + ' Z';
  }
  function pluckSep(sep) {
    if (reduced || sep._ringing) return;
    sep._ringing = true;
    const filets = [...sep.querySelectorAll('.mk-sep-filet path')];
    let left = filets.length;
    filets.forEach((path, i) => {
      if (!path._orig) path._orig = path.getAttribute('d');
      path.ownerSVGElement.style.overflow = 'visible';
      vibrate({
        x0: 0, x1: 1, pluck: i ? 0.3 : 0.7, amp: 2.2, dur: 1100, freq: 7,
        draw: f => path.setAttribute('d', bandPath(3, 0.8, f, 600)),
        done: () => { path.setAttribute('d', path._orig); if (!--left) sep._ringing = false; }
      });
    });
  }
  const seps = document.querySelectorAll('.mk-sep');
  if (seps.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      /* le toit se pose vers 1,1 s : la corde vibre à cet instant */
      setTimeout(() => pluckSep(e.target), 1050);
    }), { threshold: 0.6 });
    seps.forEach(s => {
      io.observe(s);
      s.addEventListener('pointerenter', () => pluckSep(s));
    });
  }

  /* ── Bandeau : un guzheng de 21 cordes ── */
  const band = document.querySelector('.mk-guzheng');
  if (!band) return;
  const svg = band.querySelector('.mk-guzheng-cordes');
  const cordes = [...svg.querySelectorAll('.corde')];
  const W = svg.viewBox.baseVal.width;
  const ys = cordes.map(c => parseFloat(c.dataset.y));
  const last = new Array(cordes.length).fill(0);

  /* Son : coupé par défaut, synthèse d'une corde pincée */
  let ctx = null, on = false;
  const cache = {};
  const PENTA = [0, 2, 4, 7, 9];                     // ré, mi, fa#, la, si
  const midi = i => 38 + 12 * Math.floor(i / 5) + PENTA[i % 5];   // corde du haut : ré grave
  function buffer(i) {
    if (cache[i]) return cache[i];
    const sr = ctx.sampleRate, f = 440 * Math.pow(2, (midi(i) - 69) / 12);
    const N = Math.max(2, Math.round(sr / f)), len = Math.floor(sr * 1.8);
    const b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0);
    for (let n = 0; n < N; n++) d[n] = Math.random() * 2 - 1;
    const decay = 0.996 - i * 0.0004;
    for (let n = N; n < len; n++) d[n] = decay * 0.5 * (d[n - N] + d[n - N + 1]);
    return (cache[i] = b);
  }
  function sound(i) {
    if (!on || !ctx) return;
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = buffer(i);
    g.gain.value = 0.22;
    src.connect(g).connect(ctx.destination);
    src.start();
  }

  function pluck(i, x) {
    const now = performance.now();
    if (now - last[i] < 90) return;
    last[i] = now;
    sound(i);
    if (reduced) return;
    const c = cordes[i], y = ys[i];
    c.classList.add('is-pincee');
    vibrate({
      x0: 0, x1: W, pluck: x, amp: 4.5, dur: 900, freq: 9 + i * 0.35,
      draw: f => {
        let d = '';
        for (let k = 0; k <= 40; k++) { const u = k / 40; d += (k ? ' L' : 'M') + (u * W).toFixed(1) + ' ' + (y + f(u)).toFixed(2); }
        c.setAttribute('d', d);
      },
      done: () => { c.setAttribute('d', `M0 ${y} H${W}`); c.classList.remove('is-pincee'); }
    });
  }

  /* La main traverse les cordes : chaque corde franchie est pincée */
  let prev = null;
  function toLocal(e) {
    const r = svg.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * svg.viewBox.baseVal.height };
  }
  svg.addEventListener('pointermove', e => {
    const p = toLocal(e);
    if (prev) {
      const lo = Math.min(prev.y, p.y), hi = Math.max(prev.y, p.y);
      ys.forEach((y, i) => { if (y >= lo && y <= hi && lo !== hi) pluck(i, p.x); });
    }
    prev = p;
  });
  svg.addEventListener('pointerleave', () => { prev = null; });
  svg.addEventListener('pointerdown', e => {
    const p = toLocal(e);
    let best = 0;
    ys.forEach((y, i) => { if (Math.abs(y - p.y) < Math.abs(ys[best] - p.y)) best = i; });
    pluck(best, p.x);
  });

  const btn = band.querySelector('.mk-guzheng-son');
  const AC = window.AudioContext || window.webkitAudioContext;
  if (btn && AC) {
    btn.hidden = false;
    btn.addEventListener('click', () => {
      on = !on;
      if (on && !ctx) ctx = new AC();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      btn.setAttribute('aria-pressed', String(on));
      band.classList.toggle('is-sonore', on);
      if (on) sound(10);
    });
  }
})();

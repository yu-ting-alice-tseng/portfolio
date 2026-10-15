/* ════════════════════════════════════════════════════
   Guzheng : la page entière est un instrument
   ────────────────────────────────────────────────────
   Chargé uniquement par marketing.html et
   portfolio-marketing.html.
   - Chaque séparation (.mk-sep) est une corde : quand le
     toit se pose, ses deux filets vibrent puis se calment ;
     un survol la pince à nouveau. Les cordes montent la
     gamme pentatonique en ré, de haut en bas de la page
     (ré, mi, fa#, la, si, ré…).
   - Le filet du pied de page est la dernière corde : un ré
     grave qui referme la phrase quand on arrive en bas.
   - Le son est coupé par défaut, jamais lancé tout seul :
     il ne s'active que par le bouton note de l'en-tête
     (.mk-son). Le choix suit le visiteur d'une page à
     l'autre pendant la session (sessionStorage).
   - Rien ne bouge en mouvement réduit ; le son reste
     disponible sur demande.
   ════════════════════════════════════════════════════ */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Une corde vibrante : déplacement maximal au point pincé,
     nul aux extrémités, oscillation amortie. */
  function vibrate(opts) {
    const { pluck, amp, dur, freq, draw, done } = opts;
    const start = performance.now();
    const p = Math.min(0.92, Math.max(0.08, pluck));
    (function frame(now) {
      const t = (now - start) / 1000;
      if (t * 1000 >= dur) { done(); return; }
      const k = amp * Math.cos(2 * Math.PI * freq * t) * Math.exp(-3.3 * t * 1000 / dur);
      draw(u => k * (u < p ? u / p : (1 - u) / (1 - p)));
      requestAnimationFrame(frame);
    })(start);
  }

  /* ── Son : coupé par défaut, synthèse d'une corde pincée (Karplus-Strong) ── */
  const AC = window.AudioContext || window.webkitAudioContext;
  const KEY = 'mk-son';
  let ctx = null, on = false;
  try { on = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  const cache = {};
  const PENTA = [0, 2, 4, 7, 9];                          // ré, mi, fa#, la, si
  const midiOf = step => 62 + 12 * Math.floor(step / 5) + PENTA[step % 5];   // ré 4 et au-dessus
  function buffer(midi, seconds) {
    const id = midi + ':' + seconds;
    if (cache[id]) return cache[id];
    const sr = ctx.sampleRate, f = 440 * Math.pow(2, (midi - 69) / 12);
    const N = Math.max(2, Math.round(sr / f)), len = Math.floor(sr * seconds);
    const b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0);
    for (let n = 0; n < N; n++) d[n] = Math.random() * 2 - 1;
    const decay = midi < 60 ? 0.998 : 0.996;
    for (let n = N; n < len; n++) d[n] = decay * 0.5 * (d[n - N] + d[n - N + 1]);
    return (cache[id] = b);
  }
  function sound(midi, seconds, gain) {
    if (!on || !ctx || ctx.state !== 'running') return;
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = buffer(midi, seconds);
    g.gain.value = gain;
    src.connect(g).connect(ctx.destination);
    src.start();
  }
  function wake() {
    if (!on || !AC) return;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
  }
  /* Un choix gardé d'une page à l'autre attend le premier geste du visiteur. */
  ['pointerdown', 'keydown', 'touchstart'].forEach(t => window.addEventListener(t, wake, { passive: true }));

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
    if (sep._ringing) return;
    sep._ringing = true;
    sound(midiOf(sep._step), 1.8, 0.2);
    if (reduced) { setTimeout(() => { sep._ringing = false; }, 600); return; }
    const filets = [...sep.querySelectorAll('.mk-sep-filet path')];
    let left = filets.length;
    if (!left) { sep._ringing = false; return; }
    filets.forEach((path, i) => {
      if (!path._orig) path._orig = path.getAttribute('d');
      path.ownerSVGElement.style.overflow = 'visible';
      vibrate({
        pluck: i ? 0.3 : 0.7, amp: 2.2, dur: 1100, freq: 7,
        draw: f => path.setAttribute('d', bandPath(3, 0.8, f, 600)),
        done: () => { path.setAttribute('d', path._orig); if (!--left) sep._ringing = false; }
      });
    });
  }
  const seps = [...document.querySelectorAll('.mk-sep')];
  seps.forEach((s, i) => { s._step = i; });
  if (seps.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      /* les cordes se posent vers 1,1 s : la séparation vibre à cet instant */
      setTimeout(() => pluckSep(e.target), 1050);
    }), { threshold: 0.6 });
    seps.forEach(s => {
      io.observe(s);
      s.addEventListener('pointerenter', () => pluckSep(s));
    });
  }

  /* ── Pied de page : la dernière corde, un ré grave ── */
  const foot = document.querySelector('.page-marketing .site-footer .footer-inner, .pf-footer');
  if (foot) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'mk-corde-pied');
    svg.setAttribute('viewBox', '0 0 1000 12');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const line = document.createElementNS(NS, 'path');
    line.setAttribute('d', 'M0 6 H1000');
    svg.appendChild(line);
    foot.classList.add('has-corde');
    foot.prepend(svg);
    let ringing = false;
    const pluckFoot = x => {
      if (ringing) return;
      ringing = true;
      sound(50, 3, 0.26);
      if (reduced) { setTimeout(() => { ringing = false; }, 800); return; }
      svg.classList.add('is-pincee');
      vibrate({
        pluck: x, amp: 3.4, dur: 1600, freq: 5,
        draw: f => {
          let d = '';
          for (let k = 0; k <= 50; k++) { const u = k / 50; d += (k ? ' L' : 'M') + (u * 1000).toFixed(1) + ' ' + (6 + f(u)).toFixed(2); }
          line.setAttribute('d', d);
        },
        done: () => { line.setAttribute('d', 'M0 6 H1000'); svg.classList.remove('is-pincee'); ringing = false; }
      });
    };
    if ('IntersectionObserver' in window) {
      const fio = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { fio.disconnect(); setTimeout(() => pluckFoot(0.5), 300); }
      }), { threshold: 1 });
      fio.observe(svg);
    }
    svg.addEventListener('pointerenter', e => {
      const r = svg.getBoundingClientRect();
      pluckFoot((e.clientX - r.left) / r.width);
    });
  }

  /* ── Bouton de l'en-tête : écouter la page ── */
  const btn = document.querySelector('.mk-son');
  if (!btn || !AC) return;
  const T = {
    fr: ['Écouter la page (son coupé)', 'Couper le son'],
    en: ['Listen to the page (sound off)', 'Turn sound off'],
    zh: ['聆聽這一頁（目前靜音）', '關閉聲音']
  };
  const label = () => {
    const l = (document.documentElement.lang || 'fr').slice(0, 2);
    const t = (T[l] || T.fr)[on ? 1 : 0];
    btn.setAttribute('aria-label', t);
    btn.title = t;
  };
  const sync = () => {
    btn.setAttribute('aria-pressed', String(on));
    btn.classList.toggle('is-on', on);
    label();
  };
  btn.hidden = false;
  sync();
  btn.addEventListener('click', () => {
    on = !on;
    try { sessionStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    wake();
    sync();
    if (on) setTimeout(() => sound(62, 1.8, 0.2), 30);
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setTimeout(label, 0)));
})();

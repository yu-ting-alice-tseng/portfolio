/* ════════════════════════════════════════════════════
   Pinceau : le curseur laisse un trait d'encre qui sèche
   ────────────────────────────────────────────────────
   - Le trait s'affine quand la main va vite et s'épaissit
     quand elle ralentit, comme la pression d'un pinceau.
   - Un clic dépose une goutte d'encre qui s'étale dans le
     papier puis s'efface.
   - La couleur suit la palette de la page : variable CSS
     --trail posée sur <body> (voir style.css § 43).
   - Rien sur écran tactile ni en mouvement réduit ; le
     curseur natif n'est jamais masqué par ce script.
   ════════════════════════════════════════════════════ */
(function () {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  const LIFE = 800;          // durée de vie d'un point du trait (ms)
  const MAX_W = 6.5, MIN_W = 1.1;
  const ALPHA = 0.5;

  const canvas = document.createElement('canvas');
  canvas.className = 'ink-trail';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let dpr = 1, color = '#1a1815';
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function readColor() {
    const c = getComputedStyle(document.body).getPropertyValue('--trail').trim();
    if (c) color = c;
  }
  resize();
  readColor();
  window.addEventListener('resize', resize);
  /* Changement de thème : la couleur est relue. */
  new MutationObserver(readColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* La flamme de la bougie a la priorité : pas de trait sur les œuvres éclairées. */
  const candle = () => {
    const c = document.querySelector('.pf-cursor.is-candle');
    return !!c;
  };

  const pts = [];
  let running = false, last = null;

  window.addEventListener('mousemove', e => {
    const t = performance.now();
    if (candle()) { last = null; return; }
    let w = MAX_W;
    if (last) {
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      const dt = Math.max(1, t - last.t);
      const v = dist / dt;                         // px par ms
      const target = Math.max(MIN_W, MAX_W - v * 2.6);
      w = last.w + (target - last.w) * 0.35;       // la pression varie sans à-coups
      if (dist < 1.5) return;
    }
    last = { x: e.clientX, y: e.clientY, t, w };
    pts.push(last);
    if (!running) { running = true; requestAnimationFrame(draw); }
  }, { passive: true });
  document.addEventListener('mouseleave', () => { last = null; });
  /* Le défilement déplace la page sous le trait : on repart d'un trait neuf. */
  window.addEventListener('scroll', () => { last = null; }, { passive: true });

  function draw(now) {
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    while (pts.length && now - pts[0].t > LIFE) pts.shift();
    ctx.strokeStyle = color;
    /* Chaque segment va du milieu du précédent au milieu du suivant, en
       courbe : les segments se raccordent bout à bout, sans recouvrement,
       donc sans points plus sombres aux jointures. */
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      if (b.t - a.t > 120) continue;               // levée du pinceau
      const p0 = i > 1 && a.t - pts[i - 2].t <= 120 ? pts[i - 2] : a;
      const age = (now - b.t) / LIFE;
      ctx.globalAlpha = ALPHA * Math.pow(1 - age, 1.6);
      ctx.lineWidth = b.w * (1 - age * 0.45);
      ctx.beginPath();
      ctx.moveTo((p0.x + a.x) / 2, (p0.y + a.y) / 2);
      ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (pts.length) requestAnimationFrame(draw);
    else { running = false; ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr); }
  }

  /* Goutte d'encre au clic : une tache qui boit le papier, puis s'efface. */
  let seed = 1;
  window.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (candle()) return;
    seed = (seed % 97) + 3;
    const size = 64;
    const d = document.createElement('div');
    d.className = 'ink-drop';
    d.setAttribute('aria-hidden', 'true');
    d.style.left = (e.clientX - size / 2) + 'px';
    d.style.top = (e.clientY - size / 2) + 'px';
    d.innerHTML =
      `<svg width="${size}" height="${size}" viewBox="-32 -32 64 64">` +
      `<defs><filter id="ink-f${seed}" x="-50%" y="-50%" width="200%" height="200%">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="${seed}" result="n"/>` +
      `<feDisplacementMap in="SourceGraphic" in2="n" scale="9"/><feGaussianBlur stdDeviation="0.6"/></filter></defs>` +
      `<g filter="url(#ink-f${seed})" fill="${color}">` +
      `<circle r="15" opacity="0.16"/><circle r="7.5" opacity="0.5"/></g>` +
      `<circle cx="${(seed % 2 ? 1 : -1) * 17}" cy="${(seed % 3 ? -1 : 1) * 11}" r="1.6" fill="${color}" opacity="0.45"/>` +
      `</svg>`;
    document.body.appendChild(d);
    d.animate(
      [{ transform: 'scale(0.35)', opacity: 0.95 }, { transform: 'scale(1)', opacity: 0.85, offset: 0.25 }, { transform: 'scale(1.08)', opacity: 0 }],
      { duration: 1000, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' }
    ).finished.then(() => d.remove());
  });
})();

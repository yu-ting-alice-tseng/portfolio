/* ════════════════════════════════════════════════════
   Lavis : le curseur est une goutte d'encre
   ────────────────────────────────────────────────────
   Chargé uniquement par marketing.html et
   portfolio-marketing.html (direction encre et papier).
   - Curseur : un petit point d'encre aux bords vivants,
     qui suit la main avec une légère inertie.
   - Survol d'un élément cliquable : le papier boit
     l'encre autour de lui, un lavis pâle s'épanouit sur
     son pourtour sans jamais couvrir son contenu.
   - Clic : la goutte tombe dans l'eau, des ondes d'encre
     s'élargissent puis s'effacent.
   - La couleur vient de --trail (style.css § 43).
   - Rien au toucher ni en mouvement réduit. Le curseur
     natif réapparaît dans les champs de saisie. Sur les
     travaux de création, la flamme de la bougie
     (portfolio-marketing) remplace la goutte.
   ════════════════════════════════════════════════════ */
(function () {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  const NS = 'http://www.w3.org/2000/svg';
  const CLICKABLE = 'a[href], button, summary, label, [role="button"], [role="link"], .pf-cat-card';
  const TYPING = 'input, textarea, select, [contenteditable="true"]';
  let color = '#1a1815';
  const readColor = () => {
    const c = getComputedStyle(document.body).getPropertyValue('--trail').trim();
    if (c) color = c;
    document.documentElement.style.setProperty('--ink-color', color);
  };
  readColor();
  new MutationObserver(readColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* Filtres partagés : bords de la goutte, lavis, ondes. */
  const defs = document.createElementNS(NS, 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.position = 'absolute';
  defs.innerHTML =
    '<filter id="ink-edge" x="-50%" y="-50%" width="200%" height="200%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="2" seed="3" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter>' +
    '<filter id="ink-wash" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="9" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="22"/><feGaussianBlur stdDeviation="11"/></filter>' +
    '<filter id="ink-ring" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="7"/><feGaussianBlur stdDeviation="0.5"/></filter>';
  document.body.appendChild(defs);

  /* La goutte */
  const dot = document.createElement('div');
  dot.className = 'ink-dot';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<svg viewBox="-12 -12 24 24"><circle r="5" fill="var(--ink-color)" filter="url(#ink-edge)"/></svg>';
  document.body.appendChild(dot);
  document.body.classList.add('has-ink-dot');

  /* Le lavis de survol */
  const wash = document.createElement('div');
  wash.className = 'ink-wash';
  wash.setAttribute('aria-hidden', 'true');
  wash.innerHTML = '<svg><rect fill="none" stroke="var(--ink-color)" filter="url(#ink-wash)"/></svg>';
  document.body.appendChild(wash);
  const washSvg = wash.querySelector('svg'), washRect = wash.querySelector('rect');

  let mx = -100, my = -100, dx = -100, dy = -100, target = null, shown = false;
  const candle = () => !!document.querySelector('.pf-cursor.is-candle');

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!shown) { dx = mx; dy = my; shown = true; }
    const t = e.target;
    const typing = t.closest && t.closest(TYPING);
    dot.classList.toggle('is-hidden', !!typing || candle());
    const hit = !typing && t.closest ? t.closest(CLICKABLE) : null;
    setTarget(hit && !hit.closest('[data-candle] .pf-img-wrap') ? hit : null);
  }, { passive: true });
  document.addEventListener('mouseleave', () => { dot.classList.add('is-hidden'); setTarget(null); });
  document.addEventListener('mouseenter', () => dot.classList.remove('is-hidden'));

  function setTarget(el) {
    if (el === target) return;
    target = el;
    dot.classList.toggle('is-over', !!el);
    if (el) { placeWash(); wash.classList.add('is-on'); }
    else wash.classList.remove('is-on');
  }
  function placeWash() {
    /* Sur une fiche du catalogue, le lavis entoure sa couverture. */
    const box = target.matches('.pf-cat-card') ? (target.querySelector('.pf-cat-cover') || target) : target;
    const r = box.getBoundingClientRect();
    const sw = Math.max(10, Math.min(30, Math.min(r.width, r.height) * 0.22));
    const pad = sw * 1.6;
    const w = r.width + pad * 2, h = r.height + pad * 2;
    wash.style.transform = `translate(${r.left - pad}px, ${r.top - pad}px)`;
    washSvg.setAttribute('width', w); washSvg.setAttribute('height', h);
    washRect.setAttribute('x', pad - sw / 2); washRect.setAttribute('y', pad - sw / 2);
    washRect.setAttribute('width', r.width + sw); washRect.setAttribute('height', r.height + sw);
    washRect.setAttribute('rx', Math.min(18, sw));
    washRect.setAttribute('stroke-width', sw);
  }

  (function loop() {
    /* Légère inertie : la goutte suit la main comme l'encre suit le pinceau. */
    dx += (mx - dx) * 0.35; dy += (my - dy) * 0.35;
    dot.style.transform = `translate(${dx}px, ${dy}px)`;
    if (target) {
      if (!target.isConnected || !target.getClientRects().length) setTarget(null);
      else placeWash();
    }
    requestAnimationFrame(loop);
  })();

  /* Clic : la goutte tombe dans l'eau. */
  window.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || candle()) return;
    if (e.target.closest && e.target.closest(TYPING)) return;
    const s = 150;
    const d = document.createElement('div');
    d.className = 'ink-ripple';
    d.setAttribute('aria-hidden', 'true');
    d.style.left = (e.clientX - s / 2) + 'px';
    d.style.top = (e.clientY - s / 2) + 'px';
    d.innerHTML =
      `<svg width="${s}" height="${s}" viewBox="${-s / 2} ${-s / 2} ${s} ${s}">` +
      '<g fill="none" stroke="var(--ink-color)" filter="url(#ink-ring)">' +
      '<circle class="r1" r="16" stroke-width="1.9"/><circle class="r2" r="16" stroke-width="1.5"/><circle class="r3" r="16" stroke-width="1.2"/></g>' +
      '<circle class="core" r="6" fill="var(--ink-color)" filter="url(#ink-edge)"/></svg>';
    document.body.appendChild(d);
    const ring = (sel, delay, to, op) => d.querySelector(sel).animate(
      [{ transform: 'scale(0.3)', opacity: op }, { transform: `scale(${to})`, opacity: 0 }],
      { duration: 1100, delay, easing: 'cubic-bezier(.15,.7,.3,1)', fill: 'both' });
    ring('.r1', 0, 1.2, 0.7); ring('.r2', 140, 2.4, 0.45);
    ring('.r3', 280, 3.9, 0.28).finished.then(() => d.remove());
    d.querySelector('.core').animate([{ transform: 'scale(1.3)', opacity: 0.75 }, { transform: 'scale(0.6)', opacity: 0 }],
      { duration: 700, easing: 'ease-out', fill: 'forwards' });
  });
})();

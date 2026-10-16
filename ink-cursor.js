/* ════════════════════════════════════════════════════
   Lavis : l'encre répond à la main
   ────────────────────────────────────────────────────
   Chargé uniquement par marketing.html et
   portfolio-marketing.html (direction encre et papier).
   - Curseur : la flèche native, sans retard ni substitut.
   - Survol d'un élément cliquable : le papier boit
     l'encre autour de lui, un lavis pâle s'épanouit sur
     son pourtour sans jamais couvrir son contenu.
   - Clic : la goutte tombe dans l'eau, des ondes d'encre
     s'élargissent puis s'effacent.
   - La couleur vient de --trail (style.css § 43).
   - Rien au toucher ni en mouvement réduit. Sur les
     travaux de création, la flamme de la bougie
     (portfolio-marketing) prend le relais.
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

  /* Le lavis de survol */
  const wash = document.createElement('div');
  wash.className = 'ink-wash';
  wash.setAttribute('aria-hidden', 'true');
  wash.innerHTML = '<svg><rect fill="none" stroke="var(--ink-color)" filter="url(#ink-wash)"/></svg>';
  document.body.appendChild(wash);
  const washSvg = wash.querySelector('svg'), washRect = wash.querySelector('rect');

  let target = null;
  const candle = () => !!document.querySelector('.pf-cursor.is-candle');

  window.addEventListener('mousemove', e => {
    const t = e.target;
    if (document.documentElement.classList.contains('lb-ouvert')) { setTarget(null); return; }
    const typing = t.closest && t.closest(TYPING);
    const hit = !typing && t.closest ? t.closest(CLICKABLE) : null;
    setTarget(hit && !hit.closest('[data-candle] .pf-img-wrap') ? hit : null);
  }, { passive: true });
  document.addEventListener('mouseleave', () => setTarget(null));

  function setTarget(el) {
    /* Un grand bloc (fiche, projet suivant) a son propre survol : pas de lavis autour. */
    if (el) {
      const b = el.matches('.pf-cat-card') ? (el.querySelector('.pf-cat-cover') || el) : el;
      const r = b.getBoundingClientRect();
      if (Math.min(r.width, r.height) > 90) el = null;
    }
    if (el === target) return;
    target = el;
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
    if (target) {
      if (document.documentElement.classList.contains('lb-ouvert')) setTarget(null);
      else if (!target.isConnected || !target.getClientRects().length) setTarget(null);
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

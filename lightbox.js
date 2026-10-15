/* ════════════════════════════════════════════════════
   Visionneuse : une image agrandie au centre de la page
   ────────────────────────────────────────────────────
   Chargé par portfolio-marketing.html. Tout lien vers une
   image (.webp, .png, .jpg, .gif) à l'intérieur d'un projet
   s'ouvre ici au lieu d'un nouvel onglet ; les flèches
   parcourent les autres images visibles du même projet.
   Clavier : ← → pour changer d'image, Échap pour fermer.
   Au toucher : glisser à gauche ou à droite.
   Sans JavaScript, les liens ouvrent l'image comme avant.
   ════════════════════════════════════════════════════ */
(function () {
  const IMG = /\.(webp|png|jpe?g|gif)(\?.*)?$/i;
  const SCOPE = '.pf-case, .pf-extras';
  const T = {
    fr: { dialog: "Image agrandie", prev: "Image précédente", next: "Image suivante", close: "Fermer" },
    en: { dialog: "Enlarged image", prev: "Previous image", next: "Next image", close: "Close" },
    zh: { dialog: "放大圖片", prev: "上一張", next: "下一張", close: "關閉" }
  };
  const lang = () => {
    const l = (document.documentElement.lang || 'fr').slice(0, 2);
    return T[l] ? l : 'fr';
  };
  const visible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

  const box = document.createElement('div');
  box.className = 'lb';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<div class="lb-fond"></div>' +
    '<figure class="lb-cadre"><img class="lb-img" alt=""></figure>' +
    '<button class="lb-btn lb-prev" type="button"><span aria-hidden="true">‹</span></button>' +
    '<button class="lb-btn lb-next" type="button"><span aria-hidden="true">›</span></button>' +
    '<button class="lb-btn lb-close" type="button"><span aria-hidden="true">×</span></button>' +
    '<p class="lb-compte" aria-live="polite"></p>';
  document.body.appendChild(box);
  const img = box.querySelector('.lb-img');
  const count = box.querySelector('.lb-compte');
  const prevB = box.querySelector('.lb-prev'), nextB = box.querySelector('.lb-next'), closeB = box.querySelector('.lb-close');

  let list = [], i = 0, opener = null;

  function labels() {
    const t = T[lang()];
    box.setAttribute('aria-label', t.dialog);
    prevB.setAttribute('aria-label', t.prev);
    nextB.setAttribute('aria-label', t.next);
    closeB.setAttribute('aria-label', t.close);
  }
  function show(k, dir) {
    i = (k + list.length) % list.length;
    const a = list[i];
    const inner = a.querySelector('img');
    const alt = (inner && inner.alt) || a.getAttribute('aria-label') || '';
    box.classList.remove('is-gauche', 'is-droite');
    void img.offsetWidth;
    if (dir) box.classList.add(dir > 0 ? 'is-droite' : 'is-gauche');
    img.src = a.href;
    img.alt = alt;
    count.textContent = list.length > 1 ? (i + 1) + ' / ' + list.length : '';
    box.classList.toggle('is-seule', list.length < 2);
  }
  function open(a) {
    const scope = a.closest(SCOPE) || document;
    const seen = new Set();
    list = [...scope.querySelectorAll('a[href]')].filter(x => {
      if (!IMG.test(x.getAttribute('href')) || !visible(x)) return false;
      if (seen.has(x.href)) return false;
      seen.add(x.href); return true;
    });
    if (!list.includes(a)) list.unshift(a);
    opener = a;
    labels();
    show(list.indexOf(a), 0);
    box.hidden = false;
    document.documentElement.classList.add('lb-ouvert');
    requestAnimationFrame(() => box.classList.add('is-on'));
    closeB.focus({ preventScroll: true });
  }
  function close() {
    box.classList.remove('is-on');
    document.documentElement.classList.remove('lb-ouvert');
    setTimeout(() => { box.hidden = true; img.removeAttribute('src'); }, 220);
    if (opener) opener.focus({ preventScroll: true });
  }

  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || !a.closest(SCOPE) || !IMG.test(a.getAttribute('href'))) return;
    e.preventDefault();
    open(a);
  });
  prevB.addEventListener('click', () => show(i - 1, -1));
  nextB.addEventListener('click', () => show(i + 1, 1));
  closeB.addEventListener('click', close);
  box.querySelector('.lb-fond').addEventListener('click', close);
  box.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('lb-cadre')) close(); });
  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft' && list.length > 1) { e.preventDefault(); show(i - 1, -1); }
    else if (e.key === 'ArrowRight' && list.length > 1) { e.preventDefault(); show(i + 1, 1); }
    else if (e.key === 'Tab') {
      /* la tabulation reste dans la visionneuse */
      const f = [closeB, prevB, nextB].filter(b => visible(b));
      const k = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null || list.length < 2) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    x0 = null;
  });
})();

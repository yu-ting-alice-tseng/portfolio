/* Tableaux vivants (portfolio-marketing.html) : chaque œuvre se regarde
   comme un tableau. Les fiches du catalogue et les feuilles d'album des
   salles s'inclinent vers la souris, une lumière glisse sur l'œuvre et
   l'ombre se déplace à l'opposé ; le catalogue s'accroche comme un mur
   d'exposition, à des hauteurs qui varient ; les œuvres des salles
   apparaissent comme l'encre qui se pose. Rien au toucher pour
   l'inclinaison, rien du tout en mouvement réduit. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var doc = document.documentElement;
  var survol = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Mur du catalogue : hauteur d'accrochage selon la colonne visible, recalculée après chaque filtre. */
  var grille = document.querySelector('.pf-cat-grid');
  function accrocher() {
    if (!grille) return;
    var vis = [].filter.call(grille.children, function (li) { return !li.classList.contains('is-hidden'); });
    [].forEach.call(grille.children, function (li) { li.classList.remove('pt-bas', 'pt-haut'); });
    vis.forEach(function (li, i) {
      var col = i % 3;
      if (col === 1) li.classList.add('pt-bas');
      else if (col === 2 && Math.floor(i / 3) % 2 === 0) li.classList.add('pt-haut');
    });
  }
  accrocher();
  document.querySelectorAll('.filter-btn').forEach(function (b) {
    b.addEventListener('click', function () { setTimeout(accrocher, 0); });
  });

  /* L'encre se pose : chaque salle apparaît quand elle entre dans l'écran. */
  if ('IntersectionObserver' in window) {
    doc.classList.add('pt-on');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-vu'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    document.querySelectorAll('.ex .ex-salle').forEach(function (s) { io.observe(s); });
  }

  if (!survol) return;

  /* Le regard : inclinaison, lumière et ombre qui suivent la souris. */
  function tableau(el, ombre) {
    el.classList.add('pt-tableau');
    var lum = document.createElement('span');
    lum.className = 'pt-lumiere'; lum.setAttribute('aria-hidden', 'true');
    el.appendChild(lum);
    var raf = 0, px = 0.5, py = 0.5;
    function peindre() {
      raf = 0;
      var r = el.getBoundingClientRect();
      /* Plus l'œuvre est grande, plus elle bouge peu. */
      var max = Math.max(1.2, Math.min(6, 2200 / r.width));
      var ry = (px - 0.5) * 2 * max, rx = -(py - 0.5) * 2 * max;
      el.style.transform = 'perspective(1100px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-5px)';
      el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      if (ombre) el.style.setProperty('box-shadow', ombre(-(px - 0.5) * 22, 26 - (py - 0.5) * 12), 'important');
    }
    el.addEventListener('pointerenter', function () {
      /* Pendant le vol d'une couverture, l'affiche d'arrivée reste à plat. */
      if (el.querySelector('[data-land][style*="hidden"]')) return;
      el.classList.remove('is-repos'); el.classList.add('is-regard');
    });
    el.addEventListener('pointermove', function (e) {
      if (!el.classList.contains('is-regard')) return;
      var r = el.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width; py = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(peindre);
    });
    function repos() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      el.classList.remove('is-regard'); el.classList.add('is-repos');
      el.style.transform = '';
      el.style.removeProperty('box-shadow');
    }
    el.addEventListener('pointerleave', repos);
    /* Au clic, l'œuvre se remet à plat tout de suite (vol de la couverture, visionneuse). */
    el.addEventListener('pointerdown', function () {
      repos(); el.classList.remove('is-repos');
      el.style.transition = 'none'; void el.offsetWidth; el.style.transition = '';
    });
  }

  document.querySelectorAll('.pf-cat-cover').forEach(function (el) {
    tableau(el, function (x, y) {
      return '0 0 0 5px var(--mk-card), ' + x.toFixed(1) + 'px ' + y.toFixed(1) + 'px 34px -18px rgba(26, 24, 21, 0.5)';
    });
  });
  document.querySelectorAll('.pf-design-cover, .pf-next-cover').forEach(function (el) {
    tableau(el, function (x, y) {
      return x.toFixed(1) + 'px ' + y.toFixed(1) + 'px 30px -18px rgba(26, 24, 21, 0.45)';
    });
  });
  document.querySelectorAll('.ex .ex-scroll').forEach(function (el) {
    tableau(el, function (x, y) {
      return '6px 6px 0 -1px var(--mk-card), 6px 6px 0 0 var(--mk-border), 12px 12px 0 -1px var(--mk-card), 12px 12px 0 0 var(--mk-border), '
        + x.toFixed(1) + 'px ' + y.toFixed(1) + 'px 44px -20px rgba(26, 24, 21, 0.45)';
    });
  });
})();

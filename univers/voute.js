/* Voûte du planétarium : ciel de fond de marketing.html
   Étoiles fixes qui tournent lentement autour du pôle, Voie lactée, grille céleste,
   étoiles filantes. Dessiné sous le ciel interactif (#ciel). */
(() => {
const cv = document.getElementById('voute');
if (!cv) return;
const g = cv.getContext('2d');
const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAPIER = '236,233,224', CHAUD = '242,206,160', VERM = '232,131,108';
const OMEGA = 2 * Math.PI / 1800000;           // un tour complet en 30 minutes
let W, H, mob, pole, etoiles = [], voie = null, voieR = 0, filantes = [], prochaine = 0;
const t0 = performance.now();

function rnd(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

function preparer() {
  const dpr = Math.min(2, devicePixelRatio || 1);
  W = innerWidth; H = innerHeight; mob = W < 700;
  cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
  pole = [W * .5, -H * .42];                    // pôle céleste au-dessus de l'écran : les étoiles décrivent de grands arcs
  const R = Math.hypot(Math.max(pole[0], W - pole[0]), H - pole[1]) * 1.05, r = rnd(4242);
  etoiles = [];
  const n = mob ? 900 : 1700;
  for (let k = 0; k < n; k++) {
    // répartition uniforme sur le disque qui couvre l'écran pendant la rotation
    const rad = Math.sqrt(r()) * R, ang = r() * 6.2832, m = Math.pow(r(), 5);   // la plupart sont faibles, quelques-unes brillent
    const c = r(), col = c < .05 ? VERM : c < .22 ? CHAUD : PAPIER;
    etoiles.push({ rad, ang, r: .35 + m * 1.6, a: .18 + m * .75, ph: r() * 6.28, f: .0008 + r() * .0025, col, vive: m > .7 });
  }
  voie = faireVoie(Math.round(Math.max(W, H) * 1.5));
}

/* La Voie lactée : une bande de poussière d'étoiles et de nébulosité, avec sa bande sombre */
function faireVoie(L) {
  const c = document.createElement('canvas'), h = Math.round(L * .34);
  c.width = L; c.height = h; const x = c.getContext('2d'), r = rnd(777);
  const bord = y => Math.exp(-Math.pow((y - h / 2) / (h * .2), 2));
  for (let k = 0; k < 160; k++) {
    const px = r() * L, py = h / 2 + (r() + r() + r() - 1.5) * h * .28, rr = h * (.08 + r() * .22);
    const gr = x.createRadialGradient(px, py, 0, px, py, rr);
    const col = r() < .3 ? CHAUD : PAPIER;
    gr.addColorStop(0, `rgba(${col},${.028 + r() * .03})`); gr.addColorStop(1, `rgba(${col},0)`);
    x.fillStyle = gr; x.fillRect(px - rr, py - rr, rr * 2, rr * 2);
  }
  for (let k = 0; k < (mob ? 2200 : 4200); k++) {
    const px = r() * L, py = h / 2 + (r() + r() + r() + r() - 2) * h * .22;
    x.fillStyle = `rgba(${r() < .25 ? CHAUD : PAPIER},${(.15 + r() * .45) * bord(py)})`;
    x.fillRect(px, py, r() < .9 ? .7 : 1.3, r() < .9 ? .7 : 1.3);
  }
  // bande sombre de poussière, légèrement ondulée
  x.globalCompositeOperation = 'destination-out';
  for (let k = 0; k < 260; k++) {
    const px = r() * L, py = h * .5 + Math.sin(px / L * 9) * h * .05 + (r() - .5) * h * .06, rr = h * (.04 + r() * .06);
    const gr = x.createRadialGradient(px, py, 0, px, py, rr);
    gr.addColorStop(0, `rgba(0,0,0,${.05 + r() * .08})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.fillRect(px - rr, py - rr, rr * 2, rr * 2);
  }
  return c;
}

function etat() { const b = document.body; return b.classList.contains('e-chapitre') ? 'chapitre' : b.classList.contains('e-galaxie') ? 'galaxie' : b.classList.contains('e-univers') ? 'univers' : 'chaos'; }

let lum = 0, grilleA = 0, voieA = .75, eclatA = 1;
function boucle(now) {
  const t = now - t0, e = etat(), rot = reduit ? 0 : t * OMEGA;
  // extinction des lumières de la salle à l'ouverture : le ciel apparaît en trois secondes
  const cible = e === 'chapitre' ? .55 : 1;
  lum += ((reduit ? cible : Math.min(cible, t / 3000)) - lum) * .06;
  grilleA += ((e === 'univers' ? 1 : e === 'galaxie' ? .55 : 0) - grilleA) * .04;
  // dans une galaxie ou une fiche, les grosses étoiles s'effacent pour laisser la vedette aux constellations
  eclatA += ((e === 'galaxie' || e === 'chapitre' ? .12 : 1) - eclatA) * .04;
  g.clearRect(0, 0, W, H);

  // Voie lactée, qui tourne avec le ciel
  if (voie) {
    voieA += ((e === 'chaos' || e === 'univers' ? .75 : .45) - voieA) * .04;
    g.save(); g.globalAlpha = voieA * lum; g.translate(pole[0], pole[1]); g.rotate(rot);
    g.translate(0, H * .95); g.rotate(-.5); g.drawImage(voie, -voie.width / 2, -voie.height / 2); g.restore();
  }

  // grille céleste (déclinaisons et ascensions droites), très discrète
  if (grilleA > .01) {
    g.save(); g.translate(pole[0], pole[1]); g.rotate(rot);
    g.strokeStyle = `rgba(${PAPIER},${.045 * grilleA * lum})`; g.lineWidth = .7; g.setLineDash([2, 6]);
    const D = Math.hypot(W, H) * 1.3, pas = H * .32;
    for (let rr = H * .6; rr < D; rr += pas) { g.beginPath(); g.arc(0, 0, rr, 0, 6.2832); g.stroke(); }
    for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12; g.beginPath(); g.moveTo(Math.cos(a) * H * .6, Math.sin(a) * H * .6); g.lineTo(Math.cos(a) * D, Math.sin(a) * D); g.stroke(); }
    g.setLineDash([]); g.restore();
  }

  // étoiles fixes : scintillation et diffraction des plus vives
  for (const s of etoiles) {
    const a = s.ang + rot, x = pole[0] + Math.cos(a) * s.rad, y = pole[1] + Math.sin(a) * s.rad;
    if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
    const tw = reduit ? 1 : .7 + .3 * Math.sin(t * s.f + s.ph), al = s.a * tw * lum * (s.r > 1.1 ? .35 + .65 * eclatA : 1);
    g.fillStyle = `rgba(${s.col},${al})`;
    if (s.r < .8) { g.fillRect(x, y, s.r * 1.6, s.r * 1.6); continue; }
    g.beginPath(); g.arc(x, y, s.r, 0, 6.2832); g.fill();
    if (s.vive && eclatA > .02) {
      const gr = g.createRadialGradient(x, y, 0, x, y, s.r * 6);
      gr.addColorStop(0, `rgba(${s.col},${al * .35 * eclatA})`); gr.addColorStop(1, `rgba(${s.col},0)`);
      g.fillStyle = gr; g.fillRect(x - s.r * 6, y - s.r * 6, s.r * 12, s.r * 12);
      g.strokeStyle = `rgba(${s.col},${al * .35 * eclatA})`; g.lineWidth = .6; const L = s.r * 7 * tw;
      g.beginPath(); g.moveTo(x - L, y); g.lineTo(x + L, y); g.moveTo(x, y - L); g.lineTo(x, y + L); g.stroke();
    }
  }

  // étoiles filantes, de temps en temps
  if (!reduit && e !== 'chapitre') {
    if (now > prochaine) {
      if (prochaine) { const x = Math.random() * W * .8 + W * .1, y = Math.random() * H * .45, an = .35 + Math.random() * .5, dir = Math.random() < .5 ? 1 : -1;
        filantes.push({ x, y, vx: Math.cos(an) * dir * 9, vy: Math.sin(an) * 9, vie: 0, duree: 55 + Math.random() * 30 }); }
      prochaine = now + 7000 + Math.random() * 9000;
    }
  }
  filantes = filantes.filter(f => f.vie < f.duree);
  for (const f of filantes) {
    f.vie++; f.x += f.vx; f.y += f.vy;
    const k = f.vie / f.duree, a = Math.sin(k * Math.PI) * .8 * lum, L = 14;
    const gr = g.createLinearGradient(f.x, f.y, f.x - f.vx * L, f.y - f.vy * L);
    gr.addColorStop(0, `rgba(${PAPIER},${a})`); gr.addColorStop(1, `rgba(${PAPIER},0)`);
    g.strokeStyle = gr; g.lineWidth = 1.2; g.beginPath(); g.moveTo(f.x, f.y); g.lineTo(f.x - f.vx * L, f.y - f.vy * L); g.stroke();
  }

  requestAnimationFrame(boucle);
}

preparer();
addEventListener('resize', () => { clearTimeout(window._rv); window._rv = setTimeout(preparer, 200); });
requestAnimationFrame(boucle);
})();

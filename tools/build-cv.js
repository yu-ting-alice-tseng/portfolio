// Génère les CV PDF (FR et EN) à partir du contenu des pages du site.
// Le CV reprend exactement ce que chaque page affiche (sauf le bénévolat, laissé hors du PDF) : aucune donnée n'est saisie ici.
//
// Utilisation (depuis la racine du site) :
//   npx serve -l 8765 .            (ou python -m http.server 8765)
//   node tools/build-cv.js          (Playwright doit être installé : npm i -g playwright)
//
// Sortie : assets/cv/CV_Yu-Ting_Tseng_<page>_<FR|EN>.pdf

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.CV_BASE || 'http://localhost:8765';
const OUT = path.join(__dirname, '..', 'assets', 'cv');

// Palette de chaque page (voir CLAUDE.md § 3)
const PAGES = {
  index:     { accent: '#2563eb', soft: '#eef3fd', name: 'General' },
  marketing: { accent: '#a8392a', soft: '#f6ece9', name: 'Marketing' },
  data:      { accent: '#0d9488', soft: '#e7f6f4', name: 'Data' },
  finance:   { accent: '#1e3a5f', soft: '#eaf0f6', name: 'Finance' },
};
const LANGS = ['fr', 'en'];

// Lecture du contenu affiché par la page, dans la langue active
function scrape() {
  const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const visible = (el) => el && getComputedStyle(el).display !== 'none';
  const section = (id) => document.getElementById(id);
  const items = (id) => {
    const s = section(id);
    if (!s) return null;
    return {
      title: txt(s.querySelector('.section-header h2')),
      items: [...s.querySelectorAll('.timeline-item')].map((a) => ({
        period: txt(a.querySelector('.timeline-period')),
        location: txt(a.querySelector('.timeline-location')),
        title: txt(a.querySelector('.timeline-body h3')),
        org: txt(a.querySelector('.timeline-company')),
        rows: [...a.querySelectorAll('.edu-degree-row')].map((r) =>
          txt(r.querySelector('.edu-degree-label')) + ' : ' +
          [...r.querySelectorAll('.edu-degree-chip')].map(txt).join(', ')),
        gpa: [...a.querySelectorAll('.portfolio-stat')].map((st) =>
          txt(st.querySelector('.stat-value')) + ' ' + txt(st.querySelector('.stat-label'))).join(' · '),
        points: [...a.querySelectorAll('.timeline-points li, .timeline-body > p[data-i18n]:not(.timeline-company)')]
          .filter(visible).map(txt).filter(Boolean),
      })),
    };
  };
  const hero = section('about');
  const linkedin = document.querySelector('a[href*="linkedin.com/in/"]');
  const skills = section('skills');
  return {
    lang: document.documentElement.lang,
    name: txt(document.querySelector('.hero-card h2, .hero-name')) || 'Yu-Ting Tseng',
    kicker: txt(hero.querySelector('.hero-kicker, .eyebrow, .section-kicker')),
    meta: [...hero.querySelectorAll('.hero-meta > div')].map((m) => ({
      label: txt(m.querySelector('.meta-label')),
      value: txt(m.querySelector('.meta-value')),
    })).filter((m) => m.label && m.value),
    email: (document.querySelector('a[href^="mailto:"]') || {}).textContent || '',
    linkedin: linkedin ? linkedin.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '',
    skillsTitle: txt(skills.querySelector('.section-header h2')),
    // Compétences par bloc puis par sous-catégorie, comme sur la page (§ 21)
    skills: [...skills.querySelectorAll('.skills-block')].map((b) => {
      const chips = (el) => [...new Set([...el.querySelectorAll('.skill-card')].map(txt))];
      const groups = [...b.querySelectorAll('.skills-subgroup')].map((g) => {
        const parts = [];
        let cur = null;
        for (const el of g.children) {
          if (el.matches('.skills-subtitle--sub')) parts.push(cur = { label: txt(el), chips: [] });
          else if (el.matches('.skills-tools-group')) parts.push({ label: txt(el.querySelector('.skills-tools-label')), chips: chips(el) });
          else if (el.matches('.skills-cards')) {
            if (!cur) parts.push(cur = { label: '', chips: [] });
            cur.chips.push(...chips(el));
          }
        }
        return { title: txt(g.querySelector('.skills-subtitle')), parts: parts.filter((x) => x.chips.length) };
      }).filter((g) => g.parts.length);
      // Compétences posées directement dans le bloc, hors sous-catégorie
      const inGroups = new Set(groups.flatMap((g) => g.parts.flatMap((x) => x.chips)));
      const loose = chips(b).filter((c) => !inGroups.has(c));
      if (groups.length && loose.length) groups.unshift({ title: '', parts: [{ label: '', chips: loose }] });
      return { title: txt(b.querySelector('h3')), groups, chips: chips(b) };
    }),
    education: items('education'),
    experience: items('experience'),
    extra: items('extracurricular'),
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(d, pal, photo) {
  const entry = (it) => `
    <div class="it">
      <div class="it-head">
        <b>${esc(it.org || it.title)}</b>
        <span class="when">${esc(it.period)}</span>
      </div>
      ${it.org || it.location ? `<div class="it-sub">
        <span class="role">${it.org ? esc(it.title) : ''}</span>
        <span class="loc">${esc(it.location)}</span>
      </div>` : ''}
      ${[...it.rows, it.gpa].filter(Boolean).map((r) => `<div class="row">${esc(r)}</div>`).join('')}
      ${!it.points.length ? '' : `<ul>${it.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`}
    </div>`;
  const block = (sec) => sec && sec.items.length ? `
    <section><h2>${esc(sec.title)}</h2>${sec.items.map(entry).join('')}</section>` : '';
  const skills = d.skills.filter((b) => b.chips.length);
  const chipList = (c) => c.map(esc).join(' · ');
  const skillBlock = (b) => b.groups.length ? `
    <div class="sk-block"><h3>${esc(b.title)}</h3><div class="sk">${b.groups.map((g) => !g.title ? `<div class="sk-wide">${chipList(g.parts[0].chips)}</div>` :
      `<b>${esc(g.title)}</b><div>${g.parts.map((x) =>
        `<div>${x.label ? `<i>${esc(x.label)} :</i> ` : ''}${chipList(x.chips)}</div>`).join('')}</div>`).join('')}</div></div>` : `
    <div class="sk-block"><div class="sk"><b class="sk-solo">${esc(b.title)}</b><div>${chipList(b.chips)}</div></div></div>`;
  return `<!doctype html><html lang="${d.lang}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 11mm 12mm 10mm; }
  * { box-sizing: border-box; }
  body { font-family: Outfit, 'Helvetica Neue', Arial, sans-serif; font-size: 8.4pt; line-height: 1.38; color: #1f2430; margin: 0; }
  header { display: flex; gap: 14px; align-items: center; border-bottom: 2px solid ${pal.accent}; padding-bottom: 8px; margin-bottom: 6px; }
  header img { width: 62px; height: 62px; border-radius: 50%; object-fit: cover; border: 2px solid ${pal.accent}; }
  h1 { font-size: 20pt; margin: 0; letter-spacing: 0.01em; color: #111; font-weight: 600; }
  .kicker { color: ${pal.accent}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; font-size: 8pt; margin: 2px 0 3px; }
  .contact { color: #4a5160; font-size: 8pt; }
  .contact span + span::before { content: '\\00a0\\00a0·\\00a0\\00a0'; color: #9aa0ab; }
  h2 { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.09em; color: ${pal.accent}; margin: 8px 0 3px; padding: 2px 6px; background: ${pal.soft}; border-radius: 3px; font-weight: 600; }
  .it { margin: 0 0 4px; break-inside: avoid; }
  .it-head, .it-sub { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .it-head b { font-weight: 600; color: #111; }
  .when { white-space: nowrap; color: #4a5160; text-align: right; font-weight: 500; }
  .role { font-style: italic; color: #2b3140; }
  .loc { white-space: nowrap; font-size: 7.4pt; color: #7a808c; text-align: right; }
  .row { color: #4a5160; }
  ul { margin: 1px 0 0; padding: 0; list-style: none; }
  li { margin: 0; padding-left: 11px; position: relative; }
  li::before { content: ''; position: absolute; left: 2px; top: 0.58em; width: 3.4px; height: 3.4px; border-radius: 50%; background: ${pal.accent}; }
  .sk-block { margin: 0 0 4px; break-inside: avoid; }
  .sk-block h3 { font-size: 8.4pt; font-weight: 600; color: ${pal.accent}; margin: 0 0 1px; padding-bottom: 1px; border-bottom: 0.5px solid ${pal.soft}; }
  .sk { display: grid; grid-template-columns: 34mm 1fr; gap: 1px 8px; }
  .sk b { font-weight: 500; color: #2b3140; }
  .sk b.sk-solo { font-weight: 600; color: ${pal.accent}; }
  .sk i { color: #4a5160; }
  .sk-wide { grid-column: 1 / -1; }
</style></head><body>
<header>
  ${photo ? `<img src="${photo}" alt="">` : ''}
  <div>
    <h1>${esc(d.name)}</h1>
    <div class="kicker">${esc(d.kicker)}</div>
    <div class="contact">${[
      ...d.meta.map((m) => `${esc(m.label)} : ${esc(m.value)}`),
    ].map((s) => `<span>${s}</span>`).join('')}</div>
    <div class="contact"><span>${esc(d.email.trim())}</span>${d.linkedin ? `<span>${esc(d.linkedin)}</span>` : ''}</div>
  </div>
</header>
${block(d.education)}
${block(d.experience)}
${block(d.extra)}
<section><h2>${esc(d.skillsTitle)}</h2>${skills.map(skillBlock).join('')}</section>
</body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const photoPath = path.join(__dirname, '..', 'assets', 'profile.webp');
  const photo = fs.existsSync(photoPath) ? 'data:image/webp;base64,' + fs.readFileSync(photoPath).toString('base64') : '';
  const browser = await chromium.launch();
  for (const [page, pal] of Object.entries(PAGES)) {
    for (const lang of LANGS) {
      const ctx = await browser.newContext();
      await ctx.addInitScript((l) => { try { localStorage.setItem('pf-lang', l); } catch (e) {} }, lang);
      const p = await ctx.newPage();
      await p.goto(`${BASE}/${page}.html`, { waitUntil: 'load' });
      const data = await p.evaluate(scrape);
      await p.setViewportSize({ width: Math.round((210 - 24) * 96 / 25.4), height: 1000 });
      await p.emulateMedia({ media: 'print' });
      await p.setContent(render(data, pal, photo), { waitUntil: 'networkidle' });
      // Quelques lignes seules sur la dernière page : on resserre légèrement (au plus 7 %) pour les rapatrier
      await p.evaluate(() => {
        const pageH = (297 - 21) * 96 / 25.4;
        const h = document.body.scrollHeight;
        const full = Math.floor(h / pageH);
        if (full >= 1 && h > full * pageH && h - full * pageH < pageH * 0.15) {
          const z = (full * pageH - 8) / h;
          if (z >= 0.93) document.body.style.zoom = z;
        }
        return h / pageH;
      }).then((n) => console.log('  pages estimées', n.toFixed(2)));
      const file = path.join(OUT, `CV_Yu-Ting_Tseng_${pal.name}_${lang.toUpperCase()}.pdf`);
      await p.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true });
      console.log('écrit', path.relative(process.cwd(), file));
      await ctx.close();
    }
  }
  await browser.close();
})();

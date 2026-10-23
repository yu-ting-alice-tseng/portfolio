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

// Compétences du CV, rangées par importance pour le métier de chaque page (le plus utile en haut).
// Chaque compétence est désignée par son data-skill et chaque libellé par sa clé skills.* : textes repris du site,
// dans la langue du CV. Un libellé absent de la page est cherché sur les autres pages CV (même langue).
// Écartés volontairement : HTML et CSS (« Développement Web », jugé secondaire par l'utilisatrice).
const LANG_ROW = { title: 'blockLanguages', skills: ['lang-french', 'lang-english', 'lang-japanese', 'lang-mandarin'] };
const OFFICE_ROW = { title: 'blockOffice', skills: ['office-microsoft', 'office-google-suite', 'office-notion', 'office-slack', 'office-monday'] };
const AI_ROW = { title: 'blockAI', skills: ['ai-chatgpt', 'ai-claude', 'ai-gemini', 'ai-vibe-coding'] };
const SKILLS = {
  marketing: [
    { title: 'blockMarketing', groups: [
      { label: 'subMktPerf', parts: [
        { label: 'subMkt2', skills: ['mkt-sea', 'mkt-gkp'] },
        { label: 'subContent2', skills: ['mkt-meta', 'mkt-mbs', 'mkt-xhs'] },
        { label: 'subMktDisplay', skills: ['mkt-xandr', 'mkt-gam'] },
        { label: 'subMkt1', skills: ['mkt-seo-technical', 'mkt-seo-onpage', 'mkt-seo-offpage', 'mkt-seo-keyword'] },
        { label: 'toolsLabel', sub: true, skills: ['mkt-semrush', 'mkt-ahrefs', 'mkt-screaming-frog', 'mkt-similarweb', 'mkt-gtrends', 'mkt-gsc'] },
      ] },
      { label: 'subMktStrategie', skills: ['mkt-positionnement', 'mkt-campaign'] },
      { label: 'subMktContenu', skills: ['mkt-content-strategy', 'mkt-design'] },
      { label: 'blockEvents', skills: ['mkt-event-management', 'mkt-event-hosting', 'mkt-vendor-coordination'] },
    ] },
    { title: 'blockDataMarketing', groups: [
      { label: 'subMktDataTech', skills: ['mkt-analytics', 'data-marketing-automation'] },
      { label: 'subData2', skills: ['data-excel', 'data-powerbi'] },
      { label: 'subDataQual', skills: ['mkt-research', 'mkt-veille', 'mkt-benchmarking'] },
      { label: 'subDataQuant', skills: ['data-statistics', 'mkt-ab-testing'] },
      { label: 'subData1', skills: ['data-python', 'data-r'] },
    ] },
    { title: 'blockCreative', groups: [
      { label: 'subCreativeGraphic', skills: ['creative-canva', 'creative-figma', 'creative-illustrator', 'creative-acrobat', 'creative-blender'] },
      { label: 'subCreativeVideo', skills: ['creative-capcut'] },
    ] },
    AI_ROW, OFFICE_ROW, LANG_ROW,
  ],
  index: [
    { title: 'blockMarketing', groups: [
      { label: 'subMktAcq', skills: ['mkt-seo', 'mkt-sea', 'mkt-meta', 'mkt-xandr', 'mkt-gam'] },
      { label: 'subMktSocial', skills: ['mkt-xhs', 'mkt-instagram', 'mkt-facebook', 'mkt-design'] },
      { label: 'subMkt4', skills: ['mkt-campaign'] },
    ] },
    { title: 'blockData', groups: [
      { label: 'subData2', skills: ['data-excel', 'data-powerbi', 'data-tableau', 'data-rstudio', 'mkt-analytics'] },
      { label: 'subDataQual', skills: ['data-kpi', 'data-segmentation', 'mkt-research'] },
      { label: 'subDataQuant', skills: ['data-statistics', 'data-ab'] },
      { label: 'subCons1', skills: ['cons-strategy', 'cons-benchmark'] },
      { label: 'subData1', skills: ['data-r', 'data-python', 'data-sql', 'data-access'] },
    ] },
    { title: 'blockConsulting', groups: [
      { label: 'subCons2', skills: ['cons-business-case', 'cons-storytelling'] },
    ] },
    { title: 'blockSoft', groups: [
      { label: 'subSoft2', skills: ['soft-leadership', 'soft-project'] },
      { label: 'subSoft1', skills: ['soft-intercultural'] },
      { label: 'subSoft3', skills: ['soft-communication'] },
    ] },
    { title: 'blockAI', skills: ['ai-chatgpt', 'ai-claude', 'ai-gemini', 'ai-vibe-coding', 'ai-ads'] },
    OFFICE_ROW, LANG_ROW,
  ],
  data: [
    { title: 'blockData', groups: [
      { label: 'subData1', skills: ['data-python', 'data-sql', 'data-r'] },
      { label: 'subData2', skills: ['data-excel', 'data-powerbi', 'data-tableau'] },
      { label: 'subDataQuant', skills: ['data-statistics', 'data-ab'] },
      { label: 'subDataQual', skills: ['data-kpi', 'data-segmentation', 'mkt-research'] },
      { label: 'subCons1', skills: ['cons-strategy', 'cons-benchmark'] },
    ] },
    AI_ROW, OFFICE_ROW, LANG_ROW,
  ],
  finance: [
    { title: 'blockFinance', groups: [
      { label: 'subFin2', skills: ['fin-pnl', 'fin-variance', 'fin-modeling', 'fin-cost-control', 'fin-accounting', 'fin-management'] },
      { label: 'subFin1', skills: ['fin-decision', 'fin-international', 'fin-green'] },
    ] },
    { title: 'blockData', groups: [
      { label: 'subData2', skills: ['data-excel', 'data-powerbi', 'data-tableau'] },
      { label: 'subDataQual', skills: ['data-kpi', 'data-segmentation'] },
      { label: 'subDataQuant', skills: ['data-statistics', 'data-ab'] },
      { label: 'subCons1', skills: ['cons-strategy', 'cons-benchmark'] },
      { label: 'subData1', skills: ['data-python', 'data-sql', 'data-r'] },
    ] },
    { title: 'blockConsulting', groups: [
      { label: 'subCons2', skills: ['cons-business-case', 'cons-storytelling'] },
    ] },
    AI_ROW, OFFICE_ROW, LANG_ROW,
  ],
};
const OMIT = ['dev-html', 'dev-css'];

// Résout l'ordre SKILLS avec les textes de la page ; signale toute compétence de la page oubliée
function layoutSkills(page, d, fallback) {
  const label = (k) => d.labels[k] || fallback.labels[k] || (() => { throw new Error(`${page} : libellé skills.${k} introuvable`); })();
  const used = new Set();
  const list = (ids) => ids.map((id) => {
    const t = d.skillText[id];
    if (!t) throw new Error(`${page} : compétence ${id} absente de la page`);
    used.add(id);
    return t;
  });
  const out = SKILLS[page].map((b) => ({
    title: label(b.title),
    chips: b.skills ? list(b.skills) : null,
    groups: (b.groups || []).map((g) => ({
      title: label(g.label),
      parts: g.parts ? g.parts.map((x) => ({ label: label(x.label), sub: !!x.sub, chips: list(x.skills) }))
        : [{ label: '', chips: list(g.skills) }],
    })),
  }));
  const missing = Object.keys(d.skillText).filter((id) => !used.has(id) && !OMIT.includes(id));
  if (missing.length) console.warn(`  ${page} : compétences de la page absentes du CV : ${missing.join(', ')}`);
  return out;
}

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
    // Textes des compétences et des libellés, dans la langue active (l'ordre du CV est fixé par SKILLS plus bas)
    skillText: Object.fromEntries([...skills.querySelectorAll('.skill-card[data-skill]')].reverse()
      .map((c) => [c.getAttribute('data-skill'), txt(c)])),
    labels: Object.fromEntries([...skills.querySelectorAll('[data-i18n^="skills."]')].reverse()
      .map((el) => [el.getAttribute('data-i18n').slice(7), txt(el)])),
    education: items('education'),
    experience: items('experience'),
    extra: items('extracurricular'),
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(d, pal, photo) {
  // Formation : école en gras puis diplôme. Expériences et associations : poste en gras puis entreprise (demande de l'utilisatrice).
  const entry = (it, roleFirst) => {
    const [top, sub] = !it.org ? [it.title, ''] : roleFirst ? [it.title, it.org] : [it.org, it.title];
    return `
    <div class="it">
      <div class="it-head">
        <b>${esc(top)}</b>
        <span class="when">${esc(it.period)}</span>
      </div>
      ${sub || it.location ? `<div class="it-sub">
        <span class="role">${esc(sub)}</span>
        <span class="loc">${esc(it.location)}</span>
      </div>` : ''}
      ${[...it.rows, it.gpa].filter(Boolean).map((r) => `<div class="row">${esc(r)}</div>`).join('')}
      ${!it.points.length ? '' : `<ul>${it.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`}
    </div>`;
  };
  const block = (sec, roleFirst) => sec && sec.items.length ? `
    <section><h2>${esc(sec.title)}</h2>${sec.items.map((it) => entry(it, roleFirst)).join('')}</section>` : '';
  const chipList = (c) => c.map(esc).join(' · ');
  const skillBlock = (b) => b.chips ? `<b class="sk-solo">${esc(b.title)}</b><div>${chipList(b.chips)}</div>` :
    `<h3>${esc(b.title)}</h3>${b.groups.map((g) => `<b>${esc(g.title)}</b><div>${g.parts.map((x) =>
      `<div${x.sub ? ' class="sk-under"' : ''}>${x.label ? `<i>${esc(x.label)} :</i> ` : ''}${chipList(x.chips)}</div>`).join('')}</div>`).join('')}`;
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
  li::before { content: '\\2022'; position: absolute; left: 1px; top: 0; width: 8px; font-family: 'Liberation Sans', 'DejaVu Sans', Arial, sans-serif; font-size: 9pt; line-height: calc(8.4pt * 1.38); color: ${pal.accent}; }
  .sk { display: grid; grid-template-columns: max-content 1fr; gap: 1px 12px; }
  .sk h3 { grid-column: 1 / -1; font-size: 8.4pt; font-weight: 600; color: ${pal.accent}; margin: 4px 0 1px; padding-bottom: 1px; border-bottom: 0.5px solid ${pal.soft}; break-after: avoid; }
  .sk h3:first-child { margin-top: 0; }
  .sk b { font-weight: 500; color: #2b3140; white-space: nowrap; }
  .sk b.sk-solo { font-weight: 600; color: ${pal.accent}; margin-top: 3px; }
  .sk b.sk-solo + div { margin-top: 3px; }
  .sk i { color: #4a5160; }
  .sk-under { padding-left: 12px; }
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
${block(d.experience, true)}
${block(d.extra, true)}
<section><h2>${esc(d.skillsTitle)}</h2><div class="sk">${d.skills.map(skillBlock).join('')}</div></section>
</body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const photoPath = path.join(__dirname, '..', 'assets', 'profile.webp');
  const photo = fs.existsSync(photoPath) ? 'data:image/webp;base64,' + fs.readFileSync(photoPath).toString('base64') : '';
  const browser = await chromium.launch();
  for (const lang of LANGS) {
    const scraped = {};
    for (const page of Object.keys(PAGES)) {
      const ctx = await browser.newContext();
      await ctx.addInitScript((l) => { try { localStorage.setItem('pf-lang', l); } catch (e) {} }, lang);
      const p = await ctx.newPage();
      await p.goto(`${BASE}/${page}.html`, { waitUntil: 'load' });
      scraped[page] = await p.evaluate(scrape);
      await ctx.close();
    }
    const fallback = { labels: Object.assign({}, ...Object.values(scraped).map((d) => d.labels)) };
    for (const [page, pal] of Object.entries(PAGES)) {
      const data = { ...scraped[page], skills: layoutSkills(page, scraped[page], fallback) };
      const ctx = await browser.newContext();
      const p = await ctx.newPage();
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

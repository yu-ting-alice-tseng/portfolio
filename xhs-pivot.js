/* TCD du dashboard XHS (portfolio-data.html, #xhs-dashboard).
   Données réelles du classeur Excel (feuille « Données »), du 01/10/2024
   au 13/02/2025 ; les jours simulés après le 13/02/2025 ne sont pas repris.
   Une ligne par jour, jours consécutifs : vues, temps de visionnage (s),
   j'aime, enregistrements, commentaires, partages, visites du profil,
   nouveaux abonnés. Engagement, taux d'engagement et notoriété de la
   marque se calculent comme dans l'Excel. */
(function () {
  const racine = document.getElementById('xhs-tcd');
  if (!racine) return;

  const DEBUT = Date.UTC(2024, 9, 1);
  const BRUT = [
    [167,3173,8,3,1,1,8,7],
    [176,3696,7,3,1,1,11,9],
    [168,5544,4,2,0,1,12,8],
    [179,5191,7,3,1,1,7,4],
    [89,1691,3,1,0,1,6,1],
    [103,2060,3,1,0,0,6,1],
    [105,2835,4,2,0,1,7,1],
    [102,2856,5,2,1,0,6,1],
    [93,2883,4,2,0,1,6,1],
    [84,1512,2,1,0,0,5,1],
    [109,2507,5,2,1,1,5,1],
    [115,2415,3,2,1,1,8,2],
    [122,4148,4,2,1,1,6,1],
    [95,1995,3,1,0,0,4,0],
    [108,3780,2,1,0,0,6,1],
    [103,3296,4,1,0,0,6,1],
    [87,2784,4,1,0,1,4,1],
    [108,2700,5,2,1,1,6,1],
    [137,4384,4,2,1,1,9,1],
    [112,3136,5,2,0,1,8,2],
    [90,1710,4,2,1,1,4,1],
    [100,2500,4,2,1,1,6,1],
    [99,1980,4,2,0,1,8,1],
    [92,2484,3,1,0,0,5,1],
    [107,3424,3,2,0,0,5,1],
    [103,3502,3,1,0,0,4,1],
    [104,1976,3,1,0,0,5,1],
    [104,2184,4,2,1,0,5,1],
    [95,3040,3,1,0,1,6,1],
    [87,2349,3,1,0,0,4,0],
    [86,1634,4,2,0,1,4,1],
    [108,3240,4,2,1,0,8,1],
    [116,2784,5,2,1,1,9,1],
    [136,3128,4,2,0,1,9,2],
    [115,2530,4,2,1,1,5,1],
    [113,3277,3,1,0,0,8,1],
    [91,2821,3,1,0,0,7,1],
    [95,2470,2,1,0,0,4,1],
    [102,2754,4,2,1,0,5,1],
    [269,7263,9,4,1,1,19,9],
    [356,9968,13,6,2,2,26,9],
    [272,5984,12,6,1,2,17,5],
    [256,6144,10,4,1,1,20,3],
    [242,7260,5,2,1,1,19,6],
    [104,2496,4,2,1,0,7,1],
    [110,2420,4,2,0,0,9,2],
    [149,4917,3,1,0,0,7,1],
    [114,2052,4,2,0,0,8,1],
    [125,4375,5,3,1,1,10,2],
    [109,2507,4,2,0,1,7,1],
    [124,4092,3,2,0,0,5,1],
    [126,3780,5,2,1,1,10,2],
    [137,3288,6,2,1,1,8,2],
    [135,4185,5,2,1,1,6,1],
    [128,3200,5,2,1,1,10,1],
    [109,3052,4,1,0,0,8,1],
    [137,2603,5,2,1,1,7,1],
    [127,2540,5,2,1,1,9,2],
    [102,2142,3,1,0,0,5,1],
    [144,4176,5,2,0,1,9,1],
    [127,2794,3,1,0,0,9,2],
    [171,5472,5,2,1,1,9,2],
    [122,3294,5,2,1,0,10,2],
    [127,3683,5,2,1,1,9,2],
    [126,3024,4,2,0,0,7,1],
    [135,4590,6,3,1,1,10,1],
    [149,4768,4,2,0,0,11,1],
    [153,3366,7,3,1,1,8,1],
    [183,5856,4,2,1,0,11,1],
    [111,2331,4,2,1,1,6,1],
    [126,2268,3,1,0,0,8,1],
    [241,6025,6,2,1,1,15,4],
    [285,7980,12,5,1,2,17,6],
    [189,6048,4,2,0,1,8,4],
    [141,2679,3,1,0,0,9,1],
    [158,3318,7,3,1,1,12,2],
    [151,4228,6,3,1,1,6,1],
    [155,3565,5,2,1,1,12,2],
    [152,3648,5,2,1,1,9,2],
    [153,2907,7,3,1,1,9,2],
    [126,3024,4,1,1,1,7,1],
    [198,3960,6,3,1,1,11,2],
    [178,4094,6,2,1,1,8,1],
    [204,3876,6,3,1,1,16,7],
    [237,7821,8,3,2,1,16,6],
    [321,9309,10,5,1,1,25,12],
    [240,7200,10,4,1,1,15,6],
    [130,3640,3,1,0,0,9,2],
    [176,5456,7,3,1,1,11,2],
    [178,4094,6,2,1,1,8,1],
    [279,5301,10,3,1,1,19,5],
    [328,6560,9,4,2,1,20,6],
    [306,7038,14,5,2,2,24,11],
    [148,4588,6,2,1,1,7,1],
    [175,4025,6,3,1,1,10,2],
    [174,4176,6,3,1,1,11,1],
    [173,3633,4,2,1,1,8,1],
    [155,3255,5,2,0,1,12,2],
    [184,5152,8,3,1,1,12,2],
    [140,4760,6,2,1,1,10,2],
    [161,4347,6,3,1,1,9,1],
    [163,3260,7,3,1,1,10,1],
    [206,5150,9,4,1,1,12,2],
    [226,4294,8,4,1,1,13,2],
    [171,3762,4,2,1,1,9,2],
    [181,3982,6,2,1,1,9,1],
    [151,4681,4,2,1,1,11,1],
    [166,3486,7,3,1,1,13,2],
    [178,5518,5,2,1,1,13,2],
    [214,5564,6,3,1,1,15,2],
    [179,5370,8,3,1,1,8,2],
    [173,5363,4,2,0,1,12,2],
    [174,4524,4,1,0,0,11,1],
    [177,4956,6,2,1,1,9,1],
    [517,17061,23,9,3,3,37,4],
    [185,3515,7,3,1,1,9,1],
    [240,6720,6,2,1,1,17,3],
    [582,11640,14,5,2,2,34,7],
    [436,11336,12,5,2,2,25,5],
    [523,13598,17,8,2,2,36,9],
    [450,12150,20,7,3,2,31,9],
    [516,9804,16,6,2,2,21,11],
    [413,12803,15,6,2,2,31,6],
    [515,12360,15,5,2,2,21,6],
    [210,6510,7,3,1,1,10,1],
    [176,5984,8,3,1,1,9,1],
    [165,4620,6,3,1,1,10,2],
    [205,7175,6,3,1,1,16,2],
    [199,5970,9,3,1,1,11,2],
    [163,3097,4,2,1,0,11,2],
    [206,6386,7,2,1,1,9,2],
    [196,6664,8,3,1,1,10,2],
    [203,5684,6,2,1,1,14,3],
    [209,3971,9,3,1,1,13,2],
    [176,4224,7,3,1,1,8,1],
    [355,9585,12,5,2,2,25,3]
  ];

  const JOUR = 86400000;
  const jours = BRUT.map((r, i) => {
    const t = new Date(DEBUT + i * JOUR);
    const eng = r[2] + r[3] + r[4] + r[5];
    return {
      t,
      v: { vues: r[0], temps: r[1] / 60, jaime: r[2], enreg: r[3], comm: r[4], partages: r[5],
           visites: r[6], abonnes: r[7], eng, taux: eng / r[0], notor: r[6] + r[7] },
    };
  });

  const TXT = {
    fr: {
      lignes: 'Lignes', colonnes: 'Colonnes', valeur: 'Valeurs', synthese: 'Synthèse', du: 'Du', au: 'Au',
      aucune: '(aucune)', total: 'Total général', vide: '–',
      dims: { mois: 'Mois', semaine: 'Semaine', jsem: 'Jour de la semaine' },
      aggs: { somme: 'Somme', moyenne: 'Moyenne', max: 'Max', min: 'Min' },
      mesures: {
        vues: 'Vues', temps: 'Temps de visionnage total (min)', jaime: "J'aime", enreg: 'Enregistrements',
        comm: 'Commentaires', partages: 'Partages', visites: 'Visites du profil', abonnes: 'Nouveaux abonnés',
        eng: 'Engagement', taux: "Taux d'engagement", notor: 'Notoriété de la marque',
      },
      joursSem: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      sem: d => 'Sem. du ' + jjmmaaaa(d),
      legende: (agg, m) => agg + ' de « ' + m + ' »',
      noteTaux: "Taux d'engagement en somme ou en moyenne : engagement total divisé par les vues totales de la case, comme dans l'Excel.",
      nombre: n => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(n).replace(/ /g, ' '),
      pourcent: n => (n * 100).toFixed(1).replace('.', ',') + ' %',
    },
    en: {
      lignes: 'Rows', colonnes: 'Columns', valeur: 'Values', synthese: 'Summarize by', du: 'From', au: 'To',
      aucune: '(none)', total: 'Grand Total', vide: '–',
      dims: { mois: 'Month', semaine: 'Week', jsem: 'Day of week' },
      aggs: { somme: 'Sum', moyenne: 'Average', max: 'Max', min: 'Min' },
      mesures: {
        vues: 'Views', temps: 'Total watch time (min)', jaime: 'Likes', enreg: 'Saves',
        comm: 'Comments', partages: 'Shares', visites: 'Profile visits', abonnes: 'New followers',
        eng: 'Engagement', taux: 'Engagement rate', notor: 'Brand awareness',
      },
      joursSem: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      sem: d => 'Week of ' + jjmmaaaa(d),
      legende: (agg, m) => agg + ' of "' + m + '"',
      noteTaux: 'Engagement rate as a sum or average: total engagement divided by total views in the cell, as in the Excel file.',
      nombre: n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n),
      pourcent: n => (n * 100).toFixed(1) + '%',
    },
  };

  const deux = n => String(n).padStart(2, '0');
  function jjmmaaaa(d) { return deux(d.getUTCDate()) + '/' + deux(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear(); }
  const indexJour = d => (d.getUTCDay() + 6) % 7;
  const lundi = d => new Date(d.getTime() - indexJour(d) * JOUR);
  const clefMois = d => d.getUTCFullYear() * 100 + d.getUTCMonth() + 1;

  // Chaque dimension donne une clé triable et un libellé
  const DIMS = {
    mois: { clef: clefMois, nom: (k) => deux(k % 100) + '/' + Math.floor(k / 100) },
    semaine: { clef: d => lundi(d).getTime(), nom: (k, L) => L.sem(new Date(k)) },
    jsem: { clef: indexJour, nom: (k, L) => L.joursSem[k] },
  };

  const listeMois = [...new Set(jours.map(j => clefMois(j.t)))];
  const etat = { lignes: 'mois', colonnes: '', mesure: 'vues', agg: 'somme', du: listeMois[0], au: listeMois[listeMois.length - 1] };

  function synthese(groupe) {
    if (!groupe.length) return null;
    const m = etat.mesure;
    if (m === 'taux' && (etat.agg === 'somme' || etat.agg === 'moyenne')) {
      const eng = groupe.reduce((s, j) => s + j.v.eng, 0);
      const vues = groupe.reduce((s, j) => s + j.v.vues, 0);
      return vues ? eng / vues : null;
    }
    const vals = groupe.map(j => j.v[m]);
    if (etat.agg === 'max') return Math.max(...vals);
    if (etat.agg === 'min') return Math.min(...vals);
    const somme = vals.reduce((s, x) => s + x, 0);
    return etat.agg === 'somme' ? somme : somme / vals.length;
  }

  const langue = () => (document.querySelector('.lang-btn.is-active') || {}).dataset?.lang === 'en' ? 'en' : 'fr';

  function choix(nom, libelle, options, valeur) {
    const opts = options.map(([v, t]) => `<option value="${v}"${String(v) === String(valeur) ? ' selected' : ''}>${t}</option>`).join('');
    return `<label class="pf-tcd-champ"><span class="pf-tcd-lbl">${libelle}</span><select data-champ="${nom}">${opts}</select></label>`;
  }

  function rendre() {
    const L = TXT[langue()];
    const format = v => v == null ? L.vide : etat.mesure === 'taux' ? L.pourcent(v) : L.nombre(etat.agg === 'moyenne' || etat.mesure === 'temps' ? Math.round(v * 10) / 10 : v);
    const dims = Object.keys(DIMS).map(k => [k, L.dims[k]]);
    const moisOpts = listeMois.map(k => [k, DIMS.mois.nom(k)]);

    const filtres = jours.filter(j => { const k = clefMois(j.t); return k >= etat.du && k <= etat.au; });
    const D = DIMS[etat.lignes];
    const C = etat.colonnes ? DIMS[etat.colonnes] : null;
    const clefsL = [...new Set(filtres.map(j => D.clef(j.t)))].sort((a, b) => a - b);
    const clefsC = C ? [...new Set(filtres.map(j => C.clef(j.t)))].sort((a, b) => a - b) : [];

    const cellules = clefsL.map(l => {
      const ligne = filtres.filter(j => D.clef(j.t) === l);
      return { l, cases: clefsC.map(c => synthese(ligne.filter(j => C.clef(j.t) === c))), total: synthese(ligne) };
    });
    const totauxC = clefsC.map(c => synthese(filtres.filter(j => C.clef(j.t) === c)));
    const general = synthese(filtres);

    // Intensité de la case : de pâle (plus petite valeur) à sarcelle (plus grande)
    const corps = C ? cellules.flatMap(r => r.cases) : cellules.map(r => r.total);
    const connues = corps.filter(v => v != null);
    const bas = Math.min(...connues), haut = Math.max(...connues);
    const teinte = v => v == null || haut === bas ? '' : ` style="--i:${((v - bas) / (haut - bas)).toFixed(2)}"`;

    const titre = L.legende(L.aggs[etat.agg], L.mesures[etat.mesure]);
    let tete = `<tr><th scope="col">${L.dims[etat.lignes]}</th>`;
    tete += C ? clefsC.map(c => `<th scope="col">${C.nom(c, L)}</th>`).join('') + `<th scope="col" class="is-total">${L.total}</th>` : `<th scope="col">${L.mesures[etat.mesure]}</th>`;
    tete += '</tr>';
    const lignes = cellules.map(r => `<tr><th scope="row">${D.nom(r.l, L)}</th>` +
      (C ? r.cases.map(v => `<td class="is-chaud"${teinte(v)}>${format(v)}</td>`).join('') + `<td class="is-total">${format(r.total)}</td>`
         : `<td class="is-chaud"${teinte(r.total)}>${format(r.total)}</td>`) + '</tr>').join('');
    const pied = `<tr class="is-total"><th scope="row">${L.total}</th>` +
      (C ? totauxC.map(v => `<td>${format(v)}</td>`).join('') : '') + `<td>${format(general)}</td></tr>`;

    racine.innerHTML =
      `<div class="pf-tcd-champs">` +
        choix('lignes', L.lignes, dims, etat.lignes) +
        choix('colonnes', L.colonnes, [['', L.aucune], ...dims.filter(([k]) => k !== etat.lignes)], etat.colonnes) +
        choix('mesure', L.valeur, Object.keys(L.mesures).map(k => [k, L.mesures[k]]), etat.mesure) +
        choix('agg', L.synthese, Object.keys(L.aggs).map(k => [k, L.aggs[k]]), etat.agg) +
        choix('du', L.du, moisOpts.filter(([k]) => k <= etat.au), etat.du) +
        choix('au', L.au, moisOpts.filter(([k]) => k >= etat.du), etat.au) +
      `</div>` +
      `<div class="pf-tcd-cadre" tabindex="0"><table class="pf-tcd-table"><caption>${titre}</caption><thead>${tete}</thead><tbody>${lignes}</tbody><tfoot>${pied}</tfoot></table></div>` +
      (etat.mesure === 'taux' && (etat.agg === 'somme' || etat.agg === 'moyenne') ? `<p class="pf-tcd-note">${L.noteTaux}</p>` : '');
  }

  racine.addEventListener('change', e => {
    const champ = e.target.dataset.champ;
    if (!champ) return;
    const v = e.target.value;
    etat[champ] = champ === 'du' || champ === 'au' ? Number(v) : v;
    if (champ === 'lignes' && etat.colonnes === v) etat.colonnes = '';
    rendre();
    const suivant = racine.querySelector(`[data-champ="${champ}"]`);
    if (suivant) suivant.focus();
  });
  // Après applyLang (inscrit plus tôt sur les mêmes boutons)
  document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', rendre));
  rendre();
})();

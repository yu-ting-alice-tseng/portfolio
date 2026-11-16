/* Contenu réel de marketing.html et du catalogue de portfolio-marketing.html (français), sans ajout. */
window.SITE = '';
(() => {
const pf = h => 'portfolio-marketing.html' + h;

window.UNIVERS = {
  soleil: {
    id: 'contact', forme: 'contact', court: 'Yu‑Ting Tseng', chiffre: '01/2027', legende: 'disponible, stage de césure de 6 mois',
    titre: 'Entrons en Contact', sur: 'Marketing 360 · Paris, France', photo: 'assets/profile.webp',
    texte: "Étudiante en Master en Gestion (Programme Grande École) à emlyon, je relie l'analyse et la création : je lis les données d'audience pour orienter les contenus, je conçois des visuels et des campagnes adaptés à chaque canal et je mesure chaque action pour l'ajuster.",
    contact: [['Basée à', 'Paris, France'], ['Disponible à partir de', '01/2027 (stage de césure de 6 mois)'],
      ['Email', 'yuting.alice.tseng@gmail.com', 'mailto:yuting.alice.tseng@gmail.com'],
      ['LinkedIn', 'yu-ting-tseng-emlyon', 'https://www.linkedin.com/in/yu-ting-tseng-emlyon'],
      ['CV', 'Télécharger le CV (PDF)', 'assets/cv/CV_Yu-Ting_Tseng_Marketing_FR.pdf']]
  },
  galaxies: [
  { id: 'experiences', nom: 'Expériences Professionnelles', court: 'Expériences',
    desc: 'Social media, performance marketing, création de contenu et engagement communautaire.',
    items: [
    { id: 'leboncoin', apercu: "Traffic Manager / AdOps", forme: 'leboncoin', court: 'leboncoin', chiffre: '20+', legende: 'campagnes display simultanées',
      titre: 'Traffic Manager / AdOps', org: 'leboncoin, Adevinta · Régie publicitaire', dates: '07/2026 – 01/2027', lieu: 'Paris · France',
      puces: ["Mise en ligne de plus de 20 campagnes display multiformats dans les outils d'ad serving.",
        'Optimisation de la diffusion de plus de 20 campagnes simultanées pour atteindre et dépasser les objectifs contractuels.',
        "Élaboration des rapports de diffusion dès le lancement et rédaction de bilans détaillés intégrant l'analyse des KPI.",
        'Interface opérationnelle entre le pôle commercial, les clients et la régie, au service de la fluidité des flux de travail.'] },
    { id: 'kpn', apercu: "Assistante Marketing Digital", forme: 'kpn', court: 'KPN', chiffre: '+9,5 %', legende: 'de CTR sur Meta et Google',
      titre: 'Assistante Marketing Digital', org: 'KPN · Agence de marketing digital', dates: '01/2025 – 06/2025', lieu: 'Taipei · Taïwan',
      puces: ['Analyse des tendances et benchmarks sectoriels pour orienter la création de contenus web : plus de 10 articles positionnés dans le Top 10 Google et cités dans les réponses des IA génératives.',
        'Pilotage de la performance des campagnes Meta et Google par des reportings et des tests A/B : CTR +9,5 % et taux de conversion +5,1 %.',
        'Collaboration transversale avec les pôles CRM et technique pour aligner la production de contenu sur les objectifs de visibilité de la marque.',
        "Projet de recherche sur les facteurs de positionnement Google par régressions statistiques, pour affiner la stratégie SEO de l'agence.",
        'Automatisation des reportings de campagne destinés aux clients grâce à des scripts Python : 5 à 10 minutes économisées par client et par semaine.'] },
    { id: 'engoo', apercu: "Assistante Marketing", forme: 'engoo', court: 'Engoo', chiffre: '+93,3 %', legende: 'de vues sur Rednote',
      titre: 'Assistante Marketing', org: 'Engoo, DMM.com · Plateforme mondiale de cours de langue', dates: '10/2024 – 02/2025', lieu: 'Taipei · Taïwan',
      stats: [['+93,3 %', 'Vues'], ['+69,7 %', 'Abonnés'], ['+89,1 %', 'Interactions']],
      puces: ['Tableaux de bord dynamiques sur Excel pour piloter la performance marketing : temps de traitement des données réduit de 30 %.',
        'Contenus Rednote fondés sur une veille des tendances : visibilité +93,3 %, engagement +89,1 % et abonnés +69,7 %.',
        'Analyses de marché et veille concurrentielle pour optimiser la stratégie marketing sur le segment du chinois simplifié.',
        "Coordination des flux de localisation avec le pôle contenu, pour une image de marque homogène à l'international."],
      oeuvres: [['assets/covers/engoo-dashboard.webp', 'Engoo · Dashboard Rednote', pf('#engoo-dashboard')],
                ['assets/covers/engoo-weekly.webp', 'Engoo · Rapport Hebdomadaire', pf('#engoo-weekly')]] },
    { id: 'enseignement', apercu: "Assistante d'Enseignement", forme: 'enseignement', court: 'NCCU · Enseignement', chiffre: '9', legende: 'cours coordonnés',
      titre: "Assistante d'Enseignement", org: 'Faculté de Banque et Finance Internationale, NCCU', dates: '07/2023 – 12/2023 · 07/2024 – 04/2025', lieu: 'Taipei · Taïwan',
      puces: ['Coordination de la logistique opérationnelle de 9 cours et interface entre des parties prenantes exigeantes.',
        "Organisation d'événements (conférences thématiques, sessions de networking) : flux de communication et gestion des prestataires."] },
    { id: 'recherche', apercu: "Assistante de Recherche", forme: 'recherche', court: 'NCCU · Recherche', chiffre: '3 – 4', legende: 'personnes par équipe encadrée',
      titre: 'Assistante de Recherche', org: 'Institut des Relations Internationales, NCCU', dates: '06/2023 – 12/2023', lieu: 'Taipei · Taïwan',
      puces: ["Encadrement d'équipes de 3 à 4 personnes pour l'organisation de séminaires, conférences et camps d'été.",
        "Synthèse d'analyses complexes et visualisation des données sous PowerPoint pour formuler des recommandations stratégiques."] },
    { id: 'sora', apercu: "Co-Fondatrice", forme: 'sora', court: 'Sora Education', chiffre: '3 250 €', legende: "de bénéfice net, 5 camps d'été",
      titre: 'Co-Fondatrice (Projet Entrepreneurial)', org: 'Sora Education · Cours de langues étrangères et soft skills pour enfants pendant les vacances scolaires', dates: '02/2022 – 08/2022', lieu: 'Hsinchu & Taichung · Taïwan',
      stats: [['5', 'Camps organisés'], ['3 250 €', 'Bénéfice net généré']],
      puces: ["Organisation de cinq camps d'été d'une semaine avec deux partenaires, élaboration du business plan, suivi financier et études de marché pour ajuster l'offre de cours et la stratégie marketing."],
      lien: ['Sora Education · Étude de Marché', pf('#sora-education')] }
    ] },
  { id: 'associations', nom: 'Expériences Extra-Scolaires', court: 'Associations',
    desc: 'Engagements dans des clubs et associations qui complètent mon parcours académique.',
    items: [
    { id: 'aiesec', apercu: "Pôle Marketing", forme: 'aiesec', court: 'AIESEC', chiffre: '+53,7 %', legende: "au-delà de l'objectif budgétaire",
      titre: 'Responsabilités du Pôle Marketing & Membre du Pôle de Bénévolat International Entrant', org: 'AIESEC in NCCU · Organisation internationale de développement du leadership', dates: '09/2024 – 06/2025', lieu: 'Taipei · Taïwan',
      stats: [['15', 'Volontaires recrutés'], ['60+', 'Participants'], ['+53,7 %', 'Objectif dépassé']],
      puces: ["Pilotage d'une équipe marketing de 4 personnes pour recruter 15 volontaires et plus de 60 participants à un camp d'anglais, dépassant l'objectif budgétaire de 53,7 %.",
        'Collaboration avec des partenaires locaux et internationaux sur des programmes de volontariat.'],
      oeuvres: [['assets/covers/aiesec-yolo.webp', 'AIESEC · Camp International YOLO', pf('#aiesec-yolo')]] },
    { id: 'guzheng', apercu: "Directrice Marketing & Adhésions", forme: 'guzheng', court: 'Club de Guzheng', chiffre: '100 %', legende: 'places pourvues à chaque recrutement',
      titre: 'Directrice Marketing & Adhésions', org: 'Club de Guzheng, NCCU', dates: '02/2023 – 01/2024', lieu: 'Taipei · Taïwan',
      stats: [['100 %', 'Places pourvues à chaque recrutement'], ['80 %', 'Fidélisation des membres']],
      puces: ['Pilotage des campagnes de recrutement et des événements d\'orientation, atteignant le plein effectif les deux semestres.',
        "Fidélisation de 80 % des membres via la gestion de la page Facebook, l'adaptation des cours et l'organisation d'activités et de performances."],
      oeuvres: [['assets/covers/guzheng-facebook.webp', 'Club de Guzheng · Page Facebook', pf('#guzheng-facebook')]] }
    ] },
  { id: 'benevolat', nom: 'Bénévolat & Engagement', court: 'Bénévolat',
    desc: "Des initiatives centrées sur l'éducation, l'international et l'impact social.",
    items: [
    { id: 'restos', apercu: "Bénévole", forme: 'restos', court: 'Restos du Cœur', chiffre: '', legende: 'distribution alimentaire',
      titre: 'Bénévole – Restos du Cœur', org: 'Les Restos du Cœur · Association humanitaire', dates: '10/2025 – 06/2026', lieu: 'Lyon, France',
      puces: ['Distribution alimentaire et accueil de bénéficiaires en situation de précarité.', 'Tri et conditionnement des denrées alimentaires.'] },
    { id: 'usr', apercu: "Volontaire", forme: 'usr', court: 'University Social Responsibility', chiffre: '', legende: 'langue et intégration culturelle',
      titre: 'Volontaire – Projet University Social Responsibility', org: 'Office of University Responsibility, NCCU', dates: '09/2024 – 06/2025', lieu: 'Taipei · Taïwan',
      puces: ["Accompagnement d'élèves issus de familles transnationales dans l'apprentissage de la langue et l'intégration culturelle."] },
    { id: 'nuit', apercu: "Déléguée", forme: 'nuit', court: 'Nuit des Idées 2023', chiffre: '350+', legende: 'participants',
      titre: 'Déléguée – Nuit des Idées 2023', org: 'Bureau Français de Taipei, Institut Français & Département de la Culture de Taipei', dates: '12/2023', lieu: 'Taipei · Taïwan',
      puces: ['Présentation de points de vue sur des sujets de durabilité devant plus de 350 participants, en français et en chinois.'] },
    { id: 'compagnonnage', apercu: "Volontaire", forme: 'compagnonnage', court: 'Compagnonnage Linguistique', chiffre: '', legende: 'immersion linguistique et culturelle',
      titre: 'Volontaire – Programme de Compagnonnage Linguistique', org: "Centre d'excellence de Chinois à Taïwan", dates: '09/2023 – 06/2025', lieu: 'Taipei · Taïwan',
      puces: ["Facilitation de l'immersion linguistique et culturelle d'étudiants américains via des événements et visites."] },
    { id: 'buddy', apercu: "Étudiante-Référente", forme: 'buddy', court: 'Buddy Program', chiffre: '3', legende: 'étudiants en échange accompagnés',
      titre: 'Étudiante-Référente – Buddy Program', org: 'Direction des Relations Internationales, NCCU', dates: '09/2023 – 01/2025', lieu: 'Taipei · Taïwan',
      puces: ['Accompagnement de 3 étudiants en échange (France, États-Unis, Corée du Sud) dans leur vie quotidienne à Taïwan.'] }
    ] },
  { id: 'portfolio', nom: 'Portfolio', court: 'Portfolio',
    desc: 'Campagnes, dashboards et visuels de marque : chaque constellation encadre une œuvre.',
    items: [
    { id: 'p-dash', forme: 'oeuvre', ratio: 1.5, court: 'Engoo · Dashboard Rednote', chiffre: '+93,3 %', legende: 'vues sur 3 mois',
      titre: 'Engoo · Dashboard Rednote', sur: '01 · Dashboard · Social Analytics', image: 'assets/covers/engoo-dashboard.webp', lien: ['Voir le projet dans le portfolio', pf('#engoo-dashboard')] },
    { id: 'p-weekly', forme: 'oeuvre', ratio: 1.5, court: 'Engoo · Rapport Hebdomadaire', chiffre: '', legende: 'reporting · data storytelling',
      titre: 'Engoo · Rapport Hebdomadaire', sur: '02 · Reporting · Data Storytelling', image: 'assets/covers/engoo-weekly.webp', lien: ['Voir le projet dans le portfolio', pf('#engoo-weekly')] },
    { id: 'p-yolo', forme: 'oeuvre', ratio: 1.5, court: 'AIESEC · Camp YOLO', chiffre: '+53,7 %', legende: 'objectif budgétaire dépassé',
      titre: 'AIESEC · Camp International YOLO', sur: '03 · Campagne · Direction Artistique · Design', image: 'assets/covers/aiesec-yolo.webp', lien: ['Voir le projet dans le portfolio', pf('#aiesec-yolo')] },
    { id: 'p-sora', forme: 'sora', court: 'Sora · Étude de Marché', chiffre: '3 250 €', legende: "bénéfice net, 5 camps d'été",
      titre: 'Sora Education · Étude de Marché', sur: '04 · Entrepreneuriat · Benchmarking · Prix', lien: ['Voir le projet dans le portfolio', pf('#sora-education')] },
    { id: 'p-guzheng', forme: 'oeuvre', ratio: 1.5, court: 'Club de Guzheng · Facebook', chiffre: '100 %', legende: 'places pourvues à chaque recrutement',
      titre: 'Club de Guzheng · Page Facebook', sur: '05 · Community Management · Design', image: 'assets/covers/guzheng-facebook.webp', lien: ['Voir le projet dans le portfolio', pf('#guzheng-facebook')] },
    { id: 'p-sephora', forme: 'sephora', court: 'Sephora · Intelligence Produit', chiffre: '8 494', legende: 'produits analysés',
      titre: 'Sephora · Intelligence Produit', sur: '06 · Projet personnel · Analyse de Portefeuille · Power BI', image: 'assets/covers/sephora-matrice.webp', ratio: 1.5, lien: ['Voir le projet dans le portfolio', pf('#bcg-beaute')] },
    { id: 'p-beaute', forme: 'oeuvre', ratio: 1.5, court: 'Maison Beauté · Diagnostic Client', chiffre: '2 058', legende: 'clients analysés',
      titre: 'Maison Beauté · Diagnostic Client', sur: '07 · Projet personnel · Segmentation · Campagnes', image: 'assets/covers/maison-beaute.webp', lien: ['Voir le projet dans le portfolio', pf('#maison-beaute')] },
    { id: 'p-penwards', forme: 'oeuvre', ratio: 1366 / 768, court: 'Affiche Penwards 2024', chiffre: '', legende: 'affiche · projet personnel',
      titre: 'Affiche - Thème Penwards 2024', sur: 'Design · Affiche · Projet personnel', image: 'assets/penwards-design-award.webp', lien: ['Voir les créations dans le portfolio', pf('')] }
    ] },
  { id: 'formation', nom: 'Formation Académique', court: 'Formation',
    desc: 'Trois écoles, trois villes, deux continents.',
    items: [
    { id: 'emlyon', apercu: "Master en Gestion (Programme Grande École)", forme: 'emlyon', logo: 'emlyon', legende_logo: 'GPA 4,0/4,0 · année de césure, puis M2', court: 'emlyon business school', chiffre: 'GPA 4,0/4,0', legende: '09/2025 – Présent · Lyon',
      titre: 'Master en Gestion (Programme Grande École)', org: 'emlyon business school', dates: '09/2025 – Présent', lieu: 'Lyon, France',
      stats: [['4,0/4,0', 'GPA']],
      groupes: [['Statut', 'Année de césure (2026 – 2027), puis M2'], ['Cours pertinents', 'Marketing · Management Stratégique · Négociation & Ventes · Responsabilité Sociale des Entreprises']] },
    { id: 'nccu', apercu: "Bachelor en Français & Diplomatie", forme: 'nccu', logo: 'nccu', legende_logo: 'Top 7 % du classement · GPA 3,99/4,0', court: 'NCCU', chiffre: 'GPA 3,99/4,0 · Top 7 %', legende: '09/2020 – 06/2025 · Taipei',
      titre: 'Bachelor en Français & Diplomatie', org: 'Université Nationale Chengchi (NCCU)', dates: '09/2020 – 06/2025', lieu: 'Taipei, Taïwan',
      stats: [['3,99/4,0', 'GPA'], ['Top 7 %', 'Classement']],
      groupes: [['Majeure', 'Langues et Cultures Européennes : Parcours Français · Diplomatie'], ['Mineure', 'Économie'], ['Distinction', 'Certificate of Excellence (Top 5 % GPA) – 2021, 2023'], ['Cours pertinents', 'Études de marché (R, Decanter AI) · Management']] },
    { id: 'paris1', apercu: "Programme d'Échange en Science Politique", forme: 'paris1', logo: 'paris1', legende_logo: 'Échange en science politique · 01/2024 – 06/2024', court: 'Paris 1 Panthéon-Sorbonne', chiffre: '', legende: '01/2024 – 06/2024 · Paris',
      titre: "Programme d'Échange en Science Politique", org: 'Université Paris 1 Panthéon-Sorbonne', dates: '01/2024 – 06/2024', lieu: 'Paris, France' }
    ] },
  { id: 'competences', nom: 'Compétences', court: 'Compétences',
    desc: 'Marketing digital, création de contenu, outils data et IA pour le marketing.',
    items: [
    { id: 'c-mkt', forme: 'grappes', court: 'Marketing', chiffre: '31', legende: 'compétences', titre: 'Marketing',
      groupes: [['Stratégie', 'Veille Concurrentielle · Benchmarking · Études de Marché · Positionnement · Planification de Campagnes'],
        ['Contenu', 'Stratégie de Contenu · Rédaction de Contenu & Design Visuel'],
        ['Référencement Naturel (SEO)', 'SEO Technique · SEO On-Page · SEO Off-Page · Recherche de Mots-Clés'],
        ['Outils SEO', 'Semrush · Ahrefs · Screaming Frog · Similarweb · Google Trends · Google Search Console'],
        ['SEA', 'Google Ads · Google Keyword Planner'],
        ['SMM', 'Meta Ads · Meta Business Suite · Rednote'],
        ['Display & AdOps', 'Xandr · Google Ad Manager'],
        ['Data Analytics & Marketing Tech', 'Google Analytics 4 · Marketing Automation · Python · A/B Testing'],
        ['Événementiel & Coordination', "Organisation d'Événements · Présidence & Animation · Coordination avec Prestataires"]] },
    { id: 'c-data', forme: 'grappes', court: 'Data & Analytics', chiffre: '5', legende: 'compétences', titre: 'Data, Reporting & Automation',
      groupes: [['Data, Reporting & Automation', 'Excel - TOSA 950/1000 · Power BI · Statistiques & Méthodes Quantitatives'], ['Langages & Requêtes', 'Python · R']] },
    { id: 'c-crea', forme: 'grappes', court: 'Outils Créatifs', chiffre: '6', legende: 'outils', titre: 'Outils Créatifs',
      groupes: [['Design Graphique', 'Canva · Figma · Adobe Illustrator · Adobe Photoshop · Blender'], ['Montage Vidéo', 'CapCut']] },
    { id: 'c-ia', forme: 'grappes', court: 'IA & Digital', chiffre: '6', legende: 'compétences', titre: 'Outils IA',
      groupes: [['Intelligence Artificielle', 'ChatGPT · Claude · Gemini · Vibe Coding'], ['Développement Web', 'HTML · CSS']] },
    { id: 'c-bur', forme: 'grappes', court: 'Bureautique', chiffre: '5', legende: 'outils', titre: 'Suite Bureautique',
      groupes: [['Suite Bureautique', 'Microsoft Office (Word · Excel · PowerPoint) · Google Suite · Notion · Slack · Monday']] },
    { id: 'c-lang', forme: 'langues', court: 'Langues', chiffre: '4', legende: 'langues de travail', titre: 'Langues',
      groupes: [['Mandarin', 'Langue Maternelle'], ['Français', 'DALF C1'], ['Anglais', 'IELTS 8.0 (C1)'], ['Japonais', 'JLPT N1']] }
    ] }
  ]
};

/* Espaces insécables du français (« 93,3 % », « 3 250 € ») */
window.EXPO_DE = { 'p-dash':'engoo-dashboard', 'p-weekly':'engoo-weekly', 'p-yolo':'aiesec-yolo', 'p-sora':'sora-education', 'p-guzheng':'guzheng-facebook', 'p-sephora':'bcg-beaute', 'p-beaute':'maison-beaute' };
window.EXPO_EXTRA = { 'engoo-dashboard': [{ type:'salle', parts:[{ t:'Le Dashboard Excel', p:[] }], imgs:['assets/Engoo_Excel/Engoo Dashboard_FR.webp'] }], 'guzheng-facebook': [{ type:'salle', parts:[{ t:'Affiche de Recrutement', p:[] }], imgs:['assets/guzheng-club-recruitment-poster.webp'] }, { type:'salle', parts:[{ t:'Réunion de Fin de Semestre', p:[] }], imgs:['assets/guzheng-club-year-end-gathering.webp'] }] };
window.nb = s => String(s).replace(/(\d) (?=\d{3}\b)/g, '$1 ').replace(/(\d) (%|€)/g, '$1 $2');

/* Fiche de lecture */
window.rendreChapitre = function (c) {
  const esc = s => nb(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const lien = h => /^(https?:|mailto:|assets\/)/.test(h) ? h : SITE + h;
  const sur = c.dates ? c.dates + ' · ' + c.lieu : (c.sur || '');
  let h = sur ? `<p class="f-sur">${esc(sur)}</p>` : '';
  if (c.photo) h = `<img class="f-photo" src="${c.photo}" alt="Portrait de Yu-Ting Tseng">` + h;
  h += `<h2 class="f-titre">${esc(c.titre)}</h2>`;
  if (c.org) h += `<p class="f-org">${esc(c.org)}</p>`;
  if (c.texte) h += `<p class="f-texte">${esc(c.texte)}</p>`;
  const stats = c.stats || (c.chiffre && c.forme !== 'contact' ? [[c.chiffre, c.legende]] : null);
  if (stats) h += `<div class="f-stats">${stats.map(s => `<div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>`;
  if (c.puces) h += `<ul class="f-puces">${c.puces.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
  if (c.groupes) h += `<dl class="f-groupes">${c.groupes.map(g => `<dt>${esc(g[0])}</dt><dd>${esc(g[1])}</dd>`).join('')}</dl>`;
  if (c.contact) h += `<dl class="f-groupes">${c.contact.map(g => `<dt>${esc(g[0])}</dt><dd>${g[2] ? `<a href="${lien(g[2])}" target="_blank" rel="noopener">${esc(g[1])}</a>` : esc(g[1])}</dd>`).join('')}</dl>`;
  if (c.image) h += `<div class="f-oeuvres un"><a href="${lien(c.lien[1])}" target="_blank" rel="noopener"><img src="${c.image}" alt="" loading="lazy"></a></div>`;
  if (c.oeuvres) h += `<div class="f-oeuvres">${c.oeuvres.map(o => `<a href="${lien(o[2])}" target="_blank" rel="noopener"><img src="${o[0]}" alt="" loading="lazy"><span>${esc(o[1])}</span></a>`).join('')}</div>`;
  if (c.lien) h += `<p class="f-voir"><a href="${lien(c.lien[1])}" target="_blank" rel="noopener">→ ${esc(c.lien[0])}</a></p>`;
  return h;
};
})();

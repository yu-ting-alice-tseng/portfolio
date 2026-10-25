# Portfolio Website — Claude Guidelines

These rules apply to **every task** on this project. Read and follow them before making any change, writing any content, or editing any file.

---

## 1. Capitalization

- The **first letter of every word** in a title or sub-title must be capitalized (title case), **except prepositions** (e.g. de, sur, en, in, of, à, pour, etc.) which stay lowercase.
- Follow the capitalization convention already in use on the specific page for body text (typically sentence case).

---

## 2. Punctuation

- Match the punctuation style already in use on the page — do not introduce new patterns.
- Always put **a space before and after `-`** when used as a separator.
  - ✅ `Excel - TOSA 950/1000`
  - ❌ `Excel-TOSA 950/1000`
- Do **not** use dots/periods as separators to add detail.
  - ❌ `Excel. TOSA 950/1000`
- **Em dash `—` is only allowed in titles and subtitles.** Never use `—` in body text, sentences, paragraphs, or list items. Use `:`, `,`, or parentheses `( )` instead as appropriate.

---

## 3. Font, Writing Style & Color Palette

- New content must use the page's existing fonts, writing tone, CSS variables, and color palette.
- Each page has its own color scheme — **never copy colors verbatim** from another page. Always replace hardcoded colors with the target page's own CSS variables.
  - Finance page: `--fi-accent`, etc.
  - Marketing page: `--mk-accent`, etc.
  - Data/Luxury page: `--lx-gold`, etc.
- After porting a component's shape/structure, check the page's `:root` or top-level style block and replace all colors with the correct page variables.
- **Une page CV et son portfolio partagent la même palette.** Les éléments communs (en-tête, sélecteur de langue, bouton de thème, soulignés de navigation, barre de progression, boutons, repères de frise, liserés latéraux, logo, cadre de l'avatar et carte de profil) suivent la palette de la page, en thème clair comme en thème sombre. Les surcharges vivent dans `style.css` § 42.

| Page | Fond | Accent | Secondaire | Sombre (fond / accent) |
|---|---|---|---|---|
| `index` | `#f2f5fb` | bleu `#2563eb` | indigo `#4f46e5`, violet `#6d28d9`, rose `#ec4899` | `#0b1220` / `#2563eb` |
| `teaching` | `#f2f5fb` | bleu `#2563eb` | une teinte par section : cyan `#0891b2`, vert `#059669`, violet `#7c3aed`, ambre `#d97706`, rose `#e11d48` | `#0b1220` / `#2563eb` |
| `marketing` + `portfolio-marketing` | papier `#ece9e0`, carte `#f3f1ea` | vermillon `#a8392a` (survol `#8c2e21`) | encre `#1a1815`, gris `#4a463d`, filet `#cbc7ba` | `#14130f` / `#cb5842` |
| `data` + `portfolio-data` | papier céladon `#e4ece7`, carte `#eef3ef` | sarcelle `#0d9488` (survol `#0f766e`) | encre `#16211f`, gris `#44524f`, filet `#c3cfc9` | `#111816` / `#0d9488` |
| `finance` + `portfolio-finance` | `#f6f8fb` | marine `#1e3a5f` | `#2d5282`, bleu acier `#2d6a9f` | `#0b1220` / `#5b8fc7` |

---

## 4. Completeness

- Before finalizing, ask: would a reader feel confused or sense that the page is incomplete?
- If yes, add the missing context. Do not stop at a technically correct but insufficient result.

---

## 5. Consistency — Never Fabricate Information

- If new information could contradict something already on the site, **flag the conflict and ask** the user before proceeding.
- **Never invent, assume, or fill in information** that was not explicitly provided by the user. Always ask if unsure.

---

## 6. No Garbled Text

Proofread every piece of new content for:
- Encoding issues (e.g. `â€™` instead of `'`)
- Leftover placeholder text (e.g. `Lorem ipsum`, `[INSERT HERE]`)
- Broken or unrecognized characters
- Copy-paste artifacts

---

## 7. Correct Placement & Organization

- Every piece of content must be placed in the **right section** and well-organized within the page structure.
- Do not drop content into a convenient but semantically wrong location.

---

## 8. Language Correctness Per Page

- Match the language of the page — do not place English content on a French page or vice versa.
- **Version chinoise invisible en ligne** : seule `teaching` garde le bouton CN. Sur toutes les autres pages (CV et portfolios), une langue enregistrée sans bouton visible sur la page (`pf-lang = zh` venu de `teaching`) revient au français à l'ouverture ; aucun texte chinois ne doit s'afficher (`main.js` et scripts `applyLang` des portfolios).
- **Étiquettes des projets (`.pf-tag`, tous les portfolios) traduites aussi** (demande de l'utilisatrice) : paire `data-lang-show` FR / EN (« Tableaux Croisés Dynamiques » / « Pivot Tables », « Suivi des KPI » / « KPI Tracking »…). Restent identiques dans les deux langues les noms d'outils, de marques et d'organisations (Excel, Python, R, PowerPoint, Canva, Adobe Illustrator, Facebook, Xiaohongshu, Sephora, AIESEC, LSEG · Refinitiv), les sigles (FMCG, M&A, Logit) et les termes déjà employés tels quels dans le texte français des pages (Dashboard, Reporting, Community Management).
- **Exception:** some terms are intentionally kept in their original language (e.g. "SEO", specific tool names the user has chosen to keep). When in doubt about whether a term should be translated, **ask the user**.

---

## 9. Experience Reframing — Never Delete Entries

- **Never remove** an experience or education entry from the site as a whole.
- **Exception (demande de l'utilisatrice) :** chaque page CV se concentre sur les expériences et compétences liées à son domaine. Une expérience sans rapport avec le domaine peut quitter une page à condition de rester sur la page de son propre domaine (ex. TutorABC, Weber et la traduction freelance ne figurent plus sur `index`, ils restent sur `teaching`).
- Instead, **reframe the description** to highlight the transferable skills relevant to that page's domain (finance, marketing, data, teaching, etc.).
- Do not invent fictional tasks — only reframe or emphasize real aspects of the experience from a different angle.

---

## 10. Self-Updating Rules

- If the user mentions a new rule, correction, or preference at any point during a session, **immediately update this `CLAUDE.md` file** to include it.
- Also update the corresponding memory file under `memory/` if one exists (e.g. `feedback_content_creation_rules.md`).
- Do not wait to be asked — treat any new guideline as a standing rule and record it right away.

---

## 11. Skill Proof Card Titles

- The **title** of a proof card inside a skill detail panel must **never repeat the skill's name**.
- For internship/stage proofs, use: **Job title – Specific project or context**
  - ✅ `Assistante Marketing Digital – Campagnes Meta & Google`
  - ❌ `A/B Testing – Campagnes Meta & Google`
- For portfolio, project, or certification proofs, use a descriptive title for the deliverable (no job title needed).

---

## 12. Skill Proof Card Ordering

Order proof cards within a skill by importance (descending):

1. **Portfolio / Project** (most important)
2. **Professional Experience** (Stage, CDI, CDD, etc.)
3. **Extracurricular** (associations, clubs)
4. **Volunteer**
5. **Certification / Course** (least important)

---

## 13. Skill Proof Meta Tags — No Redundant Category Tags

- Do **not** add a meta tag to a proof entry if its value is the same as (or a subset of) the skill's category name.
- Example: a proof under the "SEO" category should not have `meta: ["SEO"]`.

---

## 14. Une Expérience, Une Écriture par Page

- Lorsqu'une même expérience apparaît sur plusieurs pages, **le style d'écriture et les compétences mises en avant doivent être différents sur chaque page**.
- Ne jamais dupliquer les mêmes puces d'une page à l'autre : chaque page reçoit sa propre variante de clés i18n (`point…` pour index, `mkPoint…` pour marketing, `dataPoint…` pour data, `finPoint…` pour finance).
- **Toutes les puces de CV s'écrivent en phrases nominales** (« Pilotage de… », « Conception de… »), sur toutes les pages, jamais à l'infinitif. En anglais, les puces gardent le verbe d'action habituel des CV anglophones.
- Les compétences signalées suivent le domaine de la page (marketing : diffusion, relation annonceur ; data : consolidation et analyse des indicateurs ; finance : exécution des engagements, synthèse de performance).
- Reformuler uniquement à partir de faits réels : changer l'angle, jamais inventer de nouvelles missions.

---

## 15. Git : Toujours Directement sur `main`

- **Ne jamais créer de branche** pour une modification du site : travailler, committer et pousser **directement sur `main`**.
- Pas de pull request : `main` est la branche publiée, toute modification validée doit y arriver immédiatement.
- Toujours faire un `git pull --rebase origin main` avant de pousser, afin de ne pas bloquer la synchronisation automatique de la machine locale.
- La synchronisation locale est assurée par `auto-watch.ps1` (surveillance du dossier, déclenchement une minute après la dernière modification, contrôle toutes les 30 minutes), qui appelle `auto-sync.bat`. Tâche Windows « Portfolio Auto Sync », installée via `install-auto-sync.bat`.
- **Session Claude Code forcée sur une branche** (`claude/…`) : la consigne de session impose parfois de développer sur une branche dédiée. Dans ce cas, une fois le travail terminé et vérifié, **toujours finir par le ramener sur `main`** sans attendre qu'on le demande :
  ```bash
  git push -u origin <branche>                 # trace du travail
  git checkout main && git pull --rebase origin main
  git merge --ff-only <branche> && git push origin main
  ```
  Sans cette dernière étape, le site publié ne change pas : `main` est la seule branche que GitHub Pages met en ligne.
- **Chaîne de publication complète**, aucune étape manuelle : machine locale → `auto-watch.ps1` → `main` → GitHub Pages (mise en ligne en une à deux minutes). Une modification poussée sur `main` depuis n'importe où redescend sur la machine locale au contrôle suivant (30 minutes au plus).

---

## 16. Page Marketing : Direction Visuelle et Portée des Effets

- `marketing.html` et `portfolio-marketing.html` suivent la direction **encre et papier** (lavis, papier de riz, vermillon en seul accent). `data.html` et `portfolio-data.html` reprennent tout ce design en céladon et sarcelle (voir § 24). Les autres pages (`index`, `finance`, `teaching`) gardent leurs dégradés d'origine.
- **Plus de curseur bougie** (retiré à la demande de l'utilisatrice, sur toute la page `portfolio-marketing.html`) : toutes les œuvres s'affichent en couleur, sans flamme ni niveaux de gris. Ne pas le réintroduire.
- **Effets de curseur réservés aux directions marketing et data** : `index`, `finance`, `teaching` et `portfolio-finance` gardent le curseur natif, sans trait, sans cadre ni aucun effet. `data` et `portfolio-data` ont le curseur lavis (§ 24).
- **Curseur « lavis »** (`ink-cursor.js`, chargé par `marketing.html`, `portfolio-marketing.html`, `data.html` et `portfolio-data.html`), tout dans le vocabulaire de l'encre, jamais de réticule ni de cadre de visée :
  - curseur : **la flèche native**, jamais remplacée ni retardée (la goutte d'encre qui suivait la main a été retirée : elle masquait la flèche et traînait derrière le geste ; un plectre de guzheng a aussi été écarté, peu compréhensible hors de Chine) ;
  - survol d'un **petit** élément cliquable (bouton, lien, puce) : un lavis pâle s'épanouit sur son pourtour, comme le papier qui boit l'encre, sans couvrir son contenu ;
  - survol d'un **grand bloc** (fiche du catalogue, « Projet suivant », tout élément de plus de 90 px dans sa plus petite dimension) : **jamais de lavis autour**, il faisait une auréole grise « sale ». À la place, un coup de pinceau à l'encre se trace de gauche à droite sous le titre (`.pf-cat-name`, `.pf-next-name`), la couverture se soulève ou prend le liseré vermillon, la flèche avance ;
  - visionneuse ouverte (`html.lb-ouvert`) : lavis et ondes disparaissent aussitôt, rien ne passe devant l'image agrandie ;
  - clic : la goutte tombe dans l'eau. Trois ondes fines, à peine ovales et inclinées au hasard, s'élargissent en ralentissant, s'amincissent et pâlissent en s'éloignant (on anime le rayon, jamais l'échelle, sinon le trait s'épaissit) ; au centre, l'encre se diffuse en petit nuage flou, sans point dur ;
  - couleur `--trail` (`style.css` § 43), l'encre de la page ; rien au toucher ni en mouvement réduit.
- **État des fiches du catalogue (`portfolio-marketing.html` uniquement)** : à côté de la catégorie, chaque fiche affiche « ○ Vue » (restée au moins une seconde à moitié visible) puis « ● Ouverte » en vermillon (projet ouvert par la fiche, la vignette ou « Projet suivant »), en FR/EN. Chaque fiche ne compte qu'une fois ; l'état reste dans `sessionStorage`, rien n'est envoyé. L'ancien onglet flottant « CTR » a été retiré à la demande : il comptait de nouvelles impressions à chaque retour au catalogue et se lisait mal. Ne pas le réintroduire.
- **Visionneuse (`lightbox.js`, `portfolio-marketing.html`)** : tout lien vers une image dans un projet s'ouvre agrandi au centre de la page, jamais dans un nouvel onglet ; flèches à gauche et à droite (clavier ← →, glisser au toucher) pour parcourir les images visibles du même projet, compteur « 3 / 7 », fermeture par ×, Échap ou clic sur le fond. Fond papier voilé, cadre et boutons aux couleurs `--mk-*`. Pas de légende visible (les textes alternatifs ne sont pas tous traduits). Sans JavaScript, le lien ouvre l'image comme avant.
- **Catégorie « Design » du catalogue (`portfolio-marketing.html`)** : l'ancienne section « Autres Travaux » est devenue un filtre « Design » du catalogue. Ses travaux (affiche Penwards, badges du club de kyudo) s'affichent en **petites fiches** sous les projets (`.pf-design`, quatre par ligne, visuel 16:9 entier, catégorie et titre en FR/EN/ZH), jamais un simple texte : la catégorie sert à montrer les créations. Une fiche ouvre l'œuvre directement dans la visionneuse, sans étude de cas. Ajouter un travail : un `<li>` dans `.pf-design-grid`. Un projet complet qui relève aussi du design (ex. Club de Guzheng, page Facebook : affiche de recrutement et visuel de fin de semestre) garde son étude de cas et reçoit une seconde catégorie (`data-cat="social design"`, catégorie affichée « Community Management · Design ») : il apparaît sous le filtre « Design » au-dessus des petites fiches, sans doublon. Même chose pour AIESEC, Camp International YOLO (`data-cat="social design"`, « Campagne · Direction Artistique · Design »). Pas de données de campagne conservées pour YOLO : le résumé suit l'ordre réel (démarrage digital peu concluant, puis plan réorienté à partir des données des éditions précédentes et d'une étude de marché vers la promotion dans les lycées, comme dans « Défi / Résolution »), puis donne les résultats déjà affichés (15 volontaires, plus de 60 participants, +53,7 %).
- **La carte de profil du héros garde la photo** sur toutes les pages, marketing comprise : on ne la remplace jamais par une œuvre. Les travaux se montrent dans le portfolio.
- **Structure de `portfolio-marketing.html` : catalogue puis lecture, un projet à la fois.**
  - **Ordre des projets : les expériences réelles d'abord, les projets personnels sur données publiques ensuite** (marketing : Engoo Dashboard, Engoo Rapport Hebdomadaire, YOLO, Sora, Club de Guzheng, Sephora, Maison Beauté ; data : Dashboard XHS, Rapport Hebdomadaire, Risky Deals, Chocolat, Boutique de Mode). Changer l'ordre = déplacer fiche, vignette et `<article>`, renuméroter (`pf-cat-n`, `pf-rail-n`, `pf-case-n`) et refaire chaque lien « Projet suivant ».
  - Catalogue : une grille de fiches (couverture, numéro, catégorie, titre, un seul chiffre clé), filtrable. **Filtres (demande de l'utilisatrice, plus de filtre à un seul projet)** : Tous · Réseaux Sociaux (`social` : dashboard et rapport Engoo, YOLO, Club de Guzheng ; « Social Media » en anglais) · Dashboard & Reporting (`reporting` : les deux projets Engoo) · Études de Marché (`etude` : YOLO, Sora Education) · Analyse des Données · Design. Les anciens filtres « Campagnes » et « Communauté » ont été fondus dans « Réseaux Sociaux » : un nouveau filtre n'apparaît qu'avec au moins deux projets. Pas de tableau de résultats ni de chiffres répétés ailleurs.
  - Lecture : un seul projet affiché (`#id` dans l'URL, liens profonds et retour arrière pris en charge), avec fil d'Ariane « Tous les projets », frise de vignettes à gauche (bandeau horizontal sur mobile) et « Projet suivant » en fin de page.
  - Chaque projet : colonne gauche (titre, chiffres, outils), colonne droite (visuel, résumé court), détails complets repliés sous « Lire l'étude complète ».
  - **Couvertures sans recadrage visible** : chaque couverture d'image est une composition au format exact 3:2 dans `assets/covers/` (œuvres entières posées sur le papier `#f3f1ea`, plusieurs pièces côte à côte ou diapositives empilées si besoin). On ne laisse jamais le CSS couper une affiche, une diapositive ou un dashboard.
  - **Une couverture n'est jamais un simple chiffre** : un projet sans image reçoit une visualisation de ses propres données (graphique, matrice, diapositive façon rapport d'affaires), construite uniquement à partir des chiffres déjà présents dans l'étude.
  - Tout texte visible existe en français et en anglais (clé i18n dans `main.js` ou paires `data-lang-show`), y compris dans les SVG et les chiffres (`8 495` / `8,495`).
  - Ouvrir une fiche fait voler sa couverture jusqu'à la couverture identique en tête du projet (élément `[data-land]`), qui reste masquée pendant le vol : une seule image, qui se pose exactement à sa place. Tout nouveau projet doit avoir cette couverture d'arrivée, et le défilement du script reste immédiat (`behavior: 'instant'`), car `scroll-behavior: smooth` fausserait la mesure. Sans JavaScript ou en `prefers-reduced-motion`, tout reste lisible sans animation.
  - Ajouter un projet : une fiche dans `.pf-cat-grid`, une vignette dans `.pf-rail`, un `<article class="pf-case">` avec son lien `.pf-next`, et mettre à jour le lien « Projet suivant » du projet précédent.
- **Un seul motif sur les pages marketing : le guzheng** (clin d'œil au club de guzheng), montré **en entier, comme un instrument reconnaissable**, jamais en fragments abstraits (cordes et chevalets isolés jugés « moches » et illisibles). Les éléments d'architecture chinoise (toit 飛簷, poutre 額枋, tuiles 瓦當, coins de fenêtre 窗櫺角花, porte de lune, logo sous avant-toit) ont été **retirés à la demande** : sans lien avec le parcours. Ne pas les réintroduire, ni ajouter un second registre décoratif. Le guzheng n'apparaît qu'à deux endroits ; partout ailleurs, des traits sobres (`style.css` § 44), clair comme sombre :
  - **séparations** (`marketing.html` et `portfolio-marketing.html`, sur le portfolio entre le catalogue et le pied de page et dans chaque projet avant « Projet suivant ») : deux filets d'encre et, au centre, un **guzheng de trois quarts** légèrement incliné (environ 8°) comme posé sur la page : table bombée claire, flancs et tête laqués, quinze cordes sur deux sillets, chevalets (雁柱) en arc dont celui du milieu en vermillon, pieds et ombre douce. Dessiné une seule fois dans le symbole `#mk-guzheng` (défini dans le `<svg>` caché en haut de page) et repris par `<use>` ; 200 px de large (150 px sur téléphone). Couleurs par classes `.q-*` ciblées sur `#mk-guzheng`, variables `--mk-*` sur le portfolio ;
  - **au-dessus des titres de section** : un simple trait d'encre court ;
  - **repères de la frise** : un petit cercle d'encre, le plus récent de chaque frise plein et vermillon ; puces des expériences en simples points discrets ;
  - **rien derrière la carte de profil**, aucun ornement aux coins des cartes ; portrait rond à double cerne d'encre (la photo reste la photo) ;
  - **logo** (`marketing.html` uniquement, `.brand-mark--cordes`) : « YT » à l'encre au-dessus d'un petit guzheng vu de dessus, chevalet vermillon. Les autres pages gardent le losange à leurs couleurs ;
  - aucune surface bleue, violette ou dégradée sur la page marketing (y compris la puce de compétence sélectionnée, en vermillon plein) : cartes, formulaire et champs prennent `--surface`, `--bg` et `--border-subtle` ;
  - **versions précédentes** : cordes et chevalets en fragments au commit `1ae91b7`, version architecture au commit `d073067`.
- **Guzheng : la page entière est un instrument** (`guzheng.js`, chargé par `marketing.html`, `portfolio-marketing.html`, `data.html` et `portfolio-data.html`), clin d'œil au club de guzheng :
  - **chaque séparation est une corde** : quand le guzheng se pose, les deux filets d'encre vibrent comme une corde pincée puis se calment ; un survol les pince à nouveau. De haut en bas, les cordes montent la gamme pentatonique en ré (ré, mi, fa#, la, si, ré…) ;
  - **le filet du pied de page est la dernière corde** : il vibre en vermillon et sonne un ré grave quand on arrive en bas, pour refermer la phrase ;
  - **son coupé par défaut**, jamais de lecture automatique : il ne s'active que par le **bouton note** de l'en-tête (`.mk-son`, à côté du bouton de thème, barré tant que le son est coupé, info-bulle FR/EN). Le choix suit le visiteur d'une page marketing à l'autre pendant la session ; synthèse dans le navigateur, aucun fichier audio ;
  - en `prefers-reduced-motion`, rien ne vibre (le son reste disponible sur demande) ;
  - l'ancien bandeau de 21 cordes au-dessus du pied de page a été retiré (jugé plaqué). **Pour y revenir** : la dernière version qui l'affiche est le commit `b44eeae` sur `main` ; annuler les commits « Guzheng intégré » suivants avec `git revert` suffit.
- **Fond en papier xuan** (`style.css` § 45, `marketing.html` et `portfolio-marketing.html`) : une feuille de papier de riz (nuages de densité et fibres) en mosaïque de 640 px, `assets/xuan-paper.webp` en clair, `assets/xuan-paper-dark.webp` en sombre (marketing uniquement : le portfolio n'a pas de thème sombre). Le papier reste **sous** le contenu : plus de grain posé par-dessus la page (`.mk-grain` et `.pf-grain` masqués), les œuvres et les cartes restent nettes. Si la teinte de fond change, refaire les deux images à la nouvelle teinte (elles portent la couleur du fond, ce n'est pas un calque transparent).
- La cohérence entre les deux directions passe par le **vocabulaire d'animation** (apparition, survol, rythme des chiffres), pas par la couleur.
- **Sora Education, Étude de Marché (`#sora-education`, projet 07, catégorie « Entrepreneuriat · Benchmarking · Prix »)** : le projet montre une **chaîne de décisions** (où, pour quel âge, quelle offre, à quel prix), chacune partie d'une étude. Faits de l'utilisatrice : camps d'été d'une semaine (langues étrangères et soft skills) pour les **6 – 12 ans**, public choisi après une étude des âges et des habitudes d'été des enfants ; prix fixés d'après les prix du marché et ce que les parents sont prêts à payer ; l'équipe visait d'abord les grandes villes du Nord, puis a choisi **Hsinchu et Taichung** après étude de marché et analyse de la concurrence ; 5 camps, 3 250 € de bénéfice net (02/2022 – 08/2022). Les données de l'étude de 2022 n'ont pas été fournies : à sa demande, l'étude affichée est une **relecture en 2026 à partir de statistiques publiques**, et la ligne source le dit. Ne jamais la présenter comme l'étude réalisée en 2022, ni inventer les raisons réelles du choix, des concurrents nommés ou des prix. Chiffres sourcés : part des 0 – 14 ans fin 2021, Hsinchu (ville) 16,63 %, Hsinchu (comté) 15,94 %, Taoyuan 14,35 %, Taichung 13,74 %, New Taipei 11,79 %, Taipei 13,24 % (fin 2020, chiffre 2021 introuvable) ; élèves du primaire 2021 – 2022 : Taichung 160 242, Taipei 125 093 ; élèves de 1re année à Taichung +24,16 % depuis 2016 – 2017 ; revenu disponible par habitant 2021 : Taipei 520 000 NT$, New Taipei 390 000, Taoyuan 388 000, Taichung 371 544. Graphiques de l'étude complète (demande de l'utilisatrice) : chaîne des quatre décisions, tableau des six marchés (part des 0 – 14 ans et revenu disponible, Hsinchu « non comparé dans la source »), dynamique de Taichung (1re année ≈ 23 115 → 28 700, primaire ≈ 153 063 → 160 242 : valeurs 2016 – 2017 recalculées à partir des taux publiés +24,16 % et +4,69 %, et dites recalculées). La concurrence n'est décrite que par types d'offre. Seul repère de prix public de 2022 : camp STEAM d'anglais du Formosa Language Center à Taichung, cinq jours, 6 – 8 ans, 6 600 NT$. **Le prix de Sora, les résultats de l'enquête auprès des parents et les concurrents précis n'ont pas été fournis : l'utilisatrice a proposé de les inventer (« personne ne vérifiera »), refusé (§ 5).** Ne jamais afficher de chiffres de prix, d'enquête ou de concurrents qu'elle n'a pas donnés ; les ajouter dès qu'elle les retrouve.

---

## 17. Ligne Entreprise d'une Expérience

- Format : **nom de l'entreprise (avec le groupe si besoin), puis `·`, puis une courte description de l'entreprise**.
  - ✅ `leboncoin, Adevinta · Régie publicitaire`
  - ❌ `leboncoin · Adevinta` (le groupe n'est pas une description)
- Ce qui suit `·` décrit toujours l'activité de l'entreprise, jamais un autre nom.

---

## 18. Pas de Nom Chinois sur le Site

- Les candidatures visent des entreprises hors de Taïwan : le site affiche uniquement **Yu-Ting Tseng**, jamais le nom chinois.
- Cela vaut pour toutes les pages et toutes les langues, y compris la version chinoise.
- **Exception (validée par l'utilisatrice) :** le visuel des badges du club de kyudo (`assets/kyudo-name-badge.webp`, catégorie « Design » de `portfolio-marketing.html`) reste tel quel, avec le prénom imprimé sur le badge : c'est l'œuvre elle-même.

---

## 19. Statut et Coordonnées

- Yu-Ting Tseng est en **année de césure 2026 – 2027** (stages uniquement), toujours étudiante à emlyon, retour en M2 ensuite. Elle est **basée à Paris** ; emlyon reste situé à Lyon.
- La ligne « Statut : Année de césure (2026 – 2027), puis M2 » figure dans la formation emlyon de chaque page CV.

---

## 20. Format des Dates et des Nombres

- **Dates : toujours `MM/AAAA`** (`08/2025 – 06/2026`), dans toutes les langues, jamais « Août 2023 », « Sep. 2024 » ni « 2025/08 ». En cours : `Présent` / `Present` / `至今`.
- **Nombres en français** : virgule décimale et espace insécable avant `%`, `€` et les unités (`+89,1 %`, `3 250 €`, `5 h`). En anglais : `+89.1%`, `€3,250`. Préférer « plus de 20 » à « 20+ » dans les phrases françaises.
- Un chiffre affiché dans toutes les langues ne s'écrit jamais en dur : clé `nums.*` dans `main.js` sur les pages CV, paires `data-lang-show` sur les portfolios.

---

## 21. Sections des Pages CV

- **Pas de section « Distinctions & Bourses »** : retirée à la demande. Le Certificate of Excellence reste mentionné dans la formation NCCU.
- **Bénévolat présent sur toutes les pages CV** (`index`, `marketing`, `data`, `finance`), même contenu que sur `index`.
- **Formation (toutes les pages)** : pas de nom d'école après « GPA » (le libellé est simplement « GPA »), pas de puce « Approfondissement des politiques européennes et internationales » sous l'échange Paris 1. La ligne « Spécialisation : Finance & Comptabilité » ne figure que sur `finance.html`.
- **leboncoin** : toujours « plus de 20 campagnes simultanées » (« 20+ » en anglais et en chinois), sur toutes les pages.
- **Compétences : toujours garder les sous-catégories** (« Stratégie », « Contenu », « Référencement Naturel (SEO) »…). Les aplatir en une seule liste par bloc a été essayé puis refusé : trop chargé, illisible. `index` n'affiche pas le bloc Finance.

---

## 22. Projets sur Données Publiques

- Tout projet réalisé hors entreprise sur un jeu de données public porte la mention **« Projet personnel »** (catégorie de la fiche) et une ligne **Source des données** sous le résumé (`.pf-case-source`).
- Sephora : Kaggle « Sephora Products and Skincare Reviews ». Maison Beauté : Kaggle « Customer Personality Analysis », marque fictive servant de cadre au cas.
- **Citations et liste de références (demande de l'utilisatrice)** : tout projet qui s'appuie sur des données publiques ou cite des travaux donne ses sources dans le texte (auteur, année : « (Inky, 2023) », « (Henisz, 2000) ») et se termine par un bloc **Références / References** (`.pf-refs`, à la fin de l'étude complète, avant `</details>` ; sur `portfolio-finance`, avant les chiffres de la carte), au format APA 7, en FR et EN (et ZH si le projet l'a). Les URL encodées s'affichent sous la forme « domaine (PDF) ». Références en place : Sephora (Inky, 2023), Maison Beauté (Patel, 2021), Boutique de Mode (Puri, 2025), Risky Deals (Cao et al., 2017 ; Fund for Peace, 2025 ; Henisz, 2000 et 2025 ; IMAA Institute ; LSEG, 2026 ; Schipperus, 2025 ; World Bank, 2025, d'après la bibliographie du rapport `RECAPSS_Group 2_Final Paper.pdf`), Sora Education (ministère de l'Intérieur, villes de New Taipei, Taichung et Taipei, Formosa Language Center). Chocolat FMCG : Kaggle « Chocolate Sales Dataset 2023 - 2024 » (ssssws, s.d. ; nom réel de l'auteur et année non vérifiables, d'où le pseudonyme et « s.d. »), source donnée par l'utilisatrice. Jamais de référence inventée : une source non retrouvée reste signalée sans entrée.
- **Boutique de Mode / Fashion Boutique** (`#boutique-mode`, ancien « Maison Luxe ») : Kaggle « Retail Fashion Boutique Data Sales Analytics 2025 » (pratyushpuri, 2 176 lignes, données synthétiques, 8 marques), CSV fourni par l'utilisatrice. Le jeu de données ne nomme aucune boutique et ses marques (Zara, H&M, Uniqlo, Mango, Gap, Banana Republic, Ann Taylor, Forever21) ne sont pas du luxe : **ne jamais l'appeler « Maison Luxe »** ni lui inventer un nom. Chiffres vérifiés : 211 508 $ plein prix, 25 461 $ de remises (12,0 %), 878 articles remisés (40,3 %, 30,1 % en moyenne), part remisée selon le stock 38,5 % (0 – 5 unités) contre 42,8 % (36 – 50 unités), r = 0,01 ; quart le plus cher = 41,6 % de la perte ; remise moyenne Bottoms 13,2, Dresses 13,2, Shoes 13,0, Outerwear 10,8 ; 26 544 $ = valeur des articles retournés (320, 14,7 %), pas un coût logistique ; note 2,99. Aucune donnée de ventes ni de vélocité : pas de classification rupture / stock mort (l'ancienne « 888 / 907 SKUs » n'était pas reproductible).
- **Projets de recherche en préparation, pas encore sur le site** : « Yen et luxe au Japon » (`assets/R_Yen Luxury Japan/`, R) et « Inflation et marques de distributeur, FMCG 2021 – 2025 » (`assets/Python_Private Label FMCG/`, Python). Plans de recherche et modèles de données vides, à remplir par l'utilisatrice à partir des documents originaux (rapports trimestriels, Eurostat, PLMA). Ne jamais les ajouter au portfolio avec des résultats tant que les données réelles ne sont pas saisies et que la régression n'a pas été lancée.
- Chocolat FMCG (`portfolio-data.html`) : projet personnel sur jeu de données public (confirmé par l'utilisatrice). Source fournie par l'utilisatrice : Kaggle « Chocolate Sales Dataset 2023 - 2024 » (https://www.kaggle.com/datasets/ssssws/chocolate-sales-dataset-2023-2024), données synthétiques selon sa description.
- **Chocolat FMCG : données vraisemblablement simulées** (indicateurs identiques sur les 4 canaux, toutes les marges à 40 %, aucune saisonnalité, six groupes concurrents dans une seule entreprise). Le projet le dit dans un bloc « Contrôle Qualité des Données · 4 alertes » : les constats décrivent le jeu de données, les recommandations sont des hypothèses à tester. Ne jamais présenter ces régularités comme des problèmes réels d'entreprise.
- **Tout projet personnel finit par des recommandations priorisées puis des limites** (demande de l'utilisatrice : montrer la pensée professionnelle, pas un mémoire) : « Priorité 1, … » avec l'action, la raison de l'ordre et un indicateur de suivi, puis « Limites » (et « Prochaine Étape » si utile). Les chiffres viennent uniquement de l'étude ; jamais d'impact chiffré inventé. Plus de paragraphes « En premier lieu… En second lieu… ».
- **Sephora** : la BCG est adaptée (volume d'avis et note à la place de la croissance et de la part de marché), dit dans les limites. Segments : Hero (Stars), **Hidden Gems** (ancien « Question Marks », renommé à la demande de l'utilisatrice : ce sont les produits les mieux notés, seule leur visibilité est incertaine), Risk (forte exposition, note faible), Underperformers (Dogs). Ne pas réécrire « Risk (Dogs) » ni revenir à « Question Marks » (sauf la mention « Hidden Gems (Question Marks) » qui fait le lien avec la BCG).
- **Sephora, chiffres = dashboard Power BI de l'utilisatrice** (demande : en cas d'écart, les captures font foi, arrondis et décimales compris). 4 pages : Product Overview, Portfolio Matrix, Customer Voice, Customer Voice - Skincare ; captures `assets/Sephora_PowerBI/sephora-powerbi-1…4.webp` (exportées en PDF par l'utilisatrice, format français), carrousel `#sephoraBI` dans l'étude complète. Chiffres : 8 494 produits (pas 8 495), 304 marques, prix moyen 51,66 $, note moyenne 4,19 (4,23 = moyenne des seuls soins), Hero 2 307, Hidden Gems 1 801, Risk 1 815, Underperformers 2 293, non notés 278, médianes 122 avis et 4,29 ; 3 685 250 avis comptés sur les fiches produits (pas « 32 000+ ») et 1 094 411 avis individuels, **soins de la peau uniquement** (le jeu de données n'a d'avis détaillés que pour Skincare). « Top brand : Anastasia Beverly Hills » (Hero) n'apparaît pas dans le dashboard : c'est la marque Hero qui cumule le plus de favoris, SEPHORA COLLECTION en compte le plus de produits ; signalé à l'utilisatrice, texte laissé tel quel.
- **Maison Beauté : pas de « ROI »** : le jeu de données n'a aucun coût de campagne, on parle de « Performance des Campagnes » / « Campaign Performance » (taux d'acceptation). Les limites rappellent aussi que l'écart « 3x » des clients engagés peut venir du revenu (corrélation, pas causalité).

---

## 23. CV PDF Téléchargeables

- Chaque page CV (`index`, `marketing`, `data`, `finance`) a un bouton « Télécharger le CV (PDF) » dans le héros ; le lien change avec la langue (clés `cv.*`, la version chinoise renvoie au PDF anglais).
- Les PDF (`assets/cv/`) sont **générés depuis les pages** par `tools/build-cv.js` : ne jamais les modifier à la main. **Après toute modification de contenu d'une page CV, relancer le script** (serveur local sur le port 8765, Playwright requis) et committer les PDF.
- **Contenu du PDF** : le bénévolat n'y figure pas (il reste sur les pages CV, § 21). Chaque entrée s'écrit sur deux lignes, dates à droite de la première, lieu à droite de la seconde :
  - **expériences et associations** : poste en gras, puis entreprise ou association en italique ;
  - **formation** : école en gras, puis diplôme en italique.
- **Puces du PDF** : caractère « • » d'une police système (DejaVu Sans), placé en absolu à la couleur d'accent, même taille sur chaque ligne. Ni le glyphe d'Outfit (à moitié coupé) ni un petit rond CSS (taille irrégulière à l'affichage).
- **Compétences du PDF** : classées par bloc puis sous-catégorie (libellé à gauche, compétences à droite, sous-niveaux comme « SEA » ou « Outils » en italique). Jamais une longue liste à plat. L'ordre est fixé pour chaque CV dans `SKILLS` (`tools/build-cv.js`), avec les `data-skill` et les clés `skills.*` du site : aucun texte saisi à la main, aucun libellé inventé. Le script signale toute compétence de la page absente du CV.
  - **Du plus important au moins important pour le métier visé**, blocs comme sous-catégories et compétences (ex. Finance en tête du CV Finance).
  - **Libellés des sous-catégories sur une seule ligne** (colonne à la largeur du plus long libellé).
  - **Toutes les capacités d'analyse dans le bloc Data** (« Data, Reporting & Automation » sur marketing, « Data & Analytics » ailleurs) : Google Analytics, Études de Marché, Veille Concurrentielle, Benchmarking, Analyse Stratégique.
  - **SEO dans « Marketing Performance »** à côté de SEA, SMM et Display & AdOps, ses outils juste en dessous, en retrait.
  - **Langues par ordre d'importance** : français, anglais, japonais, puis mandarin.
  - **Retiré du CV** : « Développement Web » (HTML · CSS), jugé secondaire. Il reste sur le site.
- **Pas de page presque vide** : si la dernière page ne porte que quelques lignes, le script resserre le contenu (7 % au plus) pour tenir sur une page de moins.

---

## 24. Pages Data : Tout le Design de Marketing, Relié à la Data

- **Demande de l'utilisatrice (direction B « papier céladon », choisie parmi trois propositions) :** `data.html` et `portfolio-data.html` reprennent **tout le design marketing** (papier xuan, filets d'encre, cartes plates, chiffres qui s'écrivent, repères de frise en cercles, catalogue puis lecture, coup de pinceau sous les titres des fiches, curseur lavis, séparations qui vibrent et sonnent), reliés à la data par la couleur et par le dessin du guzheng. Le contenu suit la logique data. Pas de bougie.
- **Palette (§ 3)** : papier xuan retinté céladon `#e4ece7` (`assets/xuan-paper-celadon.webp`, sombre `assets/xuan-paper-celadon-dark.webp` sur `#111816`), cartes `#eef3ef`, encre `#16211f`, sarcelle `#0d9488` à la place du vermillon. Si la teinte change, refaire les deux images (même règle que § 45).
- **Le guzheng vu de dessus, dessiné comme un graphique** (symbole `#da-guzheng`, 240 × 56, 150 px sur téléphone, passé au filtre d'encre `#mk-encre`) : table claire cernée d'encre, deux sillets, dix cordes fines comme des lignes de graphique, la 5e et la 10e en sarcelle (les cordes vertes qui marquent la note gong), chevalets posés en arc comme sur l'instrument, reliés par une courbe de tendance en pointillé sarcelle, le plus haut chevalet en sarcelle.
- **Séparations** : mêmes classes que marketing (`.mk-sep`, filets d'encre `.mk-sep-filet`, `.mk-sep-orn` qui reprend `#da-guzheng`), donc `guzheng.js` les fait vibrer et sonner ; dernière corde au pied de page sur `data.html` seulement (sur `portfolio-data.html`, la séparation au guzheng précède directement le pied de page : une seule ligne gardée, demande de l'utilisatrice) ; bouton note `.mk-son` dans l'en-tête (son coupé par défaut, même choix de session que marketing).
- **Logo** (`.brand-mark--guzheng`) : « YT » au-dessus d'un petit guzheng en plan à l'encre, un chevalet en sarcelle.
- **Versions écartées** : graphique en barres, papier millimétré, papier à cordes sarcelle (avec ou sans lignes grises).
- **Styles :** `style.css` § 46 pour `data.html`. `portfolio-data.html` garde ses styles dans la page, variables `--da-*`.
- **`portfolio-data.html`** suit la structure de `portfolio-marketing.html` (§ 16) : catalogue filtrable (Tous, Dashboard, Analyse, Recherche, Reporting), lecture d'un projet à la fois (`#id`), frise de vignettes, « Projet suivant », couverture qui vole jusqu'à `[data-land]`, études complètes repliées, état « Vue / Ouverte » (clé `pf-etat-data`), visionneuse `lightbox.js`. Les couvertures sans image sont des graphiques tirés des chiffres de l'étude (M&A, Chocolat, Boutique de Mode), en FR et EN. Le chiffre de chaque fiche met en avant la méthode (12 métriques, 3 hypothèses, 990 236 transactions, 2 176 SKUs, +50 % de vues pour le rapport hebdomadaire), pas le même chiffre que la fiche marketing.
- Couverture image de `portfolio-data.html` (dashboard XHS) : recomposée sur la carte céladon `#eef3ef` au lieu du papier marketing, `assets/covers/engoo-dashboard-data(-en).webp`, clé `portfolio.data.coverDash`.
- **Rapport hebdomadaire XHS (`#xhs-weekly`), angle data : recréé dans la page, jamais en téléchargement** (demande de l'utilisatrice). Couverture = graphique des vues jour par jour (semaine du 27/01 au 02/02/2025 contre la précédente) ; dans l'étude : tableau de bord des 7 KPI, graphique détaillé avec écart par jour, lecture des résultats, vérification la semaine suivante (1 310 vues, −57 %), recommandations, plan d'action. Chiffres tirés uniquement du dashboard Excel (`Data`, données réelles jusqu'au 13/02/2025) : 3 063 vues contre 2 048, 47 nouveaux abonnés contre 19, 40 enregistrements, 14 commentaires, 22 h de visionnage, 175 visites du profil contre 129, meilleure semaine depuis le début du suivi (10/2024). **Pas d'« aperçu des contenus »** sur la page data : les trois posts de la diapositive 4 ont été choisis pour leur couverture, pas pour leurs chiffres.
- **Decks du rapport (`assets/Engoo_Weekly Report_FR.pptx` et `_EN.pptx`, corrigés)** : « meilleure semaine depuis le début du suivi » ; « les nouveaux abonnés ont plus que doublé » ; 4e point de la synthèse = visites du profil (+36 %) ; diapositive 4 renommée « Aperçu des contenus » / « Content Highlights », sans badges de classement ni « n° 1 » ; moteurs de la semaine : seul le contenu Zodiaque est cité (publié pendant la semaine du Nouvel An), plus de mention de budget publicitaire. Diapositives du carrousel marketing : `assets/Engoo_Weekly Report_FR|EN/Diapositive1-7.JPG`, exportées par l'utilisatrice depuis PowerPoint (jamais rendues par LibreOffice, les polices diffèrent) ; couvertures `assets/covers/engoo-weekly(-en).webp` recomposées à partir de ces exports (diapositive 1 devant, 2 derrière, sur le papier `#f3f1ea`). Ne jamais réintroduire « chaque top post a dépassé 3 000 vues » ni aucun chiffre absent du dashboard : l'utilisatrice a demandé un chiffre embelli, refusé (§ 5).
- **Rapport hebdomadaire XHS : un exemple, pas un modèle** (demande de l'utilisatrice). Les diapositives montrées sont celles d'une seule semaine (27/01 – 02/02/2025). Ne jamais le présenter comme bilingue (aucun « bilingue », « FR / EN », « Langues de diffusion ») ni comme un format fixe (« 7 diapositives par semaine »), et ne jamais indiquer le nombre de diapositives (ni « les 7 diapositives », ni « 7 slides », demande de l'utilisatrice) ; la fiche marketing du catalogue n'affiche pas de chiffre, l'intérêt du projet étant la lecture des chiffres, pas un chiffre.
- **Dashboard XHS téléchargeable** (demande de l'utilisatrice, à la place de l'ancien TCD interactif `xhs-pivot.js`, retiré) : bouton « Télécharger le dashboard (Excel) » / « Download the dashboard (Excel) » dans la colonne gauche du projet, sur `portfolio-data.html` (`#xhs-dashboard`) et `portfolio-marketing.html` (`#engoo-dashboard`) ; le fichier suit la langue (`assets/Engoo_Excel/Engoo_XHS Dashboard_FR_261023.xlsx` ou `_EN_261023.xlsx`). Si le classeur est remplacé, mettre à jour les deux liens. Fichiers Engoo dans `assets/Engoo_Excel/` (ancien `Excel_Engoo`) ; les fichiers verrou d'Excel (`~$*`) sont ignorés par git.
- **Captures du dashboard Engoo** (`assets/Engoo_Excel/Engoo Dashboard_FR|EN.webp`) : exportées par l'utilisatrice depuis Excel (version du 23/10/2026, période « 30 derniers jours », données simulées), jamais rendues par LibreOffice (segments et graphiques croisés vides). Les quatre couvertures `assets/covers/engoo-dashboard(-data)(-en).webp` en sont recomposées : capture entière de 1 078 px de large, filet et ombre douce, sur le papier `#f3f1ea` (marketing) ou la carte `#eef3ef` (data).
- Identifiants des projets : `xhs-dashboard`, `ma-risque-politique`, `chocolat-fmcg`, `boutique-mode`, `xhs-weekly`.
- **Engoo, faits confirmés par l'utilisatrice** : le dashboard suit **11 métriques**, celles de l'Excel (vues, temps de visionnage total, j'aime, enregistrements, commentaires, partages, visites du profil, nouveaux abonnés, engagement, taux d'engagement, notoriété de la marque), jamais CTR, taux de complétion ni portée (l'Excel n'a ni impressions, ni clics, ni données par post ou par format : « +34 % CTR », « +28 % d'engagement » après passage au tutoriel court et « CTR 25 % supérieur des miniatures Educational Tips » ont été retirés des deux portfolios et de `main.js`, source introuvable) ; elle a géré le compte XHS **de 12/2024 à 02/2025** (inactif avant), d'où les progressions « sur 3 mois » ; **+93,3 % de vues, +89,1 % d'interactions et +69,7 % d'abonnés** : chiffres maintenus par l'utilisatrice (source exacte oubliée, non reproductibles à partir de la feuille « Données », qui donne par exemple +70,7 % de vues par jour entre 12/2024 – 02/2025 et 10 – 11/2024) : ne pas les modifier ni les recalculer ; **aucun script Python ni macro VBA** chez Engoo ; gain de temps du dashboard = **30 % de temps de reporting quotidien en moins** (jamais « 5 h par semaine ») : le script Python d'automatisation du reporting client a été fait **chez KPN** (5 à 10 minutes gagnées par client chaque semaine), puces `experience.kpn.*PythonPoint` sur chaque page CV.
- **Engoo, pas d'« Insights métier » ni de comparaison de formats** (demande de l'utilisatrice) : retirés des deux portfolios, sans source dans l'Excel ni dans les diapositives. Ne jamais réécrire « les publications éducatives génèrent deux à trois fois plus de sauvegardes que les contenus promotionnels », ni « la semaine à +40 % coïncide avec l'adoption d'une charte visuelle », ni « graphiques de comparaison des formats » (l'Excel n'a que des courbes par KPI et le graphique Période A / Période B).
- **Dashboard XHS : saisie manuelle des données** : les nouvelles données s'ajoutent à la main dans la feuille `Data`. Ne jamais écrire « Zéro mise à jour manuelle » / « Zero manual updates » / « 零手動更新 » (retiré à la demande de l'utilisatrice). Vérifié dans l'Excel : aucune formule DÉCALER / OFFSET ni INDIRECT, aucune moyenne mobile ni fenêtre glissante, ne jamais les citer ; la mise en forme conditionnelle sert à **mettre en évidence les variations clés** (seuils par KPI), pas à repérer des « jours outliers ». Rien ne doit laisser croire que le dashboard se met à jour seul : jamais « entièrement autonome », « self-contained », « 完全自主運作 », « tableaux de bord automatisés », « automatisation du reporting / du tableau de bord », « built and automated ». Seuls les calculs de formules (écarts A/B en %) peuvent être dits automatiques. Le classeur se décrit **en 3 parties** (données brutes, dashboard dynamique, module A/B), jamais « 3 feuilles » : l'Excel en compte 5.
- **Script Python du dashboard XHS** (`update-data.py`) : **plus mentionné sur le site** (retiré à la demande de l'utilisatrice), fichier supprimé du dépôt lors du nettoyage des anciens fichiers (il reste dans l'historique git). Testé sur la version actuelle du classeur, il l'abîme (écrit sur la ligne MIN, dates en texte, formules remplacées par des valeurs, segment et styles de graphiques supprimés par openpyxl). Une macro VBA d'import (`ImporterExportXHS`, fournie à l'utilisatrice) le remplacera : ne l'ajouter au site qu'une fois que l'utilisatrice confirme l'avoir intégrée à son Excel.
- **Maison Beauté** (vérifié sur le jeu de données Kaggle) : « dépense premium » = vins + produits or (`MntWines + MntGoldProds`), r = 0,59 donc R² ≈ 0,34 ; le « profil idéal » est la moyenne des clients ayant répondu à la campagne Response, tranche de revenu T3, pas T4.

---

## Quick Pre-Publish Checklist

Before finalizing any new text, component, or section:

- [ ] Title/subtitle words are all capitalized
- [ ] Punctuation matches page style; dashes have spaces; no dot-separators
- [ ] Colors use the correct page CSS variables
- [ ] Content is complete and not confusing on its own
- [ ] No contradiction with existing content (or user has been asked)
- [ ] No fabricated information
- [ ] No garbled/placeholder text
- [ ] Content is in the correct section
- [ ] Une expérience présente sur plusieurs pages a un style et des compétences différents sur chaque page
- [ ] Language matches the page's language version
- [ ] Aucun nom chinois affiché sur le site
- [ ] Dates en `MM/AAAA`, nombres au format de la langue
- [ ] CV PDF régénérés si le contenu d'une page CV a changé

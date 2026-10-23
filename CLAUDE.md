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
- **Le curseur bougie ne s'applique qu'aux travaux de création** : affiches, identité visuelle, design packaging. Les livrables analytiques (dashboards, segmentation, analyse produit) restent affichés normalement : leur lisibilité passe avant l'effet.
- **Fonctionnement de la bougie** (implémenté dans `portfolio-marketing.html`) : le curseur devient une flamme, l'œuvre survolée s'affiche en niveaux de gris et ne retrouve ses couleurs que dans le halo de lumière, réchauffé d'un voile ambré. Le rayon vacille légèrement, il est proportionné à la taille de l'œuvre.
- **Effets de curseur réservés aux directions marketing et data** : `index`, `finance`, `teaching` et `portfolio-finance` gardent le curseur natif, sans trait, sans cadre ni aucun effet. `data` et `portfolio-data` ont le curseur lavis (§ 24), jamais la bougie.
- **Curseur « lavis »** (`ink-cursor.js`, chargé par `marketing.html`, `portfolio-marketing.html`, `data.html` et `portfolio-data.html`), tout dans le vocabulaire de l'encre, jamais de réticule ni de cadre de visée :
  - curseur : **la flèche native**, jamais remplacée ni retardée (la goutte d'encre qui suivait la main a été retirée : elle masquait la flèche et traînait derrière le geste ; un plectre de guzheng a aussi été écarté, peu compréhensible hors de Chine) ;
  - survol d'un **petit** élément cliquable (bouton, lien, puce) : un lavis pâle s'épanouit sur son pourtour, comme le papier qui boit l'encre, sans couvrir son contenu ;
  - survol d'un **grand bloc** (fiche du catalogue, « Projet suivant », tout élément de plus de 90 px dans sa plus petite dimension) : **jamais de lavis autour**, il faisait une auréole grise « sale ». À la place, un coup de pinceau à l'encre se trace de gauche à droite sous le titre (`.pf-cat-name`, `.pf-next-name`), la couverture se soulève ou prend le liseré vermillon, la flèche avance ;
  - visionneuse ouverte (`html.lb-ouvert`) : lavis et ondes disparaissent aussitôt, rien ne passe devant l'image agrandie ;
  - clic : la goutte tombe dans l'eau. Trois ondes fines, à peine ovales et inclinées au hasard, s'élargissent en ralentissant, s'amincissent et pâlissent en s'éloignant (on anime le rayon, jamais l'échelle, sinon le trait s'épaissit) ; au centre, l'encre se diffuse en petit nuage flou, sans point dur ;
  - couleur `--trail` (`style.css` § 43), l'encre de la page ; rien au toucher ni en mouvement réduit ; sur les travaux de création, la flamme de la bougie prend le relais.
- **État des fiches du catalogue (`portfolio-marketing.html` uniquement)** : à côté de la catégorie, chaque fiche affiche « ○ Vue » (restée au moins une seconde à moitié visible) puis « ● Ouverte » en vermillon (projet ouvert par la fiche, la vignette ou « Projet suivant »), en FR/EN. Chaque fiche ne compte qu'une fois ; l'état reste dans `sessionStorage`, rien n'est envoyé. L'ancien onglet flottant « CTR » a été retiré à la demande : il comptait de nouvelles impressions à chaque retour au catalogue et se lisait mal. Ne pas le réintroduire.
- **Visionneuse (`lightbox.js`, `portfolio-marketing.html`)** : tout lien vers une image dans un projet s'ouvre agrandi au centre de la page, jamais dans un nouvel onglet ; flèches à gauche et à droite (clavier ← →, glisser au toucher) pour parcourir les images visibles du même projet, compteur « 3 / 7 », fermeture par ×, Échap ou clic sur le fond. Fond papier voilé, cadre et boutons aux couleurs `--mk-*`. Pas de légende visible (les textes alternatifs ne sont pas tous traduits). Sans JavaScript, le lien ouvre l'image comme avant.
- **Étendre la bougie à une autre carte** : poser `data-candle` sur l'`<article>`. Toutes les `.pf-img-wrap` et `.ig-item a` qu'elle contient entrent alors dans le jeu, le calque couleur est construit en JS à partir de l'image existante, sans second téléchargement.
- **Garde-fous à conserver** : sans survol fin (tactile) ou en `prefers-reduced-motion`, les œuvres restent en couleur et aucun calque n'est créé. Une œuvre ne doit jamais rester inaccessible parce que l'effet ne peut pas s'exécuter.
- **La carte de profil du héros garde la photo** sur toutes les pages, marketing comprise : on ne la remplace jamais par une œuvre. Les travaux se montrent dans le portfolio.
- **Structure de `portfolio-marketing.html` : catalogue puis lecture, un projet à la fois.**
  - Catalogue : une grille de fiches (couverture, numéro, catégorie, titre, un seul chiffre clé), filtrable. Pas de tableau de résultats ni de chiffres répétés ailleurs.
  - Lecture : un seul projet affiché (`#id` dans l'URL, liens profonds et retour arrière pris en charge), avec fil d'Ariane « Tous les projets », frise de vignettes à gauche (bandeau horizontal sur mobile) et « Projet suivant » en fin de page.
  - Chaque projet : colonne gauche (titre, chiffres, outils), colonne droite (visuel, résumé court), détails complets repliés sous « Lire l'étude complète ».
  - **Couvertures sans recadrage visible** : chaque couverture d'image est une composition au format exact 3:2 dans `assets/covers/` (œuvres entières posées sur le papier `#f3f1ea`, plusieurs pièces côte à côte ou diapositives empilées si besoin). On ne laisse jamais le CSS couper une affiche, une diapositive ou un dashboard.
  - **Une couverture n'est jamais un simple chiffre** : un projet sans image reçoit une visualisation de ses propres données (graphique, matrice, diapositive façon rapport d'affaires), construite uniquement à partir des chiffres déjà présents dans l'étude.
  - Tout texte visible existe en français et en anglais (clé i18n dans `main.js` ou paires `data-lang-show`), y compris dans les SVG et les chiffres (`8 495` / `8,495`).
  - Ouvrir une fiche fait voler sa couverture jusqu'à la couverture identique en tête du projet (élément `[data-land]`), qui reste masquée pendant le vol : une seule image, qui se pose exactement à sa place. Tout nouveau projet doit avoir cette couverture d'arrivée, et le défilement du script reste immédiat (`behavior: 'instant'`), car `scroll-behavior: smooth` fausserait la mesure. Sans JavaScript ou en `prefers-reduced-motion`, tout reste lisible sans animation.
  - Ajouter un projet : une fiche dans `.pf-cat-grid`, une vignette dans `.pf-rail`, un `<article class="pf-case">` avec son lien `.pf-next`, et mettre à jour le lien « Projet suivant » du projet précédent.
- **Un seul motif sur les pages marketing : le guzheng** (clin d'œil au club de guzheng), montré **en entier, comme un instrument reconnaissable**, jamais en fragments abstraits (cordes et chevalets isolés jugés « moches » et illisibles). Les éléments d'architecture chinoise (toit 飛簷, poutre 額枋, tuiles 瓦當, coins de fenêtre 窗櫺角花, porte de lune, logo sous avant-toit) ont été **retirés à la demande** : sans lien avec le parcours. Ne pas les réintroduire, ni ajouter un second registre décoratif. Le guzheng n'apparaît qu'à deux endroits ; partout ailleurs, des traits sobres (`style.css` § 44), clair comme sombre :
  - **séparations** (`marketing.html` et `portfolio-marketing.html`, sur le portfolio entre le catalogue et « Autres Travaux » et dans chaque projet avant « Projet suivant ») : deux filets d'encre et, au centre, un **guzheng de trois quarts** légèrement incliné (environ 8°) comme posé sur la page : table bombée claire, flancs et tête laqués, quinze cordes sur deux sillets, chevalets (雁柱) en arc dont celui du milieu en vermillon, pieds et ombre douce. Dessiné une seule fois dans le symbole `#mk-guzheng` (défini dans le `<svg>` caché en haut de page) et repris par `<use>` ; 200 px de large (150 px sur téléphone). Couleurs par classes `.q-*` ciblées sur `#mk-guzheng`, variables `--mk-*` sur le portfolio ;
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
- **Formation sur `marketing.html`** : pas de ligne « Spécialisation : Finance & Comptabilité », pas de nom d'école après « GPA » (le libellé est simplement « GPA »), pas de puce sous l'échange Paris 1.
- **Compétences : toujours garder les sous-catégories** (« Stratégie », « Contenu », « Référencement Naturel (SEO) »…). Les aplatir en une seule liste par bloc a été essayé puis refusé : trop chargé, illisible. `index` n'affiche pas le bloc Finance.

---

## 22. Projets sur Données Publiques

- Tout projet réalisé hors entreprise sur un jeu de données public porte la mention **« Projet personnel »** (catégorie de la fiche) et une ligne **Source des données** sous le résumé (`.pf-case-source`).
- Sephora : Kaggle « Sephora Products and Skincare Reviews ». Maison Beauté : Kaggle « Customer Personality Analysis », marque fictive servant de cadre au cas.
- Chocolat FMCG et Maison Luxe (`portfolio-data.html`) : projets personnels sur jeux de données publics (confirmé par l'utilisatrice). Le nom exact des jeux de données n'a pas encore été fourni : la ligne indique seulement « jeu de données public » ; la compléter dès que l'utilisatrice donne la source.

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

- **Demande de l'utilisatrice (direction B « papier céladon », choisie parmi trois propositions) :** `data.html` et `portfolio-data.html` reprennent **tout le design marketing** (papier xuan, filets d'encre, cartes plates, chiffres qui s'écrivent, repères de frise en cercles, catalogue puis lecture, coup de pinceau sous les titres des fiches, curseur lavis, séparations qui vibrent et sonnent), reliés à la data par la couleur et par le dessin du guzheng. Le contenu suit la logique data. Pas de bougie (réservée aux travaux de création).
- **Palette (§ 3)** : papier xuan retinté céladon `#e4ece7` (`assets/xuan-paper-celadon.webp`, sombre `assets/xuan-paper-celadon-dark.webp` sur `#111816`), cartes `#eef3ef`, encre `#16211f`, sarcelle `#0d9488` à la place du vermillon. Si la teinte change, refaire les deux images (même règle que § 45).
- **Le guzheng vu de dessus, dessiné comme un graphique** (symbole `#da-guzheng`, 240 × 56, 150 px sur téléphone, passé au filtre d'encre `#mk-encre`) : table claire cernée d'encre, deux sillets, dix cordes fines comme des lignes de graphique, la 5e et la 10e en sarcelle (les cordes vertes qui marquent la note gong), chevalets posés en arc comme sur l'instrument, reliés par une courbe de tendance en pointillé sarcelle, le plus haut chevalet en sarcelle.
- **Séparations** : mêmes classes que marketing (`.mk-sep`, filets d'encre `.mk-sep-filet`, `.mk-sep-orn` qui reprend `#da-guzheng`), donc `guzheng.js` les fait vibrer et sonner ; dernière corde au pied de page sur `data.html` seulement (sur `portfolio-data.html`, la séparation au guzheng précède directement le pied de page : une seule ligne gardée, demande de l'utilisatrice) ; bouton note `.mk-son` dans l'en-tête (son coupé par défaut, même choix de session que marketing).
- **Logo** (`.brand-mark--guzheng`) : « YT » au-dessus d'un petit guzheng en plan à l'encre, un chevalet en sarcelle.
- **Versions écartées** : graphique en barres, papier millimétré, papier à cordes sarcelle (avec ou sans lignes grises).
- **Styles :** `style.css` § 46 pour `data.html`. `portfolio-data.html` garde ses styles dans la page, variables `--da-*`.
- **`portfolio-data.html`** suit la structure de `portfolio-marketing.html` (§ 16) : catalogue filtrable (Tous, Dashboard, Analyse, Recherche, Reporting), lecture d'un projet à la fois (`#id`), frise de vignettes, « Projet suivant », couverture qui vole jusqu'à `[data-land]`, études complètes repliées, état « Vue / Ouverte » (clé `pf-etat-data`), visionneuse `lightbox.js`. Les couvertures sans image sont des graphiques tirés des chiffres de l'étude (M&A, Chocolat, Maison Luxe), en FR et EN. Le chiffre de chaque fiche met en avant la méthode (12 métriques, 3 hypothèses, 990 236 transactions, 2 176 SKUs, 7 diapositives), pas le même chiffre que la fiche marketing.
- Couverture image de `portfolio-data.html` (dashboard XHS) : recomposée sur la carte céladon `#eef3ef` au lieu du papier marketing, `assets/covers/engoo-dashboard-data(-en).webp`, clé `portfolio.data.coverDash`.
- **Rapport hebdomadaire XHS (`#xhs-weekly`), angle data : recréé dans la page, jamais en téléchargement** (demande de l'utilisatrice). Couverture = graphique des vues jour par jour (semaine du 27/01 au 02/02/2025 contre la précédente) ; dans l'étude : tableau de bord des 7 KPI, graphique détaillé avec écart par jour, lecture des résultats, vérification la semaine suivante (1 310 vues, −57 %), recommandations, plan d'action. Chiffres tirés uniquement du dashboard Excel (`Data`, données réelles jusqu'au 13/02/2025) : 3 063 vues contre 2 048, 47 nouveaux abonnés contre 19, 40 enregistrements, 14 commentaires, 22 h de visionnage, 175 visites du profil contre 129, meilleure semaine depuis le début du suivi (10/2024). **Pas d'« aperçu des contenus »** sur la page data : les trois posts de la diapositive 4 ont été choisis pour leur couverture, pas pour leurs chiffres.
- **Decks du rapport (`assets/Engoo_Weekly Report_FR.pptx` et `_EN.pptx`, corrigés)** : « meilleure semaine depuis le début du suivi » ; « les nouveaux abonnés ont plus que doublé » ; 4e point de la synthèse = visites du profil (+36 %) ; diapositive 4 renommée « Aperçu des contenus » / « Content Highlights », sans badges de classement ni « n° 1 » ; moteurs de la semaine : seul le contenu Zodiaque est cité (publié pendant la semaine du Nouvel An), plus de mention de budget publicitaire. Ne jamais réintroduire « chaque top post a dépassé 3 000 vues » ni aucun chiffre absent du dashboard : l'utilisatrice a demandé un chiffre embelli, refusé (§ 5).
- Identifiants des projets : `xhs-dashboard`, `ma-risque-politique`, `chocolat-fmcg`, `maison-luxe`, `xhs-weekly`.

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

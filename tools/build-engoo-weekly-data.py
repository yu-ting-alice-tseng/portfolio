"""Version data du rapport hebdomadaire Engoo (XHS), en français et en anglais.

Part des decks d'origine (assets/Engoo_Weekly Report_FR|EN.pptx, jamais modifiés)
et écrit assets/Engoo_Weekly Report_Data_FR|EN_V{n}.pptx, numéro suivant à chaque
exécution, sans jamais écraser un fichier existant.

Changements par rapport au deck d'origine :
  - « Aperçu des contenus » retiré (choisi pour les couvertures, pas pour les chiffres) ;
  - « Des constats aux hypothèses » (thème, jour et heure de publication) ;
  - « Plan de test A/B » (une variable à la fois, mesure par post) ;
  - « Vérification » de la semaine suivante, sur les totaux quotidiens du dashboard.

Tous les chiffres viennent de la feuille « Données » du dashboard Excel
(données réelles jusqu'au 13/02/2025). Les tests A/B sont un protocole proposé :
aucun résultat de test n'est affiché.

Les images publiées sur le site s'exportent depuis PowerPoint (jamais LibreOffice).
"""
import copy
import re
import sys
from pathlib import Path

from pptx import Presentation
from pptx.util import Emu

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

NB = " "  # espace insécable avant % et :

TEXT = {
    "fr": {
        "src": "Engoo_Weekly Report_FR.pptx",
        "out": "Engoo_Weekly Report_Data_FR_V{n}.pptx",
        "hyp_title": "Des constats aux hypothèses",
        "hyp": [
            ("H1 · THÈME", "Le calendrier culturel attire plus de vues",
             f"25 déc., 31 déc. et 1er janv.{NB}: 306 à 328 vues, contre une médiane de 172 vues par jour en déc. – janv."),
            ("H2 · THÈME", "Les contenus de référence sont plus enregistrés",
             f"Enregistrements +67{NB}% cette semaine (1,3{NB}% des vues){NB}: les posts sont gardés comme supports d'étude."),
            ("H3 · JOUR", "Le dimanche porte mieux le post clé",
             f"Médiane du dimanche{NB}: 173 vues, contre 144 à 160 les autres jours (oct. – févr.). Écart faible, à confirmer."),
            ("H4 · HEURE", "Le soir touche un public plus disponible",
             f"Le dashboard n'a que des totaux par jour{NB}: hypothèse tirée des habitudes du public (étudiants, actifs), à tester."),
        ],
        "hyp_foot": "Chaque hypothèse part d'un constat et se vérifie par un indicateur · Dashboard Excel, 10/2024 – 02/2025",
        "test_title": "Plan de test A/B",
        "test_head": ("Hypothèse", "Version A contre version B", "Mesure", "Règle de décision"),
        "test_rows": [
            ("H1 · Thème", "Post de fête contre post d'actualité, même format, même heure",
             "Vues à 48 h par post · Lanternes, Qingming, 1er mai", "Calendrier culturel adopté si A dépasse B à chaque fête"),
            ("H2 · Thème", "Carrousel glossaire contre post d'actualité sur le même sujet",
             "Taux d'enregistrement par post · 4 semaines", "Un carrousel par semaine si A l'emporte 3 semaines sur 4"),
            ("H3 · Jour", "Même post clé le dimanche contre le vendredi, en alternance",
             "Vues à 7 jours par post · 4 semaines", f"Post clé fixé au dimanche si l'écart dépasse 20{NB}%"),
            ("H4 · Heure", "Même format publié à 12 h contre 20 h, en alternance",
             "Vues et nouveaux abonnés à 24 h · 2 semaines", "Créneau retenu s'il gagne sur les deux indicateurs"),
        ],
        "test_foot": "Une seule variable change à la fois · Mesure par post dans les statistiques de chaque note (le dashboard n'a que des totaux par jour)",
        "ver_title": "Vérification : semaine du 3 au 9 févr.",
        "ver": [
            ("CONFIRMÉE", True, "La baisse annoncée s'est vérifiée",
             f"1 310 vues (−57{NB}%) et 13 nouveaux abonnés contre 47{NB}: sans l'effet des fêtes, le volume retombe."),
            ("ATTEINT", True, "Le taux d'enregistrement a tenu",
             f"19 enregistrements, soit 1,45{NB}% des vues (objectif ≥ 1,3{NB}%), et un engagement à 6,1{NB}%{NB}: le public resté est fidèle."),
            ("NON ATTEINT", False, "Test glossaire : objectif manqué",
             f"Jeudi 6 févr.{NB}: 3 enregistrements contre 5,7 visés. L'objectif venait de la semaine des fêtes ; le résultat égale un jeudi ordinaire (3)."),
            ("À REVOIR", False, "Fête des lanternes : effet décalé",
             f"12 févr.{NB}: 176 vues ; 13 févr.{NB}: 355, deux fois la médiane. Le pic arrive le lendemain{NB}: tester le jour et l'heure (H3, H4)."),
        ],
        "ver_foot": "Lecture sur les totaux quotidiens du dashboard Excel : un post n'y est pas isolé des autres publications du jour",
    },
    "en": {
        "src": "Engoo_Weekly Report_EN.pptx",
        "out": "Engoo_Weekly Report_Data_EN_V{n}.pptx",
        "hyp_title": "From Findings to Hypotheses",
        "hyp": [
            ("H1 · TOPIC", "Cultural-calendar posts draw more views",
             "Dec 25, Dec 31 and Jan 1: 306 to 328 views, vs a median of 172 views per day in Dec – Jan."),
            ("H2 · TOPIC", "Reference content gets saved more",
             "Saves +67% this week (1.3% of views): posts are kept as study material."),
            ("H3 · DAY", "Sunday carries the key post better",
             "Sunday median: 173 views, vs 144 to 160 on other days (Oct – Feb). Small gap, to be confirmed."),
            ("H4 · TIME", "Evening posts reach a more available audience",
             "The dashboard only holds daily totals: a hypothesis drawn from audience habits (students, workers), to be tested."),
        ],
        "hyp_foot": "Each hypothesis starts from a finding and is checked by one metric · Excel dashboard, 10/2024 – 02/2025",
        "test_title": "A/B Test Plan",
        "test_head": ("Hypothesis", "Version A vs version B", "Metric", "Decision rule"),
        "test_rows": [
            ("H1 · Topic", "Festival post vs news post, same format, same time",
             "48h views per post · Lantern, Qingming, May Day", "Adopt the cultural calendar if A beats B at every festival"),
            ("H2 · Topic", "Glossary carousel vs news post on the same subject",
             "Save rate per post · 4 weeks", "One carousel per week if A wins 3 weeks out of 4"),
            ("H3 · Day", "Same key post on Sunday vs Friday, alternating",
             "7-day views per post · 4 weeks", "Key post moved to Sunday if the gap exceeds 20%"),
            ("H4 · Time", "Same format posted at 12pm vs 8pm, alternating",
             "24h views and new followers · 2 weeks", "Keep the slot that wins on both metrics"),
        ],
        "test_foot": "One variable changes at a time · Measured per post in each note's analytics (the dashboard only holds daily totals)",
        "ver_title": "Follow-Up: Week of Feb 3 – 9",
        "ver": [
            ("CONFIRMED", True, "The predicted dip happened",
             "1,310 views (−57%) and 13 new followers vs 47: without the holiday effect, volume falls back."),
            ("MET", True, "The save rate held",
             "19 saves, i.e. 1.45% of views (target ≥ 1.3%), and a 6.1% engagement rate: the audience that stayed is loyal."),
            ("MISSED", False, "Glossary test: target missed",
             "Thursday Feb 6: 3 saves vs a 5.7 target. The target came from the holiday week; the result matches an ordinary Thursday (3)."),
            ("REVIEW", False, "Lantern effect came late",
             "Feb 12: 176 views; Feb 13: 355, twice the median. The peak came a day later: test the day and time (H3, H4)."),
        ],
        "ver_foot": "Read from the Excel dashboard's daily totals: a post is not isolated from the day's other posts",
    },
}


def set_text(tf, text):
    """Remplace le texte en gardant la mise en forme du premier segment."""
    paras = tf.paragraphs
    first = paras[0]
    for p in paras[1:]:
        p._p.getparent().remove(p._p)
    runs = first.runs
    for r in runs[1:]:
        r._r.getparent().remove(r._r)
    if runs:
        runs[0].text = text
    else:
        first.text = text


def clone_slide(prs, src):
    new = prs.slides.add_slide(src.slide_layout)
    tree = new.shapes._spTree
    for el in list(tree):
        if el.tag.endswith("}sp") or el.tag.endswith("}graphicFrame") or el.tag.endswith("}pic"):
            tree.remove(el)
    for el in src.shapes._spTree:
        if el.tag.endswith(("}sp", "}graphicFrame", "}grpSp", "}cxnSp")):
            tree.append(copy.deepcopy(el))
    return new


def shapes_by_name(slide):
    return {sh.name: sh for sh in slide.shapes}


def fill_cards(slide, title, cards, badge_src_ok=None):
    """Diapositive à quatre cartes (modèle « Les moteurs de la semaine »)."""
    s = shapes_by_name(slide)
    set_text(s["Titre 1"].text_frame, title)
    # (badge, titre, texte) par carte, dans l'ordre du modèle
    slots = [(4, 5, 6), (9, 10, 11), (14, 15, 16), (19, 20, 21)]
    for (b, t, x), card in zip(slots, cards):
        badge, head, body = card[0], card[-2], card[-1]
        set_text(s[f"Rectangle\u00a0: coins arrondis {b}"].text_frame, badge)
        set_text(s[f"ZoneTexte {t}"].text_frame, head)
        set_text(s[f"ZoneTexte {x}"].text_frame, body)
        # titres sur deux lignes : le texte commence sous le titre (écart du deck FR)
        s[f"ZoneTexte {x}"].top = s[f"ZoneTexte {t}"].top + Emu(762000)


def restyle_badge(slide, slot_idx, like_shape):
    """Donne au badge (et au liseré) d'une carte le style d'une autre carte."""
    s = shapes_by_name(slide)
    slots = [(3, 4), (8, 9), (13, 14), (18, 19)]
    bar, badge = slots[slot_idx]
    lbar, lbadge = like_shape
    if (bar, badge) == (lbar, lbadge):
        return
    for target, model in ((f"Rectangle {bar}", f"Rectangle {lbar}"),
                          (f"Rectangle\u00a0: coins arrondis {badge}", f"Rectangle\u00a0: coins arrondis {lbadge}")):
        t, m = s[target]._element, s[model]._element
        sp = copy.deepcopy(m.spPr)
        sp.replace(sp.xfrm, copy.deepcopy(t.spPr.xfrm))  # garde la position de la carte
        t.replace(t.spPr, sp)
        if target.startswith("Rectangle\u00a0: coins"):
            tr = t.txBody.p_lst[0].r_lst[0].rPr if t.txBody.p_lst[0].r_lst else None
            mr = m.txBody.p_lst[0].r_lst[0].rPr
            if tr is not None and mr is not None:
                tr.getparent().replace(tr, copy.deepcopy(mr))


def add_footer(slide, model_tb, text, top):
    el = copy.deepcopy(model_tb._element)
    slide.shapes._spTree.append(el)
    sh = slide.shapes[-1]
    sh.top = Emu(top)
    set_text(sh.text_frame, text)


def build(lang, n):
    t = TEXT[lang]
    prs = Presentation(ASSETS / t["src"])
    slides = list(prs.slides)
    drivers, recos, plan = slides[4], slides[5], slides[6]
    plan_foot = shapes_by_name(plan)["ZoneTexte 4"]

    # Des constats aux hypothèses : quatre cartes « à tester » (style « À surveiller »)
    hyp = clone_slide(prs, drivers)
    fill_cards(hyp, t["hyp_title"], t["hyp"])
    for i in range(3):
        restyle_badge(hyp, i, (18, 19))
    add_footer(hyp, plan_foot, t["hyp_foot"], 6172200)

    # Plan de test A/B : tableau du plan d'action
    test = clone_slide(prs, plan)
    s = shapes_by_name(test)
    set_text(s["Titre 1"].text_frame, t["test_title"])
    table = s["Tableau 3"].table
    for c, txt in enumerate(t["test_head"]):
        set_text(table.cell(0, c).text_frame, txt)
    for r, row in enumerate(t["test_rows"], start=1):
        for c, txt in enumerate(row):
            set_text(table.cell(r, c).text_frame, txt)
    tbl = table._tbl
    tbl.remove(tbl.tr_lst[-1])  # quatre tests, une ligne de trop
    # La 2e colonne du modèle (« Responsable ») est en gras rouge : on lui
    # donne le style des cellules de texte courant de la 4e colonne.
    for r in range(1, len(t["test_rows"]) + 1):
        src_r = table.cell(r, 3).text_frame.paragraphs[0].runs[0]._r
        dst_r = table.cell(r, 1).text_frame.paragraphs[0].runs[0]._r
        dst_r.replace(dst_r.rPr, copy.deepcopy(src_r.rPr))
    for col, w in zip(table.columns, (1400000, 3600000, 2900000, 2768000)):
        col.width = Emu(w)
    set_text(s["ZoneTexte 4"].text_frame, t["test_foot"])

    # Vérification de la semaine suivante
    ver = clone_slide(prs, drivers)
    fill_cards(ver, t["ver_title"], t["ver"])
    for i, card in enumerate(t["ver"]):
        restyle_badge(ver, i, (3, 4) if card[1] else (18, 19))
    add_footer(ver, plan_foot, t["ver_foot"], 6172200)

    # Ordre : titre, synthèse, KPI, moteurs, hypothèses, recommandations,
    # plan d'action, plan de test, vérification ; « Aperçu des contenus » retiré.
    lst = prs.slides._sldIdLst
    ids = list(lst)
    title, summary, kpi, highlights, drv, rec, pln, h, te, v = ids
    rid = highlights.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
    prs.part.drop_rel(rid)
    for el in ids:
        lst.remove(el)
    for el in (title, summary, kpi, drv, h, rec, pln, te, v):
        lst.append(el)

    out = ASSETS / t["out"].format(n=n)
    if out.exists():
        sys.exit(f"{out.name} existe déjà : rien n'est écrasé.")
    prs.save(out)
    print(out.relative_to(ROOT))


def next_version():
    nums = [int(m.group(1)) for p in ASSETS.glob("Engoo_Weekly Report_Data_*_V*.pptx")
            if (m := re.search(r"_V(\d+)\.pptx$", p.name))]
    return max(nums, default=0) + 1


if __name__ == "__main__":
    v = next_version()
    for lang in ("fr", "en"):
        build(lang, v)

"""Version data du rapport Engoo (XHS) : bilan de deux mois, en français et en anglais.

Part des decks V1 (assets/Engoo_Weekly Report_FR|EN_V1.pptx, jamais modifiés) et
écrit assets/Engoo_Weekly Report_Data_FR|EN_V{n}.pptx, numéro suivant à chaque
exécution, sans jamais écraser un fichier existant.

À partir de V2 (demande de l'utilisatrice), le deck ne raconte plus une semaine mais
la période gérée par l'utilisatrice, 12/2024 – 01/2025, sans comparaison avec la
période précédente :
  titre, synthèse, KPI, ce que disent les données, hypothèses de fin janvier,
  plan de test A/B, premiers signaux (01/02 – 13/02/2025), solutions pour garder
  l'audience après les fêtes, plan d'action ; « Aperçu des contenus » retiré.

Tous les chiffres viennent de la feuille « Données » du dashboard Excel
(données réelles jusqu'au 13/02/2025, totaux par jour). Les tests A/B sont un
protocole proposé : aucun résultat de test n'est affiché.

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
        "src": "Engoo_Weekly Report_FR_V1.pptx",
        "out": "Engoo_Weekly Report_Data_FR_V{n}.pptx",
        "cover": ("ENGOO · XIAOHONGSHU  |  BILAN DE PERFORMANCE SOCIALE",
                  "Période : 1er déc. 2024 – 31 janv. 2025",
                  "Deux mois de pilotage : des données aux hypothèses, puis aux tests",
                  "Garder l'élan entre deux fêtes"),
        "summary_title": "Synthèse",
        "summary": [
            ("13 460 vues en deux mois", f"217 vues par jour  ·  janvier +39{NB}% vs décembre"),
            ("187 nouveaux abonnés", "Pics les jours de fête : 12 le 25 déc., 11 le 1er janv."),
            (f"Taux d'engagement stable à 5,7{NB}%", "187 enregistrements  ·  65 commentaires"),
            ("Un creux après chaque fête", "2 janv. : 148 vues et 1 abonné, contre 306 et 11 la veille"),
        ],
        "summary_key": ("À retenir", "Les fêtes font les pics : l'enjeu est de garder l'audience entre deux fêtes."),
        "kpi_title": "Tableau de bord des KPI",
        "kpi": [("Vues", "13 460", f"▲ +39{NB}%"), ("Nouveaux abonnés", "187", f"▲ +13{NB}%"),
                ("Taux d'engagement", f"5,7{NB}%", "▲ +0,2 pt"), ("Enregistrements", "187", f"▲ +40{NB}%"),
                ("Commentaires", "65", f"▲ +41{NB}%"), ("Temps de visionnage", "95 h", f"▲ +39{NB}%")],
        "kpi_foot": "Vues par jour du 1er déc. 2024 au 31 janv. 2025 (en jaune : 25 déc., 31 déc., 1er janv., 28 et 29 janv.)  ·  variations des KPI : janvier vs décembre",
        "drv_title": "Ce que disent les données",
        "drv": [
            ("RÉUSSI", True, "Une croissance qui s'accélère",
             f"Janvier contre décembre{NB}: vues +39{NB}%, interactions +44{NB}%, enregistrements +40{NB}%."),
            ("RÉUSSI", True, "La qualité tient avec le volume",
             f"Taux d'engagement entre 5,1 et 6,7{NB}% chaque semaine{NB}: plus de vues, sans audience moins attentive."),
            ("RÉUSSI", True, "Les fêtes créent les pics",
             f"25 déc.{NB}: 321 vues, 31 déc.{NB}: 328, 1er janv.{NB}: 306, contre une médiane de 177 vues par jour."),
            ("À SURVEILLER", False, "L'audience repart le lendemain",
             f"1er janv.{NB}: 306 vues et 11 abonnés ; 2 janv.{NB}: 148 vues et 1 abonné. Même creux le 27 déc. (130 vues)."),
        ],
        "hyp_title": "Fin janvier : quatre hypothèses",
        "hyp": [
            ("H1 · THÈME", "Le calendrier culturel attire plus de vues",
             "Avant la semaine du Nouvel An chinois, les trois meilleurs jours sont le 31 déc., le 25 déc. et le 1er janv."),
            ("H2 · THÈME", "Les contenus de référence sont plus enregistrés",
             f"Le taux d'enregistrement reste à 1,4{NB}% en décembre comme en janvier{NB}: un format à garder fait-il mieux{NB}?"),
            ("H3 · APRÈS-FÊTE", "Une suite le lendemain garde l'audience",
             "Après chaque pic, les vues et les abonnés retombent dès le jour suivant."),
            ("H4 · HEURE", "L'heure de publication compte plus que le jour",
             "Aucun jour ne se détache (médianes de 166 à 187 vues) et l'heure n'est pas suivie dans le dashboard."),
        ],
        "hyp_foot": "Chaque hypothèse part d'un constat et se vérifie par un indicateur  ·  Dashboard Excel, 12/2024 – 01/2025",
        "test_title": "Plan de test A/B",
        "test_head": ("Hypothèse", "Version A contre version B", "Mesure", "Règle de décision"),
        "test_rows": [
            ("H1 · Thème", "Post de fête contre post d'actualité, même format, même heure",
             "Vues à 48 h par post  ·  Lanternes, Qingming, 1er mai", "Calendrier culturel adopté si A dépasse B à chaque fête"),
            ("H2 · Thème", "Carrousel glossaire contre post d'actualité sur le même sujet",
             "Taux d'enregistrement par post  ·  4 semaines", "Un carrousel par semaine si A l'emporte 3 semaines sur 4"),
            ("H3 · Après-fête", "Suite de la série le lendemain contre post habituel",
             "Vues et abonnés de J+1 à J+3  ·  à chaque fête", f"Série gardée si J+1 reste au-dessus de la médiane (177 vues)"),
            ("H4 · Heure", "Même format publié à 12 h contre 20 h, en alternance",
             "Vues et nouveaux abonnés à 24 h  ·  2 semaines", "Créneau retenu s'il gagne sur les deux indicateurs"),
        ],
        "test_foot": "Une seule variable change à la fois  ·  Mesure par post dans les statistiques de chaque note (le dashboard n'a que des totaux par jour)",
        "ver_title": "Premiers signaux : 1er – 13 févr.",
        "ver": [
            ("CONFIRMÉE", True, "Le creux d'après-fête se répète",
             f"Semaine du 3 au 9 févr.{NB}: 1 310 vues (−57{NB}%) et 13 abonnés contre 47 la semaine du Nouvel An (H3)."),
            ("ATTEINT", True, "Le taux d'enregistrement a tenu",
             f"1,45{NB}% des vues du 3 au 9 févr. (objectif ≥ 1,3{NB}%) et un engagement à 6,1{NB}%{NB}: le public resté est fidèle."),
            ("NON ATTEINT", False, "Test glossaire : objectif manqué",
             f"Jeudi 6 févr.{NB}: 3 enregistrements contre 5,7 visés. L'objectif venait de la semaine des fêtes (H2 reste à tester)."),
            ("À REVOIR", False, "Fête des lanternes : effet décalé",
             f"12 févr.{NB}: 176 vues ; 13 févr.{NB}: 355, deux fois la médiane. Le pic arrive le lendemain (H4 à tester)."),
        ],
        "ver_foot": "Lecture sur les totaux quotidiens du dashboard Excel : un post n'y est pas isolé des autres publications du jour",
        "sol_title": "Après les fêtes : garder l'audience",
        "sol": [
            ("Prolonger chaque fête par une série de trois jours",
             "Récapitulatif, vocabulaire, quiz de J+1 à J+3 (H3)  ·  suivi : vues de J+1 au-dessus de 177"),
            ("Relier les fêtes par un calendrier continu",
             "Lanternes, Saint-Valentin, Qingming, 1er mai : jamais plus de deux semaines sans temps fort"),
            ("Donner un rendez-vous fixe aux nouveaux abonnés",
             "Post épinglé « commencez ici » et une série hebdomadaire  ·  suivi : abonnés hors jours de fête"),
            ("Faire parler l'audience entre deux fêtes",
             "Question en légende et réponse à chaque commentaire sous 24 h  ·  suivi : commentaires par jour"),
        ],
        "plan_title": "Plan d'action — semaines suivantes",
        "plan_head": ("Action", "Responsable", "Échéance", "Indicateur de réussite"),
        "plan_rows": [
            ("Série « après les Lanternes » de J+1 à J+3", "Contenu", "13 – 15 févr.", "Vues de J+1 ≥ 177"),
            ("Test d'heure : 12 h contre 20 h, en alternance", "Réseaux sociaux", "2 semaines", "Vues à 24 h par post"),
            ("Carrousel glossaire contre post d'actualité", "Contenu", "Chaque jeudi", "Taux d'enregistrement par post"),
            ("Post épinglé « commencez ici »", "Réseaux sociaux", "Lun", "Visites du profil → abonnés"),
            ("Répondre à tous les commentaires sous 24 h", "Communauté", "Quotidien", f"100{NB}% de taux de réponse"),
        ],
        "plan_foot": "Un responsable par action  ·  Bilan des tests à la réunion hebdomadaire",
    },
    "en": {
        "src": "Engoo_Weekly Report_EN_V1.pptx",
        "out": "Engoo_Weekly Report_Data_EN_V{n}.pptx",
        "cover": ("ENGOO · XIAOHONGSHU  |  SOCIAL PERFORMANCE REVIEW",
                  "Period: Dec 1, 2024 – Jan 31, 2025",
                  "Two months of data-led management: from data to hypotheses, then to tests",
                  "Keeping Momentum Between Festivals"),
        "summary_title": "Executive Summary",
        "summary": [
            ("13,460 views in two months", "217 views per day  ·  January +39% vs December"),
            ("187 new followers", "Festival-day peaks: 12 on Dec 25, 11 on Jan 1"),
            ("Engagement rate steady at 5.7%", "187 saves  ·  65 comments"),
            ("A dip after every festival", "Jan 2: 148 views and 1 follower, vs 306 and 11 the day before"),
        ],
        "summary_key": ("Takeaway", "Festivals drive the peaks: the job is to keep the audience between them."),
        "kpi_title": "KPI Scorecard",
        "kpi": [("Views", "13,460", "▲ +39%"), ("New Followers", "187", "▲ +13%"),
                ("Engagement Rate", "5.7%", "▲ +0.2pp"), ("Saves", "187", "▲ +40%"),
                ("Comments", "65", "▲ +41%"), ("Watch Time", "95 hrs", "▲ +39%")],
        "kpi_foot": "Daily views, Dec 1, 2024 to Jan 31, 2025 (yellow: Dec 25, Dec 31, Jan 1, Jan 28 and 29)  ·  KPI changes: January vs December",
        "drv_title": "What the Data Says",
        "drv": [
            ("WORKED", True, "Growth is accelerating",
             "January vs December: views +39%, interactions +44%, saves +40%."),
            ("WORKED", True, "Quality held as volume grew",
             "Engagement rate between 5.1% and 6.7% every week: more views without a less attentive audience."),
            ("WORKED", True, "Festivals create the peaks",
             "Dec 25: 321 views, Dec 31: 328, Jan 1: 306, vs a median of 177 views per day."),
            ("WATCH", False, "The audience leaves the next day",
             "Jan 1: 306 views and 11 followers; Jan 2: 148 views and 1 follower. Same dip on Dec 27 (130 views)."),
        ],
        "hyp_title": "End of January: Four Hypotheses",
        "hyp": [
            ("H1 · TOPIC", "Cultural-calendar posts draw more views",
             "Before Chinese New Year week, the three best days are Dec 31, Dec 25 and Jan 1."),
            ("H2 · TOPIC", "Reference content gets saved more",
             "The save rate stays at 1.4% in both December and January: would a keep-worthy format do better?"),
            ("H3 · POST-FESTIVAL", "A next-day follow-up keeps the audience",
             "After every peak, views and followers fall back the very next day."),
            ("H4 · TIME", "Posting time matters more than the day",
             "No day stands out (medians from 166 to 187 views) and the dashboard does not track the hour."),
        ],
        "hyp_foot": "Each hypothesis starts from a finding and is checked by one metric  ·  Excel dashboard, 12/2024 – 01/2025",
        "test_title": "A/B Test Plan",
        "test_head": ("Hypothesis", "Version A vs version B", "Metric", "Decision rule"),
        "test_rows": [
            ("H1 · Topic", "Festival post vs news post, same format, same time",
             "48h views per post  ·  Lantern, Qingming, May Day", "Adopt the cultural calendar if A beats B at every festival"),
            ("H2 · Topic", "Glossary carousel vs news post on the same subject",
             "Save rate per post  ·  4 weeks", "One carousel per week if A wins 3 weeks out of 4"),
            ("H3 · Post-festival", "Next-day series follow-up vs usual post",
             "Views and followers from D+1 to D+3  ·  every festival", "Keep the series if D+1 stays above the median (177 views)"),
            ("H4 · Time", "Same format posted at 12pm vs 8pm, alternating",
             "24h views and new followers  ·  2 weeks", "Keep the slot that wins on both metrics"),
        ],
        "test_foot": "One variable changes at a time  ·  Measured per post in each note's analytics (the dashboard only holds daily totals)",
        "ver_title": "Early Signals: Feb 1 – 13",
        "ver": [
            ("CONFIRMED", True, "The post-festival dip repeats",
             "Week of Feb 3 – 9: 1,310 views (−57%) and 13 followers vs 47 in the New Year week (H3)."),
            ("MET", True, "The save rate held",
             "1.45% of views from Feb 3 to 9 (target ≥ 1.3%) and a 6.1% engagement rate: the audience that stayed is loyal."),
            ("MISSED", False, "Glossary test: target missed",
             "Thursday Feb 6: 3 saves vs a 5.7 target. The target came from the holiday week (H2 still to be tested)."),
            ("REVIEW", False, "Lantern effect came late",
             "Feb 12: 176 views; Feb 13: 355, twice the median. The peak came a day later (H4 to be tested)."),
        ],
        "ver_foot": "Read from the Excel dashboard's daily totals: a post is not isolated from the day's other posts",
        "sol_title": "After the Festivals: Keeping the Audience",
        "sol": [
            ("Extend every festival with a three-day series",
             "Recap, vocabulary, quiz from D+1 to D+3 (H3)  ·  tracked: D+1 views above 177"),
            ("Link festivals with a continuous calendar",
             "Lantern, Valentine's Day, Qingming, May Day: never more than two weeks without a highlight"),
            ("Give new followers a fixed appointment",
             "Pinned “start here” post and a weekly series  ·  tracked: followers outside festival days"),
            ("Get the audience talking between festivals",
             "Question in the caption and a reply to every comment within 24h  ·  tracked: comments per day"),
        ],
        "plan_title": "Action Plan — Following Weeks",
        "plan_head": ("Action", "Owner", "Timing", "Success Metric"),
        "plan_rows": [
            ("“After the Lanterns” series, D+1 to D+3", "Content", "Feb 13 – 15", "D+1 views ≥ 177"),
            ("Time test: 12pm vs 8pm, alternating", "Social", "2 weeks", "24h views per post"),
            ("Glossary carousel vs news post", "Content", "Every Thu", "Save rate per post"),
            ("Pinned “start here” post", "Social", "Mon", "Profile visits → followers"),
            ("Reply to all comments within 24h", "Community", "Daily", "100% reply rate"),
        ],
        "plan_foot": "One owner per action  ·  Test review at the weekly sync",
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


def set_paras(tf, texts):
    """Un texte par paragraphe, mise en forme de chacun conservée."""
    for para, text in zip(tf.paragraphs, texts):
        runs = para.runs
        for r in runs[1:]:
            r._r.getparent().remove(r._r)
        runs[0].text = text


def fill_table(table, head, rows):
    for c, txt in enumerate(head):
        set_text(table.cell(0, c).text_frame, txt)
    for r, row in enumerate(rows, start=1):
        for c, txt in enumerate(row):
            set_text(table.cell(r, c).text_frame, txt)


def daily_views():
    """Vues par jour du 01/12/2024 au 31/01/2025, feuille « Données » du dashboard."""
    import datetime as dt
    import warnings
    import openpyxl
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        wb = openpyxl.load_workbook(ASSETS / "Engoo_Excel" / "Engoo_XHS Dashboard_FR_261023.xlsx", data_only=True)
    out = []
    for r in wb["Données"].iter_rows(values_only=True):
        if isinstance(r[0], dt.datetime) and dt.datetime(2024, 12, 1) <= r[0] <= dt.datetime(2025, 1, 31):
            out.append((r[0], r[1]))
    assert len(out) == 62, len(out)
    return out


FESTIVALS = {(12, 25), (12, 31), (1, 1), (1, 28), (1, 29)}  # Noël, réveillon, Nouvel An, veille et jour du Nouvel An chinois


def daily_chart(slide, lang):
    """Remplace le graphique de la semaine par les vues jour par jour de la période."""
    from pptx.chart.data import CategoryChartData
    from pptx.oxml.ns import qn
    gf = next(sh for sh in slide.shapes if sh.has_chart)
    chart = gf.chart
    cs = chart._chartSpace
    plot_area = cs.find(".//" + qn("c:plotArea"))
    bar = plot_area.find(qn("c:barChart"))
    line = plot_area.find(qn("c:lineChart"))
    # couleur de la 2e série de barres (jaune) pour les jours de fête
    sers = bar.findall(qn("c:ser"))
    yellow = copy.deepcopy(sers[1].find(qn("c:spPr")))  # couleur du thème, recopiée telle quelle
    bar.remove(sers[1])
    # plus de courbe ni d'axes secondaires
    line_ax = {e.get("val") for e in line.findall(qn("c:axId"))}
    bar_ax = {e.get("val") for e in bar.findall(qn("c:axId"))}
    plot_area.remove(line)
    for tag in ("c:catAx", "c:valAx"):
        for ax in plot_area.findall(qn(tag)):
            if ax.find(qn("c:axId")).get("val") in line_ax - bar_ax:
                plot_area.remove(ax)
    data = daily_views()
    cd = CategoryChartData()
    # une date par semaine sous l'axe, les autres jours sans libellé
    months = {"fr": {12: "déc.", 1: "janv."}, "en": {12: "Dec", 1: "Jan"}}[lang]
    def label(d):
        return f"{d.day}{NB}{months[d.month]}" if lang == "fr" else f"{months[d.month]}{NB}{d.day}"
    cd.categories = [label(d) for d, _ in data]
    cd.add_series("Vues", [v for _, v in data])
    chart.replace_data(cd)
    plot = chart.plots[0]
    plot.has_data_labels = False
    for ser in plot_area.iter(qn("c:ser")):
        for dl in ser.findall(qn("c:dLbls")):
            ser.remove(dl)
    plot.gap_width = 40
    chart.has_legend = False
    for i, (d, _) in enumerate(data):
        if (d.month, d.day) in FESTIVALS:
            pt = plot.series[0].points[i]
            pt.format.fill.solid()
            sp = pt.format._element.spPr if hasattr(pt.format._element, "spPr") else None
            dpt = pt._ser.get_or_add_dPt_for_point(i)
            dpt.replace(dpt.spPr, copy.deepcopy(yellow))
    # une date par semaine sous l'axe : tickLblSkip, à sa place dans le schéma
    # (après lblOffset, avant tickMarkSkip / noMultiLvlLbl / extLst)
    cat = plot_area.find(qn("c:catAx"))
    for tag in ("c:tickLblSkip", "c:tickMarkSkip"):
        for old in cat.findall(qn(tag)):
            cat.remove(old)
    rpr = cat.find(".//" + qn("a:defRPr"))
    if rpr is not None:
        rpr.set("sz", "900")
    skip = cat.makeelement(qn("c:tickLblSkip"), {"val": "7"})
    after = [qn(t) for t in ("c:noMultiLvlLbl", "c:extLst")]
    nxt = next((e for e in cat if e.tag in after), None)
    if nxt is not None:
        nxt.addprevious(skip)
    else:
        cat.append(skip)


def build(lang, n):
    t = TEXT[lang]
    prs = Presentation(ASSETS / t["src"])
    slides = list(prs.slides)
    cover, summary, kpi, drivers, recos, plan = (slides[i] for i in (0, 1, 2, 4, 5, 6))
    plan_foot = shapes_by_name(plan)["ZoneTexte 4"]

    # Titre : deux formes s'appellent « Titre 1 », on les prend dans l'ordre
    titles = [sh for sh in cover.shapes if sh.name == "Titre 1"]
    label, period, line, big = t["cover"]
    set_text(titles[0].text_frame, label)
    set_paras(shapes_by_name(cover)["Sous-titre 2"].text_frame, (period, line))
    set_text(titles[1].text_frame, big)

    # Synthèse
    s = shapes_by_name(summary)
    set_text(s["Titre 1"].text_frame, t["summary_title"])
    for (head, sub), (a, b) in zip(t["summary"], ((6, 7), (10, 11), (14, 15), (18, 19))):
        set_text(s[f"ZoneTexte {a}"].text_frame, head)
        set_text(s[f"ZoneTexte {b}"].text_frame, sub)
    set_text(s["ZoneTexte 22"].text_frame, t["summary_key"][0])
    set_text(s["ZoneTexte 23"].text_frame, t["summary_key"][1])

    # Tableau de bord des KPI
    s = shapes_by_name(kpi)
    set_text(s["Titre 1"].text_frame, t["kpi_title"])
    for (name, val, delta), base in zip(t["kpi"], (3, 7, 11, 15, 19, 23)):
        set_text(s[f"ZoneTexte {base}"].text_frame, name)
        set_text(s[f"ZoneTexte {base + 1}"].text_frame, val)
        set_text(s[f"Rectangle\u00a0: coins arrondis {base + 2}"].text_frame, delta)
    set_text(s["ZoneTexte 26"].text_frame, t["kpi_foot"])
    daily_chart(kpi, lang)

    # Ce que disent les données (modèle « Les moteurs de la semaine »)
    fill_cards(drivers, t["drv_title"], t["drv"])

    # Hypothèses de fin janvier : quatre cartes « à tester » (style « À surveiller »)
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
    fill_table(table, t["test_head"], t["test_rows"])
    tbl = table._tbl
    tbl.remove(tbl.tr_lst[-1])  # quatre tests, une ligne de trop
    # La 2e colonne du modèle (« Responsable ») est en gras rouge : on lui
    # donne le style des cellules de texte courant de la 4e colonne.
    for r in range(1, len(t["test_rows"]) + 1):
        src_r = table.cell(r, 3).text_frame.paragraphs[0].runs[0]._r
        dst_r = table.cell(r, 1).text_frame.paragraphs[0].runs[0]._r
        dst_r.replace(dst_r.rPr, copy.deepcopy(src_r.rPr))
    for col, w in zip(table.columns, (1500000, 3500000, 2900000, 2768000)):
        col.width = Emu(w)
    set_text(s["ZoneTexte 4"].text_frame, t["test_foot"])

    # Premiers signaux, du 1er au 13 févr.
    ver = clone_slide(prs, drivers)
    fill_cards(ver, t["ver_title"], t["ver"])
    for i, card in enumerate(t["ver"]):
        restyle_badge(ver, i, (3, 4) if card[1] else (18, 19))
    add_footer(ver, plan_foot, t["ver_foot"], 6172200)

    # Solutions après les fêtes (modèle « Recommandations »)
    s = shapes_by_name(recos)
    set_text(s["Titre 1"].text_frame, t["sol_title"])
    for (head, sub), (a, b) in zip(t["sol"], ((5, 6), (9, 10), (13, 14), (17, 18))):
        set_text(s[f"ZoneTexte {a}"].text_frame, head)
        set_text(s[f"ZoneTexte {b}"].text_frame, sub)

    # Plan d'action
    s = shapes_by_name(plan)
    set_text(s["Titre 1"].text_frame, t["plan_title"])
    fill_table(s["Tableau 3"].table, t["plan_head"], t["plan_rows"])
    set_text(s["ZoneTexte 4"].text_frame, t["plan_foot"])

    # Ordre : titre, synthèse, KPI, données, hypothèses, plan de test, premiers
    # signaux, solutions, plan d'action ; « Aperçu des contenus » retiré.
    lst = prs.slides._sldIdLst
    ids = list(lst)
    title, summ, kp, highlights, drv, rec, pln, h, te, v = ids
    rid = highlights.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
    prs.part.drop_rel(rid)
    for el in ids:
        lst.remove(el)
    for el in (title, summ, kp, drv, h, te, v, rec, pln):
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

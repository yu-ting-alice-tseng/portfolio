"""Build the Tableau workbooks of the Beauty E-commerce SQL project (FR and EN).

Reads the chart files in assets/SQL_Beauty E-commerce/tableau/ (built from the
BigQuery results, results/bigquery_results.csv) and writes to the same folder:
  Beaute_Ecommerce_FR_V{n}.twb   French workbook
  Beauty_Ecommerce_EN_V{n}.twb   English workbook
  beauty_tableau_V{n}.csv        the six charts stacked in one file

Versioned files (request of the user): every run writes the next version
number and never overwrites an earlier file.

Tableau Desktop 2026.3 (the user's version) shows no data for a second
datasource, so the six charts share ONE file: a `chart` column tells them apart
and each sheet filters on it. Labels exist in both languages (label_fr,
label_en, series_fr, series_en).

Header, feature manifest, object model and window cards follow
tools/build-tableau-chocolate.py, itself copied from a workbook saved by
Tableau Desktop 2026.3. Validate with:
  python3 tools/build-tableau-beauty.py --xsd path/to/twb_2026.1.0.xsd

Usage: python3 tools/build-tableau-beauty.py [--xsd FILE]
"""

import csv
import re
import sys
import uuid
from pathlib import Path
from xml.sax.saxutils import escape, quoteattr

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "SQL_Beauty E-commerce" / "tableau"


# ---------------------------------------------------------------- data

def read(name):
    with open(OUT / f"{name}.csv", encoding="utf-8") as f:
        return list(csv.DictReader(f))


FR_STEP = {"1. View": "1. Vue", "2. Cart": "2. Panier", "3. Purchase": "3. Achat"}
FR_FUNNEL = {"Loose (step happens at all)": "Large (étape présente)",
             "Strict (in order, same session)": "Stricte (dans l'ordre, même session)"}
EN_FUNNEL = {"Loose (step happens at all)": "Loose (step happens at all)",
             "Strict (in order, same session)": "Strict (in order, same session)"}
OUTCOME = {  # en, fr
    "1. Bought back within 1 day": ("Within 1 day", "Sous 24 h"),
    "2. Bought back in 1 - 7 days": ("1 - 7 days", "1 à 7 jours"),
    "3. Bought back after 7 days": ("After 7 days", "Après 7 jours"),
}
QUADRANT = {"Stars": "Stars", "Leaks": "Fuites", "Hidden gems": "Pépites cachées", "Long tail": "Traîne"}
BASKET_FR = {"1 item": "1 article", "2 items": "2 articles", "3 items": "3 articles",
             "4 items": "4 articles", "5+ items": "5 articles ou plus"}
LABELLED = ("masura", "kapous", "jessnail", "grattol", "runail", "irisk", "elskin")

COLS = [  # (csv name, tableau datatype, role, type)
    ("chart", "string", "dimension", "nominal"),
    ("label_en", "string", "dimension", "nominal"),
    ("label_fr", "string", "dimension", "nominal"),
    ("series_en", "string", "dimension", "nominal"),
    ("series_fr", "string", "dimension", "nominal"),
    ("sort_key", "integer", "dimension", "ordinal"),
    ("day", "date", "dimension", "ordinal"),
    ("pct", "real", "measure", "quantitative"),
    ("amount", "real", "measure", "quantitative"),
    ("views", "integer", "measure", "quantitative"),
    ("purchases", "integer", "measure", "quantitative"),
    ("brand_tag", "string", "dimension", "nominal"),
]


def build_data(csv_name):
    rows = []

    def add(chart, label_en, label_fr=None, series_en="", series_fr=None, sort_key=0,
            day="", pct="", amount="", views="", purchases="", brand_tag=""):
        rows.append({"chart": chart, "label_en": label_en,
                     "label_fr": label_en if label_fr is None else label_fr,
                     "series_en": series_en, "series_fr": series_en if series_fr is None else series_fr,
                     "sort_key": sort_key, "day": day, "pct": pct, "amount": amount,
                     "views": views, "purchases": purchases, "brand_tag": brand_tag})

    for r in read("1_funnel"):
        step = r["step"]
        add("funnel", step[3:], FR_STEP[step][3:], EN_FUNNEL[r["funnel"]], FR_FUNNEL[r["funnel"]],
            int(step[0]), pct=r["pct_of_view"])
    for i, r in enumerate(read("3_cart_recovery")[:3], 1):
        en, fr = OUTCOME[r["outcome"]]
        add("recovery", en, fr, sort_key=i, pct=r["pct_of_recovered"], purchases=r["items"])
    for r in read("2_brand_matrix"):
        q = r["quadrant"]
        add("brand", r["brand"], r["brand"], q, QUADRANT[q], pct=r["view_to_purchase_pct"],
            amount=r["revenue"], views=r["s_view"], purchases=r["s_purchase"],
            brand_tag=r["brand"] if r["brand"] in LABELLED else "")
    for r in read("4_daily"):
        add("daily", "Daily revenue", "CA quotidien", "Daily revenue", "CA quotidien", 1,
            day=r["day"], amount=r["revenue"])
        add("daily", "7-day average", "Moyenne sur 7 jours", "7-day average", "Moyenne sur 7 jours", 2,
            day=r["day"], amount=r["revenue_ma7"])
    for r in read("5_cohort"):
        if int(r["month_n"]) >= 1:
            c = r["cohort"]
            co = f"{c[5:]}/{c[:4]}" + (" *" if c == "2019-10" else "")
            add("cohort", r["month_label"], r["month_label"], co, co, int(r["month_n"]),
                pct=r["retention_pct"], purchases=r["buyers"])
    for r in read("6_repeat_by_basket"):
        add("repeat", r["first_basket"], BASKET_FR[r["first_basket"]], sort_key=int(r["items_in_first_order"]),
            pct=r["repeat_60d_pct"], purchases=r["first_time_buyers"])

    with open(OUT / csv_name, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=[c for c, *_ in COLS])
        w.writeheader()
        w.writerows(rows)

    # Figures quoted in the dashboard text: fail loudly if they drift.
    get = lambda chart: [r for r in rows if r["chart"] == chart]  # noqa: E731
    strict = [r for r in get("funnel") if r["series_en"].startswith("Strict")]
    assert [r["pct"] for r in strict][-1] == "1.67"
    assert get("recovery")[0]["pct"] == "52.6"
    brands = get("brand")
    leaks = [r for r in brands if r["series_en"] == "Leaks"]
    share = sum(int(r["views"]) for r in leaks) / sum(int(r["views"]) for r in brands) * 100
    conv = sum(int(r["purchases"]) for r in leaks) / sum(int(r["views"]) for r in leaks) * 100
    assert (len(brands), len(leaks), round(share), round(conv, 2)) == (180, 46, 43, 1.53)
    assert [r["pct"] for r in get("repeat")] == ["11.9", "13.6", "17.7", "19.2", "25.4"]
    print(f"rows: {len(rows)} ({', '.join(f'{c} {len(get(c))}' for c in ('funnel', 'recovery', 'brand', 'daily', 'cohort', 'repeat'))})")


# ---------------------------------------------------------------- workbook text

NB = " "  # non-breaking space before % in French (CLAUDE.md § 20)

TEXT = {
    "fr": {
        "file": "Beaute_Ecommerce_FR", "locale": "fr_FR", "label": "label_fr", "series": "series_fr",
        "dash": "Tunnel et Rétention",
        "title": "Beauté E-commerce : Tunnel de Conversion, Paniers Abandonnés et Rétention",
        "subtitle": f"20,7 M d'événements · 10/2019 – 02/2020 · analysés en SQL sur BigQuery",
        "kpis": [(f"1,67{NB}%", "des visites achètent en une seule session"),
                 (f"15,6{NB}%", "des articles abandonnés sont rachetés plus tard"),
                 (f"43{NB}%", "du trafic des marques va aux marques « fuites »"),
                 (f"21,0{NB}%", "des nouveaux clients rachètent sous 60 jours")],
        "sheets": {
            "funnel": "Tunnel", "recovery": "Rachat des Paniers", "brand": "Matrice des Marques",
            "daily": "CA Quotidien", "cohort": "Cohortes", "repeat": "Premier Panier",
        },
        "titles": {
            "funnel": "Sessions Atteignant Chaque Étape (% des Sessions avec Vue)",
            "recovery": "Délai avant le Rachat des Articles Abandonnés (% des Articles Rachetés)",
            "brand": "Marques selon le Trafic (Échelle Log) et la Conversion",
            "daily": "CA Quotidien et Moyenne sur 7 Jours",
            "cohort": "Rachat selon le Mois du Premier Achat",
            "repeat": "Rachat à 60 Jours selon le Nombre d'Articles du Premier Panier",
        },
        "sections": [
            ("1", "La Plupart des Achats Prennent Plusieurs Visites",
             f"Seules 46{NB}% des commandes suivent vue, panier puis achat dans la même session. "
             f"Parmi les articles abandonnés puis rachetés, 52,6{NB}% le sont sous 24 h : "
             "une relance du panier a sa place dans ce délai."),
            ("2", f"Marques « Fuites » : 43{NB}% du Trafic, 1,53{NB}% de Conversion",
             f"180 marques réparties selon la médiane du trafic (5 146 sessions) et de la conversion (1,886{NB}%). "
             f"Si les fuites convertissaient comme les stars (2,40{NB}%), leurs achats passeraient d'environ "
             f"23 900 à 37 400 (+56{NB}%, scénario et non prévision). grattol se situe sur la médiane."),
            ("3", "Pic Fin Novembre, Creux au Nouvel An",
             f"6 des 10 meilleurs jours tombent entre le 21 et le 29/11/2019 : trafic +32{NB}%, "
             "conversion +1,6 pt. Le 31/12 est le jour le plus faible de la période."),
            ("4", "Rétention et Premier Panier",
             f"Environ 9{NB}% des nouveaux clients rachètent le mois suivant. Un premier panier de 5 articles "
             f"ou plus va avec un taux de rachat deux fois plus élevé (25,4{NB}% contre 11,9{NB}%) : "
             "une corrélation, à vérifier par un test."),
        ],
        "fields": {
            "label": "Libellé", "series": "Série", "pct": "Taux (%)", "amount": "CA",
            "views": "Sessions avec vue", "purchases": "Achats", "day": "Jour",
            "brand_tag": "Marque citée", "sort_key": "Ordre",
        },
        "note_title": "Limites des Données",
        "note": (f"Marque connue pour environ 57{NB}% des achats, catégories absentes (98{NB}% vides). "
                 "Pas de numéro de commande : une session avec achat = une commande. Heures en UTC, "
                 "devise non précisée. Cohorte 10/2019 (*) surestimée : les données commencent ce mois-là. "
                 "Corrélations uniquement, aucune expérience."),
        "source": ("Source des données : Kaggle « eCommerce Events History in Cosmetics Shop » "
                   "(10/2019 – 02/2020) · Projet personnel · Yu-Ting Tseng"),
        "pct_fmt": f'n#,##0.00"{NB}%"', "pct1_fmt": f'n#,##0.0"{NB}%"',
    },
    "en": {
        "file": "Beauty_Ecommerce_EN", "locale": "en_US", "label": "label_en", "series": "series_en",
        "dash": "Funnel and Retention",
        "title": "Beauty E-commerce: Conversion Funnel, Cart Abandonment and Retention",
        "subtitle": "20.7M events · 10/2019 – 02/2020 · analysed in SQL on BigQuery",
        "kpis": [("1.67%", "of visits buy in a single session"),
                 ("15.6%", "of abandoned items are bought back later"),
                 ("43%", "of brand traffic goes to “leak” brands"),
                 ("21.0%", "of new customers buy again within 60 days")],
        "sheets": {
            "funnel": "Funnel", "recovery": "Cart Recovery", "brand": "Brand Matrix",
            "daily": "Daily Revenue", "cohort": "Cohorts", "repeat": "First Basket",
        },
        "titles": {
            "funnel": "Sessions Reaching Each Step (% of View Sessions)",
            "recovery": "Delay Before Abandoned Items Are Bought Back (% of Items Bought Back)",
            "brand": "Brands by Traffic (Log Scale) and Conversion",
            "daily": "Daily Revenue and 7-Day Average",
            "cohort": "Repeat Purchase by First-Purchase Month",
            "repeat": "60-Day Repeat by Items in the First Order",
        },
        "sections": [
            ("1", "Most Purchases Take Several Visits",
             "Only 46% of orders follow view, cart, purchase in the same session. Of the abandoned "
             "items bought back later, 52.6% come back within 24 hours: a cart reminder belongs in that window."),
            ("2", "Leak Brands: 43% of Traffic, 1.53% Conversion",
             "180 brands split at the median traffic (5,146 sessions) and conversion (1.886%). If leaks "
             "converted like stars (2.40%), their purchases would go from about 23,900 to 37,400 "
             "(+56%, a what-if, not a forecast). grattol sits on the median."),
            ("3", "Late-November Peak, New Year Low",
             "6 of the 10 best days fall between 21 and 29/11/2019: traffic +32%, conversion +1.6 pts. "
             "31/12 is the weakest day of the period."),
            ("4", "Retention and First Basket",
             "About 9% of new customers buy again the next month. A first basket of 5+ items goes with "
             "twice the repeat rate (25.4% vs 11.9%): a correlation, to be tested."),
        ],
        "fields": {
            "label": "Label", "series": "Series", "pct": "Rate (%)", "amount": "Revenue",
            "views": "View sessions", "purchases": "Purchases", "day": "Day",
            "brand_tag": "Named brand", "sort_key": "Order",
        },
        "note_title": "Data Limits",
        "note": ("Brand known for about 57% of purchases, no categories (98% empty). No order id: one "
                 "session with a purchase = one order. Times in UTC, currency not stated. Cohort 10/2019 (*) "
                 "overstated: the data starts that month. Correlations only, no experiment."),
        "source": ("Data source: Kaggle “eCommerce Events History in Cosmetics Shop” "
                   "(10/2019 – 02/2020) · Personal project · Yu-Ting Tseng"),
        "pct_fmt": 'n#,##0.00"%"', "pct1_fmt": 'n#,##0.0"%"',
    },
}

# Palette of the data pages (CLAUDE.md § 3, § 24): celadon paper, teal accent.
PAPER, CARD, RULE = "#E4ECE7", "#F7FAF8", "#C3CFC9"
INK, MUTED = "#16211F", "#44524F"
ACCENT, ACCENT_SOFT = "#0D9488", "#5FB8AE"
TITLE_FONT, FONT = "Georgia", "Segoe UI"

MAIN = "federated.beauty_main"
DS_CAPTION = "Beauty E-commerce"


def a(v):
    return quoteattr(str(v))


def _count():
    i = 0
    while True:
        i += 1
        yield i


_counter = _count()


def sid():
    return "{" + str(uuid.uuid5(uuid.NAMESPACE_URL, "beauty-" + str(next(_counter)))).upper() + "}"


# ---------------------------------------------------------------- datasource

def column_xml(name, caption, datatype, role, typ, fmt=None, formula=None, hidden=False):
    fmt_attr = f" default-format={a(fmt)}" if fmt else ""
    attrs = (f"caption={a(caption)} datatype={a(datatype)}{fmt_attr} name={a('[' + name + ']')} "
             f"role={a(role)} type={a(typ)}")
    if hidden:
        attrs += " hidden='true'"
    if formula is None:
        return f"      <column {attrs} />\n"
    return (f"      <column {attrs}>\n"
            f"        <calculation class='tableau' formula={a(formula)} />\n"
            f"      </column>\n")


REMOTE_TYPE = {"integer": 20, "real": 5, "string": 129, "date": 133}


def metadata_xml(csv_name, obj):
    """Metadata records written by Tableau 2026.3 for a CSV read as en_US."""
    parent = "[" + csv_name + "]"
    out = ["        <metadata-records>\n",
           "          <metadata-record class='capability'>\n",
           "            <remote-name />\n",
           "            <remote-type>0</remote-type>\n",
           f"            <parent-name>{escape(parent)}</parent-name>\n",
           "            <remote-alias />\n",
           "            <aggregation>Count</aggregation>\n",
           "            <contains-null>true</contains-null>\n",
           "            <attributes>\n"]
    for k, v in (("character-set", "UTF-8"), ("collation", "en_US"), ("currency", "$"),
                 ("decimal-char", "."), ("header-row", "true"), ("locale", "en_US"),
                 ("single-char", ""), ("thousands-char", ",")):
        out.append(f"              <attribute datatype='string' name={a(k)}>{escape(chr(34) + v + chr(34))}</attribute>\n")
    out += ["            </attributes>\n", "          </metadata-record>\n"]
    for i, (c, dt, _, _) in enumerate(COLS):
        agg = {"string": "Count", "date": "Year"}.get(dt, "Sum")
        out += ["          <metadata-record class='column'>\n",
                f"            <remote-name>{escape(c)}</remote-name>\n",
                f"            <remote-type>{REMOTE_TYPE[dt]}</remote-type>\n",
                f"            <local-name>{escape('[' + c + ']')}</local-name>\n",
                f"            <parent-name>{escape(parent)}</parent-name>\n",
                f"            <remote-alias>{escape(c)}</remote-alias>\n",
                f"            <ordinal>{i}</ordinal>\n",
                f"            <local-type>{dt}</local-type>\n",
                f"            <aggregation>{agg}</aggregation>\n"]
        if dt == "string":
            out += ["            <scale>1</scale>\n", "            <width>1073741823</width>\n"]
        out.append("            <contains-null>true</contains-null>\n")
        if dt == "string":
            out.append("            <collation flag='0' name='LEN_RUS' />\n")
        out += [f"            <object-id>{escape('[' + obj + ']')}</object-id>\n",
                "          </metadata-record>\n"]
    out.append("        </metadata-records>\n")
    return "".join(out)


def datasources_xml(lang):
    T = TEXT[lang]
    F = T["fields"]
    lab, ser = T["label"], T["series"]
    conn = MAIN.replace("federated.", "textscan.")
    table = DATA_CSV.replace(".csv", "#csv")
    obj = DATA_CSV + "_" + uuid.uuid5(uuid.NAMESPACE_URL, "beauty-object-" + DATA_CSV).hex.upper()
    relation = (f"        <relation connection={a(conn)} name={a(DATA_CSV)} table={a('[' + table + ']')} type='table'>\n"
                "          <columns character-set='UTF-8' header='yes' locale='en_US' separator=','>\n"
                + "".join(f"            <column datatype={a(dt)} name={a(c)} ordinal='{i}' />\n"
                          for i, (c, dt, _, _) in enumerate(COLS))
                + "          </columns>\n"
                "        </relation>\n")
    caps = {  # visible columns; the others are hidden
        "chart": ("Chart", None, False),
        lab: (F["label"], None, False),
        ser: (F["series"], None, False),
        "sort_key": (F["sort_key"], None, False),
        "day": (F["day"], None, False),
        "pct": (F["pct"], T["pct_fmt"], False),
        "amount": (F["amount"], "n#,##0", False),
        "views": (F["views"], "n#,##0", False),
        "purchases": (F["purchases"], "n#,##0", False),
        "brand_tag": (F["brand_tag"], None, False),
    }
    out = [f"    <datasource caption={a(DS_CAPTION)} inline='true' name={a(MAIN)} version='18.1'>\n",
           "      <connection class='federated'>\n",
           "        <named-connections>\n",
           f"          <named-connection caption={a(DATA_CSV.replace('.csv', ''))} name={a(conn)}>\n",
           f"            <connection class='textscan' directory='.' filename={a(DATA_CSV)} password='' server='' />\n",
           "          </named-connection>\n",
           "        </named-connections>\n",
           relation,
           metadata_xml(DATA_CSV, obj),
           "      </connection>\n",
           "      <aliases enabled='yes' />\n",
           f"      <column caption={a(DATA_CSV)} datatype='table' "
           f"name={a('[__tableau_internal_object_id__].[' + obj + ']')} role='measure' type='quantitative' />\n"]
    for c, dt, role, typ in COLS:
        cap, fmt, hidden = caps.get(c, (c, None, True))
        out.append(column_xml(c, cap, dt, role, typ, fmt, hidden=hidden))
    deep = relation.replace("\n        ", "\n                ").replace("        <relation", "              <relation", 1)
    out += ["      <object-graph>\n",
            "        <objects>\n",
            f"          <object caption={a(DATA_CSV)} id={a(obj)}>\n",
            "            <properties context=''>\n",
            deep,
            "            </properties>\n",
            "          </object>\n",
            "        </objects>\n",
            "      </object-graph>\n",
            "    </datasource>\n"]
    return "  <datasources>\n" + "".join(out) + "  </datasources>\n"


# ---------------------------------------------------------------- worksheets

PREFIX = {"None": "none", "Sum": "sum", "Min": "min", "Day-Trunc": "tdy"}
SUFFIX = {"nominal": "nk", "ordinal": "ok", "quantitative": "qk"}


def inst(field, deriv="None", typ="nominal"):
    """Column-instance name: [none:chart:nk], [sum:pct:qk], [tdy:day:qk]."""
    return f"[{PREFIX[deriv]}:{field}:{SUFFIX[typ]}]"


def q(i):
    return f"[{MAIN}].{i}"


DTYPE = {c: (dt, role, typ) for c, dt, role, typ in COLS}


def worksheet_xml(name, title, chart, uses, rows="", cols="", mark="Bar", encodings="",
                  sort="", pane_style="", table_style=""):
    """uses: list of (field, derivation, instance type). The sheet keeps only its chart's rows."""
    uses = [("chart", "None", "nominal")] + uses
    dep_cols, dep_inst, seen, seen_inst = [], [], set(), set()
    for f, deriv, ityp in uses:
        dt, role, typ = DTYPE[f]
        if f not in seen:
            seen.add(f)
            dep_cols.append(f"            <column datatype={a(dt)} name={a('[' + f + ']')} role={a(role)} type={a(typ)} />\n")
        i = inst(f, deriv, ityp)
        if i not in seen_inst:
            seen_inst.add(i)
            dep_inst.append(f"            <column-instance column={a('[' + f + ']')} derivation={a(deriv)} "
                            f"name={a(i)} pivot='key' type={a(ityp)} />\n")
    ch = inst("chart")
    flt = (f"          <filter class='categorical' column={a(q(ch))}>\n"
           f"            <groupfilter function='member' level={a(ch)} member={a(chr(34) + chart + chr(34))} "
           "user:ui-domain='database' user:ui-enumeration='inclusive' user:ui-marker='enumerate' />\n"
           "          </filter>\n")
    title_xml = ("      <layout-options>\n"
                 "        <title>\n"
                 "          <formatted-text>\n"
                 f"            <run fontcolor={a(INK)} fontname={a(TITLE_FONT)} fontsize='13'>{escape(title)}</run>\n"
                 "          </formatted-text>\n"
                 "        </title>\n"
                 "      </layout-options>\n")
    return (f"    <worksheet name={a(name)}>\n"
            + title_xml +
            "      <table>\n"
            "        <view>\n"
            "          <datasources>\n"
            f"            <datasource caption={a(DS_CAPTION)} name={a(MAIN)} />\n"
            "          </datasources>\n"
            f"          <datasource-dependencies datasource={a(MAIN)}>\n"
            + "".join(dep_cols) + "".join(dep_inst) +
            "          </datasource-dependencies>\n"
            + flt + sort +
            "          <slices>\n"
            f"            <column>{escape(q(ch))}</column>\n"
            "          </slices>\n"
            "          <aggregation value='true' />\n"
            "        </view>\n"
            f"        <style>\n{table_style}        </style>\n"
            "        <panes>\n"
            "          <pane selection-relaxation-option='selection-relaxation-allow'>\n"
            "            <view>\n"
            "              <breakdown value='auto' />\n"
            "            </view>\n"
            f"            <mark class={a(mark)} />\n"
            + (f"            <encodings>\n{encodings}            </encodings>\n" if encodings else "")
            + (f"            <style>\n{pane_style}            </style>\n" if pane_style else "")
            + "          </pane>\n"
            "        </panes>\n"
            f"        <rows>{escape(rows)}</rows>\n"
            f"        <cols>{escape(cols)}</cols>\n"
            "      </table>\n"
            f"      <simple-id uuid={a(sid())} />\n"
            "    </worksheet>\n")


def mark_style(color=None, labels=True, size=None):
    out = "              <style-rule element='mark'>\n"
    if color:
        out += f"                <format attr='mark-color' value={a(color)} />\n"
    if labels:
        out += "                <format attr='mark-labels-show' value='true' />\n"
    if size:
        out += f"                <format attr='size' value='{size}' />\n"
    return out + "              </style-rule>\n"


def table_style(axis_extra=""):
    return ("          <style-rule element='axis'>\n"
            + axis_extra +
            f"            <format attr='color' value={a(MUTED)} />\n"
            f"            <format attr='font-family' value={a(FONT)} />\n"
            "            <format attr='font-size' value='10' />\n"
            "          </style-rule>\n"
            "          <style-rule element='label'>\n"
            f"            <format attr='color' value={a(INK)} />\n"
            f"            <format attr='font-family' value={a(FONT)} />\n"
            "            <format attr='font-size' value='10' />\n"
            "          </style-rule>\n"
            "          <style-rule element='gridline'>\n"
            "            <format attr='line-visibility' value='off' />\n"
            "          </style-rule>\n"
            "          <style-rule element='table'>\n"
            f"            <format attr='background-color' value={a(CARD)} />\n"
            "          </style-rule>\n")


def sort_by_key(field):
    # Tableau 2026.3 reads <sort class='computed'> (see build-tableau-chocolate.py).
    return (f"          <sort class='computed' column={a(q(inst(field)))} direction='ASC' "
            f"using={a(q(inst('sort_key', 'Min', 'quantitative')))} />\n")


def worksheets_xml(lang):
    T = TEXT[lang]
    S, TT = T["sheets"], T["titles"]
    lab, ser = T["label"], T["series"]
    pct = q(inst("pct", "Sum", "quantitative"))
    key = ("sort_key", "Min", "quantitative")
    text_pct = f"              <text column={a(pct)} />\n"
    out = ["  <worksheets>\n"]

    # 1 Funnel: loose and strict side by side, one panel each.
    out.append(worksheet_xml(
        S["funnel"], TT["funnel"], "funnel",
        [(lab, "None", "nominal"), (ser, "None", "nominal"), ("pct", "Sum", "quantitative"), key],
        rows=q(inst(lab)), cols=f"({q(inst(ser))} / {pct})",
        encodings=text_pct, sort=sort_by_key(lab), pane_style=mark_style(ACCENT),
        table_style=table_style()))

    # 2 Cart recovery: delay before abandoned items are bought back.
    out.append(worksheet_xml(
        S["recovery"], TT["recovery"], "recovery",
        [(lab, "None", "nominal"), ("pct", "Sum", "quantitative"), key],
        rows=q(inst(lab)), cols=pct, encodings=text_pct, sort=sort_by_key(lab),
        pane_style=mark_style(ACCENT), table_style=table_style()))

    # 3 Brand matrix: one circle per brand, colour by quadrant (Tableau's own
    # colours: it ignores a palette written in the file), log-scale traffic,
    # names of the seven brands quoted in the study.
    views = q(inst("views", "Sum", "quantitative"))
    enc = (f"              <color column={a(q(inst(ser)))} />\n"
           f"              <lod column={a(q(inst(lab)))} />\n"
           f"              <text column={a(q(inst('brand_tag')))} />\n")
    # Fixed range: every brand has 1,000+ view sessions and the largest
    # (runail) 371,260. Left automatic, Tableau 2026.3 started the log axis at
    # 1 and pushed the brands above 100,000 out of view (V1).
    log_axis = (f"            <encoding attr='space' class='0' field={a(views)} field-type='quantitative' "
                "max='500000' min='1000' range-type='fixed' scale='log' type='space' />\n")
    out.append(worksheet_xml(
        S["brand"], TT["brand"], "brand",
        [(lab, "None", "nominal"), (ser, "None", "nominal"), ("brand_tag", "None", "nominal"),
         ("views", "Sum", "quantitative"), ("pct", "Sum", "quantitative")],
        rows=pct, cols=views, mark="Circle", encodings=enc,
        pane_style=mark_style(labels=True), table_style=table_style(log_axis)))

    # 4 Daily revenue and its 7-day average: two lines, one axis.
    day = q(inst("day", "Day-Trunc", "quantitative"))
    amount = q(inst("amount", "Sum", "quantitative"))
    out.append(worksheet_xml(
        S["daily"], TT["daily"], "daily",
        [(ser, "None", "nominal"), ("day", "Day-Trunc", "quantitative"), ("amount", "Sum", "quantitative")],
        rows=amount, cols=day, mark="Line", encodings=f"              <color column={a(q(inst(ser)))} />\n",
        pane_style=mark_style(labels=False), table_style=table_style()))

    # 5 Cohorts: heat map of the repeat rate, months after the first purchase.
    enc = (f"              <color column={a(pct)} />\n"
           f"              <text column={a(pct)} />\n")
    out.append(worksheet_xml(
        S["cohort"], TT["cohort"], "cohort",
        [(lab, "None", "nominal"), (ser, "None", "nominal"), ("pct", "Sum", "quantitative"), key],
        rows=q(inst(ser)), cols=q(inst(lab)), mark="Square", encodings=enc,
        sort=sort_by_key(lab), pane_style=mark_style(labels=True), table_style=table_style()))

    # 6 First basket: 60-day repeat rate by items in the first order.
    out.append(worksheet_xml(
        S["repeat"], TT["repeat"], "repeat",
        [(lab, "None", "nominal"), ("pct", "Sum", "quantitative"), key],
        rows=pct, cols=q(inst(lab)), encodings=text_pct, sort=sort_by_key(lab),
        pane_style=mark_style(ACCENT), table_style=table_style()))

    out.append("  </worksheets>\n")
    return "".join(out)


# ---------------------------------------------------------------- dashboard

W, H = 1200, 2120


def px(v, total):
    return int(round(v / total * 100000))


class Zones:
    def __init__(self):
        self.n = 2
        self.items = []

    def add(self, x, y, w, h, body):
        self.n += 1
        attrs = f"h='{px(h, H)}' id='{self.n}' w='{px(w, W)}' x='{px(x, W)}' y='{px(y, H)}'"
        self.items.append(body.format(attrs=attrs))


def zone_style(bg=CARD, border=True, margin=6, padding=8):
    b = (f"              <format attr='border-color' value={a(RULE)} />\n"
         "              <format attr='border-style' value='solid' />\n"
         "              <format attr='border-width' value='1' />\n") if border else ""
    return ("            <zone-style>\n"
            + b +
            f"              <format attr='margin' value='{margin}' />\n"
            f"              <format attr='padding' value='{padding}' />\n"
            f"              <format attr='background-color' value={a(bg)} />\n"
            "            </zone-style>\n")


def dashboard_xml(lang):
    T = TEXT[lang]
    S = T["sheets"]
    z = Zones()
    G = 16

    def text(x, y, w, h, runs, bg=PAPER, border=False, margin=2, padding=4):
        z.add(x, y, w, h, "          <zone {attrs} type-v2='text'>\n"
              "            <formatted-text>\n" + runs.replace("{", "{{").replace("}", "}}") +
              "            </formatted-text>\n" + zone_style(bg, border, margin, padding) +
              "          </zone>\n")

    def sheet(x, y, w, h, name):
        z.add(x, y, w, h, f"          <zone {{attrs}} name={a(name).replace('{', '{{').replace('}', '}}')} show-title='true'>\n"
              + zone_style() + "          </zone>\n")

    def run(txt, size, color=INK, bold=False, font=FONT):
        b = " bold='true'" if bold else ""
        return (f"              <run{b} fontcolor={a(color)} fontname={a(font)} "
                f"fontsize='{size}'>{escape(txt)}</run>\n")

    br = "              <run>Æ&#10;</run>\n"  # Tableau's line break inside formatted text

    inner = W - 2 * G
    half = inner / 2
    text(G, 8, inner, 96, run(T["title"], 22, INK, font=TITLE_FONT) + br + run(T["subtitle"], 11, MUTED))

    y = 108
    kw = inner / 4
    for i, (fig, lbl) in enumerate(T["kpis"]):
        text(G + i * kw, y, kw, 120, run(fig, 30, ACCENT, font=TITLE_FONT) + br + run(lbl, 11, MUTED),
             bg=CARD, border=True, margin=6, padding=12)
    y += 128

    def section(y, n):
        num, name, detail = T["sections"][n]
        text(G, y, inner, 104, run(num, 18, ACCENT, font=TITLE_FONT)
             + run("   " + name, 17, INK, font=TITLE_FONT) + br + run(detail, 11, MUTED))
        return y + 108

    y = section(y, 0)
    sheet(G, y, half, 280, S["funnel"])
    sheet(G + half, y, half, 280, S["recovery"])
    y += 288
    y = section(y, 1)
    sheet(G, y, inner, 420, S["brand"])
    y += 428
    y = section(y, 2)
    sheet(G, y, inner, 300, S["daily"])
    y += 308
    y = section(y, 3)
    sheet(G, y, half, 280, S["cohort"])
    sheet(G + half, y, half, 280, S["repeat"])
    y += 288
    text(G, y, inner, 92, run(T["note_title"], 13, INK, font=TITLE_FONT) + br + run(T["note"], 10, MUTED),
         bg=CARD, border=True, margin=6, padding=10)
    y += 96
    assert y + 30 <= H, y
    text(G, y, inner, H - y - 8, run(T["source"], 9, MUTED))

    return ("  <dashboards>\n"
            f"    <dashboard name={a(T['dash'])}>\n"
            "      <style>\n"
            "        <style-rule element='table'>\n"
            f"          <format attr='background-color' value={a(PAPER)} />\n"
            "        </style-rule>\n"
            "      </style>\n"
            f"      <size maxheight='{H}' maxwidth='{W}' minheight='{H}' minwidth='{W}' sizing-mode='fixed' />\n"
            "      <zones>\n"
            "        <zone h='100000' id='2' type-v2='layout-basic' w='100000' x='0' y='0'>\n"
            + "".join(z.items) +
            "        </zone>\n"
            "      </zones>\n"
            f"      <simple-id uuid={a(sid())} />\n"
            "    </dashboard>\n"
            "  </dashboards>\n")


CARDS = ("      <cards>\n"
         "        <edge name='left'>\n"
         "          <strip size='160'>\n"
         "            <card type='pages' />\n"
         "            <card type='filters' />\n"
         "            <card type='marks' />\n"
         "          </strip>\n"
         "        </edge>\n"
         "        <edge name='top'>\n"
         "          <strip size='2147483647'>\n"
         "            <card type='columns' />\n"
         "          </strip>\n"
         "          <strip size='2147483647'>\n"
         "            <card type='rows' />\n"
         "          </strip>\n"
         "          <strip size='30'>\n"
         "            <card type='title' />\n"
         "          </strip>\n"
         "        </edge>\n"
         "      </cards>\n")


def windows_xml(lang):
    T = TEXT[lang]
    out = ["  <windows>\n",
           f"    <window class='dashboard' maximized='true' name={a(T['dash'])}>\n",
           # Tableau 2026.3 stops with an internal error when a sheet shown in
           # the dashboard has no viewpoint in the dashboard window.
           "      <viewpoints>\n",
           *(f"        <viewpoint name={a(name)}>\n"
             "          <zoom type='entire-view' />\n"
             "        </viewpoint>\n" for name in T["sheets"].values()),
           "      </viewpoints>\n",
           "      <active id='-1' />\n",
           f"      <simple-id uuid={a(sid())} />\n",
           "    </window>\n"]
    for name in T["sheets"].values():
        out += [f"    <window class='worksheet' hidden='true' name={a(name)}>\n",
                CARDS,
                f"      <simple-id uuid={a(sid())} />\n",
                "    </window>\n"]
    out.append("  </windows>\n")
    return "".join(out)


def workbook_xml(lang):
    global _counter
    _counter = _count()
    T = TEXT[lang]
    return ("<?xml version='1.0' encoding='utf-8' ?>\n"
            f"<workbook locale={a(T['locale'])} original-version='18.1' "
            "source-build='2026.3.0 (20263.26.1022.1645)' source-platform='win' version='18.1' "
            "xmlns:user='http://www.tableausoftware.com/xml/user'>\n"
            "  <document-format-change-manifest>\n"
            "    <AnimationOnByDefault />\n"
            "    <MarkAnimation />\n"
            "    <ObjectModelEncapsulateLegacy />\n"
            "    <ObjectModelTableType />\n"
            "    <SchemaViewerObjectModel />\n"
            "    <SheetIdentifierTracking />\n"
            "    <WindowsPersistSimpleIdentifiers />\n"
            "  </document-format-change-manifest>\n"
            + datasources_xml(lang)
            + worksheets_xml(lang)
            + dashboard_xml(lang)
            + windows_xml(lang)
            + "</workbook>\n")


DATA_CSV = "beauty_tableau.csv"


def version_of(path):
    m = re.search(r"_V(\d+)\.\w+$", path.name)
    return int(m.group(1)) if m else 0


def main():
    global DATA_CSV
    xsd = sys.argv[sys.argv.index("--xsd") + 1] if "--xsd" in sys.argv else None
    existing = list(OUT.glob("Beau*_V*.twb")) + list(OUT.glob("beauty_tableau*.csv"))
    n = max((version_of(f) for f in existing), default=0) + 1
    DATA_CSV = f"beauty_tableau_V{n}.csv"
    if (OUT / DATA_CSV).exists():
        sys.exit(f"{DATA_CSV} already exists: versions are never overwritten")
    build_data(DATA_CSV)
    print("version", n, "· data", DATA_CSV)
    ok = True
    for lang in ("fr", "en"):
        path = OUT / f"{TEXT[lang]['file']}_V{n}.twb"
        if path.exists():
            sys.exit(f"{path.name} already exists: versions are never overwritten")
        path.write_text(workbook_xml(lang), encoding="utf-8")
        print("wrote", path.relative_to(ROOT))
        if xsd:
            from lxml import etree
            schema = etree.XMLSchema(etree.parse(xsd))
            doc = etree.parse(str(path))
            if not schema.validate(doc):
                errors = [e for e in schema.error_log
                          if "explain-data" not in e.message and "Element 'sort'" not in e.message]
                ok = ok and not errors
                for e in errors:
                    print(f"  line {e.line}: {e.message}")
            print("  schema:", "valid (except explain-data and sort, on purpose)" if ok else "ERRORS")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()

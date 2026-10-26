"""Build the Tableau workbooks of the Chocolate FMCG project (FR and EN).

Reads the raw Kaggle files in assets/SQL_Chocolate Sales/ and writes to
assets/Tableau_Chocolate/:
  chocolate_tableau.csv   sales aggregated by month x channel x country x product
  chocolate_pareto.csv    the 200 SKUs ranked by revenue, with cumulative share
  Chocolat_FMCG_FR.twb    French workbook
  Chocolate_FMCG_EN.twb   English workbook

Cleaning: the 9,764 sales rows whose product_id is not in products.csv
(P0000 and P0201) are dropped, leaving the 990,236 transactions of the study.

The .twb files copy the header, feature manifest, object model and window
cards of a workbook saved by Tableau Desktop 2026.3 (the user's version), and
are checked against the official Tableau 2026.1 schema
(github.com/tableau/tableau-document-schemas), minus <explain-data>, which that
schema requires but older Tableau versions do not know, and <sort class='computed'>,
which Tableau 2026.3 expects instead of the schema's <computed-sort>. Validate with:
  python3 tools/build-tableau-chocolate.py --xsd path/to/twb_2026.1.0.xsd

Usage: python3 tools/build-tableau-chocolate.py [--xsd FILE]
"""

import sys
import uuid
from pathlib import Path
from xml.sax.saxutils import escape, quoteattr

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "SQL_Chocolate Sales"
OUT = ROOT / "assets" / "Tableau_Chocolate"

COUNTRY = {
    "Canada": ("Canada", "Canada"),
    "UK": ("Royaume-Uni", "UK"),
    "USA": ("USA", "USA"),
    "France": ("France", "France"),
    "Germany": ("Allemagne", "Germany"),
    "Australia": ("Australie", "Australia"),
}
MONTH_FR = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
            "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."]
MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


# ---------------------------------------------------------------- data

def build_data():
    sales = pd.read_csv(SRC / "sales.csv", sep=";")
    products = pd.read_csv(SRC / "products.csv", sep=";")
    stores = pd.read_csv(SRC / "stores.csv")

    df = sales.merge(products, on="product_id").merge(stores, on="store_id")
    assert len(df) == 990_236, len(df)
    date = pd.to_datetime(df["order_date"], format="%d/%m/%Y")
    df["year"] = date.dt.year
    df["month"] = date.dt.month
    df["country_fr"] = df["country"].map(lambda c: COUNTRY[c][0])
    df["country_en"] = df["country"].map(lambda c: COUNTRY[c][1])

    keys = ["year", "month", "store_type", "country_fr", "country_en",
            "product_id", "product_name", "brand", "category"]
    agg = (df.groupby(keys, as_index=False)
             .agg(transactions=("order_id", "size"), units=("quantity", "sum"),
                  revenue=("revenue", "sum"), cost=("cost", "sum"),
                  profit=("profit", "sum"))
             .rename(columns={"store_type": "channel"}))
    agg["month_fr"] = agg["month"].map(lambda m: f"{m:02d} {MONTH_FR[m - 1]}")
    agg["month_en"] = agg["month"].map(lambda m: f"{m:02d} {MONTH_EN[m - 1]}")
    for col in ("revenue", "cost", "profit"):
        agg[col] = agg[col].round(2)
    cols = ["year", "month", "month_fr", "month_en", "channel", "country_fr",
            "country_en", "product_id", "product_name", "brand", "category",
            "transactions", "units", "revenue", "cost", "profit"]
    agg[cols].to_csv(OUT / "chocolate_tableau.csv", index=False, encoding="utf-8")

    sku = (df.groupby(["product_id", "product_name"], as_index=False)["revenue"].sum()
             .sort_values("revenue", ascending=False, kind="stable"))
    total = sku["revenue"].sum()
    sku["rank"] = range(1, len(sku) + 1)
    sku["share"] = (sku["revenue"] / total).round(6)
    sku["cum_share"] = (sku["revenue"].cumsum() / total).round(6)
    sku["revenue"] = sku["revenue"].round(2)
    sku[["rank", "product_id", "product_name", "revenue", "share", "cum_share"]].to_csv(
        OUT / "chocolate_pareto.csv", index=False, encoding="utf-8")

    # Figures shown on portfolio-data.html: fail loudly if they drift.
    R = df["revenue"].sum()
    assert round(R / 1e6, 1) == 25.2
    assert round(df["profit"].sum() / R * 100) == 40
    assert int((sku["cum_share"] < 0.8).sum()) + 1 == 160
    share = df.groupby("store_type")["revenue"].sum() / R * 100
    assert [round(share[c], 1) for c in ("Airport", "Mall", "Online", "Retail")] == [29.9, 26.0, 25.1, 19.1]
    month = df.groupby("month")["revenue"].sum()
    index = month / month.mean() * 100
    print(f"rows: {len(agg)} aggregated, {len(df)} transactions, revenue {R:,.2f}")
    print("seasonality index:", {m: round(v, 1) for m, v in index.items()})


# ---------------------------------------------------------------- workbook text

TEXT = {
    "fr": {
        "file": "Chocolat_FMCG_FR.twb", "locale": "fr_FR",
        "country": "country_fr", "month": "month_fr",
        "dash": "Diagnostic Commercial",
        "title": "Chocolat FMCG — Diagnostic Commercial 2023 – 2024",
        "subtitle": "990 236 transactions · 4 canaux · 6 pays · 200 SKUs · 6 marques",
        "kpi": {
            "ca": "CA (M$)", "trans": "Transactions", "marge": "Marge brute",
            "aov": "Panier moyen ($)",
        },
        "sheets": {
            "ca": "KPI · CA", "trans": "KPI · Transactions", "marge": "KPI · Marge",
            "aov": "KPI · Panier Moyen",
            "canal": "Part du CA par Canal",
            "ident": "Canaux Identiques",
            "saison": "Saisonnalité",
            "pareto": "Courbe de Pareto",
            "pays": "Part du CA par Pays",
            "cat": "Part du CA par Catégorie",
        },
        "titles": {
            "canal": "Part du CA par canal",
            "ident": "Panier moyen, unités par transaction et marge : identiques sur les 4 canaux",
            "saison": "Indice de saisonnalité (100 = mois moyen) : février et décembre sans pic",
            "pareto": "Courbe de Pareto : 160 SKUs sur 200 pour atteindre 80 % du CA",
            "pays": "Part du CA par pays",
            "cat": "Part du CA par catégorie",
        },
        "fields": {
            "channel": "Canal", "country": "Pays", "category": "Catégorie",
            "brand": "Marque", "product_name": "Produit", "month": "Mois",
            "year": "Année", "revenue": "CA ($)", "transactions": "Transactions",
            "units": "Unités", "profit": "Marge ($)", "cost": "Coût ($)",
            "share": "Part du CA", "upt": "Unités par transaction",
            "index": "Indice de saisonnalité", "gap": "Écart à la moyenne (pts)",
            "sign": "Position", "above": "Au-dessus de la moyenne",
            "below": "En dessous de la moyenne",
            "rank": "Rang du SKU", "cum": "Part cumulée du CA",
        },
        "note": ("Contrôle qualité : indicateurs identiques sur les 4 canaux, marges toutes à 40 %, "
                 "aucun pic à Noël ni à la Saint-Valentin. Données vraisemblablement simulées : "
                 "les constats décrivent le jeu de données, les recommandations restent des hypothèses. "
                 "Les filtres s'appliquent à tous les graphiques sauf la courbe de Pareto (ensemble des données)."),
        "source": ("Source des données : Kaggle « Chocolate Sales Dataset 2023 - 2024 » (Nguyen, s.d.) · "
                   "Projet personnel · Yu-Ting Tseng"),
    },
    "en": {
        "file": "Chocolate_FMCG_EN.twb", "locale": "en_US",
        "country": "country_en", "month": "month_en",
        "dash": "Commercial Diagnostic",
        "title": "Chocolate FMCG — Commercial Intelligence Diagnostic 2023 – 2024",
        "subtitle": "990,236 transactions · 4 channels · 6 countries · 200 SKUs · 6 brands",
        "kpi": {
            "ca": "Revenue ($M)", "trans": "Transactions", "marge": "Gross margin",
            "aov": "Average order value ($)",
        },
        "sheets": {
            "ca": "KPI · Revenue", "trans": "KPI · Transactions", "marge": "KPI · Margin",
            "aov": "KPI · AOV",
            "canal": "Revenue Share by Channel",
            "ident": "Identical Channels",
            "saison": "Seasonality",
            "pareto": "Pareto Curve",
            "pays": "Revenue Share by Country",
            "cat": "Revenue Share by Category",
        },
        "titles": {
            "canal": "Revenue share by channel",
            "ident": "Average order value, units per transaction and margin: identical across all 4 channels",
            "saison": "Seasonality index (100 = average month): no peak in February or December",
            "pareto": "Pareto curve: 160 of 200 SKUs to reach 80% of revenue",
            "pays": "Revenue share by country",
            "cat": "Revenue share by category",
        },
        "fields": {
            "channel": "Channel", "country": "Country", "category": "Category",
            "brand": "Brand", "product_name": "Product", "month": "Month",
            "year": "Year", "revenue": "Revenue ($)", "transactions": "Transactions",
            "units": "Units", "profit": "Margin ($)", "cost": "Cost ($)",
            "share": "Revenue share", "upt": "Units per transaction",
            "index": "Seasonality index", "gap": "Gap to average (pts)",
            "sign": "Position", "above": "Above average",
            "below": "Below average",
            "rank": "SKU rank", "cum": "Cumulative revenue share",
        },
        "note": ("Data quality check: identical indicators across all 4 channels, every margin at 40%, "
                 "no peak at Christmas or Valentine's Day. Most likely simulated data: the findings "
                 "describe the dataset, and the recommendations remain hypotheses. "
                 "Filters apply to every chart except the Pareto curve (full dataset)."),
        "source": ("Data source: Kaggle “Chocolate Sales Dataset 2023 - 2024” (Nguyen, n.d.) · "
                   "Personal project · Yu-Ting Tseng"),
    },
}

# Palette of portfolio-data.html (CLAUDE.md § 3 and § 24).
INK, MUTED, RULE, CARD, PAPER = "#16211f", "#44524f", "#c3cfc9", "#eef3ef", "#e4ece7"
TEAL, TEAL_DARK, TEAL_PALE = "#0d9488", "#0f766e", "#9fcfc9"
FONT = "Tableau Book"

MAIN = "federated.choco_main"
PARETO = "federated.choco_pareto"


def a(v):
    return quoteattr(str(v))


def sid():
    return "{" + str(uuid.uuid5(uuid.NAMESPACE_URL, "choco-" + str(next(_counter)))).upper() + "}"


def _count():
    i = 0
    while True:
        i += 1
        yield i


_counter = _count()


# ---------------------------------------------------------------- datasources

MAIN_COLS = [  # (csv name, tableau datatype, role, type)
    ("year", "integer", "dimension", "ordinal"),
    ("month", "integer", "dimension", "ordinal"),
    ("month_fr", "string", "dimension", "nominal"),
    ("month_en", "string", "dimension", "nominal"),
    ("channel", "string", "dimension", "nominal"),
    ("country_fr", "string", "dimension", "nominal"),
    ("country_en", "string", "dimension", "nominal"),
    ("product_id", "string", "dimension", "nominal"),
    ("product_name", "string", "dimension", "nominal"),
    ("brand", "string", "dimension", "nominal"),
    ("category", "string", "dimension", "nominal"),
    ("transactions", "integer", "measure", "quantitative"),
    ("units", "integer", "measure", "quantitative"),
    ("revenue", "real", "measure", "quantitative"),
    ("cost", "real", "measure", "quantitative"),
    ("profit", "real", "measure", "quantitative"),
]
PARETO_COLS = [
    ("rank", "integer", "dimension", "quantitative"),
    ("product_id", "string", "dimension", "nominal"),
    ("product_name", "string", "dimension", "nominal"),
    ("revenue", "real", "measure", "quantitative"),
    ("share", "real", "measure", "quantitative"),
    ("cum_share", "real", "measure", "quantitative"),
]


def calcs(lang):
    """Calculated fields of the main datasource: name -> (caption, formula, format)."""
    t = TEXT[lang]["fields"]
    k = TEXT[lang]["kpi"]
    country, month = TEXT[lang]["country"], TEXT[lang]["month"]
    pct = "p0.0%"
    return {
        "Calc_CA_M": (k["ca"], "SUM([revenue]) / 1000000", "n#,##0.0"),
        "Calc_Marge": (k["marge"], "SUM([profit]) / SUM([revenue])", pct),
        "Calc_AOV": (k["aov"], "SUM([revenue]) / SUM([transactions])", "n#,##0.00"),
        "Calc_UPT": (t["upt"], "SUM([units]) / SUM([transactions])", "n#,##0.00"),
        "Calc_Part_Canal": (t["share"] + " · " + t["channel"],
                            "SUM([revenue]) / MIN({EXCLUDE [channel] : SUM([revenue])})", pct),
        "Calc_Part_Pays": (t["share"] + " · " + t["country"],
                           f"SUM([revenue]) / MIN({{EXCLUDE [{country}] : SUM([revenue])}})", pct),
        "Calc_Part_Cat": (t["share"] + " · " + t["category"],
                          "SUM([revenue]) / MIN({EXCLUDE [category] : SUM([revenue])})", pct),
        "Calc_Index": (t["index"],
                       f"SUM([revenue]) / (MIN({{EXCLUDE [{month}] : SUM([revenue])}}) / 12) * 100",
                       "n#,##0.0"),
        "Calc_Ecart": (t["gap"], "[Calc_Index] - 100", "n+#,##0.0;-#,##0.0"),
        "Calc_Sign": (t["sign"],
                      f'IF [Calc_Ecart] >= 0 THEN "{t["above"]}" ELSE "{t["below"]}" END', None),
    }


def column_xml(name, caption, datatype, role, typ, fmt=None, formula=None, hidden=False):
    attrs = f"caption={a(caption)} datatype={a(datatype)} name={a('[' + name + ']')} role={a(role)} type={a(typ)}"
    if fmt:
        attrs = f"caption={a(caption)} datatype={a(datatype)} default-format={a(fmt)} name={a('[' + name + ']')} role={a(role)} type={a(typ)}"
    if hidden:
        attrs += " hidden='true'"
    if formula is None:
        return f"      <column {attrs} />\n"
    return (f"      <column {attrs}>\n"
            f"        <calculation class='tableau' formula={a(formula)} />\n"
            f"      </column>\n")


REMOTE_TYPE = {"integer": 20, "real": 5, "string": 129}


def metadata_xml(csv, cols, obj):
    """Metadata records written by Tableau 2026.3 for a CSV read as en_US."""
    parent = "[" + csv + "]"
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
    for i, (c, dt, _, _) in enumerate(cols):
        out += ["          <metadata-record class='column'>\n",
                f"            <remote-name>{escape(c)}</remote-name>\n",
                f"            <remote-type>{REMOTE_TYPE[dt]}</remote-type>\n",
                f"            <local-name>{escape('[' + c + ']')}</local-name>\n",
                f"            <parent-name>{escape(parent)}</parent-name>\n",
                f"            <remote-alias>{escape(c)}</remote-alias>\n",
                f"            <ordinal>{i}</ordinal>\n",
                f"            <local-type>{dt}</local-type>\n",
                f"            <aggregation>{'Count' if dt == 'string' else 'Sum'}</aggregation>\n"]
        if dt == "string":
            out += ["            <scale>1</scale>\n", "            <width>1073741823</width>\n"]
        out.append("            <contains-null>true</contains-null>\n")
        if dt == "string":
            out.append("            <collation flag='0' name='LEN_RUS' />\n")
        out += [f"            <object-id>{escape('[' + obj + ']')}</object-id>\n",
                "          </metadata-record>\n"]
    out.append("        </metadata-records>\n")
    return "".join(out)


def datasource_xml(name, caption, csv, cols, captions, extra="", style=""):
    conn = name.replace("federated.", "textscan.")
    table = csv.replace(".csv", "#csv")
    obj = csv + "_" + uuid.uuid5(uuid.NAMESPACE_URL, "choco-object-" + csv).hex.upper()
    relation = (f"        <relation connection={a(conn)} name={a(csv)} table={a('[' + table + ']')} type='table'>\n"
                "          <columns character-set='UTF-8' header='yes' locale='en_US' separator=','>\n"
                + "".join(f"            <column datatype={a(dt)} name={a(c)} ordinal='{i}' />\n"
                          for i, (c, dt, _, _) in enumerate(cols))
                + "          </columns>\n"
                "        </relation>\n")
    out = [f"    <datasource caption={a(caption)} inline='true' name={a(name)} version='18.1'>\n",
           "      <connection class='federated'>\n",
           "        <named-connections>\n",
           f"          <named-connection caption={a(csv.replace('.csv', ''))} name={a(conn)}>\n",
           f"            <connection class='textscan' directory='.' filename={a(csv)} password='' server='' />\n",
           "          </named-connection>\n",
           "        </named-connections>\n",
           relation,
           metadata_xml(csv, cols, obj),
           "      </connection>\n",
           "      <aliases enabled='yes' />\n",
           f"      <column caption={a(csv)} datatype='table' "
           f"name={a('[__tableau_internal_object_id__].[' + obj + ']')} role='measure' type='quantitative' />\n"]
    for c, dt, role, typ in cols:
        cap, fmt, hidden = captions.get(c, (c, None, True))
        out.append(column_xml(c, cap, dt, role, typ, fmt, hidden=hidden))
    out.append(extra)
    out.append(style)
    deep = relation.replace("\n        ", "\n                ").replace("        <relation", "              <relation", 1)
    out += ["      <object-graph>\n",
            "        <objects>\n",
            f"          <object caption={a(csv)} id={a(obj)}>\n",
            "            <properties context=''>\n",
            deep,
            "            </properties>\n",
            "          </object>\n",
            "        </objects>\n",
            "      </object-graph>\n",
            "    </datasource>\n"]
    return "".join(out)


def datasources_xml(lang):
    t = TEXT[lang]["fields"]
    country, month = TEXT[lang]["country"], TEXT[lang]["month"]
    main_caps = {  # visible columns; the others are hidden
        "year": (t["year"], None, False),
        month: (t["month"], None, False),
        "channel": (t["channel"], None, False),
        country: (t["country"], None, False),
        "product_name": (t["product_name"], None, False),
        "brand": (t["brand"], None, False),
        "category": (t["category"], None, False),
        "transactions": (t["transactions"], "n#,##0", False),
        "units": (t["units"], "n#,##0", False),
        "revenue": (t["revenue"], "n#,##0", False),
        "cost": (t["cost"], "n#,##0", False),
        "profit": (t["profit"], "n#,##0", False),
    }
    extra = ""
    for name, (cap, formula, fmt) in calcs(lang).items():
        dt = "string" if name == "Calc_Sign" else "real"
        role = "dimension" if name == "Calc_Sign" else "measure"
        typ = "nominal" if name == "Calc_Sign" else "quantitative"
        extra += column_xml(name, cap, dt, role, typ, fmt, formula)
    style = ("      <style>\n"
             "        <style-rule element='mark'>\n"
             "          <encoding attr='color' field='[usr:Calc_Sign:nk]' type='palette'>\n"
             f"            <map to={a(TEAL)}>\n"
             f"              <bucket>{escape(chr(34) + t['above'] + chr(34))}</bucket>\n"
             "            </map>\n"
             f"            <map to={a(TEAL_PALE)}>\n"
             f"              <bucket>{escape(chr(34) + t['below'] + chr(34))}</bucket>\n"
             "            </map>\n"
             "          </encoding>\n"
             "        </style-rule>\n"
             "      </style>\n")
    pareto_caps = {
        "rank": (t["rank"], "n#,##0", False),
        "product_name": (t["product_name"], None, False),
        "revenue": (t["revenue"], "n#,##0", False),
        "share": (t["share"], "p0.00%", False),
        "cum_share": (t["cum"], "p0.0%", False),
    }
    return ("  <datasources>\n"
            + datasource_xml(MAIN, "Chocolate Sales", "chocolate_tableau.csv", MAIN_COLS, main_caps, extra, style)
            + datasource_xml(PARETO, "Chocolate Pareto", "chocolate_pareto.csv", PARETO_COLS, pareto_caps)
            + "  </datasources>\n")


# ---------------------------------------------------------------- worksheets

def inst(field, deriv="None", typ="nominal"):
    """Column-instance name for a field: [none:channel:nk], [sum:revenue:qk], [usr:Calc_AOV:qk]."""
    prefix = {"None": "none", "Sum": "sum", "User": "usr"}[deriv]
    suffix = {"nominal": "nk", "ordinal": "ok", "quantitative": "qk"}[typ]
    return f"[{prefix}:{field}:{suffix}]"


def worksheet_xml(lang, name, title, ds, deps, rows="", cols="", mark="Bar", encodings="",
                  sort="", pane_style="", table_style="", fit="", panes=None):
    """deps: list of (field, datatype, role, type, derivation, instance_type)."""
    dep_cols, dep_inst = [], []
    seen = set()
    for f, dt, role, typ, deriv, ityp, formula in deps:
        if f not in seen:
            seen.add(f)
            if formula:
                cap, formula, fmt = formula
                fmt_attr = f" default-format={a(fmt)}" if fmt else ""
                dep_cols.append(f"            <column caption={a(cap)} datatype={a(dt)}{fmt_attr} name={a('[' + f + ']')} role={a(role)} type={a(typ)}>\n"
                                f"              <calculation class='tableau' formula={a(formula)} />\n"
                                f"            </column>\n")
            else:
                dep_cols.append(f"            <column datatype={a(dt)} name={a('[' + f + ']')} role={a(role)} type={a(typ)} />\n")
        dep_inst.append(f"            <column-instance column={a('[' + f + ']')} derivation={a(deriv)} "
                        f"name={a(inst(f, deriv, ityp))} pivot='key' type={a(ityp)} />\n")
    ds_caption = "Chocolate Sales" if ds == MAIN else "Chocolate Pareto"
    title_xml = ("        <layout-options>\n"
                 "          <title>\n"
                 "            <formatted-text>\n"
                 f"              <run bold='true' fontcolor={a(INK)} fontname={a(FONT)} fontsize='11'>{escape(title)}</run>\n"
                 "            </formatted-text>\n"
                 "          </title>\n"
                 "        </layout-options>\n")
    if panes is None:
        panes = [(None, mark, encodings, pane_style)]
    pane_xml = ""
    for pid, pmark, penc, pstyle in panes:
        pid_attr = f" id='{pid[0]}' x-axis-name={a(pid[1])}" if pid else ""
        pane_xml += (f"          <pane selection-relaxation-option='selection-relaxation-allow'{pid_attr}>\n"
                     "            <view>\n"
                     "              <breakdown value='auto' />\n"
                     "            </view>\n"
                     f"            <mark class={a(pmark)} />\n"
                     + (f"            <encodings>\n{penc}            </encodings>\n" if penc else "")
                     + (f"            <style>\n{pstyle}            </style>\n" if pstyle else "")
                     + "          </pane>\n")
    return (f"    <worksheet name={a(name)}>\n"
            + title_xml +
            "      <table>\n"
            "        <view>\n"
            "          <datasources>\n"
            f"            <datasource caption={a(ds_caption)} name={a(ds)} />\n"
            "          </datasources>\n"
            f"          <datasource-dependencies datasource={a(ds)}>\n"
            + "".join(dep_cols) + "".join(dep_inst) +
            "          </datasource-dependencies>\n"
            + sort +
            "          <aggregation value='true' />\n"
            "        </view>\n"
            f"        <style>\n{table_style}        </style>\n"
            "        <panes>\n"
            + pane_xml +
            "        </panes>\n"
            f"        <rows>{escape(rows)}</rows>\n"
            f"        <cols>{escape(cols)}</cols>\n"
            "      </table>\n"
            f"      <simple-id uuid={a(sid())} />\n"
            "    </worksheet>\n")


def mark_color(color):
    return ("              <style-rule element='mark'>\n"
            f"                <format attr='mark-color' value={a(color)} />\n"
            "                <format attr='mark-labels-show' value='true' />\n"
            "              </style-rule>\n")


def text_style(size):
    return ("              <style-rule element='mark'>\n"
            f"                <format attr='mark-color' value={a(TEAL)} />\n"
            "              </style-rule>\n")


def base_table_style():
    return ("          <style-rule element='axis'>\n"
            f"            <format attr='color' value={a(MUTED)} />\n"
            f"            <format attr='font-family' value={a(FONT)} />\n"
            "          </style-rule>\n"
            "          <style-rule element='label'>\n"
            f"            <format attr='color' value={a(INK)} />\n"
            f"            <format attr='font-family' value={a(FONT)} />\n"
            "          </style-rule>\n"
            "          <style-rule element='gridline'>\n"
            "            <format attr='line-visibility' value='off' />\n"
            "          </style-rule>\n"
            "          <style-rule element='table'>\n"
            f"            <format attr='background-color' value={a(CARD)} />\n"
            "          </style-rule>\n")


def worksheets_xml(lang):
    T = TEXT[lang]
    S, TT = T["sheets"], T["titles"]
    C = calcs(lang)
    country, month = T["country"], T["month"]
    M = MAIN
    q = lambda f: f"[{M}].{f}"  # noqa: E731
    p = lambda f: f"[{PARETO}].{f}"  # noqa: E731

    def calc_dep(name, ityp="quantitative"):
        cap, formula, fmt = C[name]
        dt = "string" if name == "Calc_Sign" else "real"
        role = "dimension" if name == "Calc_Sign" else "measure"
        typ = "nominal" if name == "Calc_Sign" else "quantitative"
        return (name, dt, role, typ, "User", ityp, (cap, formula, fmt))

    def dim(f, typ="nominal"):
        return (f, "string", "dimension", typ, "None", typ, None)

    out = ["  <worksheets>\n"]

    # KPI cards: a single big number each.
    kpis = [("ca", "Calc_CA_M"), ("trans", None), ("marge", "Calc_Marge"), ("aov", "Calc_AOV")]
    for key, calc in kpis:
        if calc:
            deps = [calc_dep(calc)]
            fld = q(inst(calc, "User", "quantitative"))
        else:
            deps = [("transactions", "integer", "measure", "quantitative", "Sum", "quantitative", None)]
            fld = q(inst("transactions", "Sum", "quantitative"))
        enc = f"              <text column={a(fld)} />\n"
        style = ("              <style-rule element='mark'>\n"
                 f"                <format attr='mark-color' value={a(TEAL)} />\n"
                 "              </style-rule>\n"
                 "              <style-rule element='cell'>\n"
                 f"                <format attr='font-size' value='26' />\n"
                 f"                <format attr='color' value={a(TEAL_DARK)} />\n"
                 "                <format attr='text-align' value='center' />\n"
                 "              </style-rule>\n")
        out.append(worksheet_xml(lang, S[key], T["kpi"][key], M, deps, mark="Text",
                                 encodings=enc, pane_style=style, table_style=base_table_style()))

    # Bar charts of revenue share, sorted descending.
    def share_sheet(key, field, calc, color):
        f_inst = q(inst(field))
        c_inst = q(inst(calc, "User", "quantitative"))
        # Tableau 2026.3 still reads <sort class='computed'>; the 2026.1 schema
        # names it <computed-sort>, which 2026.3 rejects.
        sort = (f"          <sort class='computed' column={a(f_inst)} direction='DESC' "
                f"using={a(q(inst('revenue', 'Sum', 'quantitative')))} />\n")
        deps = [dim(field), calc_dep(calc),
                ("revenue", "real", "measure", "quantitative", "Sum", "quantitative", None)]
        enc = f"              <text column={a(c_inst)} />\n"
        return worksheet_xml(lang, S[key], TT[key], M, deps, rows=f_inst, cols=c_inst,
                             encodings=enc, sort=sort, pane_style=mark_color(color),
                             table_style=base_table_style())

    out.append(share_sheet("canal", "channel", "Calc_Part_Canal", TEAL))
    out.append(share_sheet("pays", country, "Calc_Part_Pays", TEAL))
    out.append(share_sheet("cat", "category", "Calc_Part_Cat", TEAL))

    # Identical channels: AOV, UPT and margin side by side.
    ch = q(inst("channel"))
    aov, upt, mg = (q(inst(c, "User", "quantitative")) for c in ("Calc_AOV", "Calc_UPT", "Calc_Marge"))
    deps = [dim("channel"), calc_dep("Calc_AOV"), calc_dep("Calc_UPT"), calc_dep("Calc_Marge")]
    panes = [(None, "Bar", f"              <text column={a(aov)} />\n", mark_color(TEAL)),
             (("1", aov), "Bar", f"              <text column={a(aov)} />\n", mark_color(TEAL)),
             (("2", upt), "Bar", f"              <text column={a(upt)} />\n", mark_color(TEAL_PALE)),
             (("3", mg), "Bar", f"              <text column={a(mg)} />\n", mark_color(MUTED))]
    out.append(worksheet_xml(lang, S["ident"], TT["ident"], M, deps, rows=ch,
                             cols=f"({aov} + {upt} + {mg})", panes=panes,
                             table_style=base_table_style()))

    # Seasonality: gap of each month's index to 100, coloured by sign.
    mo = q(inst(month, "None", "nominal"))
    gap = q(inst("Calc_Ecart", "User", "quantitative"))
    sign = q(inst("Calc_Sign", "User", "nominal"))
    idx = q(inst("Calc_Index", "User", "quantitative"))
    deps = [dim(month), calc_dep("Calc_Index"), calc_dep("Calc_Ecart"), calc_dep("Calc_Sign", "nominal")]
    enc = (f"              <color column={a(sign)} />\n"
           f"              <text column={a(idx)} />\n")
    style = ("              <style-rule element='mark'>\n"
             "                <format attr='mark-labels-show' value='true' />\n"
             "              </style-rule>\n")
    out.append(worksheet_xml(lang, S["saison"], TT["saison"], M, deps, rows=gap, cols=mo,
                             encodings=enc, pane_style=style, table_style=base_table_style()))

    # Pareto curve (static datasource, full dataset).
    rk = p(inst("rank", "None", "quantitative"))
    cum = p(inst("cum_share", "Sum", "quantitative"))
    deps = [("rank", "integer", "dimension", "quantitative", "None", "quantitative", None),
            ("cum_share", "real", "measure", "quantitative", "Sum", "quantitative", None),
            ("product_name", "string", "dimension", "nominal", "None", "nominal", None)]
    enc = f"              <tooltip column={a(p(inst('product_name')))} />\n"
    style = ("              <style-rule element='mark'>\n"
             f"                <format attr='mark-color' value={a(TEAL)} />\n"
             "              </style-rule>\n")
    out.append(worksheet_xml(lang, S["pareto"], TT["pareto"], PARETO, deps, rows=cum, cols=rk,
                             mark="Line", encodings=enc, pane_style=style,
                             table_style=base_table_style()))

    out.append("  </worksheets>\n")
    return "".join(out)


# ---------------------------------------------------------------- shared filters

def shared_views_xml(lang):
    T = TEXT[lang]
    filters = ["channel", T["country"], "category"]
    deps = "".join(f"        <column datatype='string' name={a('[' + f + ']')} role='dimension' type='nominal' />\n"
                   for f in filters)
    deps += "".join(f"        <column-instance column={a('[' + f + ']')} derivation='None' "
                    f"name={a(inst(f))} pivot='key' type='nominal' />\n" for f in filters)
    flt = "".join(f"      <filter class='categorical' column={a(f'[{MAIN}].' + inst(f))}>\n"
                  f"        <groupfilter function='level-members' level={a(inst(f))} "
                  "user:ui-enumeration='all' user:ui-marker='enumerate' />\n"
                  "      </filter>\n" for f in filters)
    return ("  <shared-views>\n"
            f"    <shared-view name={a(MAIN)}>\n"
            "      <datasources>\n"
            f"        <datasource caption='Chocolate Sales' name={a(MAIN)} />\n"
            "      </datasources>\n"
            f"      <datasource-dependencies datasource={a(MAIN)}>\n"
            + deps +
            "      </datasource-dependencies>\n"
            + flt +
            "    </shared-view>\n"
            "  </shared-views>\n")


# ---------------------------------------------------------------- dashboard

W, H = 1200, 1180


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


def zone_style(bg=CARD, border=True):
    b = (f"              <format attr='border-color' value={a(RULE)} />\n"
         "              <format attr='border-style' value='solid' />\n"
         "              <format attr='border-width' value='1' />\n") if border else ""
    return ("            <zone-style>\n"
            + b +
            "              <format attr='margin' value='6' />\n"
            "              <format attr='padding' value='8' />\n"
            f"              <format attr='background-color' value={a(bg)} />\n"
            "            </zone-style>\n")


def dashboard_xml(lang):
    T = TEXT[lang]
    S = T["sheets"]
    z = Zones()
    G = 16  # outer gutter

    def text(x, y, w, h, runs, bg=PAPER, border=False):
        body = (f"          <zone {{attrs}} type-v2='text'>\n"
                "            <formatted-text>\n" + runs +
                "            </formatted-text>\n" + zone_style(bg, border) +
                "          </zone>\n")
        z.add(x, y, w, h, body)

    def sheet(x, y, w, h, name):
        z.add(x, y, w, h, f"          <zone {{attrs}} name={a(name)} show-title='true'>\n"
              + zone_style() + "          </zone>\n")

    def flt(x, y, w, h, field):
        z.add(x, y, w, h,
              f"          <zone {{attrs}} mode='checkdropdown' name={a(S['canal'])} "
              f"param={a(f'[{MAIN}].' + inst(field))} type-v2='filter' values='database'>\n"
              + zone_style(PAPER, False) + "          </zone>\n")

    def run(txt, size, color=INK, bold=False):
        b = " bold='true'" if bold else ""
        return (f"              <run{b} fontcolor={a(color)} fontname={a(FONT)} "
                f"fontsize='{size}'>{escape(txt)}</run>\n")

    br = "              <run>Æ&#10;</run>\n"  # Tableau's line break inside formatted text

    inner = W - 2 * G
    text(G, 10, inner, 70, run(T["title"], 20, INK, True) + br + run(T["subtitle"], 11, MUTED))

    y = 86
    kw = inner / 4
    for i, key in enumerate(("ca", "trans", "marge", "aov")):
        sheet(G + i * kw, y, kw, 110, S[key])
    y += 116
    fw = inner / 3
    for i, f in enumerate(("channel", T["country"], "category")):
        flt(G + i * fw, y, fw, 56, f)
    y += 62
    half = inner / 2
    sheet(G, y, half, 230, S["canal"])
    sheet(G + half, y, half, 230, S["ident"])
    y += 236
    sheet(G, y, half, 260, S["saison"])
    sheet(G + half, y, half, 260, S["pareto"])
    y += 266
    sheet(G, y, half, 230, S["pays"])
    sheet(G + half, y, half, 230, S["cat"])
    y += 236
    text(G, y, inner, H - y - 8, run(T["note"], 9, MUTED) + br + run(T["source"], 9, MUTED))

    zones = "".join(z.items)
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
            + zones +
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
           "      <viewpoints />\n",
           f"      <active id='-1' />\n",
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
            # Header and feature manifest copied from a workbook saved by Tableau
            # Desktop 2026.3: without the manifest, Tableau treats the file as an
            # old document and its upgrade steps reject it.
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
            + shared_views_xml(lang)
            + worksheets_xml(lang)
            + dashboard_xml(lang)
            + windows_xml(lang)
            + "</workbook>\n")


def main():
    xsd = None
    if "--xsd" in sys.argv:
        xsd = sys.argv[sys.argv.index("--xsd") + 1]
    OUT.mkdir(parents=True, exist_ok=True)
    if "--no-data" not in sys.argv:
        build_data()
    ok = True
    for lang in ("fr", "en"):
        path = OUT / TEXT[lang]["file"]
        path.write_text(workbook_xml(lang), encoding="utf-8")
        print("wrote", path.relative_to(ROOT))
        if xsd:
            from lxml import etree
            schema = etree.XMLSchema(etree.parse(xsd))
            doc = etree.parse(str(path))
            if schema.validate(doc):
                print("  valid against", Path(xsd).name)
            else:
                errors = [e for e in schema.error_log
                          if "explain-data" not in e.message and "Element 'sort'" not in e.message]
                if errors:
                    ok = False
                for e in errors:
                    print(f"  line {e.line}: {e.message}")
                if not errors:
                    print("  valid against", Path(xsd).name, "(except explain-data and sort, on purpose)")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()

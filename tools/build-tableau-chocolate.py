"""Build the Tableau workbooks of the Chocolate FMCG project (FR and EN).

Reads the raw Kaggle files in assets/SQL_Chocolate Sales/ and writes to
assets/Tableau_Chocolate/:
  Chocolat_FMCG_FR_V{n}.twb     French workbook
  Chocolate_FMCG_EN_V{n}.twb    English workbook
  chocolate_tableau_V{n}.csv    sales aggregated by month x channel x country x
                                product (only when the data is rebuilt)

Versioned files (request of the user): every run writes the next version
number and never overwrites an earlier file. With --no-data, the workbooks
read the most recent data file (chocolate_tableau.csv or _V{n}.csv).

Cleaning: the 9,764 sales rows whose product_id is not in products.csv
(P0000 and P0201) are dropped, leaving the 990,236 transactions of the study.

The .twb files copy the header, feature manifest, object model and window
cards of a workbook saved by Tableau Desktop 2026.3 (the user's version), and
are checked against the official Tableau 2026.1 schema
(github.com/tableau/tableau-document-schemas), minus <explain-data>, which that
schema requires but older Tableau versions do not know, and <sort class='computed'>,
which Tableau 2026.3 expects instead of the schema's <computed-sort>. Validate with:
  python3 tools/build-tableau-chocolate.py --xsd path/to/twb_2026.1.0.xsd

Usage: python3 tools/build-tableau-chocolate.py [--no-data] [--xsd FILE]
"""

import re
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

def build_data(csv_name):
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
    agg["month_fr"] = agg["month"].map(lambda m: MONTH_FR[m - 1])
    agg["month_en"] = agg["month"].map(lambda m: MONTH_EN[m - 1])
    for col in ("revenue", "cost", "profit"):
        agg[col] = agg[col].round(2)
    # Pareto rank and cumulative revenue share of each SKU over the full
    # dataset, repeated on its rows: Tableau 2026.3 showed no data for a
    # second datasource, so the Pareto curve reads the main file.
    sku = (df.groupby("product_id", as_index=False)["revenue"].sum()
             .sort_values("revenue", ascending=False, kind="stable"))
    sku["sku_rank"] = range(1, len(sku) + 1)
    sku["sku_cum_share"] = (sku["revenue"].cumsum() / sku["revenue"].sum()).round(6)
    first = (sku["sku_rank"] - 1) // 40 * 40 + 1
    sku["sku_band"] = first.astype(str) + " – " + (first + 39).astype(str)
    agg = agg.merge(sku[["product_id", "sku_rank", "sku_cum_share", "sku_band"]], on="product_id")
    cols = ["year", "month", "month_fr", "month_en", "channel", "country_fr",
            "country_en", "product_id", "product_name", "brand", "category",
            "transactions", "units", "revenue", "cost", "profit", "sku_rank", "sku_cum_share", "sku_band"]
    agg[cols].to_csv(OUT / csv_name, index=False, encoding="utf-8")

    # Figures shown on portfolio-data.html: fail loudly if they drift.
    R = df["revenue"].sum()
    assert round(R / 1e6, 1) == 25.2
    assert round(df["profit"].sum() / R * 100) == 40
    assert int((sku["sku_cum_share"] < 0.8).sum()) + 1 == 160
    share = df.groupby("store_type")["revenue"].sum() / R * 100
    assert [round(share[c], 1) for c in ("Airport", "Mall", "Online", "Retail")] == [29.9, 26.0, 25.1, 19.1]
    month = df.groupby("month")["revenue"].sum()
    index = month / month.mean() * 100
    print(f"rows: {len(agg)} aggregated, {len(df)} transactions, revenue {R:,.2f}")
    print("seasonality index:", {m: round(v, 1) for m, v in index.items()})


# ---------------------------------------------------------------- workbook text

TEXT = {
    "fr": {
        "file": "Chocolat_FMCG_FR", "locale": "fr_FR",
        "country": "country_fr", "month": "month_fr",
        "dash": "Diagnostic Commercial",
        "title": "Ventes de Chocolat — Diagnostic Commercial 2023 – 2024",
        "subtitle": "990 236 transactions · 4 canaux · 6 pays · 200 SKUs · 6 marques",
        "kpi": {
            "ca": "CA", "trans": "Transactions", "marge": "Marge brute",
            "aov": "Panier moyen",
        },
        "sheets": {
            "ca": "KPI · CA", "trans": "KPI · Transactions", "marge": "KPI · Marge",
            "aov": "KPI · Panier Moyen",
            "canal": "Part du CA par Canal",
            "ident": "Panier, Unités et Marge par Canal",
            "saison": "Saisonnalité",
            "pareto": "Concentration des SKUs",
            "pays": "Part du CA par Pays",
            "cat": "Part du CA par Catégorie",
            "mix": "Canaux par Pays",
        },
        "titles": {
            "canal": "Part du CA par Canal",
            "ident": "Panier Moyen, Unités et Marge par Canal",
            "saison": "Indice de Saisonnalité par Mois (100 = Mois Moyen)",
            "pareto": "Part du CA par Tranche de 40 SKUs (Classés par CA)",
            "pays": "Part du CA par Pays",
            "cat": "Part du CA par Catégorie",
            "mix": "Part de Chaque Canal dans le CA du Pays",
        },
        # The three findings of the study (portfolio-data.html, #chocolat-fmcg).
        "sections": [
            ("1", "Saisonnalité Non Captée",
             "Aucun pic en février ni en décembre : l'indice reste entre 93 et 103."),
            ("2", "Portefeuille sans Produit Phare",
             "160 SKUs sur 200 pour atteindre 80 % du CA, contre environ 20 % selon la règle de Pareto."),
            ("3", "Canaux Indifférenciés",
             "Même panier, mêmes unités et même marge sur les 4 canaux ; l'Allemagne pèse 12 % du CA."),
        ],
        "fields": {
            "channel": "Canal", "country": "Pays", "category": "Catégorie",
            "brand": "Marque", "product_name": "Produit", "month": "Mois",
            "year": "Année", "revenue": "CA ($)", "transactions": "Transactions",
            "units": "Unités", "profit": "Marge ($)", "cost": "Coût ($)",
            "share": "Part du CA", "upt": "Unités par transaction",
            "index": "Indice de saisonnalité", "gap": "Écart à la moyenne (pts)",
            "rank": "Rang du SKU", "cum": "Part cumulée du CA", "band": "SKUs (rang)",
        },
        "source": ("Source des données : Kaggle « Chocolate Sales Dataset 2023 - 2024 » (Nguyen, s.d.) · "
                   "Projet personnel · Yu-Ting Tseng"),
    },
    "en": {
        "file": "Chocolate_FMCG_EN", "locale": "en_US",
        "country": "country_en", "month": "month_en",
        "dash": "Commercial Diagnostic",
        "title": "Chocolate Sales — Commercial Diagnostic 2023 – 2024",
        "subtitle": "990,236 transactions · 4 channels · 6 countries · 200 SKUs · 6 brands",
        "kpi": {
            "ca": "Revenue", "trans": "Transactions", "marge": "Gross margin",
            "aov": "Average order value",
        },
        "sheets": {
            "ca": "KPI · Revenue", "trans": "KPI · Transactions", "marge": "KPI · Margin",
            "aov": "KPI · AOV",
            "canal": "Revenue Share by Channel",
            "ident": "Basket, Units and Margin by Channel",
            "saison": "Seasonality",
            "pareto": "SKU Concentration",
            "pays": "Revenue Share by Country",
            "cat": "Revenue Share by Category",
            "mix": "Channels by Country",
        },
        "titles": {
            "canal": "Revenue Share by Channel",
            "ident": "Average Order Value, Units and Margin by Channel",
            "saison": "Seasonality Index by Month (100 = Average Month)",
            "pareto": "Revenue Share by Band of 40 SKUs (Ranked by Revenue)",
            "pays": "Revenue Share by Country",
            "cat": "Revenue Share by Category",
            "mix": "Share of Each Channel in the Country's Revenue",
        },
        "sections": [
            ("1", "Uncaptured Seasonality",
             "No peak in February or December: the index stays between 93 and 103."),
            ("2", "No Hero Product",
             "160 of 200 SKUs to reach 80% of revenue, vs. about 20% under the Pareto rule."),
            ("3", "Undifferentiated Channels",
             "Same basket, units and margin across the 4 channels; Germany accounts for 12% of revenue."),
        ],
        "fields": {
            "channel": "Channel", "country": "Country", "category": "Category",
            "brand": "Brand", "product_name": "Product", "month": "Month",
            "year": "Year", "revenue": "Revenue ($)", "transactions": "Transactions",
            "units": "Units", "profit": "Margin ($)", "cost": "Cost ($)",
            "share": "Revenue share", "upt": "Units per transaction",
            "index": "Seasonality index", "gap": "Gap to average (pts)",
            "rank": "SKU rank", "cum": "Cumulative revenue share", "band": "SKUs (rank)",
        },
        "source": ("Data source: Kaggle \u201cChocolate Sales Dataset 2023 - 2024\u201d (Nguyen, n.d.) · "
                   "Personal project · Yu-Ting Tseng"),
    },
}

# Palette designed for this dataset (request of the user): chocolate tones on
# cream, raspberry only for the numbers of the three findings. Constantia for
# titles and key figures, Corbel for text and axes.
PAPER, CARD, RULE = "#F6EFE6", "#FFFDF9", "#E8DCCB"
INK, MUTED = "#2B1A12", "#8A7462"
ACCENT, ACCENT_SOFT, DARK = "#6B3E26", "#C9A27E", "#2B1A12"
RASPBERRY = "#B23A48"
# "Box of chocolates" (request of the user: more colour). Tableau 2026.3
# ignores palettes written in the file, but honours one colour per sheet or
# pane and zone backgrounds: each finding gets its own colour and tint.
MILK, CARAMEL, BERRY, PISTACHIO, MINT = "#7B4A2D", "#D08C3F", "#C0485A", "#7FA66B", "#4F9A8E"
KPI_COLOR = {"ca": MILK, "trans": CARAMEL, "marge": PISTACHIO, "aov": BERRY}
SECTION = [(CARAMEL, "#FBEBD8"), (BERRY, "#F8E1E4"), (MINT, "#E1EFEC")]  # colour, header tint
TITLE_FONT, FONT = "Constantia", "Corbel"

MAIN = "federated.choco_main"


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
    ("sku_rank", "integer", "dimension", "quantitative"),
    ("sku_cum_share", "real", "measure", "quantitative"),
    ("sku_band", "string", "dimension", "nominal"),
]



# Revenue in millions and average order value, with the currency where the
# site puts it: "$25.2M" / "$25.49" in English, "25,2 M$" / "25,49 $" in French
# (non-breaking space before the unit, CLAUDE.md § 20).
MONEY = {
    "en": ('n"$"#,##0.0"M"', 'n"$"#,##0.00'),
    "fr": ('n#,##0.0"\u00a0M$"', 'n#,##0.00"\u00a0$"'),
}


def calcs(lang):
    """Calculated fields of the main datasource: name -> (caption, formula, format)."""
    t = TEXT[lang]["fields"]
    k = TEXT[lang]["kpi"]
    country, month = TEXT[lang]["country"], TEXT[lang]["month"]
    pct = "p0.0%"
    return {
        "Calc_CA_M": (k["ca"], "SUM([revenue]) / 1000000", MONEY[lang][0]),
        "Calc_Marge": (k["marge"], "SUM([profit]) / SUM([revenue])", pct),
        "Calc_AOV": (k["aov"], "SUM([revenue]) / SUM([transactions])", MONEY[lang][1]),
        "Calc_UPT": (t["upt"], "SUM([units]) / SUM([transactions])", "n#,##0.00"),
        "Calc_Part_Canal": (t["share"] + " · " + t["channel"],
                            "SUM([revenue]) / MIN({EXCLUDE [channel] : SUM([revenue])})", pct),
        "Calc_Part_Pays": (t["share"] + " · " + t["country"],
                           f"SUM([revenue]) / MIN({{EXCLUDE [{country}] : SUM([revenue])}})", pct),
        "Calc_Part_Cat": (t["share"] + " · " + t["category"],
                          "SUM([revenue]) / MIN({EXCLUDE [category] : SUM([revenue])})", pct),
        "Calc_Part_Band": (t["share"] + " · " + t["band"],
                           "SUM([revenue]) / MIN({EXCLUDE [sku_band] : SUM([revenue])})", pct),
        "Calc_Index": (t["index"],
                       f"SUM([revenue]) / (MIN({{EXCLUDE [{month}] : SUM([revenue])}}) / 12) * 100",
                       "n#,##0.0"),
        "Calc_Ecart": (t["gap"], "[Calc_Index] - 100", "n+#,##0.0;-#,##0.0"),
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
        "sku_rank": (t["rank"], "n#,##0", False),
        "sku_cum_share": (t["cum"], "p0.0%", False),
        "sku_band": (t["band"], None, False),
    }
    extra = ""
    for name, (cap, formula, fmt) in calcs(lang).items():
        dt, role, typ = "real", "measure", "quantitative"
        extra += column_xml(name, cap, dt, role, typ, fmt, formula)
    style = ""
    return ("  <datasources>\n"
            + datasource_xml(MAIN, "Chocolate Sales", DATA_CSV, MAIN_COLS, main_caps, extra, style)
            + "  </datasources>\n")


# ---------------------------------------------------------------- worksheets

def inst(field, deriv="None", typ="nominal"):
    """Column-instance name for a field: [none:channel:nk], [sum:revenue:qk], [usr:Calc_AOV:qk]."""
    prefix = {"None": "none", "Sum": "sum", "User": "usr", "Min": "min"}[deriv]
    suffix = {"nominal": "nk", "ordinal": "ok", "quantitative": "qk"}[typ]
    return f"[{prefix}:{field}:{suffix}]"


def worksheet_xml(lang, name, title, ds, deps, rows="", cols="", mark="Bar", encodings="",
                  sort="", pane_style="", table_style="", fit="", panes=None,
                  title_font=TITLE_FONT, title_size=14, title_color=INK):
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
    ds_caption = "Chocolate Sales"
    title_xml = ("        <layout-options>\n"
                 "          <title>\n"
                 "            <formatted-text>\n"
                 f"              <run fontcolor={a(title_color)} fontname={a(title_font)} fontsize={a(title_size)}>{escape(title)}</run>\n"
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


LABELS = ("              <style-rule element='mark'>\n"
          "                <format attr='mark-labels-show' value='true' />\n"
          "              </style-rule>\n")

# Shades within a chart (request of the user): colour driven by the chart's
# own value, light to dark of one hue (custom-interpolated palette, defined in
# the worksheet itself, unlike the ignored categorical palettes).
GRADIENT = {
    "mint": ("#CFE6E1", "#2F6E64"), "milk": ("#E9D3C2", "#5A321C"),
    "pistachio": ("#DDEBD3", "#4F7A3D"), "berry": ("#F3C9CF", "#9C2F42"),
}


def gradient_style(field, colors, kind="ordered-sequential", center=None):
    # Sequential shades start at 0 so they stay proportional to the values:
    # five SKU bands at 19.6 - 20.4 % must look alike, not light vs dark.
    c = f" center='{center}'" if center is not None else " min='0' range-type='fixedmin'"
    return ("          <style-rule element='mark'>\n"
            f"            <encoding attr='color'{c} field={a(field)} type='custom-interpolated'>\n"
            f"              <color-palette custom='true' name='' type='{kind}'>\n"
            + "".join(f"                <color>{col}</color>\n" for col in colors) +
            "              </color-palette>\n"
            "            </encoding>\n"
            "          </style-rule>\n")


def text_style(size):
    return ("              <style-rule element='mark'>\n"
            f"                <format attr='mark-color' value={a(ACCENT)} />\n"
            "              </style-rule>\n")


def base_table_style():
    return ("          <style-rule element='axis'>\n"
            f"            <format attr='color' value={a(MUTED)} />\n"
            f"            <format attr='font-family' value={a(FONT)} />\n"
            "            <format attr='font-size' value='11' />\n"
            "          </style-rule>\n"
            "          <style-rule element='label'>\n"
            f"            <format attr='color' value={a(INK)} />\n"
            f"            <format attr='font-family' value={a(FONT)} />\n"
            "            <format attr='font-size' value='11' />\n"
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

    def calc_dep(name, ityp="quantitative"):
        cap, formula, fmt = C[name]
        dt, role, typ = "real", "measure", "quantitative"
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
                 f"                <format attr='mark-color' value={a(KPI_COLOR[key])} />\n"
                 "              </style-rule>\n"
                 "              <style-rule element='cell'>\n"
                 f"                <format attr='font-family' value={a(TITLE_FONT)} />\n"
                 f"                <format attr='font-size' value='34' />\n"
                 f"                <format attr='color' value={a(KPI_COLOR[key])} />\n"
                 "                <format attr='text-align' value='center' />\n"
                 "              </style-rule>\n")
        out.append(worksheet_xml(lang, S[key], T["kpi"][key], M, deps, mark="Text",
                                 encodings=enc, pane_style=style, table_style=base_table_style(),
                                 title_font=FONT, title_size=12, title_color=MUTED))

    # Bar charts of revenue share, sorted descending.
    def share_sheet(key, field, calc, shades):
        f_inst = q(inst(field))
        c_inst = q(inst(calc, "User", "quantitative"))
        # Tableau 2026.3 still reads <sort class='computed'>; the 2026.1 schema
        # names it <computed-sort>, which 2026.3 rejects.
        sort = (f"          <sort class='computed' column={a(f_inst)} direction='DESC' "
                f"using={a(q(inst('revenue', 'Sum', 'quantitative')))} />\n")
        deps = [dim(field), calc_dep(calc),
                ("revenue", "real", "measure", "quantitative", "Sum", "quantitative", None)]
        enc = (f"              <color column={a(c_inst)} />\n"
               f"              <text column={a(c_inst)} />\n")
        return worksheet_xml(lang, S[key], TT[key], M, deps, rows=f_inst, cols=c_inst,
                             encodings=enc, sort=sort, pane_style=LABELS,
                             table_style=base_table_style() + gradient_style(c_inst, GRADIENT[shades]))

    out.append(share_sheet("canal", "channel", "Calc_Part_Canal", "mint"))
    out.append(share_sheet("pays", country, "Calc_Part_Pays", "milk"))
    out.append(share_sheet("cat", "category", "Calc_Part_Cat", "pistachio"))

    # Channel mix inside each country (heatmap): the 4 channels share the same
    # basket and margin, but not the same weight from one country to another.
    # Calc_Part_Canal excludes the channel only, so it reads as a share of the
    # country's revenue here.
    c_inst = q(inst("Calc_Part_Canal", "User", "quantitative"))
    deps = [dim(country), dim("channel"), calc_dep("Calc_Part_Canal"),
            ("revenue", "real", "measure", "quantitative", "Sum", "quantitative", None)]
    enc = (f"              <color column={a(c_inst)} />\n"
           f"              <text column={a(c_inst)} />\n")
    out.append(worksheet_xml(lang, S["mix"], TT["mix"], M, deps, rows=q(inst(country)),
                             cols=q(inst("channel")), mark="Square", encodings=enc,
                             pane_style=LABELS,
                             table_style=base_table_style() + gradient_style(c_inst, GRADIENT["mint"])))

    # Identical channels: AOV, UPT and margin side by side.
    ch = q(inst("channel"))
    aov, upt, mg = (q(inst(c, "User", "quantitative")) for c in ("Calc_AOV", "Calc_UPT", "Calc_Marge"))
    deps = [dim("channel"), calc_dep("Calc_AOV"), calc_dep("Calc_UPT"), calc_dep("Calc_Marge")]
    panes = [(None, "Bar", f"              <text column={a(aov)} />\n", mark_color(MILK)),
             (("1", aov), "Bar", f"              <text column={a(aov)} />\n", mark_color(MILK)),
             (("2", upt), "Bar", f"              <text column={a(upt)} />\n", mark_color(CARAMEL)),
             (("3", mg), "Bar", f"              <text column={a(mg)} />\n", mark_color(BERRY))]
    out.append(worksheet_xml(lang, S["ident"], TT["ident"], M, deps, rows=ch,
                             cols=f"({aov} + {upt} + {mg})", panes=panes,
                             table_style=base_table_style()))

    # Seasonality: gap of each month's index to 100. One colour: Tableau
    # 2026.3 ignored the palette written for a sign dimension, and the bars
    # already go up or down.
    mo = q(inst(month, "None", "nominal"))
    gap = q(inst("Calc_Ecart", "User", "quantitative"))
    idx = q(inst("Calc_Index", "User", "quantitative"))
    deps = [dim(month), calc_dep("Calc_Index"), calc_dep("Calc_Ecart"),
            ("month", "integer", "dimension", "ordinal", "Min", "quantitative", None)]
    msort = (f"          <sort class='computed' column={a(mo)} direction='ASC' "
             f"using={a(q(inst('month', 'Min', 'quantitative')))} />\n")
    enc = (f"              <color column={a(gap)} />\n"
           f"              <text column={a(idx)} />\n")
    out.append(worksheet_xml(lang, S["saison"], TT["saison"], M, deps, rows=gap, cols=mo,
                             encodings=enc, sort=msort, pane_style=LABELS,
                             table_style=base_table_style()
                             + gradient_style(gap, (BERRY, "#F1E4D6", CARAMEL), "ordered-diverging", 0)))

    # SKU concentration (vertical bars, so the five equal heights read at a
    # glance and the labels have room): revenue share of each band of 40 SKUs ranked by
    # revenue. A Line mark on a continuous axis stayed blank in Tableau 2026.3;
    # five flat bars (about 20 % each) tell the same story.
    band = q(inst("sku_band"))
    pb = q(inst("Calc_Part_Band", "User", "quantitative"))
    deps = [dim("sku_band"), calc_dep("Calc_Part_Band"),
            ("sku_rank", "integer", "dimension", "quantitative", "Min", "quantitative", None)]
    bsort = (f"          <sort class='computed' column={a(band)} direction='ASC' "
             f"using={a(q(inst('sku_rank', 'Min', 'quantitative')))} />\n")
    out.append(worksheet_xml(lang, S["pareto"], TT["pareto"], M, deps, rows=pb, cols=band,
                             encodings=(f"              <color column={a(pb)} />\n"
                                        f"              <text column={a(pb)} />\n"), sort=bsort,
                             pane_style=LABELS,
                             table_style=base_table_style() + gradient_style(pb, GRADIENT["berry"])))

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

W, H = 1200, 1770


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
    G = 16  # outer gutter

    def text(x, y, w, h, runs, bg=PAPER, border=False, margin=2, padding=4):
        body = (f"          <zone {{attrs}} type-v2='text'>\n"
                "            <formatted-text>\n" + runs +
                "            </formatted-text>\n" + zone_style(bg, border, margin, padding) +
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

    def run(txt, size, color=INK, bold=False, font=FONT):
        b = " bold='true'" if bold else ""
        return (f"              <run{b} fontcolor={a(color)} fontname={a(font)} "
                f"fontsize='{size}'>{escape(txt)}</run>\n")

    br = "              <run>Æ&#10;</run>\n"  # Tableau's line break inside formatted text

    # Report layout, read top to bottom (the user preferred it to 16:9 for a
    # business analysis): header, KPIs, filters, then one block per finding.
    inner = W - 2 * G
    half = inner / 2
    # Constantia figures descend below the baseline: title and KPI cards get
    # extra height so nothing is clipped.
    text(G, 8, inner, 100, run(T["title"], 24, INK, font=TITLE_FONT) + br + run(T["subtitle"], 11, MUTED))

    y = 114
    kw = inner / 4
    for i, key in enumerate(("ca", "trans", "marge", "aov")):
        sheet(G + i * kw, y, kw, 150, S[key])
    y += 156
    fw = inner / 3
    for i, f in enumerate(("channel", T["country"], "category")):
        flt(G + i * fw, y, fw, 52, f)
    y += 60

    def section(y, n):
        num, name, detail = T["sections"][n]
        color, tint = SECTION[n]
        text(G, y, inner, 90, run(num, 22, color, bold=True, font=TITLE_FONT)
             + run("   " + name, 18, INK, font=TITLE_FONT) + br + run(detail, 11, MUTED),
             bg=tint, margin=4, padding=10)
        return y + 94

    y = section(y, 0)
    sheet(G, y, inner, 260, S["saison"])
    y += 270
    y = section(y, 1)
    sheet(G, y, half, 260, S["pareto"])
    sheet(G + half, y, half, 260, S["cat"])
    y += 270
    y = section(y, 2)
    sheet(G, y, half, 260, S["canal"])
    sheet(G + half, y, half, 260, S["ident"])
    y += 266
    sheet(G, y, half, 260, S["pays"])
    sheet(G + half, y, half, 260, S["mix"])
    y += 266
    text(G, y, inner, H - y - 8, run(T["source"], 9, MUTED))

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
           # Tableau 2026.3 stops with an internal error when a sheet shown in
           # the dashboard has no viewpoint in the dashboard window.
           "      <viewpoints>\n",
           *(f"        <viewpoint name={a(name)}>\n"
             "          <zoom type='entire-view' />\n"
             "        </viewpoint>\n" for name in T["sheets"].values()),
           "      </viewpoints>\n",
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


DATA_CSV = "chocolate_tableau.csv"


def version_of(path):
    m = re.search(r"_V(\d+)\.\w+$", path.name)
    return int(m.group(1)) if m else 0


def main():
    global DATA_CSV
    xsd = None
    if "--xsd" in sys.argv:
        xsd = sys.argv[sys.argv.index("--xsd") + 1]
    OUT.mkdir(parents=True, exist_ok=True)
    existing = list(OUT.glob("Chocolat*_V*.twb")) + list(OUT.glob("chocolate_tableau*.csv"))
    n = max((version_of(f) for f in existing), default=0) + 1
    if "--no-data" not in sys.argv:
        DATA_CSV = f"chocolate_tableau_V{n}.csv"
        build_data(DATA_CSV)
    else:
        csvs = sorted(OUT.glob("chocolate_tableau*.csv"), key=version_of)
        DATA_CSV = csvs[-1].name
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

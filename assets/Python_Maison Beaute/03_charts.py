"""Step 3: draw the charts of the study, in French and in English.

Reads  data/raw/marketing_campaign.csv (chart 1 only) and the latest cleaned file
Writes charts/V{n}/{chart}_{fr|en}.webp (1600 x 900)

Palette of the project itself, a fragrance and skincare house (request of the
user: not the colours of the site): porcelain paper, plum ink, powder pink for
the context bars and one cosmetic colour per chart (plum, rose, rose gold,
lavender). Titles in Playfair Display, text in Outfit (fonts/, SIL Open
Font License).

Usage: python 03_charts.py
"""

import io

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import font_manager
from PIL import Image

from beaute_common import CAMPAIGNS, CHANNELS, CHARTS, FONTS, RAW, latest_clean, next_version

CARD, TEXT, MUTED, BORDER = "#fbf6f4", "#2d2330", "#85777f", "#e2d3d0"
SOFT = "#ead9d6"                       # powder pink: context bars and dots
PLUM, ROSE, ROSE_GOLD, LAVENDER = "#6b2f57", "#c25b7a", "#a8735a", "#7c6f9c"
TITLE_FONT = "Playfair Display SemiBold"

for f in FONTS.glob("*.ttf"):
    font_manager.fontManager.addfont(str(f))
plt.rcParams.update({
    "font.family": "Outfit", "font.size": 10, "text.color": TEXT,
    "axes.edgecolor": BORDER, "axes.labelcolor": MUTED, "axes.facecolor": CARD,
    "figure.facecolor": CARD, "xtick.color": MUTED, "ytick.color": MUTED,
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.titlesize": 11, "axes.titleweight": "medium", "axes.titlelocation": "left",
    "axes.titlepad": 12,
})

raw = pd.read_csv(RAW, sep="\t")
df = pd.read_csv(latest_clean())
ok = ~df["income_outlier"]


def num(x, lang, dec=1, unit=""):
    """Format a number the way the site does: 3 250 $ / 38,5 % (FR), $3,250 / 38.5% (EN)."""
    s = f"{x:,.{dec}f}".replace("-", "\u2212")
    if lang == "fr":
        s = s.replace(",", " ").replace(".", ",")
        return f"{s} {unit}" if unit else s
    return f"${s}" if unit == "$" else f"{s}{unit}"


def finish(fig, title, lang):
    fig.suptitle(title, x=0.035, y=0.965, ha="left", fontsize=19, fontfamily=TITLE_FONT)
    fig.text(0.035, 0.03, SOURCE[lang], fontsize=8, color=MUTED)
    buf = io.BytesIO()
    fig.savefig(buf, dpi=200, format="png")
    plt.close(fig)
    return Image.open(buf).convert("RGB")


def bar_labels(ax, bars, values, lang, unit="", dec=1, inside=None):
    """Value labels: white inside the highlighted bars, ink above the others."""
    for i, (b, v) in enumerate(zip(bars, values)):
        txt = num(v, lang, dec, unit)
        if inside and i in inside:
            ax.text(b.get_x() + b.get_width() / 2, b.get_height() * 0.96, txt, ha="center", va="top",
                    fontsize=9, color="white", zorder=4)
        else:
            ax.text(b.get_x() + b.get_width() / 2, b.get_height(), txt, ha="center", va="bottom",
                    fontsize=9, color=TEXT, zorder=4)


SOURCE = {"fr": f"Source : Kaggle, Customer Personality Analysis (Patel, 2021), {num(len(df), 'fr', 0)} clients "
                "après nettoyage. Traitement : Python (pandas, matplotlib).",
          "en": f"Source: Kaggle, Customer Personality Analysis (Patel, 2021), {num(len(df), 'en', 0)} customers "
                "after cleaning. Processing: Python (pandas, matplotlib)."}


# ------------------------------------------------------------ 1. data quality
def chart_quality(lang):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(8, 4.5), gridspec_kw={"width_ratios": [1, 1.1]})
    fig.subplots_adjust(left=0.2, right=0.97, top=0.78, bottom=0.17, wspace=0.3)
    same = [c for c in raw.columns if c != "ID"]
    steps = {"fr": ["Doublons retirés", "Revenus manquants", "Statuts hors liste",
                    "Clients sans achat", "Naissances avant 1920", "Revenu extrême"],
             "en": ["Duplicates removed", "Missing incomes", "Off-list statuses",
                    "Customers with no purchase", "Births before 1920", "Extreme income"]}[lang]
    kept = raw.drop_duplicates(subset=same)
    counts = [raw.duplicated(subset=same).sum(), df["income_imputed"].sum(),
              kept["Marital_Status"].isin(["Alone", "Absurd", "YOLO"]).sum(),
              (df[CHANNELS].sum(axis=1) == 0).sum(), df["birth_outlier"].sum(), df["income_outlier"].sum()]
    y = np.arange(len(steps))[::-1]
    a1.barh(y, counts, height=0.6, color=[PLUM] + [SOFT] * 5, zorder=3)
    for yi, v in zip(y, counts):
        a1.text(v + 3, yi, str(v), va="center", fontsize=9)
    a1.set_yticks(y, steps)
    a1.set_xlim(0, 215)
    a1.tick_params(axis="y", length=0)

    x = df["Income"].clip(upper=170_000)
    prem = df["premium_spend"]
    a2.scatter(x[ok], prem[ok], s=5, color=PLUM, alpha=0.35, linewidths=0)
    a2.scatter(x[~ok], prem[~ok], s=40, color=ROSE, marker=">", zorder=4)
    out_y = prem[~ok].iloc[0]
    r_all = df["Income"].corr(prem)
    r_ok = df.loc[ok, "Income"].corr(prem[ok])
    a2.set_xlim(0, 178_000)
    a2.xaxis.set_major_formatter(lambda v, _: num(v / 1000, lang, 0) + (" k" if lang == "fr" else "k"))
    if lang == "fr":
        a1.set_title("Corrections apportées (clients)")
        a2.set_title("Revenu et dépense premium")
        a2.set_xlabel("Revenu annuel ($)")
        a2.set_ylabel("Dépense premium ($)")
        note = f"666 666 $ →\nr = {num(r_all, lang, 2)} avec ce client\nr = {num(r_ok, lang, 2)} sans lui"
        title = "Nettoyage : Doublons et Valeur Extrême"
    else:
        a1.set_title("Fixes applied (customers)")
        a2.set_title("Income and premium spend")
        a2.set_xlabel("Annual income ($)")
        a2.set_ylabel("Premium spend ($)")
        note = f"$666,666 →\nr = {num(r_all, lang, 2)} with this customer\nr = {num(r_ok, lang, 2)} without"
        title = "Cleaning: Duplicates and an Extreme Value"
    a2.annotate(note, (170_000, out_y), xytext=(-8, 40), textcoords="offset points", ha="right",
                fontsize=8.5, color=ROSE)
    return finish(fig, title, lang)


# ------------------------------------------------------------ 2. premium spend
def chart_premium(lang):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(8, 4.5))
    fig.subplots_adjust(left=0.09, right=0.97, top=0.78, bottom=0.17, wspace=0.3)
    band = df[ok].groupby("income_band")["premium_spend"].mean().reindex(["T1", "T2", "T3", "T4"])
    lims = df.loc[ok].groupby("income_band")["Income"].agg(["min", "max"]).reindex(band.index)
    labels = [f"{b}\n{num(lo / 1000, lang, 0)} – {num(hi / 1000, lang, 0)} k" for b, (lo, hi) in lims.iterrows()]
    bars = a1.bar(range(4), band.values, color=[SOFT, SOFT, SOFT, PLUM], width=0.62, zorder=3)
    bar_labels(a1, bars, band.values, lang, "$", 0, inside={3})
    a1.set_xticks(range(4), labels)
    a1.yaxis.set_major_formatter(lambda v, _: num(v, lang, 0))

    tier = df.groupby("engagement_tier")["premium_spend"].mean().reindex(["0", "1", "2+"])
    bars = a2.bar(range(3), tier.values, color=[SOFT, SOFT, ROSE], width=0.62, zorder=3)
    bar_labels(a2, bars, tier.values, lang, "$", 0, inside={2})
    a2.yaxis.set_major_formatter(lambda v, _: num(v, lang, 0))
    if lang == "fr":
        a1.set_title("Par quartile de revenu annuel ($)")
        a2.set_title("Selon le nombre de campagnes acceptées")
        a2.set_xticks(range(3), ["Aucune", "Une", "Deux ou plus"])
        title = "Dépense Premium Moyenne : Revenu et Engagement"
    else:
        a1.set_title("By annual income quartile ($)")
        a2.set_title("By number of campaigns accepted")
        a2.set_xticks(range(3), ["None", "One", "Two or more"])
        title = "Average Premium Spend: Income and Engagement"
    return finish(fig, title, lang)


# ------------------------------------------------------------ 3. campaigns
def chart_campaigns(lang):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(8, 4.5), gridspec_kw={"width_ratios": [1.4, 1]})
    fig.subplots_adjust(left=0.08, right=0.97, top=0.78, bottom=0.17, wspace=0.3)
    rates = df[CAMPAIGNS].mean() * 100
    names = ["1", "2", "3", "4", "5", "Response"]
    bars = a1.bar(range(6), rates.values, color=[SOFT] * 5 + [ROSE_GOLD], width=0.62, zorder=3)
    bar_labels(a1, bars, rates.values, lang, "%", 1, inside={5})
    a1.set_xticks(range(6), names)
    a1.yaxis.set_major_formatter(lambda v, _: num(v, lang, 0, "%"))

    resp = df[ok & (df["Response"] == 1)]
    share = resp["income_band"].value_counts(normalize=True).reindex(["T1", "T2", "T3", "T4"]) * 100
    bars = a2.bar(range(4), share.values, color=[SOFT, SOFT, SOFT, ROSE_GOLD], width=0.62, zorder=3)
    bar_labels(a2, bars, share.values, lang, "%", 1, inside={3})
    a2.axhline(25, color=TEXT, lw=0.8, ls=(0, (4, 3)), zorder=1,
               label="25 % : répartition égale" if lang == "fr" else "25%: even split")
    a2.legend(loc="upper left", frameon=False, fontsize=8.5, labelcolor=MUTED)
    a2.set_xticks(range(4), ["T1", "T2", "T3", "T4"])
    a2.set_ylim(0, 55)
    a2.yaxis.set_major_formatter(lambda v, _: num(v, lang, 0, "%"))
    if lang == "fr":
        a1.set_title("Taux d'acceptation par campagne")
        a1.set_xlabel("Campagne")
        a2.set_title("Répondants à Response, par quartile")
        a2.set_xlabel("Quartile de revenu")
        title = "Response Convertit le Double, Surtout en T4"
    else:
        a1.set_title("Acceptance rate by campaign")
        a1.set_xlabel("Campaign")
        a2.set_title("Response takers by income quartile")
        a2.set_xlabel("Income quartile")
        title = "Response Converts Twice as Well, Mostly in T4"
    return finish(fig, title, lang)


# ------------------------------------------------------------ 4. channels
def chart_channels(lang):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(8, 4.5))
    fig.subplots_adjust(left=0.2, right=0.97, top=0.78, bottom=0.17, wspace=0.35)
    order = ["True Omni-Channel", "Counter-First", "Digital-First"]
    prof = df["channel_profile"].value_counts(normalize=True).reindex(order)[::-1] * 100
    a1.barh(prof.index, prof.values, height=0.6, zorder=3,
            color=[LAVENDER if p == "True Omni-Channel" else SOFT for p in prof.index])
    for i, v in enumerate(prof.values):
        a1.text(v + 1, i, num(v, lang, 1, "%"), va="center", fontsize=9)
    a1.set_xlim(0, 60)
    a1.xaxis.set_major_formatter(lambda v, _: num(v, lang, 0, "%"))
    a1.tick_params(axis="y", length=0)

    rng = np.random.default_rng(7)
    a2.scatter(df["NumWebVisitsMonth"] + rng.uniform(-0.3, 0.3, len(df)),
               df["NumWebPurchases"] + rng.uniform(-0.3, 0.3, len(df)),
               s=5, color=LAVENDER, alpha=0.35, linewidths=0)
    r = df["NumWebVisitsMonth"].corr(df["NumWebPurchases"])
    if lang == "fr":
        a1.set_title("Profils de clients selon le canal")
        a2.set_title(f"Visites web et achats web (r = {num(r, lang, 2)})")
        a2.set_xlabel("Visites du site par mois")
        a2.set_ylabel("Achats web")
        title = "Omnicanal en Tête, un Web Qui ne Convertit Pas"
    else:
        a1.set_title("Customer profiles by channel")
        a2.set_title(f"Web visits and web purchases (r = {num(r, lang, 2)})")
        a2.set_xlabel("Site visits per month")
        a2.set_ylabel("Web purchases")
        title = "Omni-Channel Leads, the Web Does Not Convert"
    return finish(fig, title, lang)


CHART_FUNCS = {"1_data_quality": chart_quality, "2_premium_spend": chart_premium,
               "3_campaigns": chart_campaigns, "4_channels": chart_channels}

n = next_version(CHARTS, r"V(\d+)")
out = CHARTS / f"V{n}"
out.mkdir()
for name, func in CHART_FUNCS.items():
    for lang in ("fr", "en"):
        func(lang).save(out / f"{name}_{lang}.webp", "WEBP", quality=90)
print(f"Wrote {len(CHART_FUNCS) * 2} charts to charts/V{n}/")

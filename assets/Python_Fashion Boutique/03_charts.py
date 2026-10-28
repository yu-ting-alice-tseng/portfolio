"""Step 3: draw the charts of the study, in French and in English.

Reads  the latest data/clean/fashion_boutique_clean_V{n}.csv
Writes charts/V{n}/{chart}_{fr|en}.webp (1600 x 900)

Colours follow portfolio-data.html (--da-* variables): celadon card, ink text,
teal accent. Font: Outfit (fonts/, SIL Open Font License), as on the site.

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

from fashion_common import CHARTS, FONTS, STOCK_LABELS, latest_clean, next_version

CARD, TEXT, MUTED, BORDER = "#eef3ef", "#16211f", "#5d6b66", "#c3cfc9"
ACCENT, ACCENT2, SOFT = "#0d9488", "#0891b2", "#a9bdb6"

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

df = pd.read_csv(latest_clean())
loss_total = df["markdown_amount"].sum()


def num(x, lang, dec=1, unit=""):
    """Format a number the way the site does: 3 250 € / 38,5 % (FR), 3,250 / 38.5% (EN)."""
    s = f"{x:,.{dec}f}"
    if lang == "fr":
        s = s.replace(",", " ").replace(".", ",")
        return f"{s} {unit}" if unit else s
    return f"${s}" if unit == "$" else f"{s}{unit}"


def finish(fig, title, source, lang):
    fig.suptitle(title, x=0.035, y=0.965, ha="left", fontsize=15, fontweight="medium")
    fig.text(0.035, 0.03, source, fontsize=8, color=MUTED)
    buf = io.BytesIO()
    fig.savefig(buf, dpi=200, format="png")
    plt.close(fig)
    return Image.open(buf).convert("RGB")


SOURCE = {"fr": "Source : Kaggle, Retail Fashion Boutique Data Sales Analytics 2025 (Puri, 2025), "
                "2 176 articles, données synthétiques. Traitement : Python (pandas, matplotlib).",
          "en": "Source: Kaggle, Retail Fashion Boutique Data Sales Analytics 2025 (Puri, 2025), "
                "2,176 items, synthetic data. Processing: Python (pandas, matplotlib)."}


# ------------------------------------------------------------ 1. data quality
def chart_quality(lang):
    per_day = pd.to_datetime(df["purchase_date"]).value_counts().sort_index()
    top_day, top_n = per_day.idxmax(), per_day.max()
    others = per_day.drop(top_day)
    fig, ax = plt.subplots(figsize=(8, 4.5))
    fig.subplots_adjust(left=0.08, right=0.97, top=0.78, bottom=0.17)
    ax.bar(others.index, others.values, width=1.2, color=SOFT)
    ax.bar([top_day], [top_n], width=3, color=ACCENT)
    ax.set_yscale("log")
    ax.set_ylim(0.8, top_n * 2.2)
    ax.set_yticks([1, 10, 100, 1000])
    ax.minorticks_off()
    ax.xaxis.set_major_formatter(matplotlib.dates.DateFormatter("%m/%Y"))
    ax.xaxis.set_major_locator(matplotlib.dates.MonthLocator(bymonth=[2, 5, 8, 11]))
    ax.yaxis.set_major_formatter(lambda v, _: num(v, lang, 0))
    share = top_n / len(df) * 100
    if lang == "fr":
        ax.set_title("Articles par date d'achat, 08/2024 – 08/2025")
        note = f"06/08/2025 : {num(top_n, lang, 0)} articles ({num(share, lang, 1, '%')})"
        rest = f"Les {len(others)} autres jours : {others.min()} à {others.max()} articles chacun"
        title = "Date d'Achat : une Valeur par Défaut"
        ax.set_ylabel("Articles (échelle log)")
    else:
        ax.set_title("Items per purchase date, 08/2024 – 08/2025")
        note = f"06/08/2025: {num(top_n, lang, 0)} items ({num(share, lang, 1, '%')})"
        rest = f"The other {len(others)} days: {others.min()} to {others.max()} items each"
        title = "Purchase Date: a Default Value"
        ax.set_ylabel("Items (log scale)")
    ax.annotate(note, (top_day, top_n), xytext=(-12, -4), textcoords="offset points",
                ha="right", va="top", fontsize=11, color=ACCENT, fontweight="medium")
    ax.annotate(rest, (others.index[len(others) // 2], others.max()), xytext=(0, 22),
                textcoords="offset points", ha="center", fontsize=9.5, color=MUTED)
    return finish(fig, title, SOURCE[lang], lang)


# ------------------------------------------------------------ 2. stock and markdowns
def chart_stock(lang):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(8, 4.5), gridspec_kw={"width_ratios": [1.15, 1]})
    fig.subplots_adjust(left=0.08, right=0.97, top=0.78, bottom=0.17, wspace=0.28)
    rng = np.random.default_rng(7)
    d = df[df["is_discounted"]]
    f = df[~df["is_discounted"]]
    full_lbl, disc_lbl = (("Plein prix", "Remisé") if lang == "fr" else ("Full price", "Discounted"))
    a1.scatter(d["stock_quantity"] + rng.uniform(-0.3, 0.3, len(d)), d["markdown_percentage"],
               s=7, color=ACCENT, alpha=0.6, linewidths=0, label=disc_lbl)
    a1.scatter(f["stock_quantity"] + rng.uniform(-0.3, 0.3, len(f)), np.zeros(len(f)),
               s=5, color=SOFT, alpha=0.5, linewidths=0, label=full_lbl)
    a1.legend(loc="upper center", bbox_to_anchor=(0.5, 1.0), ncol=2, frameon=False, fontsize=8.5,
              labelcolor=MUTED, markerscale=1.8, handletextpad=0.2)
    a1.set_xlim(-1.5, 51.5)
    a1.set_ylim(-3, 70)
    a1.set_yticks(range(0, 70, 10))
    a1.yaxis.set_major_formatter(lambda v, _: num(v, lang, 0, "%"))
    r = df["stock_quantity"].corr(df["markdown_percentage"])

    share = df.groupby("stock_band", observed=True)["is_discounted"].mean().reindex(STOCK_LABELS) * 100
    mean = df["is_discounted"].mean() * 100
    bars = a2.bar(range(5), share.values, color=[ACCENT if i in (0, 4) else SOFT for i in range(5)],
                  width=0.62, zorder=3)
    for b, v in zip(bars, share.values):
        a2.text(b.get_x() + b.get_width() / 2, v - 2.5, num(v, lang, 1, "%"), ha="center",
                va="top", fontsize=9, color="white", zorder=4)
    avg = "Moyenne" if lang == "fr" else "Average"
    a2.axhline(mean, color=TEXT, lw=0.8, ls=(0, (4, 3)), zorder=1, label=f"{avg} {num(mean, lang, 1, '%')}")
    a2.legend(loc="upper left", frameon=False, fontsize=8.5, labelcolor=MUTED)
    a2.set_xticks(range(5), [s.replace("-", " – ") for s in STOCK_LABELS])
    a2.set_ylim(0, 60)
    a2.yaxis.set_major_formatter(lambda v, _: num(v, lang, 0, "%"))
    if lang == "fr":
        a1.set_title(f"Remise selon le stock (r = {num(r, lang, 2)})")
        a1.set_xlabel("Stock (unités)")
        a1.set_ylabel("Remise")
        a2.set_title("Part d'articles remisés par tranche de stock")
        a2.set_xlabel("Stock (unités)")
        title = "Des Remises sans Lien avec le Stock"
    else:
        a1.set_title(f"Markdown by stock level (r = {num(r, lang, 2)})")
        a1.set_xlabel("Stock (units)")
        a1.set_ylabel("Markdown")
        a2.set_title("Share of discounted items by stock band")
        a2.set_xlabel("Stock (units)")
        title = "Markdowns Unrelated to Stock"
    return finish(fig, title, SOURCE[lang], lang)


# ------------------------------------------------------------ 3. where the loss sits
def chart_loss(lang):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(8, 4.5))
    fig.subplots_adjust(left=0.08, right=0.97, top=0.78, bottom=0.17, wspace=0.42)
    q = df.groupby("price_quartile", observed=True).agg(
        loss=("markdown_amount", "sum"), lo=("original_price", "min"), hi=("original_price", "max"))
    q["share"] = q["loss"] / loss_total * 100
    labels = []
    for name, row in q.iterrows():
        lo, hi = round(row["lo"]), round(row["hi"])
        labels.append(f"{name}\n{lo} – {hi} $" if lang == "fr" else f"{name}\n${lo} – {hi}")
    bars = a1.bar(range(4), q["share"], color=[SOFT, SOFT, SOFT, ACCENT], width=0.62, zorder=3)
    for b, v in zip(bars, q["share"]):
        a1.text(b.get_x() + b.get_width() / 2, v + 1, num(v, lang, 1, "%"), ha="center", fontsize=9)
    even = ("25\u00a0% : perte répartie à parts égales" if lang == "fr"
            else "25%: loss spread evenly")
    a1.axhline(25, color=TEXT, lw=0.8, ls=(0, (4, 3)), zorder=1, label=even)
    a1.legend(loc="upper left", frameon=False, fontsize=8.5, labelcolor=MUTED)
    a1.set_xticks(range(4), labels)
    a1.set_ylim(0, 50)
    a1.yaxis.set_major_formatter(lambda v, _: num(v, lang, 0, "%"))

    cat = df.groupby("category")["markdown_percentage"].mean().sort_values()
    top3 = set(cat.index[-3:])
    a2.barh(cat.index, cat.values, color=[ACCENT if c in top3 else SOFT for c in cat.index], height=0.6)
    for i, v in enumerate(cat.values):
        a2.text(v + 0.2, i, num(-v, lang, 1, "%").replace("-", "−"), va="center", fontsize=9)
    a2.set_xlim(0, 16)
    a2.set_xticks(range(0, 20, 5))
    a2.xaxis.set_major_formatter(lambda v, _: num(v, lang, 0, "%"))
    a2.tick_params(axis="y", length=0)
    if lang == "fr":
        a1.set_title("Part de la perte en remises par quartile de prix")
        a2.set_title("Remise moyenne par catégorie")
        title = "Une Perte Concentrée sur les Articles Chers"
    else:
        a1.set_title("Share of markdown loss by price quartile")
        a2.set_title("Average markdown by category")
        title = "Losses Concentrated on Expensive Items"
    return finish(fig, title, SOURCE[lang], lang)


# ------------------------------------------------------------ 4. returns
def chart_returns(lang):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(8, 4.5))
    fig.subplots_adjust(left=0.15, right=0.97, top=0.78, bottom=0.17, wspace=0.62)
    brand = df.groupby("brand")["is_returned"].mean().sort_values() * 100
    mean = df["is_returned"].mean() * 100
    a1.barh(brand.index, brand.values, height=0.6, zorder=3,
            color=[ACCENT if b in (brand.index[0], brand.index[-1]) else SOFT for b in brand.index])
    for i, v in enumerate(brand.values):
        a1.text(v - 0.4, i, num(v, lang, 1, "%"), va="center", ha="right", fontsize=9, color="white", zorder=4)
    avg = "Moyenne" if lang == "fr" else "Average"
    a1.axvline(mean, color=TEXT, lw=0.8, ls=(0, (4, 3)), zorder=1, label=f"{avg} {num(mean, lang, 1, '%')}")
    a1.legend(loc="lower right", frameon=False, fontsize=8.5, labelcolor=MUTED)
    a1.set_xlim(0, 24)
    a1.xaxis.set_major_formatter(lambda v, _: num(v, lang, 0, "%"))
    a1.tick_params(axis="y", length=0)

    reasons = df["return_reason"].value_counts().sort_values()
    a2.barh(reasons.index, reasons.values, height=0.6,
            color=[ACCENT if r in ("Changed Mind", "Size Issue") else SOFT for r in reasons.index])
    for i, v in enumerate(reasons.values):
        a2.text(v + 1, i, str(v), va="center", fontsize=9)
    a2.set_xlim(0, 80)
    a2.tick_params(axis="y", length=0)
    if lang == "fr":
        a1.set_title("Taux de retour par marque")
        a2.set_title("Motifs de retour (articles)")
        title = "Retours : Marques et Motifs"
    else:
        a1.set_title("Return rate by brand")
        a2.set_title("Return reasons (items)")
        title = "Returns: Brands and Reasons"
    a1.set_ylim(-1.3, len(brand) - 0.5)
    return finish(fig, title, SOURCE[lang], lang)


CHART_FUNCS = {"1_data_quality": chart_quality, "2_stock_markdown": chart_stock,
               "3_markdown_loss": chart_loss, "4_returns": chart_returns}

n = next_version(CHARTS, r"V(\d+)")
out = CHARTS / f"V{n}"
out.mkdir()
for name, func in CHART_FUNCS.items():
    for lang in ("fr", "en"):
        func(lang).save(out / f"{name}_{lang}.webp", "WEBP", quality=90)
print(f"Wrote {len(CHART_FUNCS) * 2} charts to charts/V{n}/")

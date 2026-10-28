"""Step 2: recompute every figure shown on the site from the cleaned data.

Reads  the latest data/clean/fashion_boutique_clean_V{n}.csv
Writes results/key_figures_V{n}.csv (metric, value, value shown on the site, match)

The `site` column is copied from portfolio-data.html (#boutique-mode): a
mismatch means the page must be checked before anything is published.

Usage: python 02_key_figures.py
"""

import pandas as pd

from fashion_common import RESULTS, latest_clean, next_version

df = pd.read_csv(latest_clean())
disc = df["is_discounted"]
ret = df["is_returned"]
loss = df["markdown_amount"].sum()
full = df["original_price"].sum()
q4 = df["price_quartile"] == "Q4"
low5 = df["stock_quantity"] <= 5
high36 = df["stock_quantity"] >= 36
low15 = df["stock_quantity"] <= 15
high40 = df["stock_quantity"] >= 40
by_cat_md = df.groupby("category")["markdown_percentage"].mean()
by_cat_ret = df.groupby("category")["is_returned"].mean()
by_brand_ret = df.groupby("brand")["is_returned"].mean()
reasons = df["return_reason"].value_counts()

rows = [  # (metric, value, value on the site)
    ("SKUs", len(df), 2176),
    ("Full-price value ($)", round(full), 211508),
    ("Markdown loss ($)", round(loss), 25461),
    ("Markdown loss / full-price value (%)", round(loss / full * 100, 1), 12.0),
    ("Discounted items", int(disc.sum()), 878),
    ("Discounted items (%)", round(disc.mean() * 100, 1), 40.3),
    ("Average markdown of discounted items (%)", round(df.loc[disc, "markdown_percentage"].mean(), 1), 30.1),
    ("Deepest markdown (%)", df["markdown_percentage"].max(), 59.9),
    ("Items with stock 0-5", int(low5.sum()), 244),
    ("Discounted among stock 0-5", int((disc & low5).sum()), 94),
    ("Discounted share, stock 0-5 (%)", round(disc[low5].mean() * 100, 1), 38.5),
    ("Items with stock 36-50", int(high36.sum()), 633),
    ("Discounted among stock 36-50", int((disc & high36).sum()), 271),
    ("Discounted share, stock 36-50 (%)", round(disc[high36].mean() * 100, 1), 42.8),
    ("Correlation stock - markdown (r)", round(df["stock_quantity"].corr(df["markdown_percentage"]), 2), 0.01),
    ("Items with stock >= 40", int(high40.sum()), 443),
    ("Full price among stock >= 40", int((~disc & high40).sum()), 252),
    ("Price threshold of the top quartile ($)", round(df["original_price"].quantile(0.75), 2), 127.63),
    ("Loss on the top price quartile ($)", round(df.loc[q4, "markdown_amount"].sum()), 10598),
    ("Share of loss, top price quartile (%)", round(df.loc[q4, "markdown_amount"].sum() / loss * 100, 1), 41.6),
    *[(f"Average markdown, {c} (%)", round(v, 1), s) for c, v, s in
      [(c, by_cat_md[c], {"Bottoms": 13.2, "Dresses": 13.2, "Shoes": 13.0, "Outerwear": 10.8}.get(c))
       for c in by_cat_md.index]],
    ("Discounted with stock <= 15", int((disc & low15).sum()), 270),
    ("Loss with stock <= 15 ($)", round(df.loc[low15, "markdown_amount"].sum()), 7966),
    ("Share of loss, stock <= 15 (%)", round(df.loc[low15, "markdown_amount"].sum() / loss * 100, 1), 31.3),
    ("Returned items", int(ret.sum()), 320),
    ("Return rate (%)", round(ret.mean() * 100, 1), 14.7),
    ("Returned value ($)", round(df.loc[ret, "current_price"].sum()), 26544),
    *[(f"Return rate, {c} (%)", round(v * 100, 1), {"Outerwear": 16.2, "Bottoms": 15.8}.get(c))
      for c, v in by_cat_ret.items()],
    *[(f"Return rate, {b} (%)", round(v * 100, 1), {"Mango": 11.3, "Ann Taylor": 19.8}.get(b))
      for b, v in by_brand_ret.items()],
    ("'Changed Mind' + 'Size Issue' / reasons (%)",
     round((reasons["Changed Mind"] + reasons["Size Issue"]) / reasons.sum() * 100), 40),
    ("Average rating (rated items)", round(df["customer_rating"].mean(), 2), 2.99),
    ("Average rating, discounted", round(df.loc[disc, "customer_rating"].mean(), 2), 2.94),
    ("Average rating, full price", round(df.loc[~disc, "customer_rating"].mean(), 2), 3.02),
    ("Return rate, discounted (%)", round(ret[disc].mean() * 100, 1), 15.3),
    ("Return rate, full price (%)", round(ret[~disc].mean() * 100, 1), 14.3),
]

out = pd.DataFrame(rows, columns=["metric", "value", "site"])
out["match"] = out.apply(lambda r: "" if pd.isna(r["site"]) else
                         ("yes" if float(r["value"]) == float(r["site"]) else "NO"), axis=1)

n = next_version(RESULTS, r"key_figures_V(\d+)\.csv")
path = RESULTS / f"key_figures_V{n}.csv"
out.to_csv(path, index=False)

shown = out[out["match"] != ""]
bad = shown[shown["match"] == "NO"]
print(f"Wrote results/{path.name}: {len(shown) - len(bad)} of {len(shown)} site figures reproduced.")
if len(bad):
    print(bad.to_string(index=False))

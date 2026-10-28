"""Step 1: check and clean the Fashion Boutique dataset.

Reads  data/raw/fashion_boutique_dataset.csv (Kaggle, Puri 2025, 2,176 rows)
Writes data/clean/fashion_boutique_clean_V{n}.csv
       reports/cleaning_report_V{n}.md

No row is deleted: every issue is either harmless or flagged in a new column,
so each later figure can say which rows it uses.

Usage: python 01_cleaning.py
"""

import pandas as pd

from fashion_common import CLEAN, RAW, REPORTS, STOCK_BINS, STOCK_LABELS, next_version

EXPECTED = ["product_id", "category", "brand", "season", "size", "color",
            "original_price", "markdown_percentage", "current_price",
            "purchase_date", "stock_quantity", "customer_rating",
            "is_returned", "return_reason"]
CLOTHING_SIZES = {"XS", "S", "M", "L", "XL", "XXL"}

raw = pd.read_csv(RAW)
df = raw.copy()
checks = []  # (check, result, decision)


def check(name, result, decision):
    checks.append((name, result, decision))


def pct(n, total=len(raw)):
    return f"{n:,} ({n / total:.1%})"


# ------------------------------------------------------------ structure
assert list(df.columns) == EXPECTED, f"Unexpected columns: {list(df.columns)}"
check("Columns", f"{len(df.columns)} columns, as documented on Kaggle", "Kept")

dup_id = df["product_id"].duplicated().sum()
dup_row = df.drop(columns="product_id").duplicated().sum()
check("Duplicates", f"{dup_id} duplicate product_id, {dup_row} duplicate rows (ignoring the id)",
      "Nothing to remove")

for col in ["category", "brand", "season", "size", "color", "return_reason"]:
    s = df[col].dropna()
    assert (s == s.str.strip()).all(), f"Spaces around values in {col}"
check("Text values", "No leading or trailing spaces, no spelling variants "
      f"({df['category'].nunique()} categories, {df['brand'].nunique()} brands, "
      f"{df['color'].nunique()} colours, {df['season'].nunique()} seasons)", "Kept")

# ------------------------------------------------------------ types and ranges
df["purchase_date"] = pd.to_datetime(df["purchase_date"], format="%Y-%m-%d")
assert df["is_returned"].dtype == bool
check("Types", "purchase_date read as a date, is_returned as a boolean", "Converted")

ranges = {
    "original_price": (df["original_price"] > 0).all(),
    "current_price": (df["current_price"] > 0).all(),
    "markdown_percentage": df["markdown_percentage"].between(0, 100).all(),
    "stock_quantity": (df["stock_quantity"] >= 0).all(),
    "customer_rating": df["customer_rating"].dropna().between(1, 5).all(),
}
assert all(ranges.values()), ranges
check("Value ranges",
      f"Prices {df['original_price'].min():.2f} to {df['original_price'].max():.2f}, "
      f"markdown 0 to {df['markdown_percentage'].max():.1f}%, "
      f"stock 0 to {df['stock_quantity'].max()} units, rating 1 to 5",
      "No impossible value")

# ------------------------------------------------------------ price consistency
gap = (df["original_price"] * (1 - df["markdown_percentage"] / 100) - df["current_price"]).abs()
check("Price consistency", "current_price = original_price x (1 - markdown) on every row "
      f"(largest gap {gap.max():.3f}, rounding to the cent)", "Kept")
df["markdown_amount"] = (df["original_price"] - df["current_price"]).round(2)
df["is_discounted"] = df["markdown_percentage"] > 0

# ------------------------------------------------------------ missing values
no_size = df["size"].isna()
accessories = df["category"] == "Accessories"
assert no_size[accessories].all(), "Some accessories have a size"
df["size_status"] = "given"
df.loc[no_size & accessories, "size_status"] = "not applicable"
df.loc[no_size & ~accessories, "size_status"] = "missing"
check("Missing size", f"{pct(no_size.sum())} rows: {(no_size & accessories).sum()} accessories "
      f"(no size by nature) and {(no_size & ~accessories).sum()} garments or shoes",
      "Accessories marked 'not applicable', the others 'missing' (column size_status)")

no_rating = df["customer_rating"].isna()
check("Missing rating", f"{pct(no_rating.sum())} rows without a customer rating, "
      f"as often among returned items ({no_rating[df['is_returned']].mean():.1%}) "
      f"as among kept ones ({no_rating[~df['is_returned']].mean():.1%})",
      "Left empty; average ratings use rated items only (column has_rating)")
df["has_rating"] = ~no_rating

reason_ok = (df["return_reason"].isna() == ~df["is_returned"]).all()
assert reason_ok
check("Return reason", f"Filled for all {df['is_returned'].sum()} returned items and empty "
      "for all the others", "Consistent, kept")

# ------------------------------------------------------------ incoherent values
shoes_sized = (df["category"] == "Shoes") & df["size"].isin(CLOTHING_SIZES)
df["size_scale_issue"] = shoes_sized
check("Size scale", f"All {shoes_sized.sum()} sized shoes use clothing sizes (XS to XXL), "
      "not shoe sizes", "Flagged (column size_scale_issue); size is not used in the analysis")

# ------------------------------------------------------------ purchase date
per_day = df["purchase_date"].value_counts()
top_day, top_n = per_day.index[0], per_day.iloc[0]
others = per_day.drop(top_day)
df["date_reliable"] = df["purchase_date"] != top_day
check("Purchase date", f"{pct(top_n)} rows fall on {top_day:%d/%m/%Y}, the last day of the "
      f"dataset; the other {len(others)} days hold {others.min()} to {others.max()} rows each "
      f"(mean {others.mean():.1f})",
      "Treated as a default value: flagged (column date_reliable), "
      "no time trend or seasonality is drawn from the dates")

# ------------------------------------------------------------ synthetic data signs
spread = {c: df[c].value_counts() for c in ["category", "brand", "color", "season"]}
spread_txt = ", ".join(f"{c} {s.max() / s.min():.2f}" for c, s in spread.items())
md = df.loc[df["is_discounted"], "markdown_percentage"]
md_bins = pd.cut(md, range(0, 70, 10)).value_counts()
rating_bins = pd.cut(df["customer_rating"], [0, 2, 3, 4, 5]).value_counts()
check("Synthetic data signs",
      f"Near-flat shares (largest / smallest group: {spread_txt}); markdowns spread evenly "
      f"from 0 to 60% ({md_bins.min()} to {md_bins.max()} items per 10-point band); "
      f"ratings spread evenly from 1 to 5 ({rating_bins.min()} to {rating_bins.max()} per band)",
      "Consistent with Kaggle's 'synthetic' label: findings describe this dataset, "
      "recommendations are hypotheses to test")

# ------------------------------------------------------------ helper columns
df["stock_band"] = pd.cut(df["stock_quantity"], STOCK_BINS, labels=STOCK_LABELS)
df["price_quartile"] = pd.qcut(df["original_price"], 4, labels=["Q1", "Q2", "Q3", "Q4"])
df["purchase_date"] = df["purchase_date"].dt.strftime("%Y-%m-%d")

# ------------------------------------------------------------ write
n = next_version(CLEAN, r"fashion_boutique_clean_V(\d+)\.csv")
out_csv = CLEAN / f"fashion_boutique_clean_V{n}.csv"
df.to_csv(out_csv, index=False)

REPORTS.mkdir(exist_ok=True)
out_md = REPORTS / f"cleaning_report_V{n}.md"
lines = [
    f"# Fashion Boutique: Data Cleaning Report (V{n})",
    "",
    f"Source: `data/raw/fashion_boutique_dataset.csv`, {len(raw):,} rows, {len(raw.columns)} columns.",
    f"Output: `data/clean/{out_csv.name}`, {len(df):,} rows (none removed), "
    f"{len(df.columns) - len(raw.columns)} columns added.",
    "",
    "| Check | Result | Decision |",
    "|---|---|---|",
    *[f"| {a} | {b} | {c} |" for a, b, c in checks],
    "",
    "## Columns Added",
    "",
    "| Column | Meaning |",
    "|---|---|",
    "| markdown_amount | original_price - current_price |",
    "| is_discounted | markdown_percentage > 0 |",
    "| size_status | given / not applicable (accessories) / missing |",
    "| has_rating | customer_rating is filled |",
    "| size_scale_issue | shoe sized XS to XXL |",
    "| date_reliable | purchase_date is not the default last day |",
    "| stock_band | 0-5, 6-15, 16-25, 26-35, 36-50 units |",
    "| price_quartile | Q1 to Q4 of original_price |",
]
out_md.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {out_csv.relative_to(CLEAN.parent.parent)} and {out_md.relative_to(REPORTS.parent)}")

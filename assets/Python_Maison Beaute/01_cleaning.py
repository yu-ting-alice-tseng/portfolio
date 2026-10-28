"""Step 1: check and clean the Customer Personality Analysis dataset.

Reads  data/raw/marketing_campaign.csv (Kaggle, Patel 2021, 2,240 rows, tab-separated)
Writes data/clean/maison_beaute_clean_V{n}.csv
       reports/cleaning_report_V{n}.md

Duplicated customers are removed (same answers on every column, only the ID
differs). Every other issue is fixed or flagged in a new column, so each later
figure can say which rows it uses.

Usage: python 01_cleaning.py
"""

import numpy as np
import pandas as pd

from beaute_common import CAMPAIGNS, CHANNELS, CLEAN, RAW, REF_YEAR, REPORTS, next_version

raw = pd.read_csv(RAW, sep="\t")
checks = []  # (check, result, decision)


def check(name, result, decision):
    checks.append((name, result, decision))


def pct(n, total):
    return f"{n:,} ({n / total:.1%})"


# ------------------------------------------------------------ duplicates
assert not raw["ID"].duplicated().any()
same = [c for c in raw.columns if c != "ID"]
dup = raw.duplicated(subset=same, keep="first")
groups = raw[raw.duplicated(subset=same, keep=False)].groupby(same, dropna=False).ngroups
df = raw[~dup].copy()
check("Duplicates", f"No duplicate ID, but {pct(dup.sum(), len(raw))} rows repeat another customer "
      f"on all {len(same)} other columns ({groups} customers entered twice or more)",
      f"Removed, first occurrence kept: {len(df):,} customers")

# ------------------------------------------------------------ constant columns
constant = [c for c in df.columns if df[c].nunique(dropna=False) == 1]
df = df.drop(columns=constant)
check("Constant columns", f"{', '.join(constant)} hold one value on every row and are not documented",
      "Dropped: undocumented constants cannot be read as a campaign cost")

# ------------------------------------------------------------ types
df["Dt_Customer"] = pd.to_datetime(df["Dt_Customer"], format="%d-%m-%Y")
check("Dates", f"Dt_Customer read as a date: enrolment from {df['Dt_Customer'].min():%m/%Y} "
      f"to {df['Dt_Customer'].max():%m/%Y}", f"Ages computed at {REF_YEAR}")

# ------------------------------------------------------------ income
missing = df["Income"].isna()
median = df["Income"].median()
df["income_imputed"] = missing
df["Income"] = df["Income"].fillna(median)
top = df["Income"].nlargest(2)
df["income_outlier"] = df["Income"] > 200_000
check("Missing income", f"{missing.sum()} customers without income",
      f"Filled with the median ({median:,.0f}) rather than the mean, which the extreme "
      "value below pulls up (column income_imputed)")
check("Extreme income", f"One customer declares {top.iloc[0]:,.0f}, four times the next "
      f"highest ({top.iloc[1]:,.0f})",
      "Kept for spend and campaigns, excluded from income statistics (column income_outlier)")

# ------------------------------------------------------------ birth year
old = df["Year_Birth"] < 1920
df["birth_outlier"] = old
df["Age"] = (REF_YEAR - df["Year_Birth"]).where(~old)
check("Birth year", f"{old.sum()} customers born in {', '.join(map(str, sorted(df.loc[old, 'Year_Birth'])))} "
      f"(over {REF_YEAR - 1900} years old in {REF_YEAR})",
      "Age left empty for them, excluded from age statistics (column birth_outlier)")

# ------------------------------------------------------------ categories
odd = {"Alone": "Single", "Absurd": "Unknown", "YOLO": "Unknown"}
n_odd = df["Marital_Status"].isin(odd).sum()
df["Marital_Status"] = df["Marital_Status"].replace(odd)
check("Marital status", f"{n_odd} answers outside the expected list (Alone, Absurd, YOLO)",
      "Alone grouped with Single, Absurd and YOLO marked Unknown")

# ------------------------------------------------------------ ranges
spend = [c for c in df.columns if c.startswith("Mnt")]
counts = [c for c in df.columns if c.startswith("Num")]
assert (df[spend + counts] >= 0).all().all()
assert df[CAMPAIGNS + ["Complain"]].isin([0, 1]).all().all()
check("Value ranges", "No negative spend or count, campaign answers all 0 or 1", "Kept")

# ------------------------------------------------------------ derived columns
df["premium_spend"] = df["MntWines"] + df["MntGoldProds"]
df["accepted_campaigns"] = df[CAMPAIGNS].sum(axis=1)
df["engagement_tier"] = pd.cut(df["accepted_campaigns"], [-1, 0, 1, 6], labels=["0", "1", "2+"])

valid = ~df["income_outlier"]
df["income_band"] = pd.Series(pd.NA, index=df.index, dtype="object")
df.loc[valid, "income_band"] = pd.qcut(df.loc[valid, "Income"], 4, labels=["T1", "T2", "T3", "T4"]).astype(str)

store, web, cat = (df[c] for c in CHANNELS)
total = store + web + cat
no_purchase = total == 0
share_store = store / total.where(total > 0)
df["channel_profile"] = np.select(
    [no_purchase, share_store >= 0.6, (1 - share_store) >= 0.6],
    ["No purchase", "Counter-First", "Digital-First"], "True Omni-Channel")
check("Purchases", f"{no_purchase.sum()} customers have no purchase in any channel",
      "Channel profile 'No purchase' (not counted in the three profiles)")

# ------------------------------------------------------------ write
n = next_version(CLEAN, r"maison_beaute_clean_V(\d+)\.csv")
out_csv = CLEAN / f"maison_beaute_clean_V{n}.csv"
df.assign(Dt_Customer=df["Dt_Customer"].dt.strftime("%Y-%m-%d")).to_csv(out_csv, index=False)

REPORTS.mkdir(exist_ok=True)
out_md = REPORTS / f"cleaning_report_V{n}.md"
lines = [
    f"# Maison Beauté: Data Cleaning Report (V{n})",
    "",
    f"Source: `data/raw/marketing_campaign.csv`, {len(raw):,} rows, {len(raw.columns)} columns.",
    f"Output: `data/clean/{out_csv.name}`, {len(df):,} customers, {len(df.columns)} columns.",
    "",
    "| Check | Result | Decision |",
    "|---|---|---|",
    *[f"| {a} | {b} | {c} |" for a, b, c in checks],
    "",
    "## Columns Added",
    "",
    "| Column | Meaning |",
    "|---|---|",
    "| income_imputed, income_outlier, birth_outlier | Flags described above |",
    f"| Age | {REF_YEAR} - Year_Birth (empty for the 3 implausible years) |",
    "| premium_spend | MntWines + MntGoldProds (the case's premium lines) |",
    "| accepted_campaigns, engagement_tier | Campaigns accepted out of 6 (5 previous + Response); 0, 1, 2+ |",
    "| income_band | Income quartile T1 to T4 (outlier excluded) |",
    "| channel_profile | Counter-First (store >= 60% of purchases), Digital-First (web + catalogue >= 60%), True Omni-Channel otherwise |",
]
out_md.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote data/clean/{out_csv.name} ({len(df):,} rows) and reports/{out_md.name}")

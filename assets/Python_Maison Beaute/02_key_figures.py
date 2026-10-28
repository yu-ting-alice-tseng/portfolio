"""Step 2: recompute every figure of the case study, before and after cleaning.

Reads  data/raw/marketing_campaign.csv and the latest data/clean/maison_beaute_clean_V{n}.csv
Writes results/key_figures_V{n}.csv

Columns:
  page_method  the method behind the figures first published (raw file, all
               2,240 rows, missing incomes filled with the mean)
  clean        same figure on the cleaned file (duplicates removed, median
               imputation, extreme income and implausible birth years excluded
               from income and age statistics)
  site         value shown on portfolio-marketing.html (#maison-beaute)
  match        page_method == site (proves the original figures are reproduced)

Usage: python 02_key_figures.py
"""

import numpy as np
import pandas as pd

from beaute_common import CAMPAIGNS, CHANNELS, RAW, REF_YEAR, RESULTS, latest_clean, next_version


def figures(df, income_ok, age_ok):
    """All figures of the study, as a dict, for one version of the data."""
    f = {}
    prem = df["MntWines"] + df["MntGoldProds"]
    inc = df.loc[income_ok, "Income"]
    band = pd.qcut(inc, 4, labels=["T1", "T2", "T3", "T4"])
    by_band = prem[income_ok].groupby(band, observed=True).mean()
    r = inc.corr(prem[income_ok])
    f["Customers"] = len(df)
    f["Income - premium spend (r)"] = round(r, 2)
    f["Share of variance explained (R2)"] = round(r ** 2, 2)
    f["Premium spend, T1 ($)"] = round(by_band["T1"])
    f["Premium spend, T4 ($)"] = round(by_band["T4"])
    f["T4 / T1 (x)"] = round(by_band["T4"] / by_band["T1"])
    n = df[CAMPAIGNS].sum(axis=1)
    f["Premium spend, 2+ campaigns ($)"] = round(prem[n >= 2].mean())
    f["Premium spend, 0 campaign ($)"] = round(prem[n == 0].mean())
    f["2+ / 0 (x)"] = round(prem[n >= 2].mean() / prem[n == 0].mean())
    for c in CAMPAIGNS:
        f[f"Acceptance, {c} (%)"] = round(df[c].mean() * 100, 1)
    s = df[CHANNELS].sum()
    f["Store purchases"] = int(s["NumStorePurchases"])
    for c in CHANNELS:
        f[f"Share of purchases, {c} (%)"] = round(s[c] / s.sum() * 100, 1)
    f["Web visits - web purchases (r)"] = round(df["NumWebVisitsMonth"].corr(df["NumWebPurchases"]), 2)
    store, web, cat = (df[c] for c in CHANNELS)
    total = store + web + cat
    share = store / total.where(total > 0)
    prof = np.select([total == 0, share >= 0.6, (1 - share) >= 0.6],
                     ["none", "Counter-First", "Digital-First"], "True Omni-Channel")
    for p in ["True Omni-Channel", "Counter-First", "Digital-First"]:
        f[f"Profile {p} (%)"] = round((prof == p).mean() * 100, 1)
    resp = df["Response"] == 1
    f["Responders, mean income ($)"] = round(df.loc[resp & income_ok, "Income"].mean())
    f["Responders, mean age"] = round((REF_YEAR - df.loc[resp & age_ok, "Year_Birth"]).mean(), 1)
    f["Responders, premium spend ($)"] = round(prem[resp].mean())
    rb = band[resp[income_ok]]
    f["Responders in T4 (%)"] = round((rb == "T4").mean() * 100, 1)
    f["Responders in T3 (%)"] = round((rb == "T3").mean() * 100, 1)
    return f


raw = pd.read_csv(RAW, sep="\t")
page = raw.assign(Income=raw["Income"].fillna(raw["Income"].mean()))
everyone = pd.Series(True, index=page.index)
before = figures(page, everyone, everyone)

clean = pd.read_csv(latest_clean())
after = figures(clean, ~clean["income_outlier"], ~clean["birth_outlier"])

site = {
    "Customers": 2240, "Income - premium spend (r)": 0.59, "Share of variance explained (R2)": 0.34,
    "Premium spend, T1 ($)": 39, "Premium spend, T4 ($)": 708, "T4 / T1 (x)": 18,
    "Premium spend, 2+ campaigns ($)": 775, "Premium spend, 0 campaign ($)": 255, "2+ / 0 (x)": 3,
    "Acceptance, AcceptedCmp2 (%)": 1.3, "Acceptance, AcceptedCmp4 (%)": 7.5, "Acceptance, Response (%)": 14.9,
    "Store purchases": 12970, "Share of purchases, NumStorePurchases (%)": 46.2,
    "Share of purchases, NumWebPurchases (%)": 32.6, "Share of purchases, NumCatalogPurchases (%)": 21.2,
    "Web visits - web purchases (r)": -0.06, "Profile True Omni-Channel (%)": 47.2,
    "Profile Counter-First (%)": 27.6, "Profile Digital-First (%)": 25.0,
    "Responders, mean income ($)": 60186, "Responders, mean age": None,  # shown as "~45"
    "Responders, premium spend ($)": 564,
}

out = pd.DataFrame({"metric": list(before), "page_method": list(before.values()),
                    "clean": [after[k] for k in before], "site": [site.get(k) for k in before]})


def match(r):
    if pd.isna(r["site"]):
        return ""
    return "yes" if float(r["page_method"]) == float(r["site"]) else "NO"


out["match"] = out.apply(match, axis=1)
n = next_version(RESULTS, r"key_figures_V(\d+)\.csv")
path = RESULTS / f"key_figures_V{n}.csv"
out.to_csv(path, index=False)

shown = out[out["match"] != ""]
print(f"Wrote results/{path.name}: {(shown['match'] == 'yes').sum()} of {len(shown)} site figures "
      "reproduced with the original method.")
print(out.to_string(index=False))

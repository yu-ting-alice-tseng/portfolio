# Maison Beauté: Customer Personality and Campaign Performance (Python)

Personal project on a public dataset. 2,240 customer records, checked and cleaned with pandas, then analysed and charted with matplotlib. "Maison Beauté" is a fictional fragrance and skincare brand used as the frame of the case; "premium spend" is wines + gold products in the original data.

**Data source:** Kaggle, "Customer Personality Analysis" (Patel, 2021).
**Stack:** Python (pandas, numpy, matplotlib).

## Run

```
pip install -r requirements.txt
python 01_cleaning.py      # checks + cleaned file + cleaning report
python 02_key_figures.py   # every figure of the study, original method vs cleaned data
python 03_charts.py        # charts in French and English
```

Every run writes the next version number (`_V1`, `_V2`...) and never overwrites an earlier file.

## Files

| Path | Content |
|---|---|
| `data/raw/marketing_campaign.csv` | Kaggle file, untouched (tab-separated) |
| `data/clean/maison_beaute_clean_V{n}.csv` | 2,058 customers after removing duplicates, with flags and derived columns |
| `reports/cleaning_report_V{n}.md` | Every check, its result and the decision taken |
| `results/key_figures_V{n}.csv` | Each figure with the original method, on the cleaned data, and as shown on the site |
| `charts/V{n}/` | 4 charts x 2 languages, WEBP 1600 x 900; beauty palette (porcelain paper, plum, rose, rose gold, lavender) |
| `fonts/` | Playfair Display for titles, Outfit for text (SIL Open Font License) |

## Data and Cleaning

| Check | Result | Decision |
|---|---|---|
| Duplicates | 182 rows (8.1%) repeat another customer on every column but the ID | Removed: 2,058 customers |
| Missing income | 24 customers | Median (51,533) instead of the mean |
| Extreme income | One customer at 666,666, four times the next highest | Excluded from income statistics |
| Birth year | 1893, 1899, 1900 | Excluded from age statistics |
| Marital status | Alone, Absurd, YOLO (7 answers) | Grouped with Single or marked Unknown |
| Constant columns | Z_CostContact, Z_Revenue | Dropped |
| No purchase | 6 customers | Not counted in the channel profiles |

## What Cleaning Changes

The 22 figures first published are all reproduced with the original method (raw file, mean imputation). On the cleaned data, most move by less than one point; one changes the reading:

| Figure | Original method | Cleaned |
|---|---|---|
| Income - premium spend correlation | r = 0.59 (R² 0.34) | **r = 0.69 (R² 0.47)**: the single extreme income pulled it down |
| Response takers in the top income quartile | not reported | **44%**, against 18% in T3 |
| Customers | 2,240 | 2,058 |

Full list in `results/key_figures_V1.csv`.

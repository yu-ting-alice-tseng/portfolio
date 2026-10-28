# Fashion Boutique: Markdowns, Stock and Returns (Python)

Personal project on a public dataset. 2,176 items from a multi-brand fashion boutique, checked and cleaned with pandas, then analysed and charted with matplotlib to answer one business question: are markdowns granted where stock needs to move, and what do returns reveal?

**Data source:** Kaggle, "Retail Fashion Boutique Data Sales Analytics 2025" (Puri, 2025), synthetic data.
**Stack:** Python (pandas, matplotlib).

---

## Run

```
pip install -r requirements.txt
python 01_cleaning.py      # checks + cleaned file + cleaning report
python 02_key_figures.py   # recomputes every figure shown on the site
python 03_charts.py        # charts in French and English
```

Every run writes the next version number (`_V1`, `_V2`...) and never overwrites an earlier file.

## Files

| Path | Content |
|---|---|
| `data/raw/fashion_boutique_dataset.csv` | Kaggle file, untouched |
| `data/clean/fashion_boutique_clean_V{n}.csv` | Same 2,176 rows, 8 columns added |
| `reports/cleaning_report_V{n}.md` | Every check, its result and the decision taken |
| `results/key_figures_V{n}.csv` | Figures recomputed from the clean file, next to the value shown on the site |
| `charts/V{n}/` | 4 charts x 2 languages, WEBP 1600 x 900; boutique palette (ivory paper, one fabric colour per chart: burgundy, navy, blush, camel, sage) |
| `fonts/` | Bodoni Moda for titles, Outfit for text (SIL Open Font License) |

## Data and Cleaning

No row is deleted: each issue is harmless or flagged in a new column. Full detail in `reports/cleaning_report_V1.md`.

| Check | Result | Decision |
|---|---|---|
| Duplicates, spelling, ranges, prices | None found; `current_price` matches `original_price x (1 - markdown)` on every row | Kept |
| Missing size | 491 rows: 402 accessories (no size by nature), 89 garments or shoes | `size_status` |
| Missing rating | 362 rows (16.6%), same share among returned and kept items | Left empty, averages on rated items |
| Size scale | All 350 sized shoes use XS to XXL | `size_scale_issue`, size not analysed |
| Purchase date | 1,641 rows (75.4%) on 06/08/2025, the last day; other days hold 1 to 6 rows | `date_reliable`, no time trend drawn |
| Synthetic signs | Flat shares by category, brand, colour, season; markdowns and ratings spread evenly | Findings describe the dataset, recommendations are hypotheses |

## Key Findings

| Question | Answer |
|---|---|
| Are markdowns linked to stock? | No: 38.5% of items with 0 to 5 units are discounted vs 42.8% at 36 to 50 units (r = 0.01). |
| Where does the loss sit? | $25,461 lost to markdowns (12.0% of $211,508); the top price quartile carries 41.6%. |
| What do returns show? | 320 items returned (14.7%), $26,544 of value; Ann Taylor 19.8% vs Mango 11.3%; "Changed Mind" and "Size Issue" are 40% of reasons. |

## Limits

Synthetic data with no sales or sell-through: there is no way to tell whether a markdown made an item sell faster. $26,544 is the value of returned items, not a logistics cost.

# Fashion Boutique: Data Cleaning Report (V1)

Source: `data/raw/fashion_boutique_dataset.csv`, 2,176 rows, 14 columns.
Output: `data/clean/fashion_boutique_clean_V1.csv`, 2,176 rows (none removed), 8 columns added.

| Check | Result | Decision |
|---|---|---|
| Columns | 14 columns, as documented on Kaggle | Kept |
| Duplicates | 0 duplicate product_id, 0 duplicate rows (ignoring the id) | Nothing to remove |
| Text values | No leading or trailing spaces, no spelling variants (6 categories, 8 brands, 11 colours, 4 seasons) | Kept |
| Types | purchase_date read as a date, is_returned as a boolean | Converted |
| Value ranges | Prices 15.14 to 249.98, markdown 0 to 59.9%, stock 0 to 50 units, rating 1 to 5 | No impossible value |
| Price consistency | current_price = original_price x (1 - markdown) on every row (largest gap 0.005, rounding to the cent) | Kept |
| Missing size | 491 (22.6%) rows: 402 accessories (no size by nature) and 89 garments or shoes | Accessories marked 'not applicable', the others 'missing' (column size_status) |
| Missing rating | 362 (16.6%) rows without a customer rating, as often among returned items (16.2%) as among kept ones (16.7%) | Left empty; average ratings use rated items only (column has_rating) |
| Return reason | Filled for all 320 returned items and empty for all the others | Consistent, kept |
| Size scale | All 350 sized shoes use clothing sizes (XS to XXL), not shoe sizes | Flagged (column size_scale_issue); size is not used in the analysis |
| Purchase date | 1,641 (75.4%) rows fall on 06/08/2025, the last day of the dataset; the other 272 days hold 1 to 6 rows each (mean 2.0) | Treated as a default value: flagged (column date_reliable), no time trend or seasonality is drawn from the dates |
| Synthetic data signs | Near-flat shares (largest / smallest group: category 1.27, brand 1.28, color 1.26, season 1.10); markdowns spread evenly from 0 to 60% (133 to 156 items per 10-point band); ratings spread evenly from 1 to 5 (427 to 482 per band) | Consistent with Kaggle's 'synthetic' label: findings describe this dataset, recommendations are hypotheses to test |

## Columns Added

| Column | Meaning |
|---|---|
| markdown_amount | original_price - current_price |
| is_discounted | markdown_percentage > 0 |
| size_status | given / not applicable (accessories) / missing |
| has_rating | customer_rating is filled |
| size_scale_issue | shoe sized XS to XXL |
| date_reliable | purchase_date is not the default last day |
| stock_band | 0-5, 6-15, 16-25, 26-35, 36-50 units |
| price_quartile | Q1 to Q4 of original_price |

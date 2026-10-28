# Maison Beauté: Data Cleaning Report (V1)

Source: `data/raw/marketing_campaign.csv`, 2,240 rows, 29 columns.
Output: `data/clean/maison_beaute_clean_V1.csv`, 2,058 customers, 36 columns.

| Check | Result | Decision |
|---|---|---|
| Duplicates | No duplicate ID, but 182 (8.1%) rows repeat another customer on all 28 other columns (176 customers entered twice or more) | Removed, first occurrence kept: 2,058 customers |
| Constant columns | Z_CostContact, Z_Revenue hold one value on every row and are not documented | Dropped: undocumented constants cannot be read as a campaign cost |
| Dates | Dt_Customer read as a date: enrolment from 07/2012 to 06/2014 | Ages computed at 2014 |
| Missing income | 24 customers without income | Filled with the median (51,533) rather than the mean, which the extreme value below pulls up (column income_imputed) |
| Extreme income | One customer declares 666,666, four times the next highest (162,397) | Kept for spend and campaigns, excluded from income statistics (column income_outlier) |
| Birth year | 3 customers born in 1893, 1899, 1900 (over 114 years old in 2014) | Age left empty for them, excluded from age statistics (column birth_outlier) |
| Marital status | 7 answers outside the expected list (Alone, Absurd, YOLO) | Alone grouped with Single, Absurd and YOLO marked Unknown |
| Value ranges | No negative spend or count, campaign answers all 0 or 1 | Kept |
| Purchases | 6 customers have no purchase in any channel | Channel profile 'No purchase' (not counted in the three profiles) |

## Columns Added

| Column | Meaning |
|---|---|
| income_imputed, income_outlier, birth_outlier | Flags described above |
| Age | 2014 - Year_Birth (empty for the 3 implausible years) |
| premium_spend | MntWines + MntGoldProds (the case's premium lines) |
| accepted_campaigns, engagement_tier | Campaigns accepted out of 6 (5 previous + Response); 0, 1, 2+ |
| income_band | Income quartile T1 to T4 (outlier excluded) |
| channel_profile | Counter-First (store >= 60% of purchases), Digital-First (web + catalogue >= 60%), True Omni-Channel otherwise |

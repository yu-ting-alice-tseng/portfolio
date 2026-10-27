# Beauty E-commerce: Funnel, Cart Abandonment and Retention (SQL, BigQuery)

Personal project on a public dataset. Five months of behaviour data from an online cosmetics shop, analysed in SQL on Google BigQuery to answer five business questions a beauty brand's e-commerce or CRM team would ask.

**Data source:** Kaggle, "eCommerce Events History in Cosmetics Shop" (10/2019 to 02/2020).
**Stack:** Google BigQuery (SQL), Tableau Public (charts).

---

## Key Findings

| Question | Answer |
|---|---|
| Q1. Where does the funnel leak? | Only **1.67%** of visits go view, cart, purchase in one session, and only **46%** of orders follow that path: most purchases span several visits. |
| Q1. Which brands? | 46 high-traffic "leak" brands hold **43%** of brand traffic but convert at **1.53%** vs **2.40%** for the leaders. |
| Q2. Cart abandonment | **87%** of carts are not bought in the same visit, at every price level. **15.6%** of abandoned items are bought later, half of them within **1 day**. |
| Q3. Retention | About **9%** of new customers buy again the next month. |
| Q4. Peak days | 6 of the 10 best days fall between 21/11 and 29/11/2019. Peak days bring **+32%** traffic and **+1.6 pts** conversion. |
| Q5. First purchase | Customers whose first basket has 5+ items are **2.1x** more likely to come back within 60 days (25.4% vs 11.9%). |

---

## Data and Cleaning

| Step | Rows |
|---|---|
| Raw events | 20,692,840 |
| After removing exact duplicates | 19,583,742 (1,109,098 duplicates, 5.4%) |
| After removing price <= 0 and missing session | 19,493,208 |
| Orders | 155,617 |
| Users | 1,637,770 |

**Data quality notes**
- `brand` is missing for **42.3%** of rows. The gap is even across event types (41% to 43%), so comparisons between known brands are not biased by funnel stage. Brand results cover about 57% of purchases.
- `category_code` is missing for **98.3%** of rows: no category analysis is possible.
- **10,435** sessions have more than 100 events (max 4,319), likely bots. They are kept; their weight on session counts is small.
- Cart events are very frequent (66% of view volume in 10/2019), which suggests carts can be filled without opening the product page.

**Assumptions**
- The data has no order id: one session with at least one purchase = one order.
- Times are UTC. The shop's country is not stated, so peak days are found in the data, not assumed.
- Revenue = sum of purchase event prices. The currency is not stated in the dataset.
- October cohorts include customers who bought before 10/2019 (data starts that month), so October retention is overstated.

---

## Q1. Conversion Funnel

| Funnel | View sessions | Cart | Purchase | View to cart | Cart to purchase | View to purchase |
|---|---|---|---|---|---|---|
| Loose (step happens at all) | 4,265,922 | 983,953 | 155,617 | 23.07% | 15.82% | 3.65% |
| **Strict** (in time order, same session) | 4,265,922 | 587,282 | 71,381 | 13.77% | 12.15% | **1.67%** |

- 20% of cart sessions and 25% of purchase sessions have no product view: steps often happen in an earlier visit.
- Strict conversion peaks in 11/2019 (1.86%) and falls each month to 1.51% in 02/2020.
- 10/2019 behaves differently (cart rate 18.5%, cart to purchase 9.1%) and is treated as a data artefact, not a trend.

**Brand matrix** (180 brands with 1,000+ view sessions, split at the median brand on traffic and conversion)

| Quadrant | Brands | Share of brand traffic | Conversion | Share of brand revenue |
|---|---|---|---|---|
| Stars (high traffic, high conversion) | 44 | 50.8% | 2.40% | 51.9% |
| Hidden gems (low traffic, high conversion) | 46 | 2.8% | 2.66% | 2.8% |
| Leaks (high traffic, low conversion) | 46 | 43.3% | 1.53% | 43.3% |
| Long tail | 44 | 3.0% | 1.11% | 2.0% |

Medians: 5,145.5 view sessions and 1.886% conversion (exact medians, so the split is the same on every run).

- Largest leaks: masura (178k view sessions, 1.66%), kapous (144k, 1.41%), jessnail (122k, 1.15%).
- grattol (222k view sessions, 1.884%) sits exactly on the median line: its "leak" label is a boundary case, not a finding.
- Sizing: if leak brands converted like stars, purchase sessions on those brands would go from 23,934 to about 37,400 (+56%). This is a what-if, not a forecast.
- Some leaks are high-price brands (strong: 287 purchases, 151,942 in revenue), where low conversion is expected. They should be compared within their price tier.
- Hidden gems convert well but get little traffic. Their rate may partly reflect intent-driven visitors, so more exposure should be tested (A/B test) before scaling.

## Q2. Cart Abandonment

- **86.9%** of carted items (4.18M) and **87.2%** of cart sessions end without a purchase in the same visit.
- Abandonment is flat across price bands (85.2% to 88.1%): price is not the main driver.
- **650,640** abandoned items (15.6%) are bought later by the same customer: median delay **1 day**, **53%** within 24 hours, **80%** within 7 days.

## Q3. Cohort Retention

| First purchase month | M+1 | M+2 | M+3 | M+4 |
|---|---|---|---|---|
| 10/2019 (overstated, see assumptions) | 17.8% | 12.3% | 12.6% | 10.0% |
| 11/2019 | 9.5% | 9.8% | 7.6% | |
| 12/2019 | 8.4% | 6.3% | | |
| 01/2020 | 8.7% | | | |

## Q4. Peak Days

| | Days | Avg sessions per day | Conversion | Avg order value |
|---|---|---|---|---|
| Top 10 revenue days | 10 | 39,275 | 4.88% | 43.78 |
| Other days | 142 | 29,710 | 3.27% | 39.93 |

- 6 of the top 10 days fall between 21/11 and 29/11/2019 and 2 more on 07 - 08/11; the best day is Friday 22/11/2019 (102,854 in revenue).
- 12/2019 is the weakest month (34,764 revenue per day). 31/12 is the lowest day of the period (6,984).
- Conversion is higher on weekdays (3.29% on Thursday) than at weekends (2.93% on Saturday), and highest between 9:00 and 12:00 UTC.

## Q5. First Purchase and Repeat (60 days)

72,225 customers made a first purchase before 01/01/2020; **21.0%** bought again within 60 days.

| First basket | Repeat within 60 days |
|---|---|
| 1 item | 11.9% |
| 3 items | 17.7% |
| 5+ items | 25.4% |
| Lowest value quartile (up to 15.07) | 15.1% |
| Highest value quartile (48.06+) | 27.3% |

Among entry brands with 500+ first buyers, repeat ranges from 36.0% (smart) to 14.8% (depilflax).

---

## Recommendations

1. **Cart reminder within 24 hours.** Half of the carts that are recovered come back within a day: a reminder in that window targets the moment of highest intent.
2. **Fix the leak brands first.** Product pages, price display and offers on masura, kapous and jessnail, measured against star brands of the same price tier.
3. **Test exposure for hidden gems** with an A/B test on a homepage slot before any permanent change.
4. **Grow the first basket.** Bundles or a free-shipping threshold on first orders, tested to see whether a larger first basket really leads to more repeat purchases (the link found here is a correlation).
5. **Plan the late-November peak** (stock, campaigns, site capacity) and use the quiet last week of December for retention campaigns.

## Limitations

- Correlations only: no experiment, so no causal claim.
- Brand known for about 57% of purchases; no product categories.
- Order = session with a purchase (no order id).
- One shop, one market, five months.

## Files

| File | Content |
|---|---|
| `bigquery/00_setup.sql` | Cleaning, orders table, price bands |
| `bigquery/01_data_quality.sql` | Volumes, missing values, duplicates, distributions |
| `bigquery/02_funnel.sql` | Loose vs strict funnel, monthly funnel, brand matrix |
| `bigquery/03_cart_abandonment.sql` | Abandonment by price and brand, later recovery |
| `bigquery/04_cohort_retention.sql` | Monthly cohorts |
| `bigquery/05_seasonality.sql` | Daily series, peak days, weekday x hour |
| `bigquery/06_first_purchase.sql` | First basket and 60-day repeat |
| `bigquery/07_chart_tables.sql` | Tables for the charts |
| `bigquery/99_run_all.sql` | Runs everything and gathers all results in one table |
| `split-csv.ps1` | Splits the source CSV files under the 100 MB upload limit |
| `results/bigquery_results.csv` | Every result of `99_run_all.sql`, as exported from BigQuery |
| `tableau/` | Tableau workbooks (FR and EN, built by `tools/build-tableau-beauty.py`), chart-ready CSV files, chart previews and the build guide |
| `duckdb/` | First local version in DuckDB (loose funnel only); the BigQuery files are the reference |

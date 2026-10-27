-- =====================================================================
-- 07 · Chart tables (BigQuery)
-- Small tables ready for Tableau / Power BI. To get a CSV: run
-- SELECT * FROM beaute.chart_... then "Save results" > "CSV (local file)".
-- Run after 00, 04 and 05 (they build orders, cohort_retention, daily).
-- =====================================================================

-- Daily KPIs (line chart, peak days)
CREATE OR REPLACE TABLE beaute.chart_daily AS
SELECT day, sessions, orders, ROUND(revenue, 2) AS revenue
FROM beaute.daily;

-- Brand funnel (bar chart)
CREATE OR REPLACE TABLE beaute.chart_brand_funnel AS
SELECT
    brand,
    COUNT(DISTINCT IF(event_type = 'view',     user_session, NULL)) AS s_view,
    COUNT(DISTINCT IF(event_type = 'cart',     user_session, NULL)) AS s_cart,
    COUNT(DISTINCT IF(event_type = 'purchase', user_session, NULL)) AS s_purchase,
    ROUND(SUM(IF(event_type = 'purchase', price, 0)), 2)            AS revenue
FROM beaute.events
WHERE brand <> 'unknown'
GROUP BY brand;

-- Cohort retention (heatmap)
CREATE OR REPLACE TABLE beaute.chart_cohort AS
SELECT FORMAT_DATE('%Y-%m', cohort) AS cohort, month_n, buyers, retention_pct
FROM beaute.cohort_retention;

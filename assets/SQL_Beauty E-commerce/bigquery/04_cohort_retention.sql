-- =====================================================================
-- 04 · Cohort retention (BigQuery)
-- Q3: of the customers who first bought in a given month, what share
--     buys again 1, 2, 3, 4 months later?
-- Caveat: the data starts in 10/2019, so the October "new" customers
-- also include people who bought before. Say so in the README.
-- =====================================================================

CREATE OR REPLACE TABLE beaute.cohort_retention AS
WITH first_month AS (
    SELECT user_id, DATE_TRUNC(DATE(MIN(order_time)), MONTH) AS cohort
    FROM beaute.orders
    GROUP BY user_id
),
active AS (
    SELECT DISTINCT user_id, DATE_TRUNC(DATE(order_time), MONTH) AS month
    FROM beaute.orders
),
cohort_long AS (
    SELECT
        f.cohort,
        DATE_DIFF(a.month, f.cohort, MONTH) AS month_n,
        COUNT(*)                            AS buyers
    FROM first_month AS f
    JOIN active AS a USING (user_id)
    GROUP BY f.cohort, month_n
)
SELECT
    cohort,
    month_n,
    buyers,
    ROUND(100 * buyers
          / MAX(IF(month_n = 0, buyers, NULL)) OVER (PARTITION BY cohort), 1) AS retention_pct
FROM cohort_long;

-- 1. Long format (easiest to chart in Tableau / Power BI)
SELECT *
FROM beaute.cohort_retention
ORDER BY cohort, month_n;

-- 2. Classic cohort matrix (one row per cohort, one column per month)
SELECT *
FROM (
    SELECT
        FORMAT_DATE('%Y-%m', cohort)          AS cohort,
        CONCAT('M', CAST(month_n AS STRING))  AS month_n,
        retention_pct
    FROM beaute.cohort_retention
)
PIVOT (MAX(retention_pct) FOR month_n IN ('M0', 'M1', 'M2', 'M3', 'M4'))
ORDER BY cohort;

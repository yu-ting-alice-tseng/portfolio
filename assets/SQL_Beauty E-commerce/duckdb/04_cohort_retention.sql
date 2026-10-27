-- =====================================================================
-- 04 · Cohort retention
-- Q3: of the customers who first bought in a given month, what share
--     buys again 1, 2, 3, 4 months later?
-- Caveat: the data starts in 10/2019, so the October "new" customers
-- also include people who bought before. Say so in the README.
-- =====================================================================

CREATE OR REPLACE TEMP TABLE cohort_long AS
WITH first_month AS (
    SELECT user_id, date_trunc('month', min(order_time)) AS cohort
    FROM orders
    GROUP BY user_id
),
active AS (
    SELECT DISTINCT user_id, date_trunc('month', order_time) AS month
    FROM orders
)
SELECT
    f.cohort,
    date_diff('month', f.cohort, a.month)      AS month_n,
    count(*)                                   AS buyers
FROM first_month f
JOIN active a USING (user_id)
GROUP BY ALL;

-- 1. Long format (easiest to chart in Tableau / Power BI)
SELECT
    cohort,
    month_n,
    buyers,
    round(100.0 * buyers
          / max(buyers) FILTER (WHERE month_n = 0) OVER (PARTITION BY cohort), 1) AS retention_pct
FROM cohort_long
ORDER BY cohort, month_n;

-- 2. Classic cohort matrix (one row per cohort, one column per month)
PIVOT (
    SELECT
        strftime(cohort, '%Y-%m') AS cohort,
        'M' || month_n            AS month_n,
        round(100.0 * buyers
              / max(buyers) FILTER (WHERE month_n = 0) OVER (PARTITION BY cohort), 1) AS retention_pct
    FROM cohort_long
)
ON month_n IN ('M0', 'M1', 'M2', 'M3', 'M4')
USING first(retention_pct)
ORDER BY cohort;

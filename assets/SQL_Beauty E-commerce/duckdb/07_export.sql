-- =====================================================================
-- 07 · Export for Tableau / Power BI
-- Writes the chart-ready tables to output/ as CSV.
-- Run after 00_setup.sql (same session or same .duckdb file).
-- =====================================================================

-- Daily KPIs (line chart, peak days)
COPY (
    SELECT
        event_time::DATE                                                    AS day,
        count(DISTINCT user_session)                                        AS sessions,
        count(DISTINCT user_session) FILTER (WHERE event_type = 'purchase') AS orders,
        round(coalesce(sum(price) FILTER (WHERE event_type = 'purchase'), 0), 2) AS revenue
    FROM events
    GROUP BY day
    ORDER BY day
) TO 'output/daily_kpis.csv' (HEADER);

-- Brand funnel (bar chart)
COPY (
    SELECT
        brand,
        count(DISTINCT user_session) FILTER (WHERE event_type = 'view')     AS s_view,
        count(DISTINCT user_session) FILTER (WHERE event_type = 'cart')     AS s_cart,
        count(DISTINCT user_session) FILTER (WHERE event_type = 'purchase') AS s_purchase,
        round(sum(price) FILTER (WHERE event_type = 'purchase'), 2)         AS revenue
    FROM events
    WHERE brand <> 'unknown'
    GROUP BY brand
) TO 'output/brand_funnel.csv' (HEADER);

-- Cohort retention (heatmap)
COPY (
    WITH first_month AS (
        SELECT user_id, date_trunc('month', min(order_time)) AS cohort
        FROM orders GROUP BY user_id
    ),
    active AS (
        SELECT DISTINCT user_id, date_trunc('month', order_time) AS month FROM orders
    ),
    cohort_long AS (
        SELECT f.cohort, date_diff('month', f.cohort, a.month) AS month_n, count(*) AS buyers
        FROM first_month f JOIN active a USING (user_id)
        GROUP BY ALL
    )
    SELECT
        strftime(cohort, '%Y-%m') AS cohort,
        month_n,
        buyers,
        round(100.0 * buyers
              / max(buyers) FILTER (WHERE month_n = 0) OVER (PARTITION BY cohort), 1) AS retention_pct
    FROM cohort_long
    ORDER BY cohort, month_n
) TO 'output/cohort_retention.csv' (HEADER);

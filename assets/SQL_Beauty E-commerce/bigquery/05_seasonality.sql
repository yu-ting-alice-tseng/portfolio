-- =====================================================================
-- 05 · Peak periods (BigQuery)
-- Q4: how much do traffic and conversion move on the busiest days
--     of the year-end season?
-- Let the data name the peak days (top revenue days) instead of
-- assuming them: the shop's country is not stated in the dataset.
-- =====================================================================

CREATE OR REPLACE TABLE beaute.daily AS
SELECT
    DATE(event_time)                                                AS day,
    COUNT(DISTINCT user_session)                                    AS sessions,
    COUNT(DISTINCT IF(event_type = 'purchase', user_session, NULL)) AS orders,
    SUM(IF(event_type = 'purchase', price, 0))                      AS revenue
FROM beaute.events
GROUP BY day;

-- 1. Daily series with 7-day moving averages (the main chart)
SELECT
    day,
    sessions,
    orders,
    ROUND(revenue, 0)                                       AS revenue,
    ROUND(100 * orders / sessions, 2)                       AS conversion_pct,
    ROUND(AVG(revenue) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 0) AS revenue_ma7,
    ROUND(AVG(100 * orders / sessions)
          OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2)             AS conversion_ma7
FROM beaute.daily
ORDER BY day;

-- 2. Top 10 revenue days, compared with their own month
SELECT * EXCEPT (rank_n)
FROM (
    SELECT
        day,
        FORMAT_DATE('%A', day)                              AS weekday,
        sessions,
        orders,
        ROUND(revenue, 0)                                   AS revenue,
        ROUND(revenue  / AVG(revenue)  OVER (PARTITION BY DATE_TRUNC(day, MONTH)), 2) AS revenue_index,
        ROUND(sessions / AVG(sessions) OVER (PARTITION BY DATE_TRUNC(day, MONTH)), 2) AS traffic_index,
        ROUND(100 * orders / sessions, 2)                   AS conversion_pct,
        ROW_NUMBER() OVER (ORDER BY revenue DESC)           AS rank_n
    FROM beaute.daily
)
WHERE rank_n <= 10
ORDER BY rank_n;

-- 3. Is the peak driven by more visitors or by better conversion?
--    Compare the peak days (top 10) with all other days.
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (ORDER BY revenue DESC) <= 10 AS is_peak
    FROM beaute.daily
)
SELECT
    IF(is_peak, 'peak days', 'other days')                  AS period,
    COUNT(*)                                                AS n_days,
    ROUND(AVG(sessions), 0)                                 AS avg_sessions,
    ROUND(100 * SUM(orders) / SUM(sessions), 2)             AS conversion_pct,
    ROUND(SUM(revenue) / SUM(orders), 2)                    AS avg_order_value
FROM ranked
GROUP BY period;

-- 4. Weekday x hour conversion
--    Hours are UTC (mention it on the chart). Weekday: 1 = Sunday ... 7 = Saturday.
SELECT
    EXTRACT(DAYOFWEEK FROM event_time)                      AS weekday_n,
    EXTRACT(HOUR FROM event_time)                           AS hour_utc,
    COUNT(DISTINCT user_session)                            AS sessions,
    ROUND(100 * COUNT(DISTINCT IF(event_type = 'purchase', user_session, NULL))
          / COUNT(DISTINCT user_session), 2)                AS conversion_pct
FROM beaute.events
GROUP BY weekday_n, hour_utc
ORDER BY weekday_n, hour_utc;

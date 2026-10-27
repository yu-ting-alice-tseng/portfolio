-- =====================================================================
-- 05 · Peak periods
-- Q4: how much do traffic and conversion move on the busiest days
--     of the year-end season?
-- Let the data name the peak days (top revenue days) instead of
-- assuming them: the shop's country is not stated in the dataset.
-- =====================================================================

CREATE OR REPLACE TEMP TABLE daily AS
SELECT
    event_time::DATE                                                    AS day,
    count(DISTINCT user_session)                                        AS sessions,
    count(DISTINCT user_session) FILTER (WHERE event_type = 'purchase') AS orders,
    coalesce(sum(price) FILTER (WHERE event_type = 'purchase'), 0)      AS revenue
FROM events
GROUP BY day;

-- 1. Daily series with 7-day moving averages (the main chart)
SELECT
    day,
    sessions,
    orders,
    round(revenue, 0)                                          AS revenue,
    round(100.0 * orders / sessions, 2)                        AS conversion_pct,
    round(avg(revenue) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 0) AS revenue_ma7,
    round(avg(100.0 * orders / sessions)
          OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2)             AS conversion_ma7
FROM daily
ORDER BY day;

-- 2. Top 10 revenue days, compared with their own month
SELECT
    day,
    strftime(day, '%A')                                        AS weekday,
    sessions,
    orders,
    round(revenue, 0)                                          AS revenue,
    round(revenue  / avg(revenue)  OVER (PARTITION BY date_trunc('month', day)), 2) AS revenue_index,
    round(sessions / avg(sessions) OVER (PARTITION BY date_trunc('month', day)), 2) AS traffic_index,
    round(100.0 * orders / sessions, 2)                        AS conversion_pct
FROM daily
QUALIFY row_number() OVER (ORDER BY revenue DESC) <= 10
ORDER BY revenue DESC;

-- 3. Is the peak driven by more visitors or by better conversion?
--    Compare the peak days (top 10) with all other days.
WITH ranked AS (
    SELECT *, row_number() OVER (ORDER BY revenue DESC) <= 10 AS is_peak
    FROM daily
)
SELECT
    CASE WHEN is_peak THEN 'peak days' ELSE 'other days' END   AS period,
    count(*)                                                   AS n_days,
    round(avg(sessions), 0)                                    AS avg_sessions,
    round(100.0 * sum(orders) / sum(sessions), 2)              AS conversion_pct,
    round(sum(revenue) / sum(orders), 2)                       AS avg_order_value
FROM ranked
GROUP BY period;

-- 4. Weekday x hour conversion (hours are UTC: mention it on the chart)
SELECT
    isodow(event_time)                                         AS weekday_n,
    hour(event_time)                                           AS hour_utc,
    count(DISTINCT user_session)                               AS sessions,
    round(100.0 * count(DISTINCT user_session) FILTER (WHERE event_type = 'purchase')
          / count(DISTINCT user_session), 2)                   AS conversion_pct
FROM events
GROUP BY ALL
ORDER BY weekday_n, hour_utc;

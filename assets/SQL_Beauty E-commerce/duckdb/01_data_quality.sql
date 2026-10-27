-- =====================================================================
-- 01 · Data quality
-- Understand the raw data before trusting any result.
-- Every number here belongs in the README "Data cleaning" section.
-- =====================================================================

-- 1. Volume by month and event type
SELECT
    left(event_time, 7)  AS month,
    event_type,
    count(*)             AS n_events
FROM raw_events
GROUP BY ALL
ORDER BY month, event_type;

-- 2. Missing values
SELECT
    count(*)                                                   AS n_rows,
    round(100.0 * count(*) FILTER (WHERE brand IS NULL OR trim(brand) = '')
          / count(*), 1)                                       AS brand_missing_pct,
    round(100.0 * count(*) FILTER (WHERE category_code IS NULL)
          / count(*), 1)                                       AS category_code_missing_pct,
    count(*) FILTER (WHERE user_session IS NULL)               AS session_missing
FROM raw_events;

-- 3. Exact duplicate rows
SELECT
    count(*)                                         AS n_rows,
    (SELECT count(*) FROM (SELECT DISTINCT * FROM raw_events)) AS n_distinct,
    count(*) - (SELECT count(*) FROM (SELECT DISTINCT * FROM raw_events)) AS n_duplicates
FROM raw_events;

-- 4. Price distribution (use the quartiles to set price_band in 00_setup.sql)
SELECT
    count(*) FILTER (WHERE price <= 0)         AS n_zero_or_negative,
    min(price)                                 AS min_price,
    quantile_cont(price, 0.25)                 AS p25,
    quantile_cont(price, 0.50)                 AS median,
    quantile_cont(price, 0.75)                 AS p75,
    quantile_cont(price, 0.95)                 AS p95,
    max(price)                                 AS max_price
FROM raw_events
WHERE event_type = 'purchase';

-- 5. How big is a session, how many sessions per user
SELECT
    round(avg(n_events), 1)               AS avg_events_per_session,
    quantile_cont(n_events, 0.5)          AS median_events_per_session,
    max(n_events)                         AS max_events_per_session
FROM (SELECT user_session, count(*) AS n_events FROM events GROUP BY user_session);

SELECT
    round(avg(n_sessions), 2)             AS avg_sessions_per_user,
    count(*) FILTER (WHERE n_sessions = 1) AS one_session_users,
    count(*)                              AS n_users
FROM (SELECT user_id, count(DISTINCT user_session) AS n_sessions FROM events GROUP BY user_id);

-- 6. Orders: size and value
SELECT
    count(*)                              AS n_orders,
    round(avg(items), 2)                  AS avg_items,
    round(avg(order_value), 2)            AS avg_order_value,
    quantile_cont(order_value, 0.5)       AS median_order_value
FROM orders;

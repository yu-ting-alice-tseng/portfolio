-- =====================================================================
-- 01 · Data quality (BigQuery)
-- Understand the raw data before trusting any result.
-- Every number here belongs in the README "Data cleaning" section.
-- =====================================================================

-- 1. Volume by month and event type
SELECT
    SUBSTR(event_time, 1, 7) AS month,
    event_type,
    COUNT(*)                 AS n_events
FROM beaute.raw_events
GROUP BY month, event_type
ORDER BY month, event_type;

-- 2. Missing values
SELECT
    COUNT(*)                                                             AS n_rows,
    ROUND(100 * COUNTIF(brand IS NULL OR TRIM(brand) = '') / COUNT(*), 1) AS brand_missing_pct,
    ROUND(100 * COUNTIF(category_code IS NULL) / COUNT(*), 1)            AS category_code_missing_pct,
    COUNTIF(user_session IS NULL)                                        AS session_missing
FROM beaute.raw_events;

-- 3. Exact duplicate rows (each row turned into text, then counted once)
SELECT
    COUNT(*)                                        AS n_rows,
    COUNT(DISTINCT TO_JSON_STRING(t))               AS n_distinct,
    COUNT(*) - COUNT(DISTINCT TO_JSON_STRING(t))    AS n_duplicates
FROM beaute.raw_events AS t;

-- 4. Price distribution (use the quartiles to set price_band in 00_setup.sql)
SELECT
    COUNTIF(price <= 0)                       AS n_zero_or_negative,
    MIN(price)                                AS min_price,
    APPROX_QUANTILES(price, 100)[OFFSET(25)]  AS p25,
    APPROX_QUANTILES(price, 100)[OFFSET(50)]  AS median,
    APPROX_QUANTILES(price, 100)[OFFSET(75)]  AS p75,
    APPROX_QUANTILES(price, 100)[OFFSET(95)]  AS p95,
    MAX(price)                                AS max_price
FROM beaute.raw_events
WHERE event_type = 'purchase';

-- 5. How big is a session, how many sessions per user
SELECT
    ROUND(AVG(n_events), 1)                    AS avg_events_per_session,
    APPROX_QUANTILES(n_events, 2)[OFFSET(1)]   AS median_events_per_session,
    MAX(n_events)                              AS max_events_per_session
FROM (SELECT user_session, COUNT(*) AS n_events FROM beaute.events GROUP BY user_session);

SELECT
    ROUND(AVG(n_sessions), 2)                  AS avg_sessions_per_user,
    COUNTIF(n_sessions = 1)                    AS one_session_users,
    COUNT(*)                                   AS n_users
FROM (SELECT user_id, COUNT(DISTINCT user_session) AS n_sessions FROM beaute.events GROUP BY user_id);

-- 6. Orders: size and value
SELECT
    COUNT(*)                                     AS n_orders,
    ROUND(AVG(items), 2)                         AS avg_items,
    ROUND(AVG(order_value), 2)                   AS avg_order_value,
    APPROX_QUANTILES(order_value, 2)[OFFSET(1)]  AS median_order_value
FROM beaute.orders;

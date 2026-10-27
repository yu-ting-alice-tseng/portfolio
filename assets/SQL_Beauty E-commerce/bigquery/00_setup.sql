-- =====================================================================
-- 00 · Setup (BigQuery)
-- Run after the CSV parts are loaded into the table beaute.raw_events
-- (see the guide). Builds the tables every other script relies on.
-- =====================================================================

-- 1. Clean table.
--    Decisions (check them against 01_data_quality.sql before keeping):
--    - exact duplicate rows are removed (DISTINCT)
--    - rows without a session are dropped
--    - prices <= 0 are dropped
--    - a missing brand becomes 'unknown' so it stays visible in counts
--    Price is cast to NUMERIC: BigQuery cannot run DISTINCT on FLOAT64.
CREATE OR REPLACE TABLE beaute.events AS
SELECT DISTINCT
    PARSE_TIMESTAMP('%Y-%m-%d %H:%M:%S UTC', event_time) AS event_time,
    event_type,
    product_id,
    category_id,
    category_code,
    COALESCE(NULLIF(TRIM(brand), ''), 'unknown')         AS brand,
    CAST(price AS NUMERIC)                               AS price,
    user_id,
    user_session
FROM beaute.raw_events
WHERE user_session IS NOT NULL
  AND price > 0;

-- 2. Orders.
--    The data has no order id: one session containing at least one
--    purchase is treated as one order (assumption to state in the README).
CREATE OR REPLACE TABLE beaute.orders AS
SELECT
    user_session,
    user_id,
    MIN(event_time) AS order_time,
    COUNT(*)        AS items,
    SUM(price)      AS order_value
FROM beaute.events
WHERE event_type = 'purchase'
GROUP BY user_session, user_id;

-- 3. Price bands for single products.
--    Cut-offs = purchase price quartiles from 01_data_quality.sql, step 4
--    (p25 1.59, median 3.00, p75 5.40, p95 14.27): about 25 / 25 / 25 / 20 / 5 %.
CREATE OR REPLACE FUNCTION beaute.price_band(p NUMERIC) AS (
    CASE
        WHEN p < 1.6  THEN '1. < 1.6'
        WHEN p < 3    THEN '2. 1.6 - 3'
        WHEN p < 5.4  THEN '3. 3 - 5.4'
        WHEN p < 14.3 THEN '4. 5.4 - 14.3'
        ELSE               '5. 14.3+'
    END
);

-- Quick check
SELECT 'raw_events' AS tbl, COUNT(*) AS n_rows FROM beaute.raw_events
UNION ALL SELECT 'events', COUNT(*) FROM beaute.events
UNION ALL SELECT 'orders', COUNT(*) FROM beaute.orders;

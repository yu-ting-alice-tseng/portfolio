-- =====================================================================
-- 00 · Setup
-- Load the five monthly CSV files (10/2019 - 02/2020) into DuckDB,
-- clean them, and build the tables every other script relies on.
-- Run from the project root: the CSV files go in data/
-- =====================================================================

-- 1. Raw import: every column read as declared, nothing changed yet.
CREATE OR REPLACE TABLE raw_events AS
SELECT *
FROM read_csv('data/*.csv', header = true, columns = {
    'event_time':    'VARCHAR',
    'event_type':    'VARCHAR',
    'product_id':    'BIGINT',
    'category_id':   'BIGINT',
    'category_code': 'VARCHAR',
    'brand':         'VARCHAR',
    'price':         'DOUBLE',
    'user_id':       'BIGINT',
    'user_session':  'VARCHAR'
});

-- 2. Clean table.
--    Decisions (check them against 01_data_quality.sql before keeping):
--    - exact duplicate rows are removed (DISTINCT)
--    - rows without a session are dropped
--    - prices <= 0 are dropped
--    - a missing brand becomes 'unknown' so it stays visible in counts
CREATE OR REPLACE TABLE events AS
SELECT DISTINCT
    strptime(replace(event_time, ' UTC', ''), '%Y-%m-%d %H:%M:%S') AS event_time,
    event_type,
    product_id,
    category_id,
    category_code,
    coalesce(nullif(trim(brand), ''), 'unknown') AS brand,
    price,
    user_id,
    user_session
FROM raw_events
WHERE user_session IS NOT NULL
  AND price > 0;

-- 3. Orders.
--    The data has no order id: one session containing at least one
--    purchase is treated as one order (assumption to state in the README).
CREATE OR REPLACE TABLE orders AS
SELECT
    user_session,
    user_id,
    min(event_time) AS order_time,
    count(*)        AS items,
    sum(price)      AS order_value
FROM events
WHERE event_type = 'purchase'
GROUP BY user_session, user_id;

-- 4. Price bands for single products.
--    Cut-offs = purchase price quartiles from 01_data_quality.sql, step 4
--    (p25 1.59, median 3.00, p75 5.40, p95 14.27): about 25 / 25 / 25 / 20 / 5 %.
CREATE OR REPLACE MACRO price_band(p) AS
    CASE
        WHEN p < 1.6  THEN '1. < 1.6'
        WHEN p < 3    THEN '2. 1.6 - 3'
        WHEN p < 5.4  THEN '3. 3 - 5.4'
        WHEN p < 14.3 THEN '4. 5.4 - 14.3'
        ELSE               '5. 14.3+'
    END;

-- Quick check
SELECT 'raw_events' AS tbl, count(*) AS n_rows FROM raw_events
UNION ALL SELECT 'events', count(*) FROM events
UNION ALL SELECT 'orders', count(*) FROM orders;

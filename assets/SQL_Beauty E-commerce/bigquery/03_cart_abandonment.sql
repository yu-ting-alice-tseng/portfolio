-- =====================================================================
-- 03 · Cart abandonment (BigQuery)
-- Q2: what do abandoned products have in common (price, brand)?
--     How many are bought later anyway (the case for a cart reminder)?
-- =====================================================================

-- Products put in a cart, and products bought, per session
CREATE OR REPLACE TABLE beaute.carted AS
SELECT
    user_session,
    user_id,
    product_id,
    ANY_VALUE(brand)  AS brand,
    AVG(price)        AS price,
    MIN(event_time)   AS cart_time
FROM beaute.events
WHERE event_type = 'cart'
GROUP BY user_session, user_id, product_id;

CREATE OR REPLACE TABLE beaute.bought AS
SELECT DISTINCT user_session, user_id, product_id, event_time AS buy_time
FROM beaute.events
WHERE event_type = 'purchase';

-- An item is abandoned when it was carted but not bought in the same session
CREATE OR REPLACE TABLE beaute.cart_items AS
SELECT
    c.*,
    b.product_id IS NULL AS abandoned
FROM beaute.carted AS c
LEFT JOIN (SELECT DISTINCT user_session, product_id FROM beaute.bought) AS b
  ON  b.user_session = c.user_session
  AND b.product_id   = c.product_id;

-- 1. Overall abandonment rate (items and sessions)
SELECT
    COUNT(*)                                          AS carted_items,
    COUNTIF(abandoned)                                AS abandoned_items,
    ROUND(100 * COUNTIF(abandoned) / COUNT(*), 1)     AS item_abandon_pct,
    ROUND(SUM(IF(abandoned, price, 0)), 0)            AS abandoned_value
FROM beaute.cart_items;

SELECT
    COUNT(*)                                          AS sessions_with_cart,
    COUNTIF(NOT has_purchase)                         AS sessions_without_purchase,
    ROUND(100 * COUNTIF(NOT has_purchase) / COUNT(*), 1) AS session_abandon_pct
FROM (
    SELECT user_session, LOGICAL_OR(event_type = 'purchase') AS has_purchase
    FROM beaute.events
    GROUP BY user_session
    HAVING LOGICAL_OR(event_type = 'cart')
);

-- 2. Abandonment by price band
SELECT
    beaute.price_band(price)                          AS band,
    COUNT(*)                                          AS carted_items,
    ROUND(100 * COUNTIF(abandoned) / COUNT(*), 1)     AS abandon_pct
FROM beaute.cart_items
GROUP BY band
ORDER BY band;

-- 3. Abandonment by brand (brands with enough carts)
SELECT
    brand,
    COUNT(*)                                          AS carted_items,
    ROUND(100 * COUNTIF(abandoned) / COUNT(*), 1)     AS abandon_pct
FROM beaute.cart_items
WHERE brand <> 'unknown'
GROUP BY brand
HAVING COUNT(*) >= 500
ORDER BY abandon_pct DESC
LIMIT 15;

-- 4. Recovered later: abandoned items the same user bought in a
--    later session, and how many days it took.
WITH recovered AS (
    SELECT
        a.user_id,
        a.product_id,
        a.cart_time,
        MIN(b.buy_time) AS buy_time
    FROM beaute.cart_items AS a
    JOIN beaute.bought AS b
      ON  b.user_id      = a.user_id
      AND b.product_id   = a.product_id
      AND b.buy_time     > a.cart_time
      AND b.user_session <> a.user_session
    WHERE a.abandoned
    GROUP BY a.user_id, a.product_id, a.cart_time
)
SELECT
    (SELECT COUNTIF(abandoned) FROM beaute.cart_items)       AS abandoned_items,
    COUNT(*)                                                 AS recovered_items,
    ROUND(100 * COUNT(*) / (SELECT COUNTIF(abandoned) FROM beaute.cart_items), 1) AS recovered_pct,
    ROUND(APPROX_QUANTILES(TIMESTAMP_DIFF(buy_time, cart_time, HOUR) / 24, 2)[OFFSET(1)], 1) AS median_days_to_recover
FROM recovered;

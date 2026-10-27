-- =====================================================================
-- 03 · Cart abandonment
-- Q2: what do abandoned products have in common (price, brand)?
--     How many are bought later anyway (the case for a cart reminder)?
-- =====================================================================

-- Products put in a cart, and products bought, per session
CREATE OR REPLACE TEMP TABLE carted AS
SELECT
    user_session,
    user_id,
    product_id,
    any_value(brand)  AS brand,
    avg(price)        AS price,
    min(event_time)   AS cart_time
FROM events
WHERE event_type = 'cart'
GROUP BY user_session, user_id, product_id;

CREATE OR REPLACE TEMP TABLE bought AS
SELECT DISTINCT user_session, user_id, product_id, event_time AS buy_time
FROM events
WHERE event_type = 'purchase';

-- An item is abandoned when it was carted but not bought in the same session
CREATE OR REPLACE TEMP TABLE cart_items AS
SELECT
    c.*,
    NOT EXISTS (
        SELECT 1 FROM bought b
        WHERE b.user_session = c.user_session AND b.product_id = c.product_id
    ) AS abandoned
FROM carted c;

-- 1. Overall abandonment rate (items and sessions)
SELECT
    count(*)                                              AS carted_items,
    count(*) FILTER (WHERE abandoned)                     AS abandoned_items,
    round(100.0 * count(*) FILTER (WHERE abandoned) / count(*), 1) AS item_abandon_pct,
    round(sum(price) FILTER (WHERE abandoned), 0)         AS abandoned_value
FROM cart_items;

SELECT
    count(*)                                               AS sessions_with_cart,
    count(*) FILTER (WHERE NOT has_purchase)               AS sessions_without_purchase,
    round(100.0 * count(*) FILTER (WHERE NOT has_purchase) / count(*), 1) AS session_abandon_pct
FROM (
    SELECT user_session, bool_or(event_type = 'purchase') AS has_purchase
    FROM events
    GROUP BY user_session
    HAVING bool_or(event_type = 'cart')
);

-- 2. Abandonment by price band
SELECT
    price_band(price)                                      AS band,
    count(*)                                               AS carted_items,
    round(100.0 * count(*) FILTER (WHERE abandoned) / count(*), 1) AS abandon_pct
FROM cart_items
GROUP BY band
ORDER BY band;

-- 3. Abandonment by brand (brands with enough carts)
SELECT
    brand,
    count(*)                                               AS carted_items,
    round(100.0 * count(*) FILTER (WHERE abandoned) / count(*), 1) AS abandon_pct
FROM cart_items
WHERE brand <> 'unknown'
GROUP BY brand
HAVING count(*) >= 500
ORDER BY abandon_pct DESC
LIMIT 15;

-- 4. Recovered later: abandoned items the same user bought in a
--    later session, and how many days it took.
WITH recovered AS (
    SELECT
        a.user_id,
        a.product_id,
        a.cart_time,
        min(b.buy_time) AS buy_time
    FROM cart_items a
    JOIN bought b
      ON  b.user_id    = a.user_id
      AND b.product_id = a.product_id
      AND b.buy_time   > a.cart_time
      AND b.user_session <> a.user_session
    WHERE a.abandoned
    GROUP BY a.user_id, a.product_id, a.cart_time
)
SELECT
    (SELECT count(*) FROM cart_items WHERE abandoned)      AS abandoned_items,
    count(*)                                               AS recovered_items,
    round(100.0 * count(*) / (SELECT count(*) FROM cart_items WHERE abandoned), 1) AS recovered_pct,
    round(quantile_cont(date_diff('hour', cart_time, buy_time) / 24.0, 0.5), 1)   AS median_days_to_recover
FROM recovered;

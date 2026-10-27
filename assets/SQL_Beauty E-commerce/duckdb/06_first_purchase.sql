-- =====================================================================
-- 06 · First purchase and repeat
-- Q5: does what a customer buys first (basket value, brand) relate to
--     whether they come back within 60 days?
-- Only first orders placed before 01/01/2020 are kept, so every
-- customer has at least 60 days of history left in the data.
-- =====================================================================

CREATE OR REPLACE TEMP TABLE first_order AS
SELECT *
FROM orders
QUALIFY row_number() OVER (PARTITION BY user_id ORDER BY order_time) = 1;

DELETE FROM first_order WHERE order_time >= TIMESTAMP '2020-01-01';

CREATE OR REPLACE TEMP TABLE repeaters AS
SELECT DISTINCT f.user_id
FROM first_order f
JOIN orders o
  ON  o.user_id    = f.user_id
  AND o.order_time > f.order_time
  AND o.order_time <= f.order_time + INTERVAL 60 DAY;

-- 1. Overall 60-day repeat rate
SELECT
    count(*)                                         AS first_time_buyers,
    count(r.user_id)                                 AS repeat_buyers,
    round(100.0 * count(r.user_id) / count(*), 1)    AS repeat_60d_pct
FROM first_order f
LEFT JOIN repeaters r USING (user_id);

-- 2. Repeat rate by first-basket value (four equal-size groups)
WITH q AS (
    SELECT f.*, ntile(4) OVER (ORDER BY order_value) AS value_quartile
    FROM first_order f
)
SELECT
    value_quartile,
    round(min(order_value), 2)                       AS from_value,
    round(max(order_value), 2)                       AS to_value,
    count(*)                                         AS first_time_buyers,
    round(100.0 * count(r.user_id) / count(*), 1)    AS repeat_60d_pct
FROM q
LEFT JOIN repeaters r USING (user_id)
GROUP BY value_quartile
ORDER BY value_quartile;

-- 3. Repeat rate by number of items in the first basket
SELECT
    least(items, 5)                                  AS items_in_first_order,  -- 5 = 5 or more
    count(*)                                         AS first_time_buyers,
    round(100.0 * count(r.user_id) / count(*), 1)    AS repeat_60d_pct
FROM first_order f
LEFT JOIN repeaters r USING (user_id)
GROUP BY ALL
ORDER BY items_in_first_order;

-- 4. "Entry brands": brands in the first basket that bring customers back
WITH first_brands AS (
    SELECT DISTINCT f.user_id, e.brand
    FROM first_order f
    JOIN events e
      ON  e.user_session = f.user_session
      AND e.event_type   = 'purchase'
    WHERE e.brand <> 'unknown'
)
SELECT
    brand,
    count(*)                                         AS first_time_buyers,
    round(100.0 * count(r.user_id) / count(*), 1)    AS repeat_60d_pct
FROM first_brands fb
LEFT JOIN repeaters r USING (user_id)
GROUP BY brand
HAVING count(*) >= 200
ORDER BY repeat_60d_pct DESC
LIMIT 15;

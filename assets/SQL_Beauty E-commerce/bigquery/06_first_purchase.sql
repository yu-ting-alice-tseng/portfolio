-- =====================================================================
-- 06 · First purchase and repeat (BigQuery)
-- Q5: does what a customer buys first (basket value, brand) relate to
--     whether they come back within 60 days?
-- Only first orders placed before 01/01/2020 are kept, so every
-- customer has at least 60 days of history left in the data.
-- =====================================================================

CREATE OR REPLACE TABLE beaute.first_order AS
SELECT * EXCEPT (rank_n)
FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_time) AS rank_n
    FROM beaute.orders
)
WHERE rank_n = 1
  AND order_time < TIMESTAMP '2020-01-01';

CREATE OR REPLACE TABLE beaute.repeaters AS
SELECT DISTINCT f.user_id
FROM beaute.first_order AS f
JOIN beaute.orders AS o
  ON  o.user_id    = f.user_id
  AND o.order_time > f.order_time
  AND o.order_time <= TIMESTAMP_ADD(f.order_time, INTERVAL 60 DAY);

-- 1. Overall 60-day repeat rate
SELECT
    COUNT(*)                                         AS first_time_buyers,
    COUNT(r.user_id)                                 AS repeat_buyers,
    ROUND(100 * COUNT(r.user_id) / COUNT(*), 1)      AS repeat_60d_pct
FROM beaute.first_order AS f
LEFT JOIN beaute.repeaters AS r USING (user_id);

-- 2. Repeat rate by first-basket value (four equal-size groups)
WITH q AS (
    SELECT f.*, NTILE(4) OVER (ORDER BY order_value) AS value_quartile
    FROM beaute.first_order AS f
)
SELECT
    value_quartile,
    ROUND(MIN(order_value), 2)                       AS from_value,
    ROUND(MAX(order_value), 2)                       AS to_value,
    COUNT(*)                                         AS first_time_buyers,
    ROUND(100 * COUNT(r.user_id) / COUNT(*), 1)      AS repeat_60d_pct
FROM q
LEFT JOIN beaute.repeaters AS r USING (user_id)
GROUP BY value_quartile
ORDER BY value_quartile;

-- 3. Repeat rate by number of items in the first basket
SELECT
    LEAST(items, 5)                                  AS items_in_first_order,  -- 5 = 5 or more
    COUNT(*)                                         AS first_time_buyers,
    ROUND(100 * COUNT(r.user_id) / COUNT(*), 1)      AS repeat_60d_pct
FROM beaute.first_order AS f
LEFT JOIN beaute.repeaters AS r USING (user_id)
GROUP BY items_in_first_order
ORDER BY items_in_first_order;

-- 4. "Entry brands": brands in the first basket that bring customers back
WITH first_brands AS (
    SELECT DISTINCT f.user_id, e.brand
    FROM beaute.first_order AS f
    JOIN beaute.events AS e
      ON  e.user_session = f.user_session
      AND e.event_type   = 'purchase'
    WHERE e.brand <> 'unknown'
)
SELECT
    brand,
    COUNT(*)                                         AS first_time_buyers,
    ROUND(100 * COUNT(r.user_id) / COUNT(*), 1)      AS repeat_60d_pct
FROM first_brands
LEFT JOIN beaute.repeaters AS r USING (user_id)
GROUP BY brand
HAVING COUNT(*) >= 200
ORDER BY repeat_60d_pct DESC
LIMIT 15;

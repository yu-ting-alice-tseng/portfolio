-- =====================================================================
-- 99 · Run all (BigQuery)
-- One paste runs the whole project (00 - 07) from beaute.raw_events:
-- it builds every table, then gathers every result into ONE table,
-- beaute.results (one row per result, the rows of that result packed
-- as JSON).
-- After the run: Save results > CSV (local file), and share the file.
-- Only needs beaute.raw_events (the uploaded CSV files).
-- =====================================================================

-- Price bands (quartiles from 01, step 4)
CREATE OR REPLACE FUNCTION beaute.price_band(p NUMERIC) AS (
    CASE
        WHEN p < 1.6  THEN '1. < 1.6'
        WHEN p < 3    THEN '2. 1.6 - 3'
        WHEN p < 5.4  THEN '3. 3 - 5.4'
        WHEN p < 14.3 THEN '4. 5.4 - 14.3'
        ELSE               '5. 14.3+'
    END
);

-- ---------- 00 · clean tables ----------
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

-- ---------- 02 · session funnel and brand matrix tables ----------
CREATE OR REPLACE TABLE beaute.session_steps AS
SELECT
    user_session,
    MIN(IF(event_type = 'view',     event_time, NULL)) AS t_view,
    MIN(IF(event_type = 'cart',     event_time, NULL)) AS t_cart,
    MIN(IF(event_type = 'purchase', event_time, NULL)) AS t_buy
FROM beaute.events
GROUP BY user_session;

CREATE OR REPLACE TABLE beaute.chart_brand_matrix AS
WITH sb AS (
    SELECT
        user_session,
        brand,
        MIN(IF(event_type = 'view',     event_time, NULL)) AS t_view,
        MIN(IF(event_type = 'cart',     event_time, NULL)) AS t_cart,
        MIN(IF(event_type = 'purchase', event_time, NULL)) AS t_buy
    FROM beaute.events
    WHERE brand <> 'unknown'
    GROUP BY user_session, brand
),
kept AS (
    SELECT
        brand,
        COUNTIF(t_view IS NOT NULL)                    AS s_view,
        COUNTIF(t_cart >= t_view)                      AS s_cart,
        COUNTIF(t_cart >= t_view AND t_buy >= t_cart)  AS s_purchase,
        100 * SAFE_DIVIDE(COUNTIF(t_cart >= t_view AND t_buy >= t_cart),
                          COUNTIF(t_view IS NOT NULL)) AS conv
    FROM sb
    GROUP BY brand
    HAVING COUNTIF(t_view IS NOT NULL) >= 1000
),
med AS (
    -- exact medians, so the quadrants are the same on every run
    SELECT DISTINCT
        PERCENTILE_CONT(s_view, 0.5) OVER () AS med_view,
        PERCENTILE_CONT(conv,   0.5) OVER () AS med_conv
    FROM kept
),
revenue AS (
    SELECT brand, SUM(price) AS revenue
    FROM beaute.events
    WHERE event_type = 'purchase' AND brand <> 'unknown'
    GROUP BY brand
)
SELECT
    k.brand,
    k.s_view,
    k.s_cart,
    k.s_purchase,
    ROUND(k.conv, 2)    AS view_to_purchase_pct,
    ROUND(r.revenue, 0) AS revenue,
    CASE
        WHEN k.s_view >= m.med_view AND k.conv >= m.med_conv THEN '1. Stars'
        WHEN k.s_view <  m.med_view AND k.conv >= m.med_conv THEN '2. Hidden gems'
        WHEN k.s_view >= m.med_view AND k.conv <  m.med_conv THEN '3. Leaks'
        ELSE                                                      '4. Long tail'
    END AS quadrant
FROM kept AS k
CROSS JOIN med AS m
LEFT JOIN revenue AS r USING (brand);

-- ---------- 03 · cart tables ----------
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

CREATE OR REPLACE TABLE beaute.cart_items AS
SELECT
    c.*,
    b.product_id IS NULL AS abandoned
FROM beaute.carted AS c
LEFT JOIN (SELECT DISTINCT user_session, product_id FROM beaute.bought) AS b
  ON  b.user_session = c.user_session
  AND b.product_id   = c.product_id;

-- ---------- 04 · cohort table ----------
CREATE OR REPLACE TABLE beaute.cohort_retention AS
WITH first_month AS (
    SELECT user_id, DATE_TRUNC(DATE(MIN(order_time)), MONTH) AS cohort
    FROM beaute.orders
    GROUP BY user_id
),
active AS (
    SELECT DISTINCT user_id, DATE_TRUNC(DATE(order_time), MONTH) AS month
    FROM beaute.orders
),
cohort_long AS (
    SELECT
        f.cohort,
        DATE_DIFF(a.month, f.cohort, MONTH) AS month_n,
        COUNT(*)                            AS buyers
    FROM first_month AS f
    JOIN active AS a USING (user_id)
    GROUP BY f.cohort, month_n
)
SELECT
    cohort,
    month_n,
    buyers,
    ROUND(100 * buyers
          / MAX(IF(month_n = 0, buyers, NULL)) OVER (PARTITION BY cohort), 1) AS retention_pct
FROM cohort_long;

-- ---------- 05 · daily table ----------
CREATE OR REPLACE TABLE beaute.daily AS
SELECT
    DATE(event_time)                                                AS day,
    COUNT(DISTINCT user_session)                                    AS sessions,
    COUNT(DISTINCT IF(event_type = 'purchase', user_session, NULL)) AS orders,
    SUM(IF(event_type = 'purchase', price, 0))                      AS revenue
FROM beaute.events
GROUP BY day;

-- ---------- 06 · first order tables ----------
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

-- ---------- 07 · chart tables ----------
CREATE OR REPLACE TABLE beaute.chart_daily AS
SELECT day, sessions, orders, ROUND(revenue, 2) AS revenue
FROM beaute.daily;

CREATE OR REPLACE TABLE beaute.chart_cohort AS
SELECT FORMAT_DATE('%Y-%m', cohort) AS cohort, month_n, buyers, retention_pct
FROM beaute.cohort_retention;

-- =====================================================================
-- All results in one table
-- =====================================================================
CREATE OR REPLACE TABLE beaute.results AS

-- 00 · row counts
SELECT '00 row counts' AS section,
       TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.n_rows DESC)) AS result
FROM (
    SELECT 'raw_events' AS tbl, COUNT(*) AS n_rows FROM beaute.raw_events
    UNION ALL SELECT 'distinct raw rows', COUNT(DISTINCT TO_JSON_STRING(r)) FROM beaute.raw_events AS r
    UNION ALL SELECT 'events', COUNT(*) FROM beaute.events
    UNION ALL SELECT 'orders', COUNT(*) FROM beaute.orders
) AS t

-- 01 · data quality
UNION ALL
SELECT '01-1 volume by month',
       TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.month, t.event_type)) AS result
FROM (
    SELECT SUBSTR(event_time, 1, 7) AS month, event_type, COUNT(*) AS n_events
    FROM beaute.raw_events
    GROUP BY month, event_type
) AS t

UNION ALL
SELECT '01-2 missing values', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
    SELECT
        COUNT(*)                                                              AS n_rows,
        ROUND(100 * COUNTIF(brand IS NULL OR TRIM(brand) = '') / COUNT(*), 1) AS brand_missing_pct,
        ROUND(100 * COUNTIF(category_code IS NULL) / COUNT(*), 1)             AS category_code_missing_pct,
        COUNTIF(user_session IS NULL)                                         AS session_missing
    FROM beaute.raw_events
) AS t

UNION ALL
SELECT '01-3 missing brand by event type', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.event_type))
FROM (
    SELECT
        event_type,
        COUNT(*)                                                          AS n_events,
        ROUND(100 * COUNTIF(brand = 'unknown') / COUNT(*), 1)             AS brand_unknown_pct,
        ROUND(100 * SUM(IF(brand = 'unknown', price, 0)) / SUM(price), 1) AS value_unknown_pct
    FROM beaute.events
    GROUP BY event_type
) AS t

UNION ALL
SELECT '01-4 purchase price distribution', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
    SELECT
        COUNTIF(price <= 0)                       AS n_zero_or_negative,
        MIN(price)                                AS min_price,
        APPROX_QUANTILES(price, 100)[OFFSET(25)]  AS p25,
        APPROX_QUANTILES(price, 100)[OFFSET(50)]  AS median,
        APPROX_QUANTILES(price, 100)[OFFSET(75)]  AS p75,
        APPROX_QUANTILES(price, 100)[OFFSET(95)]  AS p95,
        MAX(price)                                AS max_price
    FROM beaute.raw_events
    WHERE event_type = 'purchase'
) AS t

UNION ALL
SELECT '01-5 sessions and users', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
    SELECT
        (SELECT ROUND(AVG(n), 1) FROM (SELECT COUNT(*) AS n FROM beaute.events GROUP BY user_session)) AS avg_events_per_session,
        (SELECT APPROX_QUANTILES(n, 2)[OFFSET(1)] FROM (SELECT COUNT(*) AS n FROM beaute.events GROUP BY user_session)) AS median_events_per_session,
        (SELECT MAX(n) FROM (SELECT COUNT(*) AS n FROM beaute.events GROUP BY user_session)) AS max_events_per_session,
        (SELECT COUNTIF(n > 100) FROM (SELECT COUNT(*) AS n FROM beaute.events GROUP BY user_session)) AS sessions_over_100_events,
        (SELECT ROUND(AVG(n), 2) FROM (SELECT COUNT(DISTINCT user_session) AS n FROM beaute.events GROUP BY user_id)) AS avg_sessions_per_user,
        (SELECT COUNTIF(n = 1) FROM (SELECT COUNT(DISTINCT user_session) AS n FROM beaute.events GROUP BY user_id)) AS one_session_users,
        (SELECT COUNT(DISTINCT user_id) FROM beaute.events) AS n_users
) AS t

UNION ALL
SELECT '01-6 orders', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
    SELECT
        COUNT(*)                                     AS n_orders,
        ROUND(AVG(items), 2)                         AS avg_items,
        ROUND(AVG(order_value), 2)                   AS avg_order_value,
        APPROX_QUANTILES(order_value, 2)[OFFSET(1)]  AS median_order_value,
        APPROX_QUANTILES(items, 2)[OFFSET(1)]        AS median_items
    FROM beaute.orders
) AS t

-- 02 · conversion funnel
UNION ALL
SELECT '02-1 funnel loose vs strict', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.funnel))
FROM (
    SELECT
        funnel,
        s_view,
        s_cart,
        s_purchase,
        ROUND(100 * SAFE_DIVIDE(s_cart,     s_view), 2) AS view_to_cart_pct,
        ROUND(100 * SAFE_DIVIDE(s_purchase, s_cart), 2) AS cart_to_purchase_pct,
        ROUND(100 * SAFE_DIVIDE(s_purchase, s_view), 2) AS view_to_purchase_pct
    FROM (
        SELECT
            'loose' AS funnel,
            COUNTIF(t_view IS NOT NULL) AS s_view,
            COUNTIF(t_cart IS NOT NULL) AS s_cart,
            COUNTIF(t_buy  IS NOT NULL) AS s_purchase
        FROM beaute.session_steps
        UNION ALL
        SELECT
            'strict',
            COUNTIF(t_view IS NOT NULL),
            COUNTIF(t_cart >= t_view),
            COUNTIF(t_cart >= t_view AND t_buy >= t_cart)
        FROM beaute.session_steps
    )
) AS t

UNION ALL
SELECT '02-2 steps skipped', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
    SELECT
        COUNTIF(t_cart IS NOT NULL)                       AS sessions_with_cart,
        COUNTIF(t_cart IS NOT NULL AND t_view IS NULL)    AS cart_without_view,
        COUNTIF(t_buy IS NOT NULL)                        AS sessions_with_purchase,
        COUNTIF(t_buy IS NOT NULL AND t_cart IS NULL)     AS purchase_without_cart,
        COUNTIF(t_buy IS NOT NULL AND t_view IS NULL)     AS purchase_without_view
    FROM beaute.session_steps
) AS t

UNION ALL
SELECT '02-3 strict funnel by month', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.month))
FROM (
    SELECT
        DATE_TRUNC(DATE(t_view), MONTH)                      AS month,
        COUNT(*)                                             AS s_view,
        ROUND(100 * COUNTIF(t_cart >= t_view) / COUNT(*), 2) AS view_to_cart_pct,
        ROUND(100 * SAFE_DIVIDE(COUNTIF(t_cart >= t_view AND t_buy >= t_cart),
                                COUNTIF(t_cart >= t_view)), 2) AS cart_to_purchase_pct,
        ROUND(100 * COUNTIF(t_cart >= t_view AND t_buy >= t_cart) / COUNT(*), 2) AS view_to_purchase_pct
    FROM beaute.session_steps
    WHERE t_view IS NOT NULL
    GROUP BY month
) AS t

UNION ALL
SELECT '02-4 brand matrix by quadrant', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.quadrant))
FROM (
    SELECT
        quadrant,
        COUNT(*)                                      AS n_brands,
        SUM(s_view)                                   AS view_sessions,
        SUM(s_purchase)                               AS purchase_sessions,
        ROUND(100 * SUM(s_purchase) / SUM(s_view), 2) AS view_to_purchase_pct,
        ROUND(SUM(revenue), 0)                        AS revenue
    FROM beaute.chart_brand_matrix
    GROUP BY quadrant
) AS t

-- 02 · brand matrix (all brands)
UNION ALL
SELECT '02-5 brand matrix, all brands',
       TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.s_view DESC))
FROM beaute.chart_brand_matrix AS t

-- 03 · cart abandonment
UNION ALL
SELECT '03-1 item abandonment', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
    SELECT
        COUNT(*)                                      AS carted_items,
        COUNTIF(abandoned)                            AS abandoned_items,
        ROUND(100 * COUNTIF(abandoned) / COUNT(*), 1) AS item_abandon_pct,
        ROUND(SUM(IF(abandoned, price, 0)), 0)        AS abandoned_value
    FROM beaute.cart_items
) AS t

UNION ALL
SELECT '03-2 session abandonment', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
    SELECT
        COUNT(*)                                             AS sessions_with_cart,
        COUNTIF(NOT has_purchase)                            AS sessions_without_purchase,
        ROUND(100 * COUNTIF(NOT has_purchase) / COUNT(*), 1) AS session_abandon_pct
    FROM (
        SELECT user_session, LOGICAL_OR(event_type = 'purchase') AS has_purchase
        FROM beaute.events
        GROUP BY user_session
        HAVING LOGICAL_OR(event_type = 'cart')
    )
) AS t

UNION ALL
SELECT '03-3 abandonment by price band', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.band))
FROM (
    SELECT
        beaute.price_band(price)                      AS band,
        COUNT(*)                                      AS carted_items,
        ROUND(100 * COUNTIF(abandoned) / COUNT(*), 1) AS abandon_pct
    FROM beaute.cart_items
    GROUP BY band
) AS t

UNION ALL
SELECT '03-4 abandonment by brand', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.carted_items DESC))
FROM (
    SELECT
        brand,
        COUNT(*)                                      AS carted_items,
        ROUND(100 * COUNTIF(abandoned) / COUNT(*), 1) AS abandon_pct
    FROM beaute.cart_items
    WHERE brand <> 'unknown'
    GROUP BY brand
    HAVING COUNT(*) >= 500
) AS t

UNION ALL
SELECT '03-5 recovered later', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
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
        (SELECT COUNTIF(abandoned) FROM beaute.cart_items) AS abandoned_items,
        COUNT(*)                                           AS recovered_items,
        ROUND(100 * COUNT(*) / (SELECT COUNTIF(abandoned) FROM beaute.cart_items), 1) AS recovered_pct,
        ROUND(APPROX_QUANTILES(TIMESTAMP_DIFF(buy_time, cart_time, HOUR) / 24, 2)[OFFSET(1)], 1) AS median_days_to_recover,
        COUNTIF(TIMESTAMP_DIFF(buy_time, cart_time, HOUR) <= 24)  AS recovered_within_1d,
        COUNTIF(TIMESTAMP_DIFF(buy_time, cart_time, HOUR) <= 168) AS recovered_within_7d
    FROM recovered
) AS t

-- 04 · cohort retention
UNION ALL
SELECT '04-1 cohort retention', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.cohort, t.month_n))
FROM beaute.chart_cohort AS t

-- 05 · peaks
UNION ALL
SELECT '05-1 daily series', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.day))
FROM beaute.chart_daily AS t

UNION ALL
SELECT '05-2 top 10 revenue days', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.rank_n))
FROM (
    SELECT *
    FROM (
        SELECT
            day,
            FORMAT_DATE('%A', day)                        AS weekday,
            sessions,
            orders,
            ROUND(revenue, 0)                             AS revenue,
            ROUND(revenue  / AVG(revenue)  OVER (PARTITION BY DATE_TRUNC(day, MONTH)), 2) AS revenue_index,
            ROUND(sessions / AVG(sessions) OVER (PARTITION BY DATE_TRUNC(day, MONTH)), 2) AS traffic_index,
            ROUND(100 * orders / sessions, 2)             AS conversion_pct,
            ROW_NUMBER() OVER (ORDER BY revenue DESC)     AS rank_n
        FROM beaute.daily
    )
    WHERE rank_n <= 10
) AS t

UNION ALL
SELECT '05-3 peak vs other days', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.period))
FROM (
    SELECT
        IF(is_peak, 'peak days', 'other days')        AS period,
        COUNT(*)                                      AS n_days,
        ROUND(AVG(sessions), 0)                       AS avg_sessions,
        ROUND(100 * SUM(orders) / SUM(sessions), 2)   AS conversion_pct,
        ROUND(SUM(revenue) / SUM(orders), 2)          AS avg_order_value
    FROM (
        SELECT *, ROW_NUMBER() OVER (ORDER BY revenue DESC) <= 10 AS is_peak
        FROM beaute.daily
    )
    GROUP BY period
) AS t

UNION ALL
SELECT '05-4 weekday x hour (UTC, 1 = Sunday)', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.weekday_n, t.hour_utc))
FROM (
    SELECT
        EXTRACT(DAYOFWEEK FROM event_time)            AS weekday_n,
        EXTRACT(HOUR FROM event_time)                 AS hour_utc,
        COUNT(DISTINCT user_session)                  AS sessions,
        ROUND(100 * COUNT(DISTINCT IF(event_type = 'purchase', user_session, NULL))
              / COUNT(DISTINCT user_session), 2)      AS conversion_pct
    FROM beaute.events
    GROUP BY weekday_n, hour_utc
) AS t

-- 06 · first purchase and repeat
UNION ALL
SELECT '06-1 repeat within 60 days', TO_JSON_STRING(ARRAY_AGG(t))
FROM (
    SELECT
        COUNT(*)                                      AS first_time_buyers,
        COUNT(r.user_id)                              AS repeat_buyers,
        ROUND(100 * COUNT(r.user_id) / COUNT(*), 1)   AS repeat_60d_pct
    FROM beaute.first_order AS f
    LEFT JOIN beaute.repeaters AS r USING (user_id)
) AS t

UNION ALL
SELECT '06-2 repeat by first basket value', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.value_quartile))
FROM (
    SELECT
        value_quartile,
        ROUND(MIN(order_value), 2)                    AS from_value,
        ROUND(MAX(order_value), 2)                    AS to_value,
        COUNT(*)                                      AS first_time_buyers,
        ROUND(100 * COUNT(r.user_id) / COUNT(*), 1)   AS repeat_60d_pct
    FROM (
        SELECT f.*, NTILE(4) OVER (ORDER BY order_value) AS value_quartile
        FROM beaute.first_order AS f
    ) AS q
    LEFT JOIN beaute.repeaters AS r USING (user_id)
    GROUP BY value_quartile
) AS t

UNION ALL
SELECT '06-3 repeat by first basket size', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.items_in_first_order))
FROM (
    SELECT
        LEAST(items, 5)                               AS items_in_first_order,
        COUNT(*)                                      AS first_time_buyers,
        ROUND(100 * COUNT(r.user_id) / COUNT(*), 1)   AS repeat_60d_pct
    FROM beaute.first_order AS f
    LEFT JOIN beaute.repeaters AS r USING (user_id)
    GROUP BY items_in_first_order
) AS t

UNION ALL
SELECT '06-4 repeat by entry brand', TO_JSON_STRING(ARRAY_AGG(t ORDER BY t.first_time_buyers DESC))
FROM (
    SELECT
        brand,
        COUNT(*)                                      AS first_time_buyers,
        ROUND(100 * COUNT(r.user_id) / COUNT(*), 1)   AS repeat_60d_pct
    FROM (
        SELECT DISTINCT f.user_id, e.brand
        FROM beaute.first_order AS f
        JOIN beaute.events AS e
          ON  e.user_session = f.user_session
          AND e.event_type   = 'purchase'
        WHERE e.brand <> 'unknown'
    ) AS fb
    LEFT JOIN beaute.repeaters AS r USING (user_id)
    GROUP BY brand
    HAVING COUNT(*) >= 200
) AS t;

-- Show it: then Save results > CSV (local file)
SELECT * FROM beaute.results ORDER BY section;

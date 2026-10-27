-- =====================================================================
-- 02 · Conversion funnel (BigQuery)
-- Q1: view -> cart -> purchase: where do sessions drop off,
--     and which brands convert better or worse than the rest?
--
-- Data check: 20 % of cart sessions have no view, 25 % of purchase
-- sessions have no view (steps can happen in an earlier session).
-- So the funnel is shown two ways:
--   loose  = a session counts in a step if that step happens at all
--   strict = first view, then first cart, then first purchase, in that
--            time order, inside the same session
-- =====================================================================

-- 1. Overall funnel: loose vs strict
WITH s AS (
    SELECT
        user_session,
        MIN(IF(event_type = 'view',     event_time, NULL)) AS t_view,
        MIN(IF(event_type = 'cart',     event_time, NULL)) AS t_cart,
        MIN(IF(event_type = 'purchase', event_time, NULL)) AS t_buy
    FROM beaute.events
    GROUP BY user_session
),
steps AS (
    SELECT
        'loose' AS funnel,
        COUNTIF(t_view IS NOT NULL) AS s_view,
        COUNTIF(t_cart IS NOT NULL) AS s_cart,
        COUNTIF(t_buy  IS NOT NULL) AS s_purchase
    FROM s
    UNION ALL
    SELECT
        'strict',
        COUNTIF(t_view IS NOT NULL),
        COUNTIF(t_cart >= t_view),
        COUNTIF(t_cart >= t_view AND t_buy >= t_cart)
    FROM s
)
SELECT
    funnel,
    s_view,
    s_cart,
    s_purchase,
    ROUND(100 * SAFE_DIVIDE(s_cart,     s_view), 2) AS view_to_cart_pct,
    ROUND(100 * SAFE_DIVIDE(s_purchase, s_cart), 2) AS cart_to_purchase_pct,
    ROUND(100 * SAFE_DIVIDE(s_purchase, s_view), 2) AS view_to_purchase_pct
FROM steps
ORDER BY funnel;

-- 2. Strict funnel month by month (is conversion stable?)
WITH s AS (
    SELECT
        user_session,
        MIN(IF(event_type = 'view',     event_time, NULL)) AS t_view,
        MIN(IF(event_type = 'cart',     event_time, NULL)) AS t_cart,
        MIN(IF(event_type = 'purchase', event_time, NULL)) AS t_buy
    FROM beaute.events
    GROUP BY user_session
)
SELECT
    DATE_TRUNC(DATE(t_view), MONTH)                     AS month,
    COUNT(*)                                            AS s_view,
    ROUND(100 * COUNTIF(t_cart >= t_view) / COUNT(*), 2) AS view_to_cart_pct,
    ROUND(100 * SAFE_DIVIDE(COUNTIF(t_cart >= t_view AND t_buy >= t_cart),
                            COUNTIF(t_cart >= t_view)), 2) AS cart_to_purchase_pct,
    ROUND(100 * COUNTIF(t_cart >= t_view AND t_buy >= t_cart) / COUNT(*), 2) AS view_to_purchase_pct
FROM s
WHERE t_view IS NOT NULL
GROUP BY month
ORDER BY month;

-- 3. Strict funnel by brand
--    For each session and brand: a product of the brand viewed, then one
--    carted, then one bought, in time order. Brand known for ~57 % of
--    purchases (see 01). Brands with fewer than 1 000 view sessions left out.
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
brand_funnel AS (
    SELECT
        brand,
        COUNTIF(t_view IS NOT NULL)                    AS s_view,
        COUNTIF(t_cart >= t_view)                      AS s_cart,
        COUNTIF(t_cart >= t_view AND t_buy >= t_cart)  AS s_purchase
    FROM sb
    GROUP BY brand
),
revenue AS (
    SELECT brand, SUM(price) AS revenue
    FROM beaute.events
    WHERE event_type = 'purchase' AND brand <> 'unknown'
    GROUP BY brand
),
rates AS (
    SELECT
        b.*,
        r.revenue,
        100 * SAFE_DIVIDE(s_cart,     s_view) AS view_to_cart,
        100 * SAFE_DIVIDE(s_purchase, s_view) AS view_to_purchase
    FROM brand_funnel AS b
    LEFT JOIN revenue AS r USING (brand)
    WHERE s_view >= 1000
)
SELECT
    brand,
    s_view,
    s_cart,
    s_purchase,
    ROUND(revenue, 0)                                          AS revenue,
    ROUND(view_to_cart, 2)                                     AS view_to_cart_pct,
    ROUND(view_to_purchase, 2)                                 AS view_to_purchase_pct,
    -- gap vs the average brand, in percentage points
    ROUND(view_to_purchase - AVG(view_to_purchase) OVER (), 2) AS gap_vs_avg_pts,
    COUNT(*) OVER ()                                           AS n_brands_kept
FROM rates
ORDER BY view_to_purchase_pct DESC   -- switch to ASC for the weakest brands
LIMIT 15;

-- 4. Brand matrix: traffic x conversion
--    Ranking on conversion alone favours small brands. Each brand is
--    placed against the median brand on both axes:
--      Stars        = high traffic, high conversion
--      Hidden gems  = low traffic,  high conversion  -> give them visibility
--      Leaks        = high traffic, low conversion   -> fix page, price, offer
--      Long tail    = low traffic,  low conversion
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
)
SELECT
    k.brand,
    k.s_view,
    k.s_cart,
    k.s_purchase,
    ROUND(k.conv, 2) AS view_to_purchase_pct,
    CASE
        WHEN k.s_view >= m.med_view AND k.conv >= m.med_conv THEN '1. Stars'
        WHEN k.s_view <  m.med_view AND k.conv >= m.med_conv THEN '2. Hidden gems'
        WHEN k.s_view >= m.med_view AND k.conv <  m.med_conv THEN '3. Leaks'
        ELSE                                                      '4. Long tail'
    END AS quadrant
FROM kept AS k
CROSS JOIN med AS m;

-- 4a. Weight of each quadrant
SELECT
    quadrant,
    COUNT(*)                                          AS n_brands,
    SUM(s_view)                                       AS view_sessions,
    SUM(s_purchase)                                   AS purchase_sessions,
    ROUND(100 * SUM(s_purchase) / SUM(s_view), 2)     AS view_to_purchase_pct
FROM beaute.chart_brand_matrix
GROUP BY quadrant
ORDER BY quadrant;

-- 4b. Biggest leaks: most traffic lost
SELECT *
FROM beaute.chart_brand_matrix
WHERE quadrant = '3. Leaks'
ORDER BY s_view DESC
LIMIT 10;

-- 4c. Hidden gems with enough purchases to trust the rate
SELECT *
FROM beaute.chart_brand_matrix
WHERE quadrant = '2. Hidden gems'
  AND s_purchase >= 50
ORDER BY view_to_purchase_pct DESC
LIMIT 10;

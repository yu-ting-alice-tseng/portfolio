-- =====================================================================
-- 02 · Conversion funnel
-- Q1: view -> cart -> purchase: where do sessions drop off,
--     and which brands convert better or worse than the rest?
-- =====================================================================

-- 1. Overall funnel, session level
WITH sessions AS (
    SELECT
        user_session,
        bool_or(event_type = 'view')::INT     AS viewed,
        bool_or(event_type = 'cart')::INT     AS carted,
        bool_or(event_type = 'purchase')::INT AS purchased
    FROM events
    GROUP BY user_session
)
SELECT
    count(*)                                         AS n_sessions,
    sum(viewed)                                      AS s_view,
    sum(carted)                                      AS s_cart,
    sum(purchased)                                   AS s_purchase,
    round(100.0 * sum(carted)    / sum(viewed), 2)   AS view_to_cart_pct,
    round(100.0 * sum(purchased) / sum(carted), 2)   AS cart_to_purchase_pct,
    round(100.0 * sum(purchased) / sum(viewed), 2)   AS view_to_purchase_pct
FROM sessions;

-- 2. Same funnel month by month (is conversion stable?)
WITH sessions AS (
    SELECT
        user_session,
        date_trunc('month', min(event_time))  AS month,
        bool_or(event_type = 'view')::INT     AS viewed,
        bool_or(event_type = 'cart')::INT     AS carted,
        bool_or(event_type = 'purchase')::INT AS purchased
    FROM events
    GROUP BY user_session
)
SELECT
    month,
    count(*)                                         AS n_sessions,
    round(100.0 * sum(carted)    / sum(viewed), 2)   AS view_to_cart_pct,
    round(100.0 * sum(purchased) / sum(carted), 2)   AS cart_to_purchase_pct,
    round(100.0 * sum(purchased) / sum(viewed), 2)   AS view_to_purchase_pct
FROM sessions
GROUP BY month
ORDER BY month;

-- 3. Funnel by brand
--    A brand counts in a step when a session viewed / carted / bought
--    at least one of its products. Small brands are left out (threshold
--    to adjust once you see the volumes).
WITH brand_funnel AS (
    SELECT
        brand,
        count(DISTINCT user_session) FILTER (WHERE event_type = 'view')     AS s_view,
        count(DISTINCT user_session) FILTER (WHERE event_type = 'cart')     AS s_cart,
        count(DISTINCT user_session) FILTER (WHERE event_type = 'purchase') AS s_purchase,
        sum(price) FILTER (WHERE event_type = 'purchase')                   AS revenue
    FROM events
    WHERE brand <> 'unknown'
    GROUP BY brand
)
SELECT
    brand,
    s_view,
    s_cart,
    s_purchase,
    round(revenue, 0)                              AS revenue,
    round(100.0 * s_cart     / s_view, 2)          AS view_to_cart_pct,
    round(100.0 * s_purchase / s_view, 2)          AS view_to_purchase_pct,
    -- gap vs the average brand, in percentage points
    round(100.0 * s_purchase / s_view
          - avg(100.0 * s_purchase / s_view) OVER (), 2) AS gap_vs_avg_pts
FROM brand_funnel
WHERE s_view >= 1000
ORDER BY view_to_purchase_pct DESC   -- switch to ASC for the weakest brands
LIMIT 15;

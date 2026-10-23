# 日圓貶值與精品消費（2015 – 2026）
# 執行前：把工作目錄設在這個資料夾（RStudio：Session > Set Working Directory > To Source File Location）
# 需要的套件：install.packages(c("tidyverse", "sandwich", "lmtest", "plm"))

library(tidyverse)
library(sandwich)
library(lmtest)
library(plm)  # plm 也有 lag()，本檔一律寫明 dplyr::lag

if (!file.exists("data/01_fx_monthly.csv")) {
  stop("找不到 data/ 資料夾，請先把工作目錄設在 analysis.R 所在的資料夾")
}
dir.create("output", showWarnings = FALSE)

# 疫情期間：日本邊境對個人旅客關閉（2020/03 – 2022/10）
covid_start <- as.Date("2020-03-01")
covid_end   <- as.Date("2022-10-01")
# 中國團體旅遊恢復（2023/08）
china_groups <- as.Date("2023-08-01")

read_month <- function(path) {
  read_csv(path, show_col_types = FALSE) %>%
    mutate(month = as.Date(paste0(month, "-01")))
}

# 年增率（%），用 log 差，與 12 個月前比較
yoy <- function(x) 100 * (log(x) - log(dplyr::lag(x, 12)))

# ---------------------------------------------------------------
# 1. 第一層：日本市場月資料
# ---------------------------------------------------------------

fx       <- read_month("data/01_fx_monthly.csv")
arrivals <- read_month("data/02_arrivals_monthly.csv")
stores   <- read_month("data/03_department_stores_monthly.csv")

monthly <- fx %>%
  select(month, jpy_per_eur, cny_per_eur) %>%
  full_join(select(arrivals, month, arrivals_total, arrivals_china), by = "month") %>%
  full_join(select(stores, month, total_sales_jpy_m, taxfree_sales_jpy_m, luxury_cat_sales_jpy_m), by = "month") %>%
  arrange(month) %>%
  # 檢查月份是否連續，lag(12) 才會對到 12 個月前
  complete(month = seq(min(month), max(month), by = "month")) %>%
  mutate(
    jpy_per_cny      = jpy_per_eur / cny_per_eur,             # 1 人民幣兌日圓，數字越大 = 日圓越弱
    domestic_sales   = total_sales_jpy_m - taxfree_sales_jpy_m, # 本地消費 = 總營收 − 免稅營收
    spend_per_visitor = taxfree_sales_jpy_m * 1e6 / arrivals_total, # 每位旅客免稅消費（日圓）
    china_share      = 100 * arrivals_china / arrivals_total,
    g_jpy_eur        = yoy(jpy_per_eur),
    g_jpy_cny        = yoy(jpy_per_cny),
    g_spend          = yoy(spend_per_visitor),
    g_taxfree        = yoy(taxfree_sales_jpy_m),
    g_domestic       = yoy(domestic_sales),
    covid            = month >= covid_start & month <= covid_end,
    # 年增率的比較基期落在疫情期間，也視為受影響
    covid_base       = dplyr::lag(covid, 12, default = FALSE),
    china_groups_on  = month >= china_groups
  )

write_csv(monthly, "output/monthly_clean.csv")

# 基準樣本：排除疫情期間與基期落在疫情期間的月份
m_base <- monthly %>% filter(!covid, !covid_base)

cat("\n月資料：", nrow(monthly), "個月，基準樣本", sum(complete.cases(select(m_base, g_spend, g_jpy_cny))), "個月\n")

# --- 圖表 ---
ggplot(monthly, aes(month, jpy_per_eur)) +
  geom_line(color = "#16211f") +
  annotate("rect", xmin = covid_start, xmax = covid_end, ymin = -Inf, ymax = Inf, alpha = 0.12, fill = "#0d9488") +
  labs(title = "EUR/JPY (monthly average)", x = NULL, y = "JPY per EUR",
       caption = "Source: ECB Data Portal. Shaded: Japan closed to individual tourists.") +
  theme_minimal()
ggsave("output/fig1_eurjpy.png", width = 8, height = 4.5, dpi = 200)

ggplot(filter(monthly, !covid), aes(month, spend_per_visitor / 1000)) +
  geom_line(color = "#0d9488") +
  labs(title = "Department store tax-free sales per foreign visitor", x = NULL, y = "Thousand JPY",
       caption = "Source: Japan Department Stores Association, JNTO.") +
  theme_minimal()
ggsave("output/fig2_spend_per_visitor.png", width = 8, height = 4.5, dpi = 200)

# --- H1：日圓越弱，每位旅客免稅消費越高 ---
nw <- function(model) coeftest(model, vcov = NeweyWest(model, lag = 12, prewhite = FALSE))

h1_m <- lm(g_spend ~ g_jpy_cny + china_share + china_groups_on, data = m_base)
cat("\n=== H1（月資料）：每位旅客免稅消費年增率 ===\n")
print(nw(h1_m))

# --- H2：本地消費對匯率的反應較弱 ---
h2_taxfree  <- lm(g_taxfree  ~ g_jpy_eur, data = m_base)
h2_domestic <- lm(g_domestic ~ g_jpy_eur, data = m_base)
cat("\n=== H2：免稅營收年增率 ~ EUR/JPY ===\n");  print(nw(h2_taxfree))
cat("\n=== H2：本地營收年增率 ~ EUR/JPY ===\n");  print(nw(h2_domestic))

# 兩個係數的差異：把兩條式子疊在一起，用交互項檢定
h2_stack <- m_base %>%
  select(month, g_jpy_eur, taxfree = g_taxfree, domestic = g_domestic) %>%
  pivot_longer(c(taxfree, domestic), names_to = "channel", values_to = "growth") %>%
  mutate(taxfree = channel == "taxfree")
h2_diff <- lm(growth ~ g_jpy_eur * taxfree, data = h2_stack)
cat("\n=== H2：係數差異（g_jpy_eur:taxfreeTRUE > 0 支持 H2）===\n")
# 依月份群聚的穩健標準誤（同一個月的兩筆觀察不獨立）
print(coeftest(h2_diff, vcov = vcovCL(h2_diff, cluster = ~ month)))

# ---------------------------------------------------------------
# 2. 第二層：精品集團季資料
# ---------------------------------------------------------------

groups <- read_csv("data/04_groups_quarterly.csv", show_col_types = FALSE)

# 季平均匯率
fx_q <- monthly %>%
  mutate(year = as.integer(format(month, "%Y")),
         quarter = (as.integer(format(month, "%m")) - 1) %/% 3 + 1) %>%
  group_by(year, quarter) %>%
  summarise(n_months = sum(!is.na(jpy_per_eur)), jpy_per_eur = mean(jpy_per_eur), .groups = "drop") %>%
  filter(n_months == 3) %>%
  arrange(year, quarter) %>%
  mutate(g_jpy_eur      = 100 * (log(jpy_per_eur) - log(dplyr::lag(jpy_per_eur, 4))),
         g_jpy_eur_lag1 = dplyr::lag(g_jpy_eur, 1))

quarterly <- groups %>%
  left_join(select(fx_q, year, quarter, g_jpy_eur, g_jpy_eur_lag1), by = c("year", "quarter")) %>%
  mutate(
    q_date        = as.Date(sprintf("%d-%02d-01", year, (quarter - 1) * 3 + 1)),
    japan_excess  = japan_cc - group_cc,  # 日本超額成長（百分點）
    # 季資料的疫情排除：營收季度或其前一年同季落在邊境關閉期間
    covid         = q_date >= as.Date("2020-01-01") & q_date <= as.Date("2023-09-01")
  ) %>%
  arrange(group, year, quarter)

write_csv(quarterly, "output/quarterly_clean.csv")

q_base <- quarterly %>% filter(!covid)
cat("\n季資料：", n_distinct(quarterly$group), "家集團，基準樣本", sum(!is.na(q_base$japan_excess)), "筆\n")

ggplot(filter(quarterly, !is.na(japan_excess)), aes(q_date, japan_excess, color = group)) +
  geom_hline(yintercept = 0, color = "grey60") +
  geom_line() +
  labs(title = "Japan growth minus group growth (constant currency)", x = NULL,
       y = "Percentage points", color = NULL,
       caption = "Source: company quarterly releases.") +
  theme_minimal() + theme(legend.position = "bottom")
ggsave("output/fig3_japan_excess.png", width = 8, height = 4.5, dpi = 200)

pq <- pdata.frame(as.data.frame(q_base) %>% mutate(t = paste(year, quarter)), index = c("group", "t"))
# 集團內的群聚標準誤
fe_se <- function(model) coeftest(model, vcov = vcovHC(model, method = "arellano", cluster = "group"))

h1_q <- plm(japan_excess ~ g_jpy_eur, data = pq, model = "within")
cat("\n=== H1（集團）：日本超額成長 ~ EUR/JPY 年變動，集團固定效果 ===\n")
print(fe_se(h1_q))

h3_q <- plm(asia_ex_japan_cc ~ japan_excess, data = pq, model = "within")
cat("\n=== H3：亞洲（不含日本）成長 ~ 日本超額成長，集團固定效果（係數 < 0 支持 H3）===\n")
print(fe_se(h3_q))

# ---------------------------------------------------------------
# 3. 穩健性
# ---------------------------------------------------------------

# 3a. 納入疫情期間，加虛擬變數
m_all <- monthly %>% filter(!covid)  # 邊境關閉時免稅消費趨近於零，每位旅客消費無意義，仍排除
h1_rob_base <- lm(g_spend ~ g_jpy_cny + china_share + china_groups_on + covid_base, data = m_all)
cat("\n=== 穩健性：納入基期落在疫情期間的月份 ===\n"); print(nw(h1_rob_base))

# 3b. 匯率落後一季（價差需要時間被旅客發現）
h1_lag <- plm(japan_excess ~ g_jpy_eur_lag1, data = pq, model = "within")
cat("\n=== 穩健性：匯率落後一季 ===\n"); print(fe_se(h1_lag))

# 3c. 一次排除一家集團
cat("\n=== 穩健性：一次排除一家集團（H1 係數）===\n")
for (g in unique(q_base$group)) {
  d <- pdata.frame(as.data.frame(filter(q_base, group != g)) %>% mutate(t = paste(year, quarter)),
                   index = c("group", "t"))
  m <- plm(japan_excess ~ g_jpy_eur, data = d, model = "within")
  ct <- fe_se(m)
  cat(sprintf("  排除 %-10s 係數 = %6.3f  p = %.3f\n", g, ct[1, 1], ct[1, 4]))
}

cat("\n完成：圖表與清理後的資料在 output/\n")

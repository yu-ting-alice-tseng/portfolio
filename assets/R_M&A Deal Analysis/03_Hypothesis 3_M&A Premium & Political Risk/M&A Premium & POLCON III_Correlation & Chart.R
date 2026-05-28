library(tidyverse)
library(readr)
library(readxl)
library(janitor) 

#Data Input
polcon_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_POLCON/POLCON_2025_FINALPOSTED.xlsx")
ma_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_M&A Volume/M&A_LatAm_Transactions_Dataset.xlsx")

# 2. 清理 M&A 資料
ma_clean <- ma_data %>%
  clean_names() %>%
  filter(!is.na(premium_4_weeks_percent)) %>%
  mutate(
    year = year(as.Date(date_effective)),
    # 將國家轉為大寫以匹配 POLCON
    country = toupper(target_nation)
  ) %>%
  select(country, year, premium = premium_4_weeks_percent)

# 3. 清理 POLCON 資料 (政治約束力/穩定性指標)
sa_countries <- c("ARGENTINA", "BOLIVIA", "BRAZIL", "CHILE", "COLOMBIA", 
                  "ECUADOR", "GUYANA", "SURINAME", "PARAGUAY", "PERU", 
                  "URUGUAY", "VENEZUELA")

polcon_clean <- polcon_data %>%
  # 篩選南美國家並確保變數名稱正確
  filter(cnts_country %in% sa_countries) %>%
  select(
    country = cnts_country, 
    year, 
    polcon_score = POLCONIII_2025 # 這是主要的穩定性指標
  ) %>%
  mutate(year = as.numeric(year))

# 4. 合併資料
# 現在按「國家」和「年份」精確合併
final_df <- ma_clean %>%
  inner_join(polcon_clean, by = c("country", "year")) %>%
  drop_na(polcon_score)

# 5. 假設檢定 H3
# H3 預測：政治不穩定會降低溢價。
# 由於 POLCON 代表穩定性，H3 預測：POLCON 越高，溢價越高 (正相關)。

# A. 相關性檢定
cor.test(final_df$premium, final_df$polcon_score, method = "pearson")

# B. 線性迴歸
# Premium = Intercept + Beta * Polcon_Score
model <- lm(premium ~ polcon_score, data = final_df)
summary(model)

# 6. 視覺化
ggplot(final_df, aes(x = polcon_score, y = premium)) +
  geom_point(alpha = 0.5, color = "darkgreen") +
  geom_smooth(method = "lm", color = "blue") +
  labs(
    title = "Impact of Political Constraints (POLCON) on Acquisition Premiums",
    subtitle = "Testing H3: Do stronger institutions lead to higher premiums?",
    x = "POLCON III Index (Higher = More Stability/Constraint)",
    y = "Acquisition Premium (%)"
  ) +
  theme_minimal()

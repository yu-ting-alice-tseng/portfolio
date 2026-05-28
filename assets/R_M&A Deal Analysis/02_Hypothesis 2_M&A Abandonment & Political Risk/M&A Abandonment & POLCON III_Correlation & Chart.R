library(tidyverse)
library(readxl)
library(janitor) 

# 1. Data Input
# 讀取 POLCON 數據
polcon_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_POLCON/POLCON_2025_FINALPOSTED.xlsx")

# 讀取 M&A 數據
ma_ab_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_M&A Volume/Mergers & Acquisitions (M&A) - South America-With Abandonment.xlsx") %>% 
  clean_names() %>%
  mutate(Year = as.numeric(as.character(year)),
         abandonment_rate = abandoned / deals) %>% 
  filter(!is.na(Year))

# 2. 處理 POLCON 數據
# 注意：POLCON 檔案中的國家名稱通常是全大寫 (ALL CAPS)
sa_countries <- c("ARGENTINA", "BOLIVIA", "BRAZIL", "CHILE", "COLOMBIA", "ECUADOR", 
                  "GUYANA", "SURINAME", "PARAGUAY", "PERU", "URUGUAY", "VENEZUELA")

polcon_sa <- polcon_data %>%
  filter(cnts_country %in% sa_countries) %>%
  group_by(year) %>%
  # 使用 POLCONIII 作為主要的政治約束指標
  summarise(Avg_POLCON = mean(POLCONIII_2025, na.rm = TRUE)) %>%
  rename(Year = year) %>%
  mutate(Year = as.numeric(Year))

# 3. Merge Datasets
# 修正：這裡要對接到 polcon_sa 而不是舊的 fsi_long
merged_df <- inner_join(ma_ab_data, polcon_sa, by = "Year")

# 4. Binomial Regression Model (H2 測試)
# 使用 Avg_POLCON 作為自變數
model <- glm(cbind(abandoned, deals - abandoned) ~ Avg_POLCON, 
             data = merged_df, 
             family = binomial(link = "logit"))

# 解讀：若 H2 成立，Avg_POLCON 的係數應為負值 (約束力越低 -> 越不穩定 -> 放棄率越高)
summary(model)
print(model)
# 5. Plotting (雙軸趨勢圖)

# 計算縮放比例
scale_factor <- max(merged_df$Avg_POLCON, na.rm = TRUE) / max(merged_df$abandonment_rate, na.rm = TRUE)

ggplot(merged_df, aes(x = Year)) +
  # [底層] 放棄率長條圖
  geom_bar(aes(y = abandonment_rate * scale_factor, fill = "Abandonment Rate"), 
           stat = "identity", alpha = 0.4) +
  
  # [頂層] POLCON 指數折線圖
  geom_line(aes(y = Avg_POLCON, color = "Political Constraint (POLCON)"), size = 1.2) +
  geom_point(aes(y = Avg_POLCON, color = "Political Constraint (POLCON)"), size = 2.5) +
  
  # 設定雙 Y 軸
  scale_y_continuous(
    name = "POLCON III Index (Line)",
    sec.axis = sec_axis(~ . / scale_factor, 
                        name = "Deal Abandonment Rate (Bar)", 
                        labels = scales::percent)
  ) +
  
  # 設定 X 軸間隔
  scale_x_continuous(
    breaks = seq(min(merged_df$Year), max(merged_df$Year), by = 3)
  ) +
  
  # 顏色與美化
  scale_color_manual(values = c("Political Constraint (POLCON)" = "#009E73")) + # 綠色代表制度約束
  scale_fill_manual(values = c("Abandonment Rate" = "#999999")) +
  labs(title = "Policy Stability and M&A Abandonment",
       subtitle = "Testing H2: Higher Political Constraints should reduce Abandonment",
       x = "Year",
       color = "", fill = "",
       caption = "Data Sources: POLCON Database (Henisz, 2025) & Capital IQ") +
  theme_minimal() +
  theme(legend.position = "bottom",
        axis.title.y.right = element_text(color = "#999999"),
        axis.title.y.left = element_text(color = "#009E73"))


# 計算 Pearson 相關檢定
cor_test <- cor.test(merged_df$Avg_POLCON, merged_df$abandonment_rate, method = "pearson")

# 提取關鍵數值
r_value <- cor_test$estimate
p_value <- cor_test$p.value

# 輸出結果
cat("Pearson Correlation (r):", r_value, "\n")
cat("P-value:", p_value, "\n")
print(cor_test)


# 1. 手動計算相關係數
res <- cor.test(merged_df$Avg_POLCON, merged_df$abandonment_rate, method = "pearson")
my_label <- paste0("r = ", round(res$estimate, 2), ", p = ", round(res$p.value, 4))

# 2. 基本 ggplot 繪製
ggplot(merged_df, aes(x = Avg_POLCON, y = abandonment_rate)) +
  geom_point(aes(size = deals), color = "#0072B2", alpha = 0.6) +
  geom_smooth(method = "lm", color = "#D55E00") +
  # 手動加入標籤
  annotate("text", x = max(merged_df$Avg_POLCON), y = max(merged_df$abandonment_rate), 
           label = my_label, hjust = 1, vjust = 1, fontface = "bold") +
  scale_y_continuous(labels = scales::percent) +
  theme_minimal()

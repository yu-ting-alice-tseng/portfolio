library(tidyverse)
library(readr)
library(readxl)
library(janitor) 

# 1. Data Input
# 讀取 FSI 數據 (CSV)
fsi_data <- read_csv("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_Fragile States Index/fsi-Combined-Region.csv", show_col_types = FALSE)

# 讀取 M&A 數據 (Excel)
ma_ab_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_M&A Volume/Mergers & Acquisitions (M&A) - South America-With Abandonment.xlsx") %>% 
  clean_names() %>%
  mutate(Year = as.numeric(as.character(year)),
         abandonment_rate = abandoned / deals) %>% 
  filter(!is.na(Year))

# 2. 處理 FSI 數據
sa_countries <- c("Argentina", "Bolivia", "Brazil", "Chile", "Colombia", 
                  "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname", 
                  "Uruguay", "Venezuela") # 注意：FSI 檔案中通常簡稱為 Venezuela

fsi_long <- fsi_data %>%
  filter(Country %in% sa_countries) %>%
  # 將年份欄位從寬表轉成長表
  pivot_longer(cols = starts_with("20"), names_to = "Year", values_to = "FSI_Score") %>%
  mutate(Year = as.numeric(Year)) %>%
  group_by(Year) %>%
  summarise(Avg_FSI = mean(FSI_Score, na.rm = TRUE)) %>%
  arrange(Year)

# 3. Merge Datasets
merged_df <- inner_join(ma_ab_data, fsi_long, by = "Year")

# 4. Binomial Regression Model (H2 測試)
# 使用 Avg_FSI 作為自變數
model <- glm(cbind(abandoned, deals - abandoned) ~ Avg_FSI, 
             data = merged_df, 
             family = binomial(link = "logit"))

summary(model)
print(model)

# 5. Plotting (雙軸趨勢圖)

# 【關鍵】根據新變數 Avg_FSI 計算縮放比例
scale_factor <- max(merged_df$Avg_FSI, na.rm = TRUE) / max(merged_df$abandonment_rate, na.rm = TRUE)

ggplot(merged_df, aes(x = Year)) +
  # [底層] 放棄率長條圖
  geom_bar(aes(y = abandonment_rate * scale_factor, fill = "Abandonment Rate"), 
           stat = "identity", alpha = 0.4) +
  
  # [頂層] FSI 指數折線圖
  geom_line(aes(y = Avg_FSI, color = "Fragile States Index"), size = 1.2) +
  geom_point(aes(y = Avg_FSI, color = "Fragile States Index"), size = 2.5) +
  
  # 設定雙 Y 軸
  scale_y_continuous(
    name = "Fragile States Index (Line)",
    sec.axis = sec_axis(~ . / scale_factor, 
                        name = "Deal Abandonment Rate (Bar)", 
                        labels = scales::percent)
  ) +
  
  # 設定 X 軸間隔
  scale_x_continuous(
    breaks = seq(min(merged_df$Year), max(merged_df$Year), by = 3)
  ) +
  
  # 顏色與美化
  scale_color_manual(values = c("Fragile States Index" = "#D55E00")) + # 改用橘紅色代表脆弱度
  scale_fill_manual(values = c("Abandonment Rate" = "#999999")) +
  labs(title = "Co-movement of Fragile States Index and M&A Abandonment",
       subtitle = "Region: South America (Testing H2 with FSI Data)",
       x = "Year",
       color = "", fill = "",
       caption = "Data Sources: Fragile States Index (FFP) & Capital IQ") +
  theme_minimal() +
  theme(legend.position = "bottom",
        axis.title.y.right = element_text(color = "#999999"),
        axis.title.y.left = element_text(color = "#D55E00"))


# 1. 先計算相關係數 (Pearson Correlation)
cor_res <- cor.test(merged_df$Avg_FSI, merged_df$abandonment_rate)
cor_label <- paste0("r = ", round(cor_res$estimate, 2), 
                    ", p = ", round(cor_res$p.value, 4))

print(cor_res)
# 2. 繪圖
ggplot(merged_df, aes(x = Avg_FSI, y = abandonment_rate)) +
  # 點的大小代表當年的總交易數
  geom_point(aes(size = deals), color = "#D55E00", alpha = 0.6) +
  
  # 加入線性回歸線與信心區間
  geom_smooth(method = "lm", color = "#333333", fill = "lightgray") +

  
  # 格式化
  scale_y_continuous(labels = scales::percent) +
  labs(title = "Correlation: Fragile States Index vs. M&A Abandonment Rate",
       x = "Average Fragile States Index (Higher = More Fragile)",
       y = "Deal Abandonment Rate (%)",
       size = "Total Deals") +
  theme_minimal() +
  theme(legend.position = "none")

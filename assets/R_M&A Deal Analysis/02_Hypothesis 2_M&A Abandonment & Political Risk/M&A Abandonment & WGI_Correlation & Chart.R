install.packages("janitor")

library(tidyverse)
library(readr)
library(readxl)
library(janitor) 

#Data Input
wgi_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_Workd Governance Indicators/Political Stability_2025.xlsx")
ma_ab_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_M&A Volume/Mergers & Acquisitions (M&A) - South America-With Abandonment.xlsx")%>% 
  clean_names() %>%
  # 【關鍵修正】將 year 轉換為數字型態，並移除可能的空值
  mutate(Year = as.numeric(as.character(year)), 
         abandonment_rate=abandoned/deals) %>%
  filter(!is.na(Year))

# 2. Clean and Filter Political Stability Data
# We filter for South American countries and calculate an annual average
sa_countries <- c("Argentina", "Bolivia", "Brazil", "Chile", "Colombia", 
                  "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname", 
                  "Uruguay", "Venezuela, RB")

regional_stability <- wgi_data %>%
  filter(Region %in% c("Latin America & Caribbean")) %>% 
  group_by(Year) %>%
  summarise(Avg_Stability = mean(`Governance estimate (approx. -2.5 to +2.5)`, na.rm = TRUE)) %>%
  mutate(Instability=-Avg_Stability) %>%
  arrange(Year)

# 3. Merge Datasets
merged_df <- inner_join(ma_ab_data, regional_stability, by = "Year")
merged_df<- merged_df %>%
  mutate(Year = as.numeric(as.character(Year)))

# 4. Binomial Regression Model
# We model the probability of abandonment based on instability
model <- glm(cbind(abandoned, deals - abandoned) ~ Instability, 
             data = merged_df, 
             family = binomial(link = "logit"))

# Display results
summary(model)
print(model)

# 5. Plotting the Relationship


# 2. 【關鍵】計算雙軸縮放比例
# 我們希望長條圖（放棄率）的高度能跟折線圖（不穩定性）在視覺上對齊
# 這裡計算兩者最大值的比例
scale_factor <- max(merged_df$Instability, na.rm = TRUE) / max(merged_df$abandonment_rate, na.rm = TRUE)

# 3. 繪圖
ggplot(merged_df, aes(x = Year)) +
  # [底層] 放棄率長條圖：將數值放大 scale_factor 倍以對齊左軸
  geom_bar(aes(y = abandonment_rate * scale_factor, fill = "Abandonment Rate"), 
           stat = "identity", alpha = 0.4) +
  
  # [頂層] 不穩定性折線圖
  geom_line(aes(y = Instability, color = "Political Instability"), size = 1.2) +
  geom_point(aes(y = Instability, color = "Political Instability"), size = 2.5) +
  
  # 設定雙 Y 軸
  scale_y_continuous(
    name = "Political Instability Index (Line)", # 左軸標題
    # 右軸設定：將左軸數值除回 scale_factor，並轉為百分比格式
    sec.axis = sec_axis(~ . / scale_factor, 
                        name = "Deal Abandonment Rate (Bar)", 
                        labels = scales::percent)
  ) +
  #設定x間隔
  scale_x_continuous(
    breaks = seq(min(merged_df$Year), max(merged_df$Year), by = 4)
  ) +
  
  # 手動調整顏色
  scale_color_manual(values = c("Political Instability" = "#0072B2")) +
  scale_fill_manual(values = c("Abandonment Rate" = "#E69F00")) +
  
  # 其他美化設定
  labs(title = "Co-movement of Political Instability and M&A Abandonment",
       subtitle = "Region: South America (Historical Trends 2000-2024)",
       x = "Year",
       color = "", fill = "",
       caption = "Data Sources: World Bank WGI & Capital IQ") +
  theme_minimal() +
  theme(legend.position = "bottom",
        plot.title = element_text(face = "bold", size = 14),
        axis.title.y.right = element_text(color = "#E69F00"),
        axis.title.y.left = element_text(color = "#0072B2"))


# 計算皮爾森相關係數 (Pearson Correlation)
cor_result <- cor.test(merged_df$Instability, merged_df$abandonment_rate)
cor_r <- round(cor_result$estimate, 3)
p_val <- format.pval(cor_result$p.value, digits = 3)
print(cor_result)
print(cor_r)
print(p_val)

# 建立相關性散佈圖
ggplot(merged_df, aes(x = Instability, y = abandonment_rate)) +
  # 繪製資料點
  geom_point(aes(size = abandoned), alpha = 0.5) + 
  
  # 加入線性回歸線 (包含 95% 信心區間)
  geom_smooth(method = "lm", color = "#D55E00", fill = "#D55E00", alpha = 0.1) +
  
  # 格式化 Y 軸為百分比
  scale_y_continuous(labels = scales::percent) +
  
  # 調整圓圈大小範圍
  scale_size_continuous(range = c(2, 10)) +
  
  # 隱藏圖例中的具體數字刻度 (Breaks)
  guides(size = guide_legend(override.aes = list(color = "#0072B2"), 
                             labels = NULL, 
                             ticks = FALSE)) +
  
  # 標註與標題
  labs(
    title = "Correlation Between Political Instability (WGI) and M&A Abandonment",
    x = "Political Instability Index (Higher = More Unstable)",
    y = "Deal Abandonment Rate (%)") +
  
  theme_minimal() +
  theme(
    plot.title = element_text(face = "bold", size = 14),
    legend.position = "none"
  )

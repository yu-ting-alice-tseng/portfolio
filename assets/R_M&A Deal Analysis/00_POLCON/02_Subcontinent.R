library(tidyverse)
library(readxl)

# 1. 執行這一段來建立 df_plot 物件
df_plot <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/POLCON_2025_FINALPOSTED.xlsx", sheet = "Data") %>%
  filter(year >= 1905) %>%
  # 建立次區域分類
  mutate(sub_continent = case_when(
    ccode %in% c(2, 20) ~ "North America",
    ccode >= 31 & ccode <= 165 ~ "Latin America & Caribbean",
    ccode >= 200 & ccode <= 338 ~ "Western & Northern Europe",
    ccode %in% c(339:379, 701:705) ~ "Eastern Europe & Central Asia",
    ccode %in% c(435, 600:698) ~ "Middle East & North Africa",
    ccode >= 400 & ccode <= 599 & ccode != 435 ~ "Sub-Saharan Africa",
    ccode >= 710 & ccode <= 740 ~ "East Asia",
    ccode >= 750 & ccode <= 790 ~ "South Asia",
    ccode >= 800 & ccode <= 860 ~ "Southeast Asia",
    TRUE ~ "Others"
  )) %>%
  # 排除不需要的分類
  filter(sub_continent != "Others" & sub_continent != "Oceania") %>%
  # 手動排序圖例 (地理鄰近性)
  mutate(sub_continent = fct_relevel(sub_continent, 
                                     "North America", "Latin America & Caribbean", 
                                     "Western & Northern Europe", "Eastern Europe & Central Asia", 
                                     "Middle East & North Africa", "Sub-Saharan Africa", 
                                     "East Asia", "Southeast Asia", "South Asia"
  )) %>%
  # 計算年度平均
  group_by(year, sub_continent) %>%
  summarize(avg_polcon3 = mean(POLCONIII_2025, na.rm = TRUE), .groups = "drop")

# 2. 檢查物件是否建立成功
# 如果執行這行有出現表格，就代表成功了
print(head(df_plot))

# 3. 執行繪圖
my_colors <- c(
  "North America" = "#8B0000", "Latin America & Caribbean" = "#FF69B4",
  "Western & Northern Europe" = "#00008B", "Eastern Europe & Central Asia" = "#87CEEB",
  "Middle East & North Africa" = "#FF8C00", "Sub-Saharan Africa" = "#800080",
  "East Asia" = "#006400", "Southeast Asia" = "#32CD32", "South Asia" = "#ADFF2F"
)

ggplot(df_plot, aes(x = year, y = avg_polcon3, color = sub_continent)) +
  geom_line(size = 0.8) +
  scale_color_manual(values = my_colors) +
  scale_x_continuous(breaks = seq(1905, 2025, by = 20)) +
  labs(title = "Political Constraints Trends by Region (Since 1905)",
       x = "Year", y = "Average POLCON III", color = "Region",
       caption = "Source: Henisz, Witold J. (2025). Political Constraint Index (POLCON) Dataset.") +
  theme_minimal() +
  theme(
    legend.position = "bottom",
    plot.margin = margin(10, 10, 20, 10),
    legend.text = element_text(size = 9),
    plot.caption = element_text(size = 7, color = "grey50")
  ) +
  guides(color = guide_legend(ncol = 3, byrow = TRUE))

# create the plot
ggplot(usa_data, aes(x = year, y = POLCONIII_2025)) +
  geom_line(color = "steelblue", size = 1) +
  labs(title = "Political Constraint Index (POLCON III) over Time: USA",
       subtitle = "Source: Henisz (2025) POLCON Dataset",
       x = "Year",
       y = "POLCON III Index") +
  theme_minimal()

# Define countries to compare
target_countries <- c("US", "CANADA", "MEXICO", "UK", "FRANCE")

# Filter and plot
df %>%
  filter(cnts_country %in% target_countries) %>%
  ggplot(aes(x = year, y = POLCONIII_2025, color = cnts_country)) +
  geom_line(size = 0.8) +
  labs(title = "Comparison of Political Constraints",
       subtitle = "Source: Henisz (2025) POLCON Dataset",
       x = "Year",
       y = "POLCON III Index",
       color = "Country") +
  theme_minimal()


#If you have many countries and want to see them in separate small windows, use facet_wrap.
df %>%
  filter(cnts_country %in% target_countries) %>%
  ggplot(aes(x = year, y = POLCONV_2025)) +
  geom_line(color = "darkred") +
  facet_wrap(~cnts_country) +
  labs(title = "Political Constraints by Country",
       subtitle = "Source: Henisz (2025) POLCON Dataset",
       x = "Year",
       y = "POLCON V Index") +
  theme_light()


# 2. Create a Continent column based on the Country Code (ccode)
df_clean <- df %>%
  mutate(continent = case_when(
    ccode >= 1 & ccode <= 199   ~ "Americas",
    ccode >= 200 & ccode <= 399 ~ "Europe",
    ccode >= 400 & ccode <= 599 ~ "Africa",
    ccode >= 600 & ccode <= 699 ~ "Middle East",
    ccode >= 700 & ccode <= 899 ~ "Asia",
    ccode >= 900 & ccode <= 999 ~ "Oceania",
    TRUE ~ "Other"
  )) %>%
  # Filter for years after 1900
  filter(year > 1900)

# 3. Calculate the Average POLCON III per year and continent
continent_avg <- df_clean %>%
  group_by(year, continent) %>%
  summarize(avg_polcon3 = mean(POLCONIII_2025, na.rm = TRUE)) %>%
  ungroup()

# 4. Create the Visualization
ggplot(continent_avg, aes(x = year, y = avg_polcon3, color = continent)) +
  geom_line(size = 1) +
  labs(
    title = "Average Political Constraints (POLCON III) by Continent",
    subtitle = "Data limited to years after 1900",
    x = "Year",
    y = "Mean POLCON III Index",
    color = "Continent",
    caption = "Source: Henisz, Witold J. (2025). Political Constraint Index (POLCON) Dataset."
  ) +
  theme_minimal() +
  scale_x_continuous(breaks = seq(1900, 2025, by = 25))


# 2. 定義次區域 (Sub-continents)
# 根據國碼 (ccode) 將具有相似政經背景的國家分組
df_sub <- df %>%
  filter(year >= 1900) %>%
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
    ccode >= 900 & ccode <= 990 ~ "Oceania",
    TRUE ~ "Others"
  ))

# 3. 繪製趨勢圖
ggplot(df_sub, aes(x = year, y = POLCONIII_2025, color = sub_continent)) +
  # 使用 group = cnts_country 讓 R 知道每一條線代表一個國家
  # alpha = 0.4 是為了讓大量線條重疊時仍具備可讀性
  geom_line(aes(group = cnts_country), alpha = 0.4) +
  # 增加一條加粗的各區域平均線，方便觀察整體趨勢
  stat_summary(fun = mean, geom = "line", size = 1.2, linetype = "solid") +
  labs(
    title = "Political Constraints (POLCON III) by Sub-continent since 1900",
    subtitle = "Thin lines: Individual countries | Thick lines: Sub-continent average",
    x = "Year",
    y = "POLCON III Index",
    color = "Sub-continent",
    caption = "Source: Henisz, Witold J. (2025). Political Constraint Index (POLCON) Dataset."
  ) +
  theme_minimal() +
  scale_x_continuous(breaks = seq(1900, 2025, by = 20)) +
  theme(legend.position = "bottom")

#Only keep the sub continent's average
# 1. 讀取與定義區域
df_avg <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/POLCON_2025_FINALPOSTED.xlsx", sheet = "Data") %>%
  filter(year >= 1900) %>%
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
    ccode >= 900 & ccode <= 990 ~ "Oceania",
    TRUE ~ "Others"
  )) %>%
# 2. 計算各區域、各年份的平均值 (關鍵步驟)
  group_by(year, sub_continent) %>%
  summarize(avg_polcon3 = mean(POLCONIII_2025, na.rm = TRUE)) %>%
  ungroup()

# 定義顏色清單 (你可以根據喜好修改這些 Hex Code)
sub_continent_colors <- c(
  "North America"                 = "#8B0000", # 深紅
  "Latin America & Caribbean"     = "#FF69B4", # 粉紅
  "Western & Northern Europe"     = "#00008B", # 深藍
  "Eastern Europe & Central Asia" = "#87CEEB", # 天藍
  "East Asia"                     = "#006400", # 深綠
  "Southeast Asia"                = "#32CD32", # 亮綠
  "South Asia"                    = "#ADFF2F", # 黃綠
  "Middle East & North Africa"    = "#FF8C00", # 橘色
  "Sub-Saharan Africa"            = "#800080"  # 紫色
)

df_plot <- df_plot %>%
  mutate(sub_continent = fct_relevel(sub_continent, 
                                     "North America", "Latin America & Caribbean",   # 美洲組
                                     "Western & Northern Europe", "Eastern Europe & Central Asia", # 歐洲/中亞組
                                     "Middle East & North Africa", "Sub-Saharan Africa", # 非洲/中東組
                                     "East Asia", "Southeast Asia", "South Asia"      # 亞洲組
  ))

# 3. 繪製平均趨勢圖
ggplot(df_avg %>% filter(year>=1905 & sub_continent != "Oceania" & sub_continent != "Others"), aes(x = year, y = avg_polcon3, color = sub_continent)) +
  geom_line(size = 0.8) + # 線條稍微加粗，因為現在線條很少
  labs(
    title = "Average Political Constraints (POLCON III) by Sub-continent",
    subtitle = "Aggregated trends since 1905",
    x = "Year",
    y = "Mean POLCON III Index",
    caption = "Source: Henisz, Witold J. (2025). Political Constraint Index (POLCON) Dataset."
  ) +
  theme_minimal() +
  scale_color_manual(values = sub_continent_colors)+
  scale_x_continuous(breaks = seq(1905, 2025, by = 20)) +
  theme(legend.position = "bottom",
        legend.key.width = unit(1, "cm"),
        legend.text = element_text(size=7),
        plot.margin = margin(10, 10, 10, 10), 
        plot.caption = element_text(size=7, color="grey40"))+
  # 控制圖例不要排成一長排，而是自動換行
  guides(color = guide_legend(nrow = 3, byrow = TRUE)) 


        
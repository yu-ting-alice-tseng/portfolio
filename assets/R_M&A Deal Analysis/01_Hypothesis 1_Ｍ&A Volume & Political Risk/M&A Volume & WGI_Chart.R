                                                                                  屋屋library(tidyverse)
library(readr)
library(readxl)

#Data Input
wgi_raw <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/Workd Governance Indicators/Political Stability_2025.xlsx")
ma_raw <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/M&A Volume/Mergers & Acquisitions (M&A) - South America.xlsx")

# --- STEP 2: CLEAN POLITICAL STABILITY (WGI) ---
# We average the stability scores for all South American countries by year
stability_clean <- wgi_raw %>%
  filter(Region == "Latin America & Caribbean") %>%
  group_by(Year) %>%
  summarise(Avg_Stability = mean(`Governance estimate (approx. -2.5 to +2.5)`, na.rm = TRUE)) %>%
  filter(!is.na(Year))

# --- STEP 3: CLEAN M&A DATA ---
# We ensure the columns are numeric and handle the duplicate 2010 entries
ma_clean <- ma_raw %>%
  select(Year, Deals = `Number of Deals`) %>%
  mutate(Year = as.numeric(Year),
         Deals = as.numeric(Deals)) %>%
  filter(!is.na(Year) & !is.na(Deals)) %>%
  group_by(Year) %>%
  summarise(Total_Deals = sum(Deals))

# --- STEP 4: MERGE DATASETS ---
final_df <- inner_join(stability_clean, ma_clean, by = "Year")

# --- STEP 5: CREATE THE PLOT ---
ggplot(final_df, aes(x = Avg_Stability, y = Total_Deals)) +
  # Add points (Scatter plot)
  geom_point(color = "#2c3e50", size = 3, alpha = 0.7) + 
  # Add a linear regression line with confidence interval
  geom_smooth(method = "lm", color = "#e74c3c", fill = "#fadbd8") +
  # Labels and Theme
  theme_minimal() +
  labs(
    title = "Impact of Political Stability on M&A Propensity",
    subtitle = paste("South America | Correlation:", round(cor(final_df$Avg_Stability, final_df$Total_Deals), 4)),
    x = "Political Stability Score (WGI-PV: Higher = More Stable)",
    y = "Total Number of M&A Deals",
    caption = "Sources: World Governance Indicators (WGI) 2025; M&A South America (Thomson Financial & Capital IQ)"
  ) +
  theme(plot.title = element_text(face = "bold", size = 14))

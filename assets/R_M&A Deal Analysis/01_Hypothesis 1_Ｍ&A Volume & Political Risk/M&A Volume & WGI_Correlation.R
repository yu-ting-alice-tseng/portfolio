library(tidyverse)
library(readr)
library(readxl)

#Data Input
wgi_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/Workd Governance Indicators/Political Stability_2025.xlsx")
ma_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/M&A Volume/Mergers & Acquisitions (M&A) - South America.xlsx")

# Filter for South American countries and calculate the annual average
regional_stability <- wgi_data %>%
  filter(Region %in% c("Latin America & Caribbean")) %>% 
  group_by(Year) %>%
  summarise(Avg_Stability = mean(`Governance estimate (approx. -2.5 to +2.5)`, na.rm = TRUE)) %>%
  arrange(Year)

# Clean M&A data
ma_clean <- ma_data %>%
  select(Year, Number_of_Deals = `Number of Deals`) %>%
  mutate(Year = as.numeric(Year),
         Number_of_Deals = as.numeric(Number_of_Deals)) %>%
  filter(!is.na(Year)) %>%
  # If there are duplicate years, take the sum or the maximum (depending on source preference)
  group_by(Year) %>%
  summarise(Total_Deals = max(Number_of_Deals, na.rm = TRUE))

# Merge datasets
final_df <- inner_join(regional_stability, ma_clean, by = "Year")

# Calculate Pearson Correlation
correlation <- cor(final_df$Avg_Stability, final_df$Total_Deals, use = "complete.obs")
print(paste("Correlation Coefficient:", correlation))

# Correlation Test
cor.test(final_df$Avg_Stability, final_df$Total_Deals)

# Option B: Regression Summary (Look for Pr(>|t|) for Avg_Stability)
model <- lm(Total_Deals ~ Avg_Stability, data = final_df)
summary(model)

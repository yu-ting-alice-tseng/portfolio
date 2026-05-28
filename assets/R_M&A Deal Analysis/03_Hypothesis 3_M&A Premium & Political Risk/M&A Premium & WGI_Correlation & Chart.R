library(tidyverse)
library(readr)
library(readxl)
library(janitor) 

#Data Input
wgi_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_Workd Governance Indicators/Political Stability_2025.xlsx")
ma_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_M&A Volume/M&A_LatAm_Transactions_Dataset.xlsx")

# 1. Clean M&A Data
ma_clean <- ma_data %>%
  # Filter only for deals with premium data
  filter(!is.na(`Premium 4 Weeks (%)`)) %>%
  # Create a 'Year' column and harmonize country names
  mutate(Year = year(as.Date(`Date Effective`, format="%Y/%m/%d")),
         Country = ifelse(`Target Nation` == "Puerto Rico", "Puerto Rico (U.S.)", `Target Nation`)) %>%
  select(Country, Year, Premium = `Premium 4 Weeks (%)`)

# 2. Clean Political Risk Data 
# Remove the summarise() step to keep the Country (Economy) column
pol_clean <- wgi_data %>%
  # Use 'Economy (name)' to match your 'Country' column in ma_clean
  select(Country = `Economy (name)`, 
         Year, 
         Stability_Score = `Governance estimate (approx. -2.5 to +2.5)`) %>%
  # Calculate Instability (as the inverse of the stability index)
  mutate(Instability = -Stability_Score)

# 3. Merge data based on Country and Year
# Now 'Country' exists in both dataframes, so the join will work
final_df <- ma_clean %>%
  left_join(pol_clean, by = c("Country", "Year")) %>%
  # Use the correct column name for drop_na
  drop_na(Stability_Score)

# Preview the merged data
head(final_df)

# Method A: Correlation Test
# H3 suggests a positive correlation with Stability (which means negative with Instability)
cor.test(final_df$Premium, final_df$Stability_Score, method = "spearman")

# Method B: Linear Regression
# Premium = Intercept + Beta * Stability
model <- lm(Premium ~ Stability_Score, data = final_df)
summary(model)
print(model)

ggplot(final_df, aes(x = Stability_Score, y = Premium)) +
  geom_point(color = "steelblue", size = 3) +
  geom_smooth(method = "lm", color = "red", se = TRUE) +
  labs(title = "Impact of Political Stability on Acquisition Premiums",
       subtitle = "Testing Hypothesis H3 in Latin America",
       x = "Political Stability Index (Higher = More Stable)",
       y = "Acquisition Premium (%)") +
  theme_minimal()


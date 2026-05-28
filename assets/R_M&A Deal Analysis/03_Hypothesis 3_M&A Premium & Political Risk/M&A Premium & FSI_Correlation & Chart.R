library(tidyverse)
library(readr)
library(readxl)
library(janitor) 

#Data Input
fsi_data <- read_csv("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_Fragile States Index/fsi-Combined-Region.csv", show_col_types = FALSE)
ma_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_M&A Volume/M&A_LatAm_Transactions_Dataset.xlsx")

# 2. Clean M&A Data
ma_clean <- ma_data %>%
  clean_names() %>% # Helps standardize column names
  filter(!is.na(premium_4_weeks_percent)) %>%
  mutate(
    year = year(as.Date(date_effective)),
    # Ensure country names match FSI (e.g., "Venezuela, RB" vs "Venezuela")
    country = case_when(
      target_nation == "Venezuela" ~ "Venezuela",
      target_nation == "Puerto Rico" ~ "Puerto Rico",
      TRUE ~ target_nation
    )
  ) %>%
  select(country, year, premium = premium_4_weeks_percent)

# 3. Clean FSI Data (Political Instability)
# Note: FSI is an INSTABILITY index (Higher = More Fragile)
fsi_long <- fsi_data %>%
  # Pivot years into a single column
  pivot_longer(
    cols = matches("^20\\d{2}$"), # Matches columns like 2006, 2007...
    names_to = "year", 
    values_to = "instability_score"
  ) %>%
  mutate(year = as.numeric(year)) %>%
  # We keep 'Country' so we can join by it
  select(country = Country, year, instability_score)

# 4. Merge data
# We join by both Country and Year for a precise match
final_df <- ma_clean %>%
  inner_join(fsi_long, by = c("country", "year")) %>%
  drop_na(instability_score)

# 5. Testing Hypothesis H3
# H3: Political instability decreases acquisition premium.
# Therefore, we expect a NEGATIVE correlation between Instability and Premium.

# Method A: Correlation
cor_result <- cor.test(final_df$premium, final_df$instability_score, method = "pearson")
print(cor_result)

# Method B: Linear Regression
# Premium = Intercept + Beta * Instability
# If H3 is true, the coefficient for instability_score should be negative.
model <- lm(premium ~ instability_score, data = final_df)
summary(model)

# 6. Visualization
ggplot(final_df, aes(x = instability_score, y = premium)) +
  geom_point(alpha = 0.5, color = "steelblue") +
  geom_smooth(method = "lm", color = "darkred") +
  labs(
    title = "Impact of Political Instability on Acquisition Premiums",
    subtitle = "Testing H3: Higher Instability (FSI) leads to lower premiums",
    x = "Fragile States Index (Higher = More Instability)",
    y = "Acquisition Premium (%)"
  ) +
  theme_minimal()

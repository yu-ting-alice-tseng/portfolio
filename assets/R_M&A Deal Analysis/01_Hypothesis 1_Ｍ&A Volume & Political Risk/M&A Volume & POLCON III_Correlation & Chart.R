library(tidyverse)
library(readr)
library(readxl)

#Data Input
polcon_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_POLCON/POLCON_2025_FINALPOSTED.xlsx")
ma_data_raw <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_M&A Volume/Mergers & Acquisitions (M&A) - South America.xlsx")
names(ma_data_raw)

# 2. Process POLCON Data
# Define South American countries (matching the ALL CAPS format in the dataset)
sa_countries <- c("ARGENTINA", "BOLIVIA", "BRAZIL", "CHILE", "COLOMBIA", "ECUADOR", 
                  "GUYANA", "SURINAME", "PARAGUAY", "PERU", "URUGUAY", "VENEZUELA")

polcon_sa <- polcon_data %>%
  filter(cnts_country %in% sa_countries) %>%
  group_by(year) %>%
  summarise(Avg_POLCON_III = mean(POLCONIII_2025, na.rm = TRUE)) %>%
  rename(Year = year)

# 3. Clean M&A Data 讀取與處理 M&A 數據
ma_clean <- ma_data_raw %>%
  select(Year, Number_of_Deals = `Number of Deals`) %>%
  mutate(Year = as.numeric(Year),
         Number_of_Deals = as.numeric(Number_of_Deals)) %>%
  filter(!is.na(Year)) %>%
  # If there are duplicate years, take the sum or the maximum (depending on source preference)
  group_by(Year) %>%
  summarise(Total_Deals = max(Number_of_Deals, na.rm = TRUE))

# 4. Merge the datasets
combined_data <- inner_join(ma_clean, polcon_sa, by = "Year")

# 5. Calculate Correlations
corr_deals <- cor(combined_data$Avg_POLCON_III, combined_data$Total_Deals, use = "complete.obs")
print (corr_deals)


# 6. Optional: Simple Visualization
ggplot(combined_data, aes(x = Avg_POLCON_III, y = Total_Deals)) +
  geom_point() +
  geom_smooth(method = "lm", col = "blue") +
  labs(title = "Political Constraints vs. M&A Value in South America",
       x = "Avg POLCON III (Higher = Lower Risk)",
       y = "M&A Volume") +
  theme_minimal()


# 5. Correlation Tests (p-values)
test_deals <- cor.test(combined_data$Avg_POLCON_III, combined_data$Total_Deals)
print(test_deals)

# Accessing p-values specifically:
cat("P-value for M&A Value:", test_deals$p.value, "\n")

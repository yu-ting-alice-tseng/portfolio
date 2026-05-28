library(tidyverse)
library(readr)
library(readxl)

#Data Input
fsi_data <- read_csv("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_Fragile States Index/fsi-Combined-Region.csv", show_col_types = FALSE)
ma_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_M&A Volume/Mergers & Acquisitions (M&A) - South America.xlsx")

# 2. Clean M&A Data
# The file has metadata in the first few rows, so we skip and rename
ma_clean <- ma_data %>%
  slice(-1) %>% # Remove the 'in bil. USD' units row
  select(Year = 1, Num_Deals = 2, Value_USD = 3) %>%
  mutate(across(everything(), as.numeric)) %>%
  filter(!is.na(Year))

# 3. Clean FSI Data
# List of South American countries to filter
sa_countries <- c("Argentina", "Bolivia", "Brazil", "Chile", "Colombia", 
                  "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname", 
                  "Uruguay", "Venezuela, RB")

fsi_long <- fsi_data %>%
  filter(Country %in% sa_countries) %>%
  pivot_longer(cols = starts_with("20"), names_to = "Year", values_to = "FSI_Score") %>%
  mutate(Year = as.numeric(Year)) %>%
  group_by(Year) %>%
  summarise(Avg_FSI = mean(FSI_Score, na.rm = TRUE))

# 4. Merge the datasets
merged_data <- inner_join(ma_clean, fsi_long, by = "Year")

# 5. Calculate Correlation
correlation <- cor(merged_data$Avg_FSI, merged_data$Num_Deals, use = "complete.obs")
print(paste("Correlation between Political Risk (FSI) and M&A Value:", round(correlation, 3)))


# 6. Visualize the relationship
ggplot(merged_data, aes(x = Avg_FSI, y = Num_Deals)) +
  geom_point(color = "steelblue", size = 3) +
  geom_smooth(method = "lm", color = "darkred", se = TRUE) +
  labs(title = "Political Risk vs. M&A Volume in South America",
       subtitle = paste("Pearson Correlation:", round(correlation, 3)),
       x = "Average Political Risk (FSI Score - Higher is Riskier)",
       y = "M&A Deal Volume") +
  theme_minimal()

# p-value
# Assuming 'merged_data' from the previous step is ready
# Conduct a Pearson correlation test
test_results <- cor.test(merged_data$Avg_FSI, merged_data$Total_Deals, method = "pearson")

# Display the results
print(test_results)

# Extract specific values
p_val <- test_results$p.value
correlation_coeff <- test_results$estimate

cat("\n--- Analysis Summary ---\n")
cat("Correlation Coefficient:", round(correlation_coeff, 3), "\n")
cat("P-value:", round(p_val, 4), "\n")

if (p_val < 0.05) {
  cat("Result: Statistically Significant (p < 0.05). There is a significant relationship.\n")
} else {
  cat("Result: Not Statistically Significant (p >= 0.05). The relationship may be due to chance.\n")
}

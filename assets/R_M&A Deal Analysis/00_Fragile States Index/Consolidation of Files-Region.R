library(readr)
library(dplyr)

# 1. 讀取兩個檔案
# 請確保檔名與路徑正確，如果是從 CSV 匯入：
fsi_data <- read_csv("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_Fragile States Index/fsi-Combined.csv")
ps_data <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_Workd Governance Indicators/Political Stability_2025.xlsx")

# 2. 從 Political Stability 檔案中提取「國家」與「區域」的對照表
# 因為同一個國家可能出現在多個年份，我們用 distinct() 拿出一份不重複的名單
region_lookup <- ps_data %>%
  select(`Economy (name)`, Region) %>%
  distinct(`Economy (name)`, .keep_all = TRUE) %>%
  rename(Country = `Economy (name)`) # 將名稱統一為 Country 以便之後合併

# 3. 將 Region 資訊合併到 FSI 資料中
# 使用 left_join 會保留 FSI 的所有行，並根據國家名稱填入 Region
fsi_with_region <- fsi_data %>%
  left_join(region_lookup, by = "Country")

# 4. 檢查結果
# 把 Region 欄位移到第一欄方便觀察
fsi_with_region <- fsi_with_region %>%
  select(Country, Region, everything())

head(fsi_with_region)

# 5. 檢查是否有國家沒有配對到 Region (顯示為 NA)
missing_regions <- fsi_with_region %>% 
  filter(is.na(Region)) %>% 
  select(Country) %>% 
  distinct()

print(missing_regions)

# 1. 在 FSI 資料中手動修正國家名稱，使其與 PS 檔案一致
fsi_data_fixed <- fsi_data %>%
  mutate(Country = case_when(
    Country == "Bahamas"                   ~ "Bahamas, The",
    Country == "Cape Verde"                ~ "Cabo Verde",
    Country == "Congo Democratic Republic" ~ "Congo, Dem. Rep.",
    Country == "Congo Republic"            ~ "Congo, Rep.",
    Country %in% c("Cote d'Ivoire", "Côte d'Ivoire") ~ "Cote d'Ivoire",
    Country == "Czech Republic"            ~ "Czechia",
    Country == "Egypt"                     ~ "Egypt, Arab Rep.",
    Country == "Gambia"                    ~ "Gambia, The",
    Country == "Guinea Bissau"             ~ "Guinea-Bissau",
    Country == "Iran"                      ~ "Iran, Islamic Rep.",
    Country == "Israel and West Bank"      ~ "Israel", 
    Country == "Kyrgyzstan"                ~ "Kyrgyz Republic",
    Country == "Laos"                      ~ "Lao PDR",
    Country == "Macedonia"                 ~ "North Macedonia",
    Country == "Micronesia"                ~ "Micronesia, Fed. Sts.",
    Country == "North Korea"               ~ "Korea, Dem. People's Rep.",
    Country == "Palestine"                 ~ "West Bank and Gaza",
    Country == "Russia"                    ~ "Russian Federation",
    Country == "Sao Tome and Principe"     ~ "São Tomé and Principe",
    Country == "São Tomé and Principe"     ~ "São Tomé and Principe",
    Country == "Slovakia"                  ~ "Slovak Republic",
    Country == "Somalia"                   ~ "Federal Republic of Somalia",
    Country == "South Korea"               ~ "Korea, Rep.",
    Country == "Swaziland"                 ~ "Eswatini",
    Country == "Syria"                     ~ "Syrian Arab Republic",
    Country == "Turkey"                    ~ "Türkiye",
    Country == "Venezuela"                 ~ "Venezuela, RB",
    Country == "Vietnam"                   ~ "Viet Nam",
    Country == "Yemen"                     ~ "Yemen, Rep.",
    TRUE ~ Country 
  ))

# 2. 重新提取對照表（確保 PS 檔案的名稱也處理好空格或特殊符號）
region_lookup <- ps_data %>%
  select(Country = `Economy (name)`, Region) %>%
  distinct(Country, .keep_all = TRUE)

# 3. 再次嘗試合併
fsi_with_region <- fsi_data_fixed %>%
  left_join(region_lookup, by = "Country")

# 4. 驗證：如果還有 NA，我們直接手動填補（作為雙重保險）
fsi_with_region <- fsi_with_region %>%
  mutate(Region = case_when(
    Country == "Cote d'Ivoire" & is.na(Region) ~ "Sub-Saharan Africa",
    Country == "Czechia" & is.na(Region)       ~ "Europe & Central Asia",
    TRUE ~ Region
  ))

# 5. 再次檢查是否還有遺漏
final_missing <- fsi_with_region %>% filter(is.na(Region)) %>% select(Country) %>% distinct()
print(final_missing)

write.csv(fsi_with_region, "fsi-Combined-Region.csv", row.names = FALSE)

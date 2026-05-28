library(readxl)
library(dplyr)
library(purrr)
library(tidyr) # 轉置資料必備

# 1. 設定路徑
folder_path <- "C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/00_Fragile States Index"

# 2. 取得檔案清單
file_list <- list.files(path = folder_path, 
                        pattern = "fsi-.*\\.xlsx", 
                        full.names = TRUE)

# 3. 合併所有年份資料
all_data_long <- file_list %>%
  map_df(function(x) {
    data <- read_excel(x)
    
    # 統一 Year 格式並只選取需要的欄位 (國家、年份、總分)
    # 根據你的檔案，國家欄位是 "Country"，分數是 "Total"
    data %>%
      mutate(Year = as.numeric(substring(as.character(Year), 1, 4))) %>%
      select(Country, Year, Total)
  })

# 4. 將資料從長格式轉為寬格式 (國家為列，年份為欄)
all_data_wide <- all_data_long %>%
  pivot_wider(
    names_from = Year,    # 把年份變成欄位名稱
    values_from = Total   # 欄位裡面的數值填入 Total 分數
  )

# 5. 依照國家名稱排序並查看結果
all_data_wide <- all_data_wide %>% arrange(Country)
head(all_data_wide)

# 6. (選填) 如果你想把結果匯出成 CSV 檔案
write.csv(all_data_wide, "FSI_Combined_Wide_Format.csv", row.names = FALSE)
getwd()

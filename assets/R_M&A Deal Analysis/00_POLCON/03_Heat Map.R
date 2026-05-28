# 安裝並載入必要套件
if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, rnaturalearth, rnaturalearthdata, sf, viridis)

# 延長下載時間限制
options(timeout = 600)

# 重新嘗試安裝套件
install.packages(c("sf", "terra", "rnaturalearth", "rnaturalearthdata", "tidyverse"))
# Package for reading the .xlsx Excel file
install.packages("readxl")

# The "Tidyverse" (includes ggplot2 for charts and dplyr for data cleaning)
install.packages("tidyverse")

# Packages for handling dates and time series data
install.packages("lubridate")
install.packages("zoo")

# Package for exporting your results back to Excel
install.packages("writexl")
library("tidyverse")
library("readxl")
library("lubridate")
library("zoo")
library("writexl")

# 讀取資料 (假設檔案名稱如下)
df <- read_excel("C:/Users/Bonita/Desktop/03_Graduate School/03_EMLYON/03_M1-Printemps/RECAPSS/Group Work/Data/POLCON_2025_FINALPOSTED.xlsx", sheet = "Data")

# 篩選 2025 年最新的數據
df_2025 <- df %>% 
  filter(year == 2025) %>%
  select(cnts_country, POLCONIII_2025)

# 獲取世界地圖數據
world <- ne_countries(scale = "medium", returnclass = "sf")
  # 合併資料 (注意：需確保國家名稱一致，建議使用 ccode/ISO 代碼更準確)
  # 這裡先示範用國家名稱合併，實務上可能需要調整少數國家的命名差異
  world_map <- world %>%
    left_join(df_2025, by = c("name" = "cnts_country"))

#繪製地圖
ggplot(data = world_map) +
  geom_sf(aes(fill = POLCONIII_2025), color = "white", size = 0.1) +
  scale_fill_viridis(
    option = "magma", # 使用 magma 色系，深色代表低 POLCON (高風險)
    name = "POLCONV 指標",
    na.value = "grey90",
    guide = guide_colorbar(
      direction = "horizontal",
      barheight = unit(2, units = "mm"),
      barwidth = unit(50, units = "mm"),
      title.position = "top")
  ) +
  labs(
    title = "2025 全球政治風險分佈圖 (POLCON V)",
    subtitle = "數值越低 (深色) 代表政治約束力越弱，政策變動風險越高",
    caption = "Source: POLCON 2025 Dataset"
  ) +
  theme_minimal() +
  theme(legend.position = "bottom")


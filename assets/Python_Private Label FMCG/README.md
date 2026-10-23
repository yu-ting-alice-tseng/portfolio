# 通膨下的降級消費：自有品牌崛起與 FMCG 品牌的定價能力（2021 – 2025）

個人研究專案（Projet personnel），使用公開資料，以 Python 分析。
狀態：研究設計完成，資料蒐集中。本檔案所有結果欄位都還是空的，**沒有任何數字是預先寫好的**。
對應產業：Unilever、Nestlé、Danone、P&G、L'Oréal（大眾線）。與作品集的巧克力 FMCG 專案互相呼應。

---

## 1. 情境與研究問題

2022 – 2023 年，各大 FMCG 集團為了轉嫁原物料與能源成本，連續大幅漲價，財報中的「price / mix」一度達到兩位數，「volume」則轉為負成長。同一時期，歐洲超市的自有品牌（private label）市占上升。

**研究問題：** 大幅漲價之後，消費者是否轉向超市自有品牌？哪些品牌、哪些品類守得住銷量？

## 2. 文獻回顧（寫入網站前需逐篇查證原文）

| 文獻 | 用途 |
|---|---|
| Lamey, L., Deleersnyder, B., Dekimpe, M. G. & Steenkamp, J.-B. E. M. (2007). *How Business Cycles Contribute to Private-Label Success: Evidence from the United States and Europe.* Journal of Marketing, 71(1). | 自有品牌在景氣差時增加的市占，景氣恢復後不會全部還回來（棘輪效應）。本研究把「景氣」換成「通膨」，檢驗同樣的不對稱。 |

可再補充（查證後才加入）：價格彈性與品牌權益的研究（例如品牌力如何降低價格敏感度），以及縮水式通膨（shrinkflation）對價格統計的影響。

**文獻缺口：** Lamey 等人看的是 GDP 景氣循環。2022 – 2023 年的情況不同：景氣沒有衰退，但價格急漲。品牌商主動漲價是否同樣把消費者推向自有品牌，是這個研究要回答的問題。

## 3. 研究假設

- **H1：價格彈性。** 漲價幅度（price / mix）越大，銷量成長（volume）越低。
- **H2：品牌力。** 品牌力越強或越高端的品類，同樣的漲價幅度下，銷量流失越少。
- **H3：自有品牌移轉。** 食品通膨越高的歐洲國家，自有品牌市占成長越多。
- **延伸（Lamey et al., 2007）：** 2024 – 2025 年通膨退燒後，自有品牌在 2021 – 2023 年增加的市占，有多少保留下來？

## 4. 兩層資料設計

| 層級 | 單位 | 用來檢驗 |
|---|---|---|
| 第一層：集團 × 品類 | 季資料，2021 – 2025 | H1、H2 |
| 第二層：歐洲國家 | 年資料，2021 – 2025（市占變化需要 2020 年作為基期） | H3、延伸 |

兩層分開的原因：集團財報只拆到品類或大區（例如 Unilever 的「Europe」），沒有國家層級的資料，所以 H3 不能用財報檢驗，改用國家統計。

## 5. 資料來源與填寫方式

所有範本在 `data/`，格式說明在 `data/README_format.txt`。每一列都要填 `source`（文件名稱）與 `page`（頁碼或表格名稱），方便日後查核。**數字只從原始文件抄錄，不從新聞轉述。**

### 5.1 `01_company_quarterly.csv`：集團季報的成長拆解

| 集團 | 文件 | 欄位對應 | 注意 |
|---|---|---|---|
| Unilever | 季度 Trading Statement / Results | USG → `organic_growth`，UPG → `price_mix`，UVG → `volume` | 依事業群（Beauty & Wellbeing、Personal Care、Home Care、Nutrition、Ice Cream）與地區揭露 |
| Nestlé | 季度 Sales / 半年與全年 Results | OG → `organic_growth`，pricing → `price_mix`，RIG → `volume` | 依地區（Zone）與產品類別揭露；Q1、Q3 只有營收公告 |
| Danone | 季度 Sales | LFL sales → `organic_growth`，price / mix → `price_mix`，volume → `volume` | 依類別（EDP、Specialized Nutrition、Waters）與地區揭露 |
| P&G | 季度 Earnings Release | organic sales → `organic_growth`，price + mix → `price_mix`，volume → `volume` | **會計年度到 6 月**，要換成日曆季度；P&G 的 volume 有「含與不含併購」兩種，固定用同一種 |
| L'Oréal | 季度 Sales | like-for-like → `organic_growth` | 財報多半不量化拆分價格與銷量；拆不出來就只填 `organic_growth`，該列不進 H1 / H2，並在 `note` 註明 |

- 每家集團另加一列 `segment = Group`、`segment_type = total`（集團整體），供走勢圖使用，不進迴歸。
- 只填單季數字；只有年初至今累計數時，該列留空並註明。
- 程式會檢查 `organic_growth ≈ price_mix + volume`，差距超過 0.3 個百分點會列出來，提醒回頭核對。

### 5.2 `02_segments.csv`：品類分類（H2）

- `premium`：1 = 高端或品牌力強，0 = 大眾。**分類規則要在看迴歸結果之前寫進 `premium_rule`**，避免事後挑選。
- `brand_proxy`（選填）：品牌力的公開代理變數，例如 Kantar「Brand Footprint」排名，或集團揭露的高端業務（如 Unilever Prestige Beauty）。來源寫在 `brand_proxy_source`。

### 5.3 `03_food_inflation_annual.csv`：食品通膨（H3）

- 來源：Eurostat HICP，資料集 `prc_hicp_aind`（年平均），COICOP `CP011`（Food），單位 `RCH_A`（年增率）。也可用 `prc_hicp_manr` 月資料自行取年平均。
- 國家：選擇 PLMA 有市占資料的歐盟國家，兩份國家資料用同一套 Eurostat 代碼。

### 5.4 `04_private_label_share_annual.csv`：自有品牌市占（H3）

- 來源：PLMA《International Private Label Yearbook》（資料來自 NielsenIQ），各國以金額計（`pl_value_share`）與以數量計（`pl_volume_share`）的市占。
- 年鑑可能需要會員或購買；若只能取得 PLMA 網站或新聞稿公布的數字，照實填寫並在 `source` 註明。
- 各年的國家範圍與通路定義若有改變，要在 `source` 註明，避免把定義變更誤讀為市占變化。

## 6. 分析方法（`analysis.py`）

1. **資料檢查：** 拆解是否加總正確、季度是否連續、日曆季度對應（P&G）。
2. **描述統計與圖表：** 各集團 price / mix 與 volume 的走勢；2022 – 2023 各品類平均漲價 vs 平均銷量；各國食品通膨 vs 市占變化。
3. **H1（追蹤資料迴歸，`linearmodels.PanelOLS`）：**
   `volume ~ price_mix`，品類固定效果 + 季度固定效果，標準誤依品類聚類。季度固定效果吸收所有集團共同的景氣與成本衝擊，係數看的是「比同期其他品類漲更多」的效果。
4. **H2：** 加入交互項 `price_mix × premium`，預期為正（高端品類的銷量流失較少）。
5. **H3（國家 × 年）：** `Δ自有品牌市占 ~ 食品通膨`，國家固定效果，標準誤依國家聚類；另做 2021 – 2023 的橫斷面迴歸（累計通膨 vs 市占變化，HC1 穩健標準誤）。
6. **延伸：** 計算各國 2021 – 2023 增加的市占，到最新年度保留的比例（Lamey 等人的棘輪效應）。
7. **穩健性：** 落後一期的 price / mix；逐一排除單一集團；H3 加入年度固定效果。

## 7. 已知限制（結論中要寫）

- **只到品類層級：** 季報沒有單一品牌資料，同一品類內的強勢與弱勢品牌會互相抵銷。
- **price / mix 混入產品組合：** 「mix」包含消費者改買較貴或較便宜規格的效果，不全是漲價。
- **縮水式通膨：** 容量縮小、價格不變時，財報與統計對它的處理可能不同（是否計入 price、HICP 如何做品質調整）。寫結論前要查證各集團與 Eurostat 的定義，再說明它會讓價格被高估或低估。
- **內生性：** 集團在成本上升、需求強的品類比較敢漲價，H1 的係數是相關性，不是因果關係。
- **兩層資料無法直接連結：** 財報沒有國家資料，H3 只能說明國家層級的移轉，不能說明是哪家集團的客人流失。
- **樣本小：** 約 5 家集團、20 個季度；H3 約 15 – 20 國 × 5 年。結果應視為方向性的證據。
- **口徑差異：** 各集團的有機成長定義不同（是否排除阿根廷等高通膨國家的價格），只能比較方向，不直接比較幅度。

## 8. 檔案

| 檔案 | 內容 |
|---|---|
| `data/*.csv` | 資料範本（只有欄位名稱，待填寫） |
| `data/README_format.txt` | 填寫格式 |
| `analysis.py` | 讀取、檢查、圖表、迴歸，結果輸出到 `output/` |

執行：`pip install pandas numpy statsmodels linearmodels matplotlib`，然後在這個資料夾執行 `python analysis.py`。範本還沒填時，程式會停下並提示哪一份檔案是空的。

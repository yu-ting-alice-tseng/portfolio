# Tableau Public：6 張圖與儀表板

`tableau/` 資料夾裡的 CSV 已經整理好，**不用再從 BigQuery 匯出**。`preview/` 裡的 PNG 是每張圖做好之後應該長的樣子，做的時候可以對照。

Tableau 的介面是英文，下面的按鈕名稱都照原文寫。

---

## 準備

1. 到 public.tableau.com 註冊帳號，下載 **Tableau Public**（桌面版，免費）。
2. 打開 Tableau Public，左側 **Connect** →「**Text file**」→ 選 `1_funnel.csv`。
3. 其他 CSV：上方選單 **Data** →「**New Data Source**」→「Text file」，一個一個加進來。每個 CSV 都是**獨立的資料來源，不要合併**。
4. 下方的「**Sheet 1**」就是第一張工作表。每做一張圖，就按旁邊的圖示新增一張工作表。

**配色**（每張圖都用這幾個顏色，和作品集網站的 data 頁一致）：

| 用途 | 色碼 |
|---|---|
| 主色（嚴格版、Stars、長條） | `#0d9488` |
| 強調（Leaks、高峰日） | `#eb6834` |
| 第三色（Hidden gems） | `#2a78d6` |
| 次要（寬鬆版、Long tail、每日原始數據） | `#a8a8a2` |

**改顏色的方法：** 點右側的顏色圖例 → 右鍵 →「**Edit Colors**」→ 選一個項目 → 點色塊 → 在色碼欄輸入上表的 hex。

**百分比格式：** CSV 裡的百分比已經是 23.07 這種數字，不要再乘 100。在欄位上按右鍵 →「**Format**」→ Numbers 選「**Number (Custom)**」→ Suffix 填 `%`。

---

## 圖 1：寬鬆版和嚴格版漏斗

**資料：** `1_funnel`　**預覽：** `preview/1_funnel.png`

1. 把 `step` 拖到 **Rows**，再把 `funnel` 拖到 **Rows**（放在 step 右邊）。
2. 把 `pct_of_view` 拖到 **Columns**。
3. 把 `funnel` 拖到左側 Marks 的 **Color**，寬鬆版設灰色 `#a8a8a2`，嚴格版設主色 `#0d9488`。
4. 把 `pct_of_view` 拖到 Marks 的 **Label**，數字就會顯示在長條旁邊。
5. 標題：雙擊工作表標題，改成 **Only 1.67% of visits buy in one go**。

---

## 圖 2：品牌四象限（最重要的一張）

**資料：** `2_brand_matrix`　**預覽：** `preview/2_brand_matrix.png`

1. `s_view` 拖到 **Columns**，`view_to_purchase_pct` 拖到 **Rows**。
2. `brand` 拖到 Marks 的 **Detail**，這樣每個品牌才會是一個點。
3. Marks 的下拉選單選「**Circle**」。
4. `quadrant` 拖到 **Color**：Stars `#0d9488`、Leaks `#eb6834`、Hidden gems `#2a78d6`、Long tail `#a8a8a2`。
5. **橫軸改成對數**：在橫軸上按右鍵 →「**Edit Axis**」→ 勾選「**Logarithmic**」。品牌之間流量差了幾百倍，不改的話點會全部擠在左邊。
6. **兩條中位數線**：切到左側的「**Analytics**」分頁 → 把「**Reference Line**」拖到圖上：
   - 放在橫軸（Table）：Value 選「**Constant**」，填 `5145.5`
   - 再拖一次放在縱軸：Constant 填 `1.886`
   - Line 設定成虛線、深灰色
7. **標出重點品牌**：在點上按右鍵 →「**Mark Label**」→「**Always Show**」。建議標：masura、kapous、jessnail、grattol、runail、irisk、elskin。
8. **滑鼠移上去的提示**：把 `s_purchase` 和 `revenue` 拖到 Marks 的 **Tooltip**。
9. 標題：**Leaks: 43% of brand traffic, 1.53% conversion**

---

## 圖 3：購物車買回的時間

**資料：** `3_cart_recovery`　**預覽：** `preview/3_cart_recovery.png`

1. `outcome` 拖到 **Rows**，`pct_of_recovered` 拖到 **Columns**。
2. `outcome` 拖到 **Filters** → 取消勾選「**4. Never bought back**」。
3. `pct_of_recovered` 拖到 **Label**。
4. 顏色：統一用主色 `#0d9488`。
5. 標題：**Half of recovered carts come back within a day**
6. 副標可以寫：**15.6% of abandoned items are bought later by the same customer**

---

## 圖 4：每日營收

**資料：** `4_daily`　**預覽：** `preview/4_daily.png`

1. `day` 拖到 **Columns** → 在上面按右鍵 → 選「**Exact Date**」，再選「**Continuous**」（綠色）。
2. `revenue` 拖到 **Rows**。
3. 把 `revenue_ma7` 拖到**圖上的縱軸**（看到兩條平行的綠色尺規圖示再放開）。這樣兩條線會**共用同一個縱軸**，Tableau 會自動產生 `Measure Names`。
4. `Measure Names` 在 **Color** 上：revenue 設灰色 `#a8a8a2`，revenue_ma7 設主色 `#0d9488`。
5. 讓 7 日平均線粗一點：Marks 的 **Size** 往右拉。
6. **標出高峰日**：在 11/22 和 12/31 的點上按右鍵 →「**Annotate**」→「**Mark**」。
7. 標題：**Revenue peaks in November and late January, lows at New Year**

> 不要做成雙縱軸。兩條線都是營收，必須用同一個刻度，否則看起來的高低會誤導人。

---

## 圖 5：同期群留存熱力圖

**資料：** `5_cohort`　**預覽：** `preview/5_cohort.png`

1. 先在左側資料欄位的 `cohort` 上按右鍵 →「**Change Data Type**」→「**String**」。不改的話，Tableau 會把它當成日期，排列會亂掉。
2. `month_label` 拖到 **Columns**，`cohort` 拖到 **Rows**。
3. `month_n` 拖到 **Filters** → 選 Range，最小值設 **1**。M+0 永遠是 100 %，放進來沒有意義。
4. Marks 選「**Square**」。
5. `retention_pct` 拖到 **Color** → Edit Colors → 選 Sequential 單色，起點 `#e6f4f2`、終點 `#0b4f49`。
6. `retention_pct` 拖到 **Label**。
7. 標題：**About 9% of new buyers come back the next month**
8. 加一行註解：**10/2019 overstated: the data starts that month.**

---

## 圖 6：首購件數與回購率

**資料：** `6_repeat_by_basket`　**預覽：** `preview/6_repeat_by_basket.png`

1. `first_basket` 拖到 **Columns**，`repeat_60d_pct` 拖到 **Rows**。
2. 排序：在 `first_basket` 上按右鍵 →「**Sort**」→ Sort By 選「**Field**」→ 欄位選 `items_in_first_order`，Ascending。
3. 顏色用主色 `#0d9488`，把 `repeat_60d_pct` 拖到 **Label**。
4. 標題：**Bigger first baskets, more repeat buyers**

---

## 組成儀表板

1. 下方按「**New Dashboard**」圖示。
2. 左側 **Size** 選「**Fixed size**」，寬 **1200**、高 **1800**（直式，適合網頁往下捲）。
3. 最上方拖一個「**Text**」物件，寫標題和一句話：
   - **Beauty E-commerce: Funnel, Cart Abandonment and Retention**
   - **5 months, 20.7M events, analysed in SQL on BigQuery.**
4. 依照這個順序把工作表拖進去，**一列兩張**：

| 列 | 左 | 右 |
|---|---|---|
| 1 | 圖 1 漏斗 | 圖 3 購物車買回 |
| 2 | 圖 2 品牌四象限（**整列**） | |
| 3 | 圖 4 每日營收（**整列**） | |
| 4 | 圖 5 同期群 | 圖 6 首購件數 |

5. 最下方再放一個 Text，寫資料來源：**Data: Kaggle, eCommerce Events History in Cosmetics Shop (10/2019 - 02/2020). Personal project.**

---

## 發布

1. 上方選單 **File** →「**Save to Tableau Public As...**」，登入帳號。
2. 名稱：**Beauty E-commerce Funnel & Retention**
3. 發布後瀏覽器會打開你的作品頁面。**把網址複製給我**，我會把它放進 README 和作品集網站。

> Tableau Public 上的作品**一律公開**，任何人都看得到。這份資料是公開的 Kaggle 資料集，所以沒有問題。

---

## 加分圖（可做可不做）

`7_weekday_hour.csv`：星期 × 時段的轉換率熱力圖。

做法和圖 5 一樣：`hour_utc` 放 Columns，`weekday` 放 Rows（依 `weekday_order` 排序），`conversion_pct` 放 Color。重點是**平日比週末好、9 點到 12 點（UTC）最高**。

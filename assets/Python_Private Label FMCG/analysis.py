"""通膨下的降級消費：自有品牌崛起與 FMCG 品牌的定價能力（2021 – 2025）

執行：在這個資料夾裡執行 python analysis.py
需要的套件：pip install pandas numpy statsmodels linearmodels matplotlib
結果輸出到 output/（清理後的資料、迴歸表、圖表）
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import statsmodels.formula.api as smf
from linearmodels.panel import PanelOLS

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
OUT = HERE / "output"

START_YEAR, END_YEAR = 2021, 2025
# 漲價高峰：多數集團的 price/mix 在 2022 – 2023 年達到高點
PEAK_YEARS = (2022, 2023)


def read(name):
    path = DATA / name
    if not path.exists():
        raise SystemExit(f"找不到 {path}，請在 analysis.py 所在的資料夾執行")
    return pd.read_csv(path)


def check_filled(df, cols, name):
    """範本還沒填就停下，不讓程式用空資料跑出看似正常的結果。"""
    n = len(df.dropna(subset=cols))
    if n == 0:
        raise SystemExit(f"{name} 還沒有資料（{', '.join(cols)} 都是空的），請先依 README 填寫")
    return n


def fmt_results(res, title):
    lines = [f"## {title}", "", str(res.summary), ""]
    return "\n".join(lines)


# ---------------------------------------------------------------
# 1. 第一層：集團 × 品類 × 季度（H1、H2）
# ---------------------------------------------------------------


def load_company():
    q = read("01_company_quarterly.csv")
    seg = read("02_segments.csv")
    check_filled(q, ["price_mix", "volume"], "01_company_quarterly.csv")

    q = q[q["cal_year"].between(START_YEAR, END_YEAR)].copy()
    q["panel_id"] = q["company"] + " · " + q["segment"]
    q["period"] = pd.PeriodIndex.from_fields(
        year=q["cal_year"].astype(int), quarter=q["cal_quarter"].astype(int), freq="Q"
    )
    # 財報的 organic growth 約等於 price/mix + volume，差太多代表抄錯或口徑不同
    gap = (q["organic_growth"] - (q["price_mix"] + q["volume"])).abs()
    q["check_gap"] = gap
    suspicious = q[gap > 0.3]
    if len(suspicious):
        print(f"注意：{len(suspicious)} 列的 organic_growth 與 price_mix + volume 相差超過 0.3 個百分點，請回頭核對：")
        print(suspicious[["company", "segment", "fiscal_label", "organic_growth", "price_mix", "volume"]].to_string(index=False))

    q = q.merge(seg[["company", "segment", "premium"]], on=["company", "segment"], how="left")
    q = q.sort_values(["panel_id", "period"])
    # 落後一期的 price/mix：漲價對銷量的影響可能延後出現
    q["price_mix_l1"] = q.groupby("panel_id")["price_mix"].shift(1)
    return q


def company_models(q):
    out = []
    cat = q[q["segment_type"] == "category"].copy()
    if cat["panel_id"].nunique() < 3:
        print("品類層級的資料少於 3 個單位，H1 / H2 的追蹤資料迴歸先略過")
        return out

    panel = cat.set_index(["panel_id", "period"])
    panel.index = panel.index.set_levels(panel.index.levels[1].to_timestamp(), level=1)

    # H1：漲價幅度越大，銷量成長越低
    # 單位固定效果吸收各品類長期的成長差異，時間固定效果吸收全體共同的景氣與成本衝擊
    h1 = PanelOLS.from_formula(
        "volume ~ price_mix + EntityEffects + TimeEffects", data=panel
    ).fit(cov_type="clustered", cluster_entity=True)
    out.append(fmt_results(h1, "H1：volume ~ price_mix（單位與時間固定效果，依單位聚類標準誤）"))

    h1_lag = PanelOLS.from_formula(
        "volume ~ price_mix + price_mix_l1 + EntityEffects + TimeEffects",
        data=panel.dropna(subset=["price_mix_l1"]),
    ).fit(cov_type="clustered", cluster_entity=True)
    out.append(fmt_results(h1_lag, "H1 穩健性：加入落後一期的 price_mix"))

    # H2：品牌力越強或越高端，漲價後銷量流失越少（交互項係數應為正）
    if panel["premium"].notna().any() and panel["premium"].nunique() == 2:
        panel["price_x_premium"] = panel["price_mix"] * panel["premium"]
        h2 = PanelOLS.from_formula(
            "volume ~ price_mix + price_x_premium + EntityEffects + TimeEffects",
            data=panel.dropna(subset=["premium"]),
        ).fit(cov_type="clustered", cluster_entity=True)
        out.append(fmt_results(h2, "H2：volume ~ price_mix + price_mix × premium"))
    else:
        print("02_segments.csv 的 premium 欄還沒有 0 和 1 兩種值，H2 先略過")

    # 穩健性：逐一排除單一集團，看 H1 係數是否只由某一家撐起
    rows = []
    for company in cat["company"].unique():
        sub = panel[panel["company"] != company]
        if sub.index.get_level_values(0).nunique() < 3:
            continue
        r = PanelOLS.from_formula(
            "volume ~ price_mix + EntityEffects + TimeEffects", data=sub
        ).fit(cov_type="clustered", cluster_entity=True)
        rows.append({"excluded": company, "beta": r.params["price_mix"], "p_value": r.pvalues["price_mix"], "n": r.nobs})
    if rows:
        loo = pd.DataFrame(rows)
        loo.to_csv(OUT / "h1_leave_one_company_out.csv", index=False)
        out.append("## H1 穩健性：逐一排除單一集團\n\n" + loo.to_string(index=False) + "\n")
    return out


def company_charts(q):
    cat = q[q["segment_type"] == "category"]
    if cat.empty:
        return
    # 每個品類一個點：2022 – 2023 平均漲價幅度 vs 平均銷量成長
    peak = cat[cat["cal_year"].between(*PEAK_YEARS)]
    pts = peak.groupby(["panel_id", "premium"], dropna=False)[["price_mix", "volume"]].mean().reset_index()
    fig, ax = plt.subplots(figsize=(7, 5))
    for prem, grp in pts.groupby(pts["premium"].fillna(-1)):
        label = {1: "高端 / 品牌力強", 0: "大眾"}.get(prem, "未分類")
        ax.scatter(grp["price_mix"], grp["volume"], label=label)
    for _, r in pts.iterrows():
        ax.annotate(r["panel_id"], (r["price_mix"], r["volume"]), fontsize=7, alpha=0.7)
    ax.axhline(0, color="grey", lw=0.8)
    ax.set_xlabel(f"平均 price/mix（%，{PEAK_YEARS[0]} – {PEAK_YEARS[1]}）")
    ax.set_ylabel("平均 volume（%）")
    ax.legend()
    fig.tight_layout()
    fig.savefig(OUT / "fig1_price_vs_volume.png", dpi=200)
    plt.close(fig)

    # 各集團整體的價格與銷量走勢
    total = q[q["segment"].str.lower().isin(["group", "total", "集團整體"])]
    if not total.empty:
        fig, axes = plt.subplots(1, 2, figsize=(11, 4), sharey=True)
        for company, grp in total.groupby("company"):
            x = grp["period"].dt.to_timestamp()
            axes[0].plot(x, grp["price_mix"], label=company)
            axes[1].plot(x, grp["volume"], label=company)
        axes[0].set_title("price/mix（%）")
        axes[1].set_title("volume（%）")
        for ax in axes:
            ax.axhline(0, color="grey", lw=0.8)
        axes[1].legend(fontsize=8)
        fig.tight_layout()
        fig.savefig(OUT / "fig2_group_price_volume.png", dpi=200)
        plt.close(fig)


# ---------------------------------------------------------------
# 2. 第二層：歐洲國家 × 年（H3）
# ---------------------------------------------------------------


def load_country():
    infl = read("03_food_inflation_annual.csv")
    pl = read("04_private_label_share_annual.csv")
    check_filled(infl, ["food_hicp_rch"], "03_food_inflation_annual.csv")
    check_filled(pl, ["pl_value_share"], "04_private_label_share_annual.csv")

    c = pl.merge(infl[["country", "year", "food_hicp_rch"]], on=["country", "year"], how="left")
    c = c.sort_values(["country", "year"])
    # 市占成長以百分點計（不是百分比）
    c["d_pl_share"] = c.groupby("country")["pl_value_share"].diff()
    c["food_hicp_l1"] = c.groupby("country")["food_hicp_rch"].shift(1)
    return c


def country_models(c):
    out = []
    d = c.dropna(subset=["d_pl_share", "food_hicp_rch"])
    if d["country"].nunique() < 5:
        print("國家資料少於 5 國，H3 先略過")
        return out

    # H3：食品通膨越高的國家，自有品牌市占成長越多
    # 只放國家固定效果：時間固定效果會吸收 2022 – 2023 全歐洲共同的通膨，H3 看的是國家之間的差異
    h3 = PanelOLS.from_formula(
        "d_pl_share ~ food_hicp_rch + EntityEffects",
        data=d.set_index(["country", "year"]),
    ).fit(cov_type="clustered", cluster_entity=True)
    out.append(fmt_results(h3, "H3：Δ自有品牌市占 ~ 食品通膨（國家固定效果，依國家聚類標準誤）"))

    # 同時加時間固定效果：只剩「比當年歐洲平均通膨更高」的部分
    h3_te = PanelOLS.from_formula(
        "d_pl_share ~ food_hicp_rch + EntityEffects + TimeEffects",
        data=d.set_index(["country", "year"]),
    ).fit(cov_type="clustered", cluster_entity=True)
    out.append(fmt_results(h3_te, "H3 穩健性：加入時間固定效果"))

    # 橫斷面：2021 – 2023 累計食品通膨 vs 同期市占變化
    wide = c.pivot(index="country", columns="year", values=["pl_value_share", "food_hicp_rch"])
    try:
        cross = pd.DataFrame({
            "pl_change_21_23": wide["pl_value_share"][2023] - wide["pl_value_share"][2021],
            "cum_food_infl_22_23": (
                (1 + wide["food_hicp_rch"][2022] / 100) * (1 + wide["food_hicp_rch"][2023] / 100) - 1
            ) * 100,
        }).dropna()
        if len(cross) >= 5:
            ols = smf.ols("pl_change_21_23 ~ cum_food_infl_22_23", data=cross).fit(cov_type="HC1")
            out.append("## H3 橫斷面：2021 – 2023 市占變化 ~ 2022 – 2023 累計食品通膨（HC1 標準誤）\n\n" + str(ols.summary()) + "\n")
            cross.to_csv(OUT / "h3_cross_section.csv")
    except KeyError:
        print("缺少 2021 或 2023 年的國家資料，橫斷面先略過")

    # 延伸（Lamey et al., 2007）：通膨退燒後，市占有沒有還回去？
    if {2023, END_YEAR}.issubset(set(c["year"])):
        ratchet = wide["pl_value_share"][[2021, 2023, END_YEAR]].dropna()
        if not ratchet.empty:
            ratchet["gain_21_23"] = ratchet[2023] - ratchet[2021]
            ratchet["change_23_end"] = ratchet[END_YEAR] - ratchet[2023]
            ratchet["kept_share_of_gain"] = np.where(
                ratchet["gain_21_23"] > 0,
                (ratchet[END_YEAR] - ratchet[2021]) / ratchet["gain_21_23"],
                np.nan,
            )
            ratchet.to_csv(OUT / "h3_ratchet.csv")
            out.append("## 延伸：2021 – 2023 增加的市占，到最新年度保留多少\n\n" + ratchet.round(2).to_string() + "\n")
    return out


def country_charts(c):
    fig, ax = plt.subplots(figsize=(7, 5))
    d = c.dropna(subset=["d_pl_share", "food_hicp_rch"])
    for year, grp in d.groupby("year"):
        ax.scatter(grp["food_hicp_rch"], grp["d_pl_share"], label=str(year))
    ax.axhline(0, color="grey", lw=0.8)
    ax.set_xlabel("食品 HICP 年增率（%）")
    ax.set_ylabel("自有品牌市占變化（百分點）")
    ax.legend(title="年")
    fig.tight_layout()
    fig.savefig(OUT / "fig3_inflation_vs_pl_share.png", dpi=200)
    plt.close(fig)


def main():
    OUT.mkdir(exist_ok=True)
    plt.rcParams["font.sans-serif"] = ["Noto Sans CJK TC", "Microsoft JhengHei", "PingFang TC", "DejaVu Sans"]
    plt.rcParams["axes.unicode_minus"] = False

    report = ["# 迴歸結果", ""]

    q = load_company()
    q.to_csv(OUT / "company_clean.csv", index=False)
    report += company_models(q)
    company_charts(q)

    c = load_country()
    c.to_csv(OUT / "country_clean.csv", index=False)
    report += country_models(c)
    country_charts(c)

    (OUT / "results.md").write_text("\n".join(report), encoding="utf-8")
    print(f"完成，結果在 {OUT}")


if __name__ == "__main__":
    main()

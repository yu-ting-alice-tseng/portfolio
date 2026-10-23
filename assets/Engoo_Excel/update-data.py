import pandas as pd
import os
import sys
from openpyxl import load_workbook

# Force python to output text to screen immediately without buffering
sys.stdout.reconfigure(line_buffering=True)

print("\n🚀 [SYSTEM] Python script started successfully! Initializing...", flush=True)

# ==================== 1. Configuration Section ====================
# FIX: Updated to match your current target file name verbatim
dashboard_file = "Excel Dashboard Portfolio_for Data.xlsx"

# Mapping dictionary to match Xiaohongshu sheet names with Dashboard columns
sheet_mapping = {
    "观看趋势": "Views",
    "观看总时长趋势": "Total Watch Time (s)",
    "点赞趋势": "Likes",
    "收藏趋势": "Saves",
    "评论趋势": "Comments",
    "分享趋势": "Shares",
    "主页访客趋势": "Profile Visits",
    "涨粉趋势": "New Followers"
}

# ==================== 2. Dynamic File Input (Drag & Drop) ====================
print("\n------------------------------------------------------------", flush=True)
dragged_input = input("👉 Please DRAG and DROP your source Excel file (.xlsx) here, then press Enter:\n")

# Clean up outer quotation marks attached by Windows
source_xlsx = dragged_input.strip().strip('"').strip("'")

print("------------------------------------------------------------", flush=True)
print(f"🔍 [STEP 1] Opening user-selected source file: {os.path.basename(source_xlsx)}", flush=True)

if not os.path.exists(source_xlsx):
    print(f"❌ Error: Cannot find the file at [{source_xlsx}]. Please make sure the path is correct!", flush=True)
    input("\nPress Enter to exit...")
    exit()

new_df = None

# Iterate and extract data from the designated worksheet tabs
for sheet_name, en_col in sheet_mapping.items():
    try:
        df = pd.read_excel(source_xlsx, sheet_name=sheet_name)
        
        if "日期" in df.columns and "数值" in df.columns:
            df_clean = df[["日期", "数值"]].copy()
            df_clean.columns = ["Date", en_col]
            
            # Convert Chinese date format "2024年12月26日" to standard "2024-12-26"
            df_clean["Date"] = df_clean["Date"].astype(str).str.replace("年", "-").str.replace("月", "-").str.replace("日", "")
            df_clean["Date"] = pd.to_datetime(df_clean["Date"]).dt.strftime("%Y-%m-%d")
            
            if new_df is None:
                new_df = df_clean
            else:
                new_df = pd.merge(new_df, df_clean, on="Date", how="outer")
            print(f"  ✅ Successfully aligned column: {en_col}", flush=True)
        else:
            print(f"  ⚠️ Warning: Tab [{sheet_name}] missing required columns '日期' or '数值'.", flush=True)
    except Exception as e:
        # Silently skip if a trend sheet does not exist in the source file
        pass

if new_df is None:
    print("❌ Error: No data was successfully retrieved from the source Excel tabs! Exiting...", flush=True)
    input("\nPress Enter to exit...")
    exit()

# Fill missing numerical fields with 0
for col in sheet_mapping.values():
    if col in new_df.columns:
        new_df[col] = new_df[col].fillna(0).astype(int)

# ==================== 3. Load Existing Excel Data & Combine ====================
print(f"\n📂 [STEP 2] Checking existing historical data in Dashboard: {dashboard_file}", flush=True)

final_columns = [
    "Date", "Views", "Total Watch Time (s)", "Likes", "Saves", 
    "Comments", "Shares", "Profile Visits", "New Followers", 
    "Engagement", "Engagement Rate", "Brand Awareness"
]

existing_df = pd.DataFrame(columns=final_columns)

if os.path.exists(dashboard_file):
    try:
        # Skip the first 3 rows to preserve the MAX/MIN formulas in rows 2 & 3
        existing_df = pd.read_excel(dashboard_file, sheet_name="Data", skiprows=3, names=final_columns)
        existing_df = existing_df.dropna(subset=["Date"])
        existing_df["Date"] = pd.to_datetime(existing_df["Date"]).dt.strftime("%Y-%m-%d")
        print(f" 📜 Successfully retrieved {len(existing_df)} rows of old historical data from Excel.", flush=True)
    except Exception as e:
        print(f" 💡 Notice: Started with clean history (Excel row section was empty or unreadable).", flush=True)
else:
    print(f"❌ Error: Target dashboard file [{dashboard_file}] not found in current folder!", flush=True)
    input("\nPress Enter to exit...")
    exit()

if not existing_df.empty:
    print(" 🔄 Merging new datasets with Excel history (Handling duplicates with rule: Keep Old)...", flush=True)
    combined_df = pd.concat([existing_df, new_df], ignore_index=True)
    combined_df = combined_df.drop_duplicates(subset=["Date"], keep='first')
else:
    combined_df = new_df

# ==================== 4. Re-calculate Metrics ====================
combined_df = combined_df.sort_values("Date").reset_index(drop=True)
combined_df["Engagement"] = combined_df["Likes"] + combined_df["Saves"] + combined_df["Comments"] + combined_df["Shares"]
combined_df["Engagement Rate"] = combined_df.apply(
    lambda row: row["Engagement"] / row["Views"] if row["Views"] > 0 else 0.0, axis=1
)
combined_df["Brand Awareness"] = combined_df["Views"]
combined_df = combined_df[final_columns]

# ==================== 5. Write Back to Excel Safely ====================
print(f"\n💾 [STEP 3] Opening Dashboard to safely insert data...", flush=True)

try:
    wb = load_workbook(dashboard_file, data_only=False)
    if "Data" in wb.sheetnames:
        ws = wb["Data"]
        start_row = 4
        
        # Safely clear the data region values below row 4 without breaking XML structures
        if ws.max_row >= start_row:
            for r in range(start_row, ws.max_row + 1):
                for c in range(1, len(final_columns) + 1):
                    ws.cell(row=r, column=c).value = None
                    
        print(" 💡 Writing updated datasets into cells row by row (Preserving Rows 2 & 3 formulas)...", flush=True)
        
        for i, row_data in enumerate(combined_df.itertuples(index=False, name=None)):
            current_row = start_row + i
            for col_idx, value in enumerate(row_data, start=1):
                cell = ws.cell(row=current_row, column=col_idx, value=value)
                if final_columns[col_idx - 1] == "Engagement Rate":
                    cell.number_format = '0.00%'
                    
        wb.save(dashboard_file)
        wb.close()
        print(f"\n🎉 [SUCCESS] Dashboard successfully updated! All tabs merged without overwriting duplicates.", flush=True)
    else:
        print("❌ Error: Worksheet named 'Data' not found.", flush=True)
except Exception as e:
    print(f"❌ Critical Error during Excel save operations: {e}", flush=True)

input("\nPress Enter to close this window...")
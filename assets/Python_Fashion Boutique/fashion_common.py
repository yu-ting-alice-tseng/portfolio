"""Paths and helpers shared by the three scripts of the Fashion Boutique project.

Versioned files (request of the user): every run writes the next version
number (V1, V2, V3...) and never overwrites an earlier file.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "data" / "raw" / "fashion_boutique_dataset.csv"
CLEAN = ROOT / "data" / "clean"
REPORTS = ROOT / "reports"
RESULTS = ROOT / "results"
CHARTS = ROOT / "charts"
FONTS = ROOT / "fonts"

# Stock bands used on the site (portfolio-data.html, #boutique-mode)
STOCK_BINS = [-1, 5, 15, 25, 35, 50]
STOCK_LABELS = ["0-5", "6-15", "16-25", "26-35", "36-50"]


def next_version(folder, pattern):
    """Return the next free version number for files named like `pattern`
    (a regex with one group capturing the number)."""
    folder.mkdir(parents=True, exist_ok=True)
    found = [int(m.group(1)) for p in folder.iterdir()
             if (m := re.fullmatch(pattern, p.name))]
    return max(found, default=0) + 1


def latest_clean():
    """Path of the most recent cleaned dataset written by 01_cleaning.py."""
    files = sorted(CLEAN.glob("fashion_boutique_clean_V*.csv"),
                   key=lambda p: int(re.search(r"_V(\d+)\.csv$", p.name).group(1)))
    if not files:
        raise SystemExit("No cleaned file yet: run 01_cleaning.py first.")
    return files[-1]

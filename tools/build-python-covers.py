"""Build the catalogue covers of the two Python projects from their own charts.

Request of the user: when a project has produced charts, its cover shows them,
never a chart drawn by the web page. Each cover is an exact 3:2 composition
(1200 x 800): two charts of the project laid on the page's card colour, the
cleaning chart behind, the key finding in front, both whole (no cropping).

Writes, in French and English:
  assets/covers/boutique-mode-data(-en).webp   portfolio-data.html, #boutique-mode
  assets/covers/maison-beaute(-en).webp        portfolio-marketing.html, #maison-beaute

Usage: python3 tools/build-python-covers.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
COVERS = ROOT / "assets" / "covers"

PROJECTS = [
    # (output name, charts folder, back chart, front chart, card colour, border colour)
    ("boutique-mode-data", ROOT / "assets" / "Python_Fashion Boutique" / "charts" / "V2",
     "1_data_quality", "2_stock_markdown", "#eef3ef", "#c3cfc9"),
    ("maison-beaute", ROOT / "assets" / "Python_Maison Beaute" / "charts" / "V1",
     "1_data_quality", "2_premium_spend", "#f3f1ea", "#cbc7ba"),
]

W, H = 1200, 800
CHART_W = 880
CHART_H = CHART_W * 9 // 16
BACK_XY = (W - CHART_W - 40, 40)
FRONT_XY = (40, H - CHART_H - 40)


def place(canvas, chart, xy, border):
    """Paste a chart with a soft shadow and a thin frame."""
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rectangle(
        [xy[0] + 4, xy[1] + 8, xy[0] + CHART_W + 4, xy[1] + CHART_H + 8], fill=(40, 35, 30, 60))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(10)))
    canvas.paste(chart, xy)
    ImageDraw.Draw(canvas).rectangle([xy[0], xy[1], xy[0] + CHART_W - 1, xy[1] + CHART_H - 1], outline=border)


for name, folder, back, front, card, border in PROJECTS:
    for lang, suffix in (("fr", ""), ("en", "-en")):
        canvas = Image.new("RGBA", (W, H), card)
        for chart_name, xy in ((back, BACK_XY), (front, FRONT_XY)):
            chart = Image.open(folder / f"{chart_name}_{lang}.webp").convert("RGBA")
            place(canvas, chart.resize((CHART_W, CHART_H), Image.LANCZOS), xy, border)
        out = COVERS / f"{name}{suffix}.webp"
        canvas.convert("RGB").save(out, "WEBP", quality=88)
        print("wrote", out.relative_to(ROOT))

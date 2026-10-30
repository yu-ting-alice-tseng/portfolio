"""Images of the chocolate Tableau dashboard for portfolio-data.html.

Reads the PDFs exported from Tableau by the user (assets/Tableau_Chocolate/
Chocolat_FMCG_FR_V{n}.pdf and Chocolate_FMCG_EN_V{n}.pdf, latest version)
and writes:
  - assets/Tableau_Chocolate/images/V{n}/constat-{1,2,3}-{fr,en}.webp:
    the charts of each finding, cropped whole (no section header);
  - assets/covers/chocolat-data(-en).webp: 3:2 cover (1 200 x 800) on the
    card colour of the data page, the three findings stacked, the channel
    block (key finding) in front.

The site never draws its own chart when the project produced one
(CLAUDE.md § 16). Run again after a new export of the dashboard.

Usage: python3 tools/build-tableau-covers.py
"""
import re
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "Tableau_Chocolate"
COVERS = ROOT / "assets" / "covers"
CARD = (0xEE, 0xF3, 0xEF)  # --da-card
RULE = (0xC3, 0xCF, 0xC9)  # --da-border

# Chart blocks of each finding, in PDF points (A4 page of the dashboard),
# taken from the panel rectangles of the export, with a small paper margin.
BLOCKS = {
    1: (36, 218, 558, 333),
    2: (36, 378, 558, 493),
    3: (36, 538, 558, 769),
}
PDF = {"fr": "Chocolat_FMCG_FR_V{}.pdf", "en": "Chocolate_FMCG_EN_V{}.pdf"}


def latest():
    vs = [int(m.group(1)) for f in SRC.glob("Chocolat_FMCG_FR_V*.pdf")
          if (m := re.search(r"_V(\d+)\.pdf$", f.name))]
    return max(vs)


def crop(pdf, box, dpi=300):
    page = pymupdf.open(pdf)[0]
    pix = page.get_pixmap(dpi=dpi, clip=pymupdf.Rect(*box))
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def place(canvas, img, x, y, w):
    img = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
    shadow = Image.new("L", (img.width + 40, img.height + 40), 0)
    ImageDraw.Draw(shadow).rectangle((20, 24, img.width + 20, img.height + 24), fill=70)
    canvas.paste((0x16, 0x21, 0x1F), (x - 20, y - 20), shadow.filter(ImageFilter.GaussianBlur(9)))
    canvas.paste(img, (x, y))
    ImageDraw.Draw(canvas).rectangle((x, y, x + img.width - 1, y + img.height - 1), outline=RULE)
    return img.height


def main():
    v = latest()
    out = SRC / "images" / f"V{v}"
    out.mkdir(parents=True, exist_ok=True)
    for lang, name in PDF.items():
        pdf = SRC / name.format(v)
        blocks = {n: crop(pdf, box) for n, box in BLOCKS.items()}
        for n, img in blocks.items():
            if img.width > 1800:
                img = img.resize((1800, round(img.height * 1800 / img.width)), Image.LANCZOS)
            img.save(out / f"constat-{n}-{lang}.webp", quality=88)
        cover = Image.new("RGB", (1200, 800), CARD)
        place(cover, blocks[1], 50, 48, 860)
        place(cover, blocks[2], 160, 236, 860)
        place(cover, blocks[3], 380, 410, 760)
        suffix = "" if lang == "fr" else "-en"
        cover.save(COVERS / f"chocolat-data{suffix}.webp", quality=88)
        print(f"V{v} {lang}: 3 findings, cover chocolat-data{suffix}.webp")


if __name__ == "__main__":
    main()
